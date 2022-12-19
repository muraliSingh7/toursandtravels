const Amadeus = require('amadeus');
const express = require("express");
const app = express()
const cors = require('cors');


const amadeus = new Amadeus({
  clientId: "07jzwkv2FlrcJ6UX0BRA5OcG6dGFTl6i",
  clientSecret: "3CKPw8ZrZp7igUnM"
});
//process.env.amadeus_client_id,

app.use(cors());

function getflightoffers(originLocationCode, destinationLocationCode, departureDate, returnDate, adults, children) {

  if (returnDate) {
    console.log("Round-Trip");
    return amadeus.client.get('/v2/shopping/flight-offers', {
      originLocationCode: originLocationCode,
      destinationLocationCode: destinationLocationCode,
      departureDate: departureDate,
      adults: adults,
      children: children,
      returnDate: returnDate
    })/*.then(function (response) {
          //console.log(response.data);
          res.status(200).send(response.data);
      }).catch(function (responseError) {
          //console.log(responseError.code);
          res.status(502).send("Bad Gateway");
      });*/
  } else {
    console.log("One-Way");
    return amadeus.client.get('/v2/shopping/flight-offers', {
      originLocationCode: originLocationCode,
      destinationLocationCode: destinationLocationCode,
      departureDate: departureDate,
      adults: adults,
      children: children
    })/*.then(function (response) {
          //console.log(response.data);
          res.status(200).send(response.data);
      }).catch(function (responseError) {
          //console.log(responseError.code);
          res.status(502).send("Bad Gateway");
      });*/
  }
}

app.get('/airportsearch/:airportname?',(req,res)=>{
  amadeus.client.get('/v1/reference-data/locations',{
    keyword:req.params.airportname,
    subType:'AIRPORT',
    'page[limit]':100,
  }).then(function(response){
    //console.log(response);
    res.status(200).send(response);
  }).catch(function(responseError){
    res.status(responseError.response.statusCode).send(responseError);
  });
});


app.get('/flights/one-way/:from/:to/:departdate/:adult/:children', async(req, res) => {
  //console.log(req.params);
  try {
    var response = await getflightoffers(req.params.from, req.params.to, req.params.departdate, null, req.params.adult, req.params.children);
    res.status(200).send(response.data);
  } catch (responseError) {
    //console.log(responseError);
    res.status(responseError.response.statusCode).send(responseError);
  }
});

app.get('/flights/round-trip/:from/:to/:departdate/:returndate/:adult/:children', async (req, res) => {
  //console.log("Params: "+req.params);
  try {
    var response = await getflightoffers(req.params.from, req.params.to, req.params.departdate, req.params.returndate, req.params.adult, req.params.children);
    res.status(200).send(response.data);
  } catch (responseError) {
    res.status(responseError.status).send(responseError);
  }
  //console.log("Response: "+response);

});

var URL='/:adult/:children';
for(i=0;i<5;i++){
  URL+='/:from'+i+'?/'+':to'+i+'?/'+':departdate'+i+'?';
}


app.get('/flights/multi-city'+URL, async (req, res) => {
  //req.params = JSON.parse(req.params.payload);
  //console.log(req.params);
  var response = {};
  var flag=0;
  var error={}
  for (i = 0; i < 5; i++) {
    if (req.params['from'+i]!==undefined && req.params['to'+i]!==undefined && req.params['departdate'+i]!==undefined) {
      try {
        response['response' + i] = await getflightoffers(req.params['from'+i], req.params['to'+i], req.params['departdate'+i],null, req.params.adult,
          req.params.children);
      } catch (responseError) {
        flag=1;
        error['error' + i] = responseError;
      }
    }
  }

  if(flag==0){
    res.status(200).send(response);
  }else{
    res.status(400).send(error);
  }

})

app.listen(3000);
console.log("Server started on port 3000");