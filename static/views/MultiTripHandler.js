// import { sortByPrice, sortByTime, sortByDuration } from '../commonfunctions/sorting.js';
import { OneWayAndRoundTripHandler } from './OneWayAndRoundTripHandler/OneWayAndRoundTripHandler.js';
export function MultiTripHandler(triptype, tripInformation, tripFlightData){
  let multiCityView = [];
  let tripHeader = [];
  // console.log(tripFlightData);

  let tripTitle = document.createElement('div');
  tripTitle.setAttribute('name', 'tripTitle');
  tripTitle.setAttribute('class', 'tripTitle');

  for (let tripNumber = 0; tripNumber < tripFlightData.length; tripNumber++) {
    let source = tripInformation['trip' + tripNumber]['source'];
    let destination = tripInformation['trip' + tripNumber]['destination'];
    let tripDescription = document.createElement('p');
    tripDescription.setAttribute('name', 'tripDescription');
    tripDescription.setAttribute('class', 'tripDescription');


    if (tripNumber != 0) {
      let prevButton = document.createElement("span");
      prevButton.setAttribute("class", "prevButtonTripDescription");
      prevButton.setAttribute("prevButtonName", "prevButton" + tripNumber);
      prevButton.textContent = String.fromCodePoint(0x2039);
      prevButton.addEventListener('click', () => {
        document.querySelector('[name=tripDescription]').remove();
        document.querySelector('[name=tripTitle]').appendChild(tripHeader[tripNumber - 1]);
        multiCityView[tripNumber - 1].main();
      });
      tripDescription.appendChild(prevButton)
    }


    let sourceElement = document.createElement('span');
    sourceElement.setAttribute('class', 'tripSource')
    sourceElement.textContent = source;
    tripDescription.appendChild(sourceElement);


    let rightarrow = document.createElement("span");
    rightarrow.setAttribute("class", "rightArrowTripDescription");
    rightarrow.textContent = "→";//String.fromCodePoint(0x2192);
    tripDescription.appendChild(rightarrow);


    let destinationElement = document.createElement('span');
    destinationElement.setAttribute('class', 'tripDestination')
    destinationElement.textContent = destination;
    tripDescription.appendChild(destinationElement);


    if (tripNumber != tripFlightData.length - 1) {
      let nextButton = document.createElement("span");
      nextButton.setAttribute("class", "nextButtonTripDescription");
      nextButton.setAttribute("prevButtonName", "nextButton" + tripNumber);
      nextButton.textContent = String.fromCodePoint(0x203a);
      nextButton.addEventListener('click', () => {
        document.querySelector('[name=tripDescription]').remove();
        document.querySelector('[name=tripTitle]').appendChild(tripHeader[tripNumber + 1]);
        multiCityView[tripNumber + 1].main();
      });
      tripDescription.appendChild(nextButton);
    }

    tripHeader.push(tripDescription);

    multiCityView.push(new OneWayAndRoundTripHandler(triptype, tripNumber, tripInformation['trip' + tripNumber]['source'], tripInformation['trip' + tripNumber]['destination'], tripFlightData[tripNumber]));
  }

  document.body.querySelector('[name=flightDataViewContainer]').appendChild(tripTitle);
  document.querySelector('[name=tripTitle]').appendChild(tripHeader[0])
  multiCityView[0].main();

}

