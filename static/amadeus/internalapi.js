const baseURL=backendURL;
async function getlocations(locationInput){
    const locationURL="/locations";
    let completeURL=baseURL+locationURL+encodeURIComponent(`/${locationInput}`);
    let response=await fetch(completeURL);
    let data=await response.json();
    console.log(data);
}
