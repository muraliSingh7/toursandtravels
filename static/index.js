import {getTripType} from './commonfunctions/triptype.js';
import { processingData } from './processingdata.js';
import {oneWaySearch,roundTripSearch,multiCitySearch} from '../server/routes/flightoffers.js'
import { FilterCache } from './filterCache/filterCache.js';
//import {flightCardCreation} from './views/tripsearchresult.js';
//import { sortingElement } from './views/tripsearchresult.js';
import {OneWayResult} from './views/OneWayResult/OneWayResult.js'
import {RoundWayResult} from './views/RoundWayResult.js'
import {MultiTripResult} from './views/MultiTripResult.js'




var iatacodefetchtime=Date.now();



addEventListener('DOMContentLoaded', (event) => {    
    /*var fromtodepart=document.querySelector("[from-to-depart=from-to-depart_1]");
    fromtodepart.shadowRoot.querySelector("input.from").addEventListener("input",(event)=>{
        console.log(fromtodepart.shadowRoot.querySelector("input.from").value);
        console.log(fromtodepart.shadowRoot.querySelector("input.to").value);
        AirportSearch(fromtodepart.shadowRoot.querySelector("input.from"));
        AirportSearch(fromtodepart.shadowRoot.querySelector("input.to"));
    });*/
    /*var fromtodepart=document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector("input.from");
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
    })*/
    
    
    /*for(var i=1;i<=5;i++){
        var fromtodepart=document.querySelector(`[from-to-depart=from-to-depart_${i}]`);
        if(fromtodepart.style.display=="block"){
            AirportSearch(fromtodepart.shadowRoot.querySelector("input.from").value);
            AirportSearch(fromtodepart.shadowRoot.querySelector("input.to").value);
        }
    }*/



















    
    var form = document.querySelector("#flight-search");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        var payload = {
            /*"load1": {
                "from": document.querySelector("#from-to-depart_1").shadowRoot.querySelector("input.from").value,
                "to": document.querySelector("#from-to-depart_1").shadowRoot.querySelector("input.to").value,
                "departdate": document.querySelector("#from-to-depart_1").shadowRoot.querySelector("input.depart").value,
            }, 
            "adult": document.querySelector("input.adult").value,
            "child": document.querySelector("input.children").value,*/
            "load0":{
                "from":'BOM',
                "to":'BLR',
                "departdate":'2023-01-25'
            },
            "adult":1,
            "child":1
        };

        
        var tripType=getTripType();
        console.log(tripType);

        if (tripType == "One-Way") {
            // sortingElement(tripType);
            // var oneWaySearchResult=await oneWaySearch(payload);
            // let finalResult=await processingData(oneWaySearchResult)
            // console.log(finalResult);
            // localStorage.setItem("finalResult",JSON.stringify(finalResult));
            // localStorage.getItem("finalResult");
            // let filter=new FilterCache(1,JSON.parse(localStorage.getItem("finalResult"))[0]);
            let oneWay=new OneWayResult(tripType,0,payload.load0.from,payload.load0.to,JSON.parse(localStorage.getItem("finalResult"))[0]);
            oneWay.main();
            //flightCardCreation(oneWaySearchResult,'1',tripType);

        } else if (tripType == "Round-Trip") {
            // sortingElement(tripType,payload.load0.from,payload.load0.to);
            //payload["returndate"]=document.querySelector("input.returndate").value;
            payload["returndate"]='2023-01-31';  
            // var roundTripSearchResult= await processingData(await roundTripSearch(payload));
            // console.log(roundTripSearchResult);
            // localStorage.setItem("roundWayResult",JSON.stringify(roundTripSearchResult));
            // localStorage.getItem("roundWayResult");
            let roundTrip=new OneWayResult(tripType,0,payload.load0.from,payload.load0.to,JSON.parse(localStorage.getItem("roundWayResult"))[0]);
            roundTrip.main();
            
            // flightCardCreation(roundTripSearchResult,'2',tripType)

        } else {
            payload['load1']={
                "from":'PEK',
                "to":'PVG',
                "departdate":'2023-01-29',
            }
            console.log(payload);
            /*for (var i = 3; i < 5; i++) {
                if (document.querySelector("#from-to-depart_" + i).style.display == "block") {
                    payload['load' + i] = {
                        from: document.querySelector("#from-to-depart_" + i).shadowRoot.querySelector("input.from").value,
                        to: document.querySelector("#from-to-depart_" + i).shadowRoot.querySelector("input.to").value,
                        departdate: document.querySelector("#from-to-depart_" + i).shadowRoot.querySelector("input.depart").value,
                    }
                }
            }*/

            // var multiCitySearchResult=await multiCitySearch(payload);
            // console.log(multiCitySearchResult);
            // multiCitySearchResult=await processingData(multiCitySearchResult);
            // localStorage.setItem("multiCityResult",JSON.stringify(multiCitySearchResult));
            // localStorage.getItem("multiCityResult");
            let multiCity=new MultiTripResult(tripType,payload,JSON.parse(localStorage.getItem("multiCityResult")));
            //flightCardCreation(multiCitySearchResult,'1',tripType)

        }
    });
});


