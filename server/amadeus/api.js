const baseURL="https://test.api.amadeus.com/v1";
async function getlocations(locationInput){
    const locationURL="/reference-data/locations";
    let completeURL=baseURL+locationURL+`?subType=CITY,AIRPORT&keyword=${locationInput}`;
    let response=await fetch(completeURL);
    let data=await response.json();
    console.log(data);
}
