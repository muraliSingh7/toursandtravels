import baseURL from './amadeus/amadeusapi';


async function getflightoffers(originLocationCode, destinationLocationCode, departureDate, returnDate, adults, children, travelClass) {
    const getflightoffersURL='v2/shopping/flight-offers';
    let completeURL=baseURL+getflightoffersURL+`?originLocationCode=${originLocationCode}&`
    +`destinationLocationCode=${destinationLocationCode}&`+`departureDate=${departureDate}&`
    +`adults=${adults}`+`children=${children}`+`travelClass=${travelClass}`;

    
    if(returnDate!=null||returnDate!=undefined){
        completeURL=completeURL+`returnDate=${returnDate}`;
    }


    let data=await fetch(completeURL,{method:'GET'}).then((response)=>response.json());
    console.log(data);
    
    //return data;
}