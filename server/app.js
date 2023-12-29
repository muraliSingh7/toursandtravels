const Amadeus = require('amadeus');
const express = require("express");
const app = express()
const http = require('http');
const path=require('path');
const cors = require('cors');
require('dotenv').config();

const getflightoffers = require('./function_api/getflightoffers.js');
const getAirportLocations = require('./function_api/getAirportLocations.js');

const amadeus = new Amadeus({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET
});


app.use(cors());
// app.use('/static', express.static('static'));
// console.log(path.join(__dirname,'/routes'));
app.use('/static', express.static(path.join(__dirname,'../static')));
app.use('/flights', express.static(path.join(__dirname,'../static/index.html')));

app.get('/', (req, res) => {
  res.redirect('/flights');
});

app.get('/airportsearch/:airportname?', async(req, res) => {
  await getAirportLocations(req.params.airportname, res);
});


app.get('/flights/one-way/:from/:to/:departdate/:adult/:children', async (req, res) => {
  //console.log(req.params);
  let response=await getflightoffers(req.params.from, req.params.to, req.params.departdate, null, req.params.adult, req.params.children);
  if(response.data){
    let result={};
    result['response0']=response.data;
    res.status(200).send(result);
  }else{
    res.status(502).send("Bad Gateway");
  }
});

app.get('/flights/round-trip/:from/:to/:departdate/:returndate/:adult/:children', async (req, res) => {
  //console.log("Params: "+req.params);
  let response=await getflightoffers(req.params.from, req.params.to, req.params.departdate, req.params.returndate, req.params.adult, req.params.children);
  if(response.data){
    let result={};
    result['response0']=response.data;
    res.status(200).send(result);
  }else{
    res.status(502).send("Bad Gateway");
  }

});

var URL = '/:adult/:children';
for (i = 0; i < 5; i++) {
  URL += '/:from' + i + '?/' + ':to' + i + '?/' + ':departdate' + i + '?';
}


app.get('/flights/multi-city' + URL, async (req, res) => {
  //req.params = JSON.parse(req.params.payload);
  //console.log(req.params);
  let result = {};
  let flag = 0;
  let error = {}
  for (i = 0; i < 5; i++) {
    if (req.params['from' + i] !== undefined && req.params['to' + i] !== undefined && req.params['departdate' + i] !== undefined) {
        let response = (await getflightoffers(req.params['from' + i], req.params['to' + i], req.params['departdate' + i], null, req.params.adult,
          req.params.children));
        if(response.data){
          result['response'+i]=response.data;
        }else{
          flag = 1;
          error['error' + i] = "Bad Gateway";
        }
    }
  }

  if (flag == 0) {
    res.status(200).send(result);
  } else {
    res.status(502).send(error);
  }

});

// http.createServer((req, res) => {
//   //
// }).listen(process.env.PORTNUMBER, (err) => {
//   if (err) {
//     console.log("Error in starting port");
//   } else {
//     console.log("Server started on port 3000");
//   }
// });

app.listen(process.env.PORTNUMBER, (err) => {
  if (err) {
    console.log("Error in starting port");
  } else {
    console.log("Server started on port "+process.env.PORTNUMBER);
  }
});
