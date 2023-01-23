import { sortByPrice, sortByTime, sortByDuration } from '../commonfunctions/sorting.js';
import { OneWayResult } from './OneWayResult/OneWayResult.js';
export class MultiTripResult{
  constructor(triptype, payload, result) {
    let multiCityView=[];
    console.log(result);
    for (let i = 0; i < result.length; i++) {
      let source = payload['load' + i]['from'];
      let destination = payload['load' + i]['to'];
      let tripDescription=document.createElement('p');

      if (i != 0) {
        let prevButton = document.createElement("span");
        prevButton.setAttribute("class", "prevButtonTripDescription");
        prevButton.setAttribute("prevButtonName", "prevButton" + i);
        prevButton.innerHTML = '&#8249;';
        prevButton.addEventListener('click', () => {
          multiCityView[i-1].main();
        });
        tripDescription.appendChild(prevButton)
      }

      let sourceElement= document.createElement('span');
      sourceElement.textContent = source;
      tripDescription.appendChild(sourceElement);


      let rightarrow = document.createElement("span");
      rightarrow.setAttribute("class", "rightArrowTripDescription");
      rightarrow.innerHTML = '&rarr;';
      tripDescription.appendChild(rightarrow);


      let destinationElement= document.createElement('span');
      destinationElement.textContent=destination;
      tripDescription.appendChild(destinationElement);
    

      if (i != result.length - 1) {
        let nextButton = document.createElement("span");
        nextButton.setAttribute("class", "nextButtonTripDescription");
        nextButton.setAttribute("prevButtonName", "nextButton" + i);
        nextButton.innerHTML = '&#8250;';
        nextButton.addEventListener('click', () => {
          multiCityView[i+1].main();
        });
        tripDescription.appendChild(nextButton);
      }


      document.body.appendChild(tripDescription);


      multiCityView.push(new OneWayResult(triptype,i, payload['load' + i]['from'], payload['load' + i]['to'], result[i]));
    }

    multiCityView[0].main();

  }
}

