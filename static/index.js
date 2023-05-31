import { getTripType } from './commonfunctions/triptype.js';
import { processingData } from './processingdata.js';
import { oneWaySearch, roundTripSearch, multiCitySearch } from '../server/routes/flightoffers.js'
import { OneWayAndRoundTripHandler } from './views/OneWayAndRoundTripHandler/OneWayAndRoundTripHandler.js'
import { MultiTripHandler } from './views/MultiTripHandler.js'




var iatacodefetchtime = Date.now();



addEventListener('DOMContentLoaded', (event) => {
    var form = document.querySelector("#flight-search");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        let tripInformation = {};
        // var payload = {
        //     /*"load1": {
        //         "from": document.querySelector("#from-to-depart_1").shadowRoot.querySelector("input.from").value,
        //         "to": document.querySelector("#from-to-depart_1").shadowRoot.querySelector("input.to").value,
        //         "departdate": document.querySelector("#from-to-depart_1").shadowRoot.querySelector("input.depart").value,
        //     }, 
        //     "adult": document.querySelector("input.adult").value,
        //     "child": document.querySelector("input.children").value,*/
        //     "load0":{
        //         "from":'BOM',
        //         "to":'BLR',
        //         "departdate":'2023-01-25'
        //     },
        //     "adult":1,
        //     "child":1
        // };


        var tripType = getTripType();
        // console.log(tripType);

        var listOfTripInformationElement = document.body.querySelectorAll('from-to-depart');

        for (let i = 0; i < listOfTripInformationElement.length; i++) {
            console.log(listOfTripInformationElement[i].shadowRoot.querySelector("input[name=From]").value);
            tripInformation["trip" + i] = {
                'source': listOfTripInformationElement[i].shadowRoot.querySelector("input[name=From]").value,
                'destination': listOfTripInformationElement[i].shadowRoot.querySelector("input[name=To]").value,
                'departdate': listOfTripInformationElement[i].shadowRoot.querySelector("input[name=DepartDate]").value
            };
            if (i == listOfTripInformationElement.length - 1) {
                tripInformation['returndate'] = listOfTripInformationElement[i].shadowRoot.querySelector("input[name=ReturnDate]").value;
                tripInformation['adult'] = listOfTripInformationElement[i].shadowRoot.querySelector("input[name=Adult]").value;
                tripInformation['child'] = listOfTripInformationElement[i].shadowRoot.querySelector("input[name=Children]").value;
            }
            console.log(JSON.stringify(tripInformation));
        }


        if (tripType == "One-Way") {
            clearViewArea();
            let oneWaySearchResult = await oneWaySearch(tripInformation);
            // console.log(oneWaySearchResult);
            oneWaySearchResult = await processingData(oneWaySearchResult);
            // console.log(finalResult);
            localStorage.setItem("oneWaySearchResult", JSON.stringify( oneWaySearchResult));
            let oneWayViewHandler = new OneWayAndRoundTripHandler(tripType, 0, tripInformation.trip0.source, tripInformation.trip0.destination, JSON.parse(localStorage.getItem("oneWaySearchResult"))[0]);
            oneWayViewHandler.main();
        } else if (tripType == "Round-Trip") {
            clearViewArea();
            let roundTripSearchResult = await processingData(await roundTripSearch(tripInformation));
            // console.log(roundTripSearchResult);
            localStorage.setItem("roundTripSearchResult", JSON.stringify(roundTripSearchResult));
            let roundTripViewHandler = new OneWayAndRoundTripHandler(tripType, 0, tripInformation.trip0.source, tripInformation.trip0.destination, JSON.parse(localStorage.getItem("roundTripSearchResult"))[0]);
            roundTripViewHandler.main();
        } else {
            clearViewArea();
            let multiCitySearchResult = await multiCitySearch(tripInformation);
            // console.log(multiCitySearchResult);
            multiCitySearchResult = await processingData(multiCitySearchResult);
            localStorage.setItem("multiCitySearchResult", JSON.stringify(multiCitySearchResult));
            MultiTripHandler(tripType, tripInformation, JSON.parse(localStorage.getItem("multiCitySearchResult")));
        }
    });

    
});

function clearViewArea(){
    let flightDataViewContainer=document.body.querySelector('[name=flightDataViewContainer]');
    while (flightDataViewContainer.firstChild) {
        flightDataViewContainer.removeChild(flightDataViewContainer.firstChild);
    }
}
