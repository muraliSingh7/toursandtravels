import { sortByPrice, sortByTime, sortByDuration } from '../commonfunctions/sorting.js';
import{shallowCopy} from '../commonfunctions/deepcopy.js';

export function flightCardCreation(result, tripcount, triptype) {    
    let container = document.createElement('div');
    container.setAttribute('name', 'trip');
    container.setAttribute('class', 'container');
    container.style.cssText += "display:flex;flex-direction:row;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start;row-gap:5px";
    document.body.appendChild(container);


    var tripvalue = Object.keys(result).length;
    for (let j = 0; j < tripvalue; j++) {
        let column = document.createElement('div');
        column.setAttribute('name', 'column' + j);
        column.style.cssText += "display:flex;flex-direction:column;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start";
        document.querySelector('[name=trip]').appendChild(column);
    }

    // sortByPrice(originalData, "ascending", j);
    // sortByPrice(originalData, "descending", j);
    // sortByTime(originalData, "departure", "ascending", j);
    // sortByTime(originalData, "departure", "descending", j);
    // sortByTime(originalData, "arrival", "ascending", j);
    // sortByTime(originalData, "arrival", "descending", j);
    // sortByDuration(originalData, "ascending", j);
    // sortByDuration(originalData, "descending", j);
    for (let k = 0; k < tripvalue; k++) {
        let originalData = result['response' + k].data;
        let data = shallowCopy(originalData).slice(0,50);
        sortingElement("One-Way","","",originalData,data);
        
        let i = 0;
        for (let value of Object.values(data)) {
            const card = new FlightCard(tripcount, triptype);
            card.setAttribute('name', "FlightCard" + i);
            card.shadowRoot.querySelector("[name=carrier-name]").textContent = value.validatingAirlineCodes;
            for (let j = 0; j < value.itineraries.length; j++) {
 
                const numberofstops = value.itineraries[j].segments.length;
                card.shadowRoot.querySelectorAll("[name=depart-time]")[j].appendChild(document.createTextNode(value.itineraries[j].segments[0].departure.at.split('T')[1]));
                card.shadowRoot.querySelectorAll('[name="depart-place"]')[j].appendChild(document.createTextNode(value.itineraries[j].segments[0].departure.iataCode));
                card.shadowRoot.querySelectorAll("[name=duration]")[j].appendChild(document.createTextNode(value.itineraries[j].duration.split('PT')[1]));
                card.shadowRoot.querySelectorAll("[name=stoppage]")[j].appendChild(document.createTextNode(numberofstops));
                card.shadowRoot.querySelectorAll("[name=arrival-time]")[j].appendChild(document.createTextNode(value.itineraries[j].segments[numberofstops - 1].arrival.at.split('T')[1]));
                card.shadowRoot.querySelectorAll("[name=arrival-place]")[j].appendChild(document.createTextNode(value.itineraries[j].segments[numberofstops - 1].arrival.iataCode));
            }
            card.shadowRoot.querySelectorAll("[name=price]")[0].appendChild(document.createTextNode(value.price.total + " " + value.price.currency));
            document.querySelector(`[name=column${k}]`).appendChild(card);
            //console.log()
            //console.log("Price:"+value.price.total+""+value.price.currency);
            //console.log("Duration:"+value.itineraries[0].duration);
            //console.log("AirlineCodes:"+value.validatingAirlineCodes);
            //console.log("Stoppages:"+value.itineraries[0].segments.length);
            i++;
        }
    }

}


function sortingElement(triptype, from, to, originalData,data) {

    let buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('name', 'sorting');
    buttonContainer.style.cssText = "display:flex;flex-direction: row;margin: 10px 0px;padding: 10px 10px;background-color: lightgrey";
    var sortBy = document.createElement('div');
    sortBy.textContent = "Sort By: ";
    sortBy.style.cssText = "flex-grow-1;align-self:center;color:black;font-size:20px;";
    buttonContainer.appendChild(sortBy);

    if (triptype == "One-Way") {
        console.log("One-Way");
        var parameters = ['Departure', 'Duration', 'Arrival', 'Price']
        for (let j of parameters) {
            buttonContainer.appendChild(createSortingElement(j, "font-size:20px;margin:auto;width:200px;text-align:center", parameters, originalData,data));
        }


    } else if (triptype == "Round-Trip") {
        parameters = [`Departure_Time_From_${from}`, `Arrival_Time_To_${to}`, `Duration_From_${from}`, `Departure_Time_From_${to}`, `Arrival_Time_To_${from}`,
        `Duration_From_${to}`, 'Price']
        var buttonContainerColumn1 = document.createElement('div');
        buttonContainerColumn1.style.cssText = "display:flex;flex-wrap:wrap;flex-grow:2;align-items:center;justify-content:space-between;align-items:center"
        for (let i = 0; i < parameters.length - 1; i++) {
            buttonContainerColumn1.appendChild(createSortingElement(parameters[i], 'flex: 1 1 30%;color:black;font-size:20px;text-align: center;', parameters));
        }
        buttonContainer.appendChild(buttonContainerColumn1);
        buttonContainer.appendChild(createSortingElement(parameters[parameters.length - 1], "flex-grow-1;align-self:center;color:black;font-size:20px;", parameters));
    }
    return document.body.appendChild(buttonContainer);
}

function createSortingElement(nameOfElement, cssOfElement, parameters, originalData,data) {
    var uparrow = document.createElement('i');
    uparrow.setAttribute('class', 'fa fa-arrow-up');
    var downarrow = document.createElement('i');
    downarrow.setAttribute('class', 'fa fa-arrow-down');

    const paramElement = document.createElement('div');
    paramElement.setAttribute('name', nameOfElement);
    paramElement.textContent = nameOfElement.replaceAll('_', ' ');
    paramElement.style.cssText = cssOfElement;
    paramElement.addEventListener('click', ()=>{
        
        var arrowState;
        if (paramElement.contains(uparrow)) {
            arrowState = "up";
        } else if (paramElement.contains(downarrow)) {
            arrowState = "down";
        }

        removalOfUpDownArrow(parameters, paramElement);
        if (arrowState == "up") {
            if(nameOfElement=="Arrival" || nameOfElement=="Departure"){
                data=OneWaySorting(originalData,"Time",nameOfElement,"descending");
            }else{
                data=OneWaySorting(originalData,nameOfElement,"","descending");
            }

            paramElement.appendChild(downarrow);
        } else if (arrowState == "down") {
            if(nameOfElement=="Arrival" || nameOfElement=="Departure"){
                data=OneWaySorting(originalData,"Time",nameOfElement,"ascending");
            }else{
                data=OneWaySorting(originalData,nameOfElement,"","ascending");
            }
            paramElement.appendChild(uparrow);
        } else {
            if(nameOfElement=="Arrival" || nameOfElement=="Departure"){
                data=OneWaySorting(originalData,"Time",nameOfElement,"ascending");
            }else{
                data=OneWaySorting(originalData,nameOfElement,"","ascending");
            }
            paramElement.appendChild(uparrow);
        }

        paramElement.style.fontWeight = "bold";
        paramElement.style.color = "#023047";
        paramElement.style.fontSize = "25px";
    });
    return paramElement;
}



function removalOfUpDownArrow(parameters) {
    parameters.forEach((heading) => {
        let element = document.querySelector(`[name=${heading}]`);
        var up = element.querySelector('i.fa.fa-arrow-up');
        var down = element.querySelector('i.fa.fa-arrow-down');
        if (up !== null) {
            up.remove();
        } else if (down !== null) {
            down.remove();
        }
        element.style.color = "black";
        element.style.fontSize = "20px";
        element.style.fontWeight = "normal";
    });
}




function OneWaySorting(originalData, sortBy, type, order) {
    
    if (sortBy == "Time") {
        return sortByTime(originalData,type,order,0);
    } else if (sortBy = "Price") {
        return sortByPrice(originalData,order,0);
    } else {
        return sortByDuration(originalData,order,0);
    }
}

function RoundTripSorting() {

}

function MultiWaySorting() {
    if (sortBy == "Time") {
        if (type == "Departure" && order == "ascending") {
        } else if (type == "Departure" && order == "descending") {
        } else if (type == "Arrival" && order == "ascending") {
        } else if (type == "Arrival" && order == "descending") {
        }
    } else if (sortBy = "Price") {
        if (order == "ascending") {

        } else {

        }
    } else {
        if (order == "ascending") {

        } else {

        }
    }
}