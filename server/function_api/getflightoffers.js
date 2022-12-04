const Amadeus = require('amadeus');
const amadeus = new Amadeus({
    clientId:"07jzwkv2FlrcJ6UX0BRA5OcG6dGFTl6i",
    clientSecret:"3CKPw8ZrZp7igUnM"
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