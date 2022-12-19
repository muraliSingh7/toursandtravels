export async function oneWaySearch(payload) {
    var response=await fetch(`http://127.0.0.1:3000/flights/one-way/${payload.load0.from}/${payload.load0.to}/${payload.load0.departdate}/${payload.adult}/${payload.child}`)
    var data=await response.json();
    return {'response0':{'data' :data}};
}



export async function roundTripSearch(payload) {
    var response=await fetch(`http://127.0.0.1:3000/flights/round-trip/${payload.load0.from}/${payload.load0.to}/${payload.load0.departdate}/${payload.returndate}/${payload.adult}/${payload.child}`)
    var data=await response.json();
    return {'response0':{'data' :data}};
}



export async function multiCitySearch(payload) {
    var URL=payload.adult+'/'+payload.child;
    for(let i=0;i<5;i++){
        if(payload.hasOwnProperty('load'+i) && payload['load'+i].from!==undefined && payload['load'+i].to!==undefined && payload['load'+i].departdate!==undefined ){
            URL+='/'+payload['load'+i].from+'/'+payload['load'+i]['to']+'/'+payload['load'+i]['departdate'];
        }
    }

    //console.log(URL);
    
    var response=await fetch(`http://127.0.0.1:3000/flights/multi-city/`+URL)
    var data=await response.json();
    return data;
}

//export {oneWaySearch,roundTripSearch,multiCitySearch};