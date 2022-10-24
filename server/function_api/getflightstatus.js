import baseURL from '../amadeus/amadeusapi';
async function getflightstatus(carriercode,flightnumber,scheduledDepartureDate){
    const flightstatusURL='v2/schedule/flights';
    let completeURL=baseURL+flightstatusURL+`?carrierCode=${carriercode}&
    flightNumber=${flightnumber}&scheduledDepartureDate=${scheduledDepartureDate}`;
    let response=await fetch(completeURL);
    let data=await response.json();
    return data;
}
