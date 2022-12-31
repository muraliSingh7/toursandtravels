import { sortByPrice, sortByTime, sortByDuration } from '../commonfunctions/sorting.js';
export class MultiTripResult {
    #originalResult;
    #displayData;
    constructor(tripcount, result) {
        this.tripcount = tripcount;
        this.#originalResult = result;
        this.#displayData=result;
    }

    flightCardCreation() {
        let container = document.createElement('div');
        container.setAttribute('name', 'trip');
        container.setAttribute('class', 'container');
        container.style.cssText += "display:flex;flex-direction:row;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start;row-gap:5px";
        document.body.appendChild(container);

        for (let i = 0; i < this.tripcount; i++) {
            let column = document.createElement('div');
            column.setAttribute('name', 'column' + i);
            column.style.cssText += "display:flex;flex-direction:column;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start;border: 8px solid;	border-image: linear-gradient(45deg, turquoise, greenyellow) 1;margin: 10px 10px 0px 0px;width:670px;";
            document.querySelector('[name=trip]').appendChild(column);
        }

    }

    display(start,end,resultant) {
        for (let k = start; k < end; k++) {
            let individualTripResult = resultant['response'+k].data;
            for (let i = 0; i < individualTripResult.length; i++) {
                let value = individualTripResult[i];
                if (document.querySelector(`[name="FlightCard${k}${i}`) !== null) {
                    document.querySelector(`[name="FlightCard${k}${i}`).remove();
                }

                const card = new FlightCard(1);
                card.setAttribute('name', `FlightCard${k}${i}`);
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

            }
        }
    }

    createSortingElement() {
        for (let i = 0; i < this.tripcount; i++) {
            let buttonContainer = document.createElement('div');
            buttonContainer.setAttribute('name', `sorting${i}`);
            buttonContainer.style.cssText = "display:flex;flex-direction: row;margin: 10px 20px;padding: 10px 10px;background-color: lightgrey;width:600px";
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
                paramElement.textContent = nameOfElement;
                paramElement.style.cssText = "font-size:20px;margin:auto;width:200px;text-align:center";
                paramElement.addEventListener('click', () => {

                    var arrowState;
                    if (paramElement.contains(uparrow)) {
                        arrowState = "up";
                    } else if (paramElement.contains(downarrow)) {
                        arrowState = "down";
                    }


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
                        this.OneWaySorting(this.#originalResult['response'+i].data, nameOfElement, "descending",i);
                        paramElement.appendChild(downarrow);
                    } else {
                        this.OneWaySorting(this.#originalResult['response'+i].data, nameOfElement, "ascending",i);
                        paramElement.appendChild(uparrow);
                    }

                    paramElement.style.fontWeight = "bold";
                    paramElement.style.color = "#023047";
                    paramElement.style.fontSize = "25px";
                });
                buttonContainer.appendChild(paramElement);
            }
            document.querySelector(`[name=column${i}]`).appendChild(buttonContainer);
        }
    }


    OneWaySorting(originalData, sortBy, order, responseNumber) {
        let sortResult={};
        sortResult[`response${responseNumber}`]={};
        if (sortBy == "Duration") {
            sortResult[`response${responseNumber}`]['data']=sortByDuration(originalData, order, 0);
            this.display(responseNumber,responseNumber+1,sortResult);
        } else if (sortBy == "Price") {
            sortResult[`response${responseNumber}`]['data']=sortByPrice(originalData, order, 0);
            this.display(responseNumber,responseNumber+1,sortResult);
        } else {
            sortResult[`response${responseNumber}`]['data']=sortByTime(originalData,sortBy, order, 0);
            this.display(responseNumber,responseNumber+1,sortResult);
        }
    }

    main() {
        this.flightCardCreation();
        this.createSortingElement();
        this.display(0,this.tripcount,this.#displayData);
    }
}

