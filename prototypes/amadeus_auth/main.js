const process=require('process');
const Amadeus = require('amadeus');
require('isomorphic-fetch');

async function main(){
    console.log(process.env);
    console.log("main");

    const amadeus = new Amadeus({
        clientId:process.env.amadeus_client_id,
        clientSecret:process.env.amadeus_client_secret
    });

    //const response = await fetch('https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=PAR&maxPrice=200')
    //const data=await response.json();
    amadeus.referenceData.locations.get({
        keyword: 'LON',
        subType: 'AIRPORT,CITY'
      }).then(function(response){
        console.log(response.data); // first page
        return amadeus.next(response);
      }).then(function(nextResponse){
        console.log(nextResponse.data); // second page
      });

    //console.log(data);
}


main();