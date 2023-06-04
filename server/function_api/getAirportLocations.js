const Amadeus = require('amadeus');
require('dotenv').config();
const amadeus = new Amadeus({
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET
});

async function getAirportLocations(userInput,res){
    amadeus.client.get('/v1/reference-data/locations',{
        keyword:userInput,
        subType:'AIRPORT',
        'page[limit]':100,
      }).then(function(response){
        //console.log(response);
        res.status(200).send(response);
      }).catch(function(responseError){
        // console.log(responseError);
        res.status(502).send("Bad Gateway");
      });
}

module.exports=getAirportLocations;