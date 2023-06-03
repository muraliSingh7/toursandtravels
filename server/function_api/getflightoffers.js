const Amadeus = require('amadeus');
require('dotenv').config();
const amadeus = new Amadeus({
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET
});

function getflightoffers(originLocationCode, destinationLocationCode, departureDate, returnDate, adults, children, travelClass) {

    if (returnDate != null || returnDate != undefined) {
        amadeus.client.get('/v2/shopping/flight-offers', {
            originLocationCode: originLocationCode,
            destinationLocationCode: destinationLocationCode,
            departureDate: departureDate,
            adults: adults,
            children: children, returnDate: returnDate
        }).then(function (response) {
            return response.data;
        }).catch(function (responseError) {
            return responseError.code;
        });
    } else {
        amadeus.client.get('/v2/shopping/flight-offers', {
            originLocationCode: originLocationCode,
            destinationLocationCode: destinationLocationCode,
            departureDate: departureDate,
            adults: adults,
            children: children,
        }).then(function (response) {
            return response.data;
        }).catch(function (responseError) {
            return responseError.code;
        });
    }
}

//module.exports=getflightoffers;