import baseURL from './amadeus/amadeusapi.';

async function seatsavailable(){
    const seatsavailableURL='v1/shopping/availability/flight-availabilities';
    fetch(baseURL+seatsavailableURL,{
        method:'POST',
        headers:{
            'X-HTTP-Method-Override':'GET'
        },
        body:{
            
        }
    })
}
