import { sortByPrice, sortByTime, sortByDuration } from '../commonfunctions/sorting.js';
import{shallowCopy} from '../commonfunctions/deepcopy.js';

export class OneWayResult{
    #originalResult;
    #displayData;
    constructor(result){
        this.#originalResult=result['response0'].data;
        this.#displayData=shallowCopy(result['response0'].data).slice(0,50);
    }

    flightCardCreation(tripcount, triptype) {    
        let container = document.createElement('div');
        container.setAttribute('name', 'trip');
        container.setAttribute('class', 'container');
        container.style.cssText += "display:flex;flex-direction:row;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start;row-gap:5px";
        document.body.appendChild(container);
    
    
        // var tripvalue = Object.keys(result).length;
        // for (let j = 0; j < tripvalue; j++) {
        let column = document.createElement('div');
        column.setAttribute('name', 'column' + j);
        column.style.cssText += "display:flex;flex-direction:column;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start";
        document.querySelector('[name=trip]').appendChild(column);
        // }

        
        // for (let k = 0; k < tripvalue; k++) {           
            let i = 0;
            for (let value of this.#displayData) {
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
                i++;
            }
        // }
    
    }

    createSortingElement(){
        let buttonContainer = document.createElement('div');
        buttonContainer.setAttribute('name', 'sorting');
        buttonContainer.style.cssText = "display:flex;flex-direction: row;margin: 10px 0px;padding: 10px 10px;background-color: lightgrey";
        var sortBy = document.createElement('div');
        sortBy.textContent = "Sort By: ";
        sortBy.style.cssText = "flex-grow-1;align-self:center;color:black;font-size:20px;";
        buttonContainer.appendChild(sortBy);



        var parameters = ['Departure', 'Duration', 'Arrival', 'Price'];
        var uparrow = document.createElement('i');
        uparrow.setAttribute('class', 'fa fa-arrow-up');
        var downarrow = document.createElement('i');
        downarrow.setAttribute('class', 'fa fa-arrow-down');


        for (let nameOfElement of parameters) {
            const paramElement = document.createElement('div');
            paramElement.setAttribute('name', nameOfElement);
            paramElement.textContent = nameOfElement.replaceAll('_', ' ');
            paramElement.style.cssText = "font-size:20px;margin:auto;width:200px;text-align:center";
            paramElement.addEventListener('click', ()=>{
                
                var arrowState;
                if (paramElement.contains(uparrow)) {
                    arrowState = "up";
                } else if (paramElement.contains(downarrow)) {
                    arrowState = "down";
                }
        
                //removalOfUpDownArrow(parameters, paramElement);
                parameters.forEach((elementName) => {
                    let element = document.querySelector(`[name=${elementName}]`);
                    let up = element.querySelector('i.fa.fa-arrow-up');
                    let down = element.querySelector('i.fa.fa-arrow-down');
                    if (up !== null) {
                        up.remove();
                    } else if (down !== null) {
                        down.remove();
                    }
                    element.style.color = "black";
                    element.style.fontSize = "20px";
                    element.style.fontWeight = "normal";
                });


                if (arrowState == "up") {
                    if(nameOfElement=="Arrival" || nameOfElement=="Departure"){
                        this.#displayData=OneWaySorting(this.#originalResult,"Time",nameOfElement,"descending");
                    }else{
                        this.#displayData=OneWaySorting(this.#originalResult,nameOfElement,"","descending");
                    }
        
                    paramElement.appendChild(downarrow);
                } else if (arrowState == "down") {
                    if(nameOfElement=="Arrival" || nameOfElement=="Departure"){
                        this.#displayData=OneWaySorting(this.#originalResult,"Time",nameOfElement,"ascending");
                    }else{
                        this.#displayData=OneWaySorting(this.#originalResult,nameOfElement,"","ascending");
                    }
                    paramElement.appendChild(uparrow);
                } else {
                    if(nameOfElement=="Arrival" || nameOfElement=="Departure"){
                        this.#displayData=OneWaySorting(this.#originalResult,"Time",nameOfElement,"ascending");
                    }else{
                        this.#displayData=OneWaySorting(this.#originalResult,nameOfElement,"","ascending");
                    }
                    paramElement.appendChild(uparrow);
                }
        
                paramElement.style.fontWeight = "bold";
                paramElement.style.color = "#023047";
                paramElement.style.fontSize = "25px";
            });
            buttonContainer.appendChild(paramElement);
        }
        document.body.appendChild(buttonContainer);
    }

    OneWaySorting(originalData, sortBy, type, order) {
    
        if (sortBy == "Time") {
            return sortByTime(originalData,type,order,0);
        } else if (sortBy = "Price") {
            return sortByPrice(originalData,order,0);
        } else {
            return sortByDuration(originalData,order,0);
        }
    }

    main(){
        this.createSortingElement();
        console.log(this);
        this.flightCardCreation('1',"OneWay");
    }
}