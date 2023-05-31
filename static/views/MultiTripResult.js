import { sortByPrice, sortByTime, sortByDuration } from '../commonfunctions/sorting.js';
import { OneWayAndRoundTripHandler } from './OneWayAndRoundTripHandler/OneWayAndRoundTripHandler.js';
export class MultiTripResult{
  constructor(triptype, payload, result) {
    let multiCityView=[];
    let tripHeader=[];
    console.log(result);
    let tripTitle=document.createElement('div');
    tripTitle.setAttribute('name','tripTitle');
    tripTitle.setAttribute('class','tripTitle');

    for (let i = 0; i < result.length; i++) {
      let source = payload['load' + i]['from'];
      let destination = payload['load' + i]['to'];
      let tripDescription=document.createElement('p');
      tripDescription.setAttribute('name','tripDescription');
      tripDescription.setAttribute('class','tripDescription');

      if (i != 0) {
        let prevButton = document.createElement("span");
        prevButton.setAttribute("class", "prevButtonTripDescription");
        prevButton.setAttribute("prevButtonName", "prevButton" + i);
        prevButton.textContent =String.fromCodePoint(0x2039);
        prevButton.addEventListener('click', () => {
          document.querySelector('[name=tripDescription]').remove();
          document.querySelector('[name=tripTitle]').appendChild(tripHeader[i-1]);
          multiCityView[i-1].main();
        });
        tripDescription.appendChild(prevButton)
      }

      let sourceElement= document.createElement('span');
      sourceElement.setAttribute('class','tripSource')
      sourceElement.textContent = source;
      tripDescription.appendChild(sourceElement);


      let rightarrow = document.createElement("span");
      rightarrow.setAttribute("class", "rightArrowTripDescription");
      rightarrow.textContent = "→";//String.fromCodePoint(0x2192);
      tripDescription.appendChild(rightarrow);


      let destinationElement= document.createElement('span');
      destinationElement.setAttribute('class','tripDestination')
      destinationElement.textContent=destination;
      tripDescription.appendChild(destinationElement);
    

      if (i != result.length - 1) {
        let nextButton = document.createElement("span");
        nextButton.setAttribute("class", "nextButtonTripDescription");
        nextButton.setAttribute("prevButtonName", "nextButton" + i);
        nextButton.textContent =String.fromCodePoint(0x203a);
        nextButton.addEventListener('click', () => {
          document.querySelector('[name=tripDescription]').remove();
          document.querySelector('[name=tripTitle]').appendChild(tripHeader[i+1]);
          multiCityView[i+1].main();
        });
        tripDescription.appendChild(nextButton);
      }

      tripHeader.push(tripDescription);



      multiCityView.push(new OneWayAndRoundTripHandler(triptype,i, payload['load' + i]['from'], payload['load' + i]['to'], result[i]));
    }

    document.body.appendChild(tripTitle);
    document.querySelector('[name=tripTitle]').appendChild(tripHeader[0])
    multiCityView[0].main();

  }
}

