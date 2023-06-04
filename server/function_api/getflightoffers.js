const Amadeus = require('amadeus');
require('dotenv').config();
const amadeus = new Amadeus({
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET
});

async function getflightoffers(originLocationCode, destinationLocationCode, departureDate, returnDate, adults, children,res) {

    if (returnDate) {
        // console.log("Round-Trip");
        return amadeus.client.get('/v2/shopping/flight-offers', {
            originLocationCode: originLocationCode,
            destinationLocationCode: destinationLocationCode,
            departureDate: departureDate,
            adults: adults,
            children: children,
            returnDate: returnDate,
            // max:2000,
        }).then(function (response) {
            //console.log(response.data);
            res.status(200).send(response.data);
        }).catch(function (responseError) {
            //console.log(responseError.code);
            res.status(502).send("Bad Gateway");
        });
    } else {
        // console.log("One-Way");
        return amadeus.client.get('/v2/shopping/flight-offers', {
            originLocationCode: originLocationCode,
            destinationLocationCode: destinationLocationCode,
            departureDate: departureDate,
            adults: adults,
            children: children,
            // max:2000,
        }).then(function (response) {
            //console.log(response.data);
            res.status(200).send(response.data);
        }).catch(function (responseError) {
            //console.log(responseError.code);
            res.status(502).send("Bad Gateway");
        });
    }
}

module.exports = getflightoffers;