import { getTripType } from './commonfunctions/triptype.js';
import { processingData } from './processingdata.js';
import { oneWaySearch, roundTripSearch, multiCitySearch } from './routes/flightoffers.js';
import { OneWayAndRoundTripHandler } from './views/OneWayAndRoundTripHandler/OneWayAndRoundTripHandler.js'
import { MultiTripHandler } from './views/MultiTripHandler.js'



addEventListener('DOMContentLoaded', (event) => {
    var form = document.querySelector("#flight-search");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        let tripInformation = {};

        var tripType = getTripType();
        // console.log(tripType);

        var listOfTripInformationElement = document.body.querySelectorAll('from-to-depart');
        let inputFieldNotFilled = false;

        for (let i = 0; i < listOfTripInformationElement.length; i++) {
            let source = listOfTripInformationElement[i].shadowRoot.querySelector("input[name=From]").value;
            let destination = listOfTripInformationElement[i].shadowRoot.querySelector("input[name=To]").value;
            let departdate=listOfTripInformationElement[i].shadowRoot.querySelector("input[name=DepartDate]").value;
            let currentdate = new Date();
            // console.log(departdate);

            if(departdate==='' || isNaN(Date.parse(departdate))){
                departdate='';
            }else{
                departdate = new Date(departdate);
                if (departdate.getTime() < currentdate.getTime()) {
                    displayErrorInViewArea("Depart Date should be greater than or equal to Today Date");
                    return;
                }
            }

            tripInformation["trip" + i] = {
                'source': source.trim(),
                'destination': destination.trim(),
                'departdate':  departdate!=''?departdate.toISOString().split('T')[0]:departdate
            };

            
            if (i == listOfTripInformationElement.length - 1) {
                let adult = listOfTripInformationElement[i].shadowRoot.querySelector("input[name=Adult]").value;
                let child = listOfTripInformationElement[i].shadowRoot.querySelector("input[name=Children]").value;
                let returndate =listOfTripInformationElement[i].shadowRoot.querySelector("input[name=ReturnDate]").value;
                tripInformation['adult'] = adult.trim();
                tripInformation['child'] = child.trim();
                if (tripType == "Round-Trip") {
                    if(returndate==='' || isNaN(Date.parse(returndate))){
                        returndate='';
                    }else{
                        returndate = new Date(returndate);
                        tripInformation['returndate'] = returndate.toISOString().split('T')[0];
                        if (departdate!='' && departdate.getTime() > returndate.getTime()) {
                            displayErrorInViewArea("Return Date should be greater than or equal to Depart Date");
                            return;
                        }
                    }
                }

            }

            //checking all input fields are filled or not
            Object.values(tripInformation["trip" + i]).forEach((value) => {
                if (value === '') {
                    inputFieldNotFilled = true;
                }
            });

            if (tripType == "Round-Trip") {
                Array.from(['returndate', 'adult', 'child']).forEach((key) => {
                    if (tripInformation[key] === '') {
                        inputFieldNotFilled = true;
                    }
                });
            } else {
                Array.from(['adult', 'child']).forEach((key) => {
                    if (tripInformation[key] === '') {
                        inputFieldNotFilled = true;
                    }
                });
            }

            // console.log(JSON.stringify(tripInformation));
            if (inputFieldNotFilled) {
                displayErrorInViewArea("Please fill in all the required fields");
                return;
            }



        }


        clearViewArea();
        localStorage.clear();
        if (tripType == "One-Way") {
            let oneWaySearchResult = await processingData(await oneWaySearch(tripInformation));
            // console.log(oneWaySearchResult);
            localStorage.setItem("oneWaySearchResult", JSON.stringify(oneWaySearchResult));
            let oneWayViewHandler = new OneWayAndRoundTripHandler(tripType, 0, tripInformation.trip0.source, tripInformation.trip0.destination, JSON.parse(localStorage.getItem("oneWaySearchResult"))[0]);
            oneWayViewHandler.main();
        } else if (tripType == "Round-Trip") {
            let roundTripSearchResult = await processingData(await roundTripSearch(tripInformation));
            // console.log(roundTripSearchResult);
            localStorage.setItem("roundTripSearchResult", JSON.stringify(roundTripSearchResult));
            let roundTripViewHandler = new OneWayAndRoundTripHandler(tripType, 0, tripInformation.trip0.source, tripInformation.trip0.destination, JSON.parse(localStorage.getItem("roundTripSearchResult"))[0]);
            roundTripViewHandler.main();
        } else {
            let multiCitySearchResult = await multiCitySearch(tripInformation);
            console.log(multiCitySearchResult);
            multiCitySearchResult = await processingData(multiCitySearchResult);
            localStorage.setItem("multiCitySearchResult", JSON.stringify(multiCitySearchResult));
            MultiTripHandler(tripType, tripInformation, JSON.parse(localStorage.getItem("multiCitySearchResult")));

        }
    });



});

function displayErrorInViewArea(errorMessage) {
    let flightDataViewContainer = document.body.querySelector('[name=flightDataViewContainer]');
    flightDataViewContainer.textContent = errorMessage;
    flightDataViewContainer.setAttribute('class', 'displayError');
}

function clearViewArea() {
    let flightDataViewContainer = document.body.querySelector('[name=flightDataViewContainer]');
    if (flightDataViewContainer.classList.contains('displayError')) {
        flightDataViewContainer.classList.remove('displayError');
    }

    while (flightDataViewContainer.firstChild) {
        flightDataViewContainer.removeChild(flightDataViewContainer.firstChild);
    }
}
