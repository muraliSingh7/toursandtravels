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
app.use('/routes',express.static(path.join(__dirname,'/routes')))

app.get('/', (req, res) => {
  res.redirect('/flights');
});

app.get('/airportsearch/:airportname?', async(req, res) => {
  await getAirportLocations(req.params.airportname, res);
});


app.get('/flights/one-way/:from/:to/:departdate/:adult/:children', async (req, res) => {
  //console.log(req.params);
  await getflightoffers(req.params.from, req.params.to, req.params.departdate, null, req.params.adult, req.params.children, res);
});

app.get('/flights/round-trip/:from/:to/:departdate/:returndate/:adult/:children', async (req, res) => {
  //console.log("Params: "+req.params);
  await getflightoffers(req.params.from, req.params.to, req.params.departdate, req.params.returndate, req.params.adult, req.params.children, res);
});

var URL = '/:adult/:children';
for (i = 0; i < 5; i++) {
  URL += '/:from' + i + '?/' + ':to' + i + '?/' + ':departdate' + i + '?';
}


app.get('/flights/multi-city' + URL, async (req, res) => {
  //req.params = JSON.parse(req.params.payload);
  //console.log(req.params);
  var response = {};
  var flag = 0;
  var error = {}
  for (i = 0; i < 5; i++) {
    if (req.params['from' + i] !== undefined && req.params['to' + i] !== undefined && req.params['departdate' + i] !== undefined) {
      try {
        response['response' + i] = (await getflightoffers(req.params['from' + i], req.params['to' + i], req.params['departdate' + i], null, req.params.adult,
          req.params.children));
      } catch (responseError) {
        flag = 1;
        error['error' + i] = responseError;
      }
    }
  }

  if (flag == 0) {
    res.status(200).send(response);
  } else {
    res.status(400).send(error);
  }

})

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
