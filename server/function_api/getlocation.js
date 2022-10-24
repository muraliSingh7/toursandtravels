//const baseURL=require('./amadeus/amadeusapi');
import baseURL from './amadeus/amadeusapi';

async function getlocations(locationInput){
    const locationURL="v1/reference-data/locations";
    let completeURL=baseURL+locationURL+`?subType=CITY,AIRPORT&keyword=${locationInput}`;
    let response=await fetch(completeURL);
    let data=await response.json();
    return data;
}

