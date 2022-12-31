import { sortByPrice, sortByTime, sortByDuration } from '../commonfunctions/sorting.js';


export class RoundWayResult {
    #originalResult;
    #displayData;
    constructor(result, source, destination) {
        this.#originalResult = result['response0'].data;
        this.#displayData = result['response0'].data.slice(0, 50);
        this.source = source;
        this.destination = destination;
    }

    flightCardCreation() {
        let container = document.createElement('div');
        container.setAttribute('name', 'trip');
        container.setAttribute('class', 'container');
        container.style.cssText += "display:flex;flex-direction:row;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start;row-gap:5px";
        document.body.appendChild(container);


        let column = document.createElement('div');
        column.setAttribute('name', 'column0');
        column.style.cssText += "display:flex;flex-direction:column;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start";
        document.querySelector('[name=trip]').appendChild(column);

    }

    display(data) {

        for (let i=0;i<data.length;i++) {
            let value=data[i];
            if (document.querySelector(`[name="FlightCard${i}`) !== null) {
                document.querySelector(`[name="FlightCard${i}`).remove();
            }

            const card = new FlightCard(2);
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
            document.querySelector(`[name=column0]`).appendChild(card);
        }
    }


    createSortingElement() {
        let buttonContainer = document.createElement('div');
        buttonContainer.setAttribute('name', 'sorting');
        buttonContainer.style.cssText = "display:flex;flex-direction: row;margin: 10px 0px;padding: 10px 10px;background-color: lightgrey";

        var buttonContainerColumn2 = document.createElement('div');
        buttonContainerColumn2.style.cssText = "display:flex;flex-wrap:wrap;flex-grow:2;align-items:center;justify-content:space-between;align-items:center";

        var parameters = ['Sort By: ', `Departure_Time_From_${this.source}`, `Arrival_Time_To_${this.destination}`, `Duration_From_${this.source}`, `Departure_Time_From_${this.destination}`, `Arrival_Time_To_${this.source}`,
            `Duration_From_${this.destination}`, 'Price']



        var uparrow = document.createElement('i');
        uparrow.setAttribute('class', 'fa fa-arrow-up');
        var downarrow = document.createElement('i');
        downarrow.setAttribute('class', 'fa fa-arrow-down');


        for (let nameOfElement of parameters) {
            const paramElement = document.createElement('div');
            paramElement.setAttribute('name', nameOfElement);
            paramElement.textContent = nameOfElement.replaceAll('_', ' ');
            if (nameOfElement == "Price" || nameOfElement == "Sort By: ") {
                paramElement.style.cssText = "flex-grow-1;align-self:center;color:black;font-size:20px;";
            } else {
                paramElement.style.cssText = "flex: 1 1 30%;color:black;font-size:20px;text-align: center;";
            }


            if (nameOfElement !== "Sort By: ") {
                paramElement.addEventListener('click', () => {
                    var arrowState;
                    if (paramElement.contains(uparrow)) {
                        arrowState = "up";
                    } else if (paramElement.contains(downarrow)) {
                        arrowState = "down";
                    }

                  
                    parameters.forEach((elementName) => {
                        if (elementName != "Sort By: ") {
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
                        }
                    });


                    if (arrowState == "up") {
                        switch (nameOfElement) {
                            case `Departure_Time_From_${this.source}`:
                                this.roundTripSorting(this.#originalResult, 'Departure', "descending", 0); break;
                            case `Arrival_Time_To_${this.destination}`: this.roundTripSorting(this.#originalResult, 'Arrival', "descending", 0); break;
                            case `Departure_Time_From_${this.destination}`: this.roundTripSorting(this.#originalResult, 'Departure', "descending", 1); break;
                            case `Arrival_Time_To_${this.source}`: this.roundTripSorting(this.#originalResult, 'Arrival', "descending", 1); break;
                            case `Duration_From_${this.source}`: this.roundTripSorting(this.#originalResult, 'Duration', "descending", 0); break;
                            case `Duration_From_${this.destination}`: this.roundTripSorting(this.#originalResult, 'Duration', "descending", 1); break;
                            case 'Price': this.roundTripSorting(this.#originalResult, 'Price', "descending", 0); break;
                        }
                        paramElement.appendChild(downarrow);
                    } else {
                        switch (nameOfElement) {
                            case `Departure_Time_From_${this.source}`:
                                this.roundTripSorting(this.#originalResult, 'Departure', "ascending", 0); break;
                            case `Arrival_Time_To_${this.destination}`: this.roundTripSorting(this.#originalResult, 'Arrival', "ascending", 0); break;
                            case `Departure_Time_From_${this.destination}`: this.roundTripSorting(this.#originalResult, 'Departure', "ascending", 1); break;
                            case `Arrival_Time_To_${this.source}`: this.roundTripSorting(this.#originalResult, 'Arrival', "ascending", 1); break;
                            case `Duration_From_${this.source}`: this.roundTripSorting(this.#originalResult, 'Duration', "ascending", 0); break;
                            case `Duration_From_${this.destination}`: this.roundTripSorting(this.#originalResult, 'Duration', "ascending", 1); break;
                            case 'Price': this.roundTripSorting(this.#originalResult, 'Price', "ascending", 0); break;
                        }
                        paramElement.appendChild(uparrow);
                    }

                    paramElement.style.fontWeight = "bold";
                    paramElement.style.color = "#023047";
                    paramElement.style.fontSize = "25px";
                });
            }

            if (nameOfElement == "Sort By: ") {
                buttonContainer.appendChild(paramElement);
            } else if (nameOfElement == "Price") {
                buttonContainer.appendChild(buttonContainerColumn2);
                buttonContainer.appendChild(paramElement);
            } else {
                buttonContainerColumn2.appendChild(paramElement);
            }

        }
        document.body.appendChild(buttonContainer);

    }

    roundTripSorting(originalData, sortBy, order, itinerariesValue) {
        if (sortBy == "Duration") {
            this.display(sortByDuration(originalData, order, itinerariesValue));
        } else if (sortBy == "Price") {
            this.display(sortByPrice(originalData, order, itinerariesValue));
        } else {
            this.display(sortByTime(originalData, sortBy, order, itinerariesValue));
        }
    }

    main() {
        this.createSortingElement();
        this.flightCardCreation();
        this.display(this.#displayData);
    }
}