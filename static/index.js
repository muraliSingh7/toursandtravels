async function AirportSearch(query){
    console.log(query);
    var response=await fetch(`http://127.0.0.1:3000/airportsearch/${query}`)
    var data=await response.json(); 
    data=data.data;
    return data;
}



function OneWaySearch(payload) {
    fetch(`http://127.0.0.1:3000/flights/one-way/${payload.load1.from}/${payload.load1.to}/${payload.load1.departdate}/${payload.adult}/${payload.child}`)
        .then((response) => {
            return response.json();
        }).then((data) => {
            //console.log(data);
            FlightCardCreation(data,payload.load1.from,payload.load1.to);
        });
        

}



function RoundTripSearch(payload) {
    fetch(`http://127.0.0.1:3000/flights/round-trip/${payload.load1.from}/${payload.load1.to}/${payload.load1.departdate}/${payload.returndate}/${payload.adult}/${payload.child}`)
        .then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
        })
}



function MultiCitySearch(payload) {
    var URL=payload.adult+'/'+payload.child;
    for(i=1;i<=5;i++){
        if(payload.hasOwnProperty('load'+i) && payload['load'+i].from!==undefined && payload['load'+i].to!==undefined && payload['load'+i].departdate!==undefined ){
            URL+='/'+payload['load'+i].from+'/'+payload['load'+i]['to']+'/'+payload['load'+i]['departdate'];
        }
    }
    
    console.log(URL);

    fetch(`http://127.0.0.1:3000/flights/multi-city/`+URL)
        .then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
        });

}


var iatacodefetchtime=Date.now();



addEventListener('DOMContentLoaded', (event) => {    
    /*var fromtodepart=document.querySelector("[from-to-depart=from-to-depart_1]");
    fromtodepart.shadowRoot.querySelector("input.from").addEventListener("input",(event)=>{
        console.log(fromtodepart.shadowRoot.querySelector("input.from").value);
        //console.log(fromtodepart.shadowRoot.querySelector("input.to").value);
        AirportSearch(fromtodepart.shadowRoot.querySelector("input.from"));
        //AirportSearch(fromtodepart.shadowRoot.querySelector("input.to"));
    });*/
    var fromtodepart=document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector("input.from");
    fromtodepart.addEventListener("input",function(e){
        var iatacode=fromtodepart.value;
        if(iatacode!=''){
            iatacodefetchtime=Date.now();
            console.log("Event Fired At:",iatacode,(iatacodefetchtime%10000));
            setTimeout(async()=>{
                console.log("CallBack Time Diff:",iatacode,Date.now()-iatacodefetchtime,Date.now()%10000,iatacodefetchtime%10000);
                if(Date.now()-iatacodefetchtime>500){
                    var result=await AirportSearch(iatacode);
                    DropDownMenuIataCode(fromtodepart,iatacode,result);
                }
            },1000);
            
        }
    })
    
    
    /*for(var i=1;i<=5;i++){
        var fromtodepart=document.querySelector(`[from-to-depart=from-to-depart_${i}]`);
        if(fromtodepart.style.display=="block"){
            AirportSearch(fromtodepart.shadowRoot.querySelector("input.from").value);
            AirportSearch(fromtodepart.shadowRoot.querySelector("input.to").value);
        }
    }*/
    
    // var fromtodepart=document.querySelectorAll("from-to-depart");
    // var form = document.querySelector("#flight-search");
    // form.addEventListener("submit", function (event) {
    //     event.preventDefault();
    //     var payload = {
    //         "load1": {
    //             "from": document.querySelector("#from-to-depart_1").shadowRoot.querySelector("input.from").value,
    //             "to": document.querySelector("#from-to-depart_1").shadowRoot.querySelector("input.to").value,
    //             "departdate": document.querySelector("#from-to-depart_1").shadowRoot.querySelector("input.depart").value,
    //         }, 
    //         "adult": document.querySelector("input.adult").value,
    //         "child": document.querySelector("input.children").value,
    //         load1:{
    //             from:'SYD',
    //             to:'BYK',
    //             departdate:'2022-12-15'
    //         },
    //         adult:1,
    //         child:1
    //     };
        
    //     if (document.querySelector("select").value == "One-Way") {
            
    //         //console.log("Payload: "+payload);
            
    //         OneWaySearch(payload);
    //     } else if (document.querySelector("select").value == "Round-Trip") {
    //         //payload["returndate"]=document.querySelector("input.returndate").value;
    //         payload["returndate"]='2022-12-17';
            
    //         //console.log("Payload: "+payload);
            
    //         RoundTripSearch(payload);
    //     } else {
    //         payload['load2']={
    //             "from":'BYK',
    //             "to":'SYD',
    //             "departdate":'2022-12-21',
    //         }

    //         for (i = 3; i <= 5; i++) {
    //             if (document.querySelector("#from-to-depart_" + i).style.display == "block") {
    //                 payload['load' + i] = {
    //                     from: document.querySelector("#from-to-depart_" + i).shadowRoot.querySelector("input.from").value,
    //                     to: document.querySelector("#from-to-depart_" + i).shadowRoot.querySelector("input.to").value,
    //                     departdate: document.querySelector("#from-to-depart_" + i).shadowRoot.querySelector("input.depart").value,
    //                 }
    //             }
    //         }

    //         //console.log("Payload: "+payload);

    //         MultiCitySearch(payload);
    //     }

    //});
});



function FlightCardCreation(data,arrivalPlace,departurePlace){
    let i=0;
    
    for(let value of Object.values(data)){
        const numberofstops=value.itineraries[0].segments.length;
        const card=document.createElement("flight-card");
        card.setAttribute('name',"FlightCard"+i);
        card.shadowRoot.querySelector("[name=carrier-name]").textContent=value.validatingAirlineCodes;
        card.shadowRoot.querySelector("[name=depart-time]").appendChild(document.createTextNode(value.itineraries[0].segments[0].departure.at.split('T')[1]));
        card.shadowRoot.querySelector('[name="depart-place"]').appendChild(document.createTextNode(departurePlace));
        card.shadowRoot.querySelector("[name=duration]").appendChild(document.createTextNode(value.itineraries[0].duration.split('PT')[1]));                
        card.shadowRoot.querySelector("[name=stoppage]").appendChild(document.createTextNode(numberofstops));
        card.shadowRoot.querySelector("[name=arrival-time]").appendChild(document.createTextNode(value.itineraries[0].segments[numberofstops-1].arrival.at.split('T')[1]));
        card.shadowRoot.querySelector("[name=arrival-place]").appendChild(document.createTextNode(arrivalPlace));
        card.shadowRoot.querySelector("[name=price]").appendChild(document.createTextNode(value.price.total+""+value.price.currency));
        document.body.appendChild(card);
        //console.log()
        //console.log("Price:"+value.price.total+""+value.price.currency);
        //console.log("Duration:"+value.itineraries[0].duration);
        //console.log("AirlineCodes:"+value.validatingAirlineCodes);
        //console.log("Stoppages:"+value.itineraries[0].segments.length);
        i++;
    }
}



function DropDownMenuIataCode(query,value,data){
    data=data.filter((element)=>{
        return element.detailedName.toLowerCase().startsWith(value.toLowerCase());
    });
    data.sort(function(a,b){
        return a.iataCode<b.iataCode?-1:1;
    });
    if(Object.keys(data).length>=5){
        data=data.slice(0,5);
    }
    
    console.log(data.slice(0,Object.keys(data).length));
    query.addEventListener("input",function(e){
        var length_of_data=Object.keys(data).length;
        for(var i=0;i<length_of_data;i++){
            //data.iata
        }
    })
    /*for(i=0;i<data.length;i++){
        var newelement=document.createElement("div");


    }*/
}