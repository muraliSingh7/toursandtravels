export async function oneWaySearch(tripInformation) {
    var response=await fetch(`/flights/one-way/${tripInformation.trip0.source}/${tripInformation.trip0.destination}/${tripInformation.trip0.departdate}/${tripInformation.adult}/${tripInformation.child}`)
    var data=await response.json();
    return data;
}


export async function roundTripSearch(tripInformation) {
    var response=await fetch(`/flights/round-trip/${tripInformation.trip0.source}/${tripInformation.trip0.destination}/${tripInformation.trip0.departdate}/${tripInformation.returndate}/${tripInformation.adult}/${tripInformation.child}`)
    var data=await response.json();
    return data;
}


export async function multiCitySearch(tripInformation) {
    var URL=tripInformation.adult+'/'+tripInformation.child;
    for(let i=0;i<5;i++){
        if(tripInformation.hasOwnProperty('trip'+i) && tripInformation['trip'+i].source!==undefined && tripInformation['trip'+i].destination!==undefined && tripInformation['trip'+i].departdate!==undefined ){
            URL+='/'+tripInformation['trip'+i].source+'/'+tripInformation['trip'+i].destination+'/'+tripInformation['trip'+i].departdate;
        }
    }

    //console.log(URL);
    
    var response=await fetch(`/flights/multi-city/`+URL)
    var data=await response.json();
    return data;
}