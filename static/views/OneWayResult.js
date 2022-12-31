import { sortByPrice, sortByTime, sortByDuration, appliedFilter } from '../commonfunctions/sorting.js';
export class OneWayResult {
    #originalResult;
    #displayData;
    constructor(result, source, destination) {
        this.#originalResult = result['response0'].data;
        this.#displayData = result['response0'].data.slice(0, 50);
        this.source = source;
        this.destination = destination;
        this.appliedFilterResult = {};
    }

    flightResultColumnCreation() {
        let container = document.createElement('div');
        container.setAttribute('name', 'trip');
        container.setAttribute('class', 'container');
        container.style.cssText += "display:flex;flex-direction:row;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start;row-gap:5px";
        document.body.appendChild(container);


        let filterPanel = document.createElement('div');
        filterPanel.setAttribute('name', 'filterPanel');
        // column.style.cssText += "display:flex;flex-direction:column;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start;margin:10px 10px";
        document.querySelector('[name=trip]').appendChild(filterPanel);

        let sortPanel = document.createElement('div');
        sortPanel.setAttribute('name', 'sortPanel');
        // column.style.cssText += "display:flex;flex-direction:column;flex-wrap:no-wrap;justify-content:flex-start;align-items:flex-start;margin:10px 10px";
        document.querySelector('[name=trip]').appendChild(sortPanel);

    }


    creatingButtonsAsPerTimeRange(parentElement, resultAsPerTimeRange, departureOrArrival) {
        var timing = ['0AM-6AM', '6AM-12PM', '12PM-6PM', '6PM-12AM'];
        var imgSource = ["https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_active.png?v=1",
            "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png?v=1",
            "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png?v=1",
            "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png?v=1"
        ];
        for (let i = 0; i < timing.length; i++) {
            if (resultAsPerTimeRange[timing[i]]) {
                let buttonContainer = document.createElement('div');
                buttonContainer.setAttribute('class', timeIntervalButton);
                if (departureOrArrival == 'departure') {
                    buttonContainer.setAttribute('departure-time', timing[i]);
                } else {
                    buttonContainer.setAttribute('arrival-time', timing[i]);
                }


                let img = document.createElement('img');
                img.setAttribute('src', imgSource[i]);
                buttonContainer.appendChild(img);


                let timeTitle = document.createElement('p');
                timeTitle.setAttribute('class', 'timeTitle');
                buttonContainer.appendChild(timeTitle);


                let buttonPrice = document.createElement('p');
                buttonPrice.setAttribute('class', 'buttonPrice');
                buttonPrice.textContent = resultAsPerTimeRange[timing[i]]['price'];
                buttonContainer.appendChild(buttonPrice);


                buttonContainer.addEventListener('click', () => {
                    if (buttonContainer.style.backgroundColor == "none") {
                        buttonContainer.style.backgroundColor = "green";
                        this.appliedFilterCommonData(timing[i], DepartureFromSourceAsPerTime[timing[i]]['result'], true);
                    }

                    if (buttonContainer.style.backgroundColor == "green") {
                        buttonContainer.style.backgroundColor = "none";
                        this.appliedFilterCommonData(timing[i], DepartureFromSourceAsPerTime[timing[i]]['result'], false);
                    }
                });


                parentElement.appendChild(buttonContainer);

            }
        }
    }


    filterViewCreation(source, destination, result) {
        var filterElementsContainer=['stoppage','departure','arrival','airlines'];
        var filterElementsTitle=[`Stops From ${source}`,`Departure From ${source}`,`Arrival To ${destination}`, 'Airlines'];


        let appliedFilterResult = appliedFilter(result);
        console.log(appliedFilterResult);
        let numberOfStopsFromSource = appliedFilterResult['numberOfStopsFromSource'];
        let DepartureFromSourceAsPerTime = appliedFilterResult['DepartureFromSourceAsPerTime'];
        let ArrivalAtDestinationAsPerTime = appliedFilterResult['ArrivalAtDestinationAsPerTime'];
        let Airline = appliedFilterResult['Airline'];


        if(Object.keys(numberOfStopsFromSource).length>0){
            let numberOfStopsContainer=document.createElement('div');
            numberOfStopsContainer.setAttribute('class','container');
            numberOfStopsContainer.setAttribute('name','numberOfStops');

            let numberOfStopsTitle=document.createElement('p');
            numberOfStopsTitle.setAttribute('class','title');
            numberOfStopsTitle.setAttribute('name','numberOfStopsTitle');
            numberOfStopsTitle.textContent=`Stops From ${source}`;




        }

        if(Object.keys(DepartureFromSourceAsPerTime).length>0){
            let DepartureFromSourceAsPerTimeContainer=document.createElement('div');
            DepartureFromSourceAsPerTimeContainer.setAttribute('class','container');
            DepartureFromSourceAsPerTimeContainer.setAttribute('name','DepartureFromSourceAsPerTime');

            let DepartureFromSourceAsPerTimeTitle=document.createElement('p');
            DepartureFromSourceAsPerTimeTitle.setAttribute('class','title');
            DepartureFromSourceAsPerTimeTitle.setAttribute('name','DepartureFromSourceAsPerTimeTitle');
            DepartureFromSourceAsPerTimeTitle.textContent=`Departure From ${source}`;
            this.creatingButtonsAsPerTimeRange(DepartureFromSourceAsPerTimeContainer,DepartureFromSourceAsPerTime,departure);
        }

        if(Object.keys(ArrivalAtDestinationAsPerTime).length>0){
            let ArrivalAtDestinationAsPerTimeContainer=document.createElement('div');
            ArrivalAtDestinationAsPerTimeContainer.setAttribute('class','container');
            ArrivalAtDestinationAsPerTimeContainer.setAttribute('name','ArrivalAtDestinationAsPerTime');

            let ArrivalAtDestinationAsPerTimeTitle=document.createElement('p');
            ArrivalAtDestinationAsPerTimeTitle.setAttribute('class','title');
            ArrivalAtDestinationAsPerTimeTitle.setAttribute('name','ArrivalAtDestinationAsPerTimeTitle');
            ArrivalAtDestinationAsPerTimeTitle.textContent=`Arrival To ${destination}`;

            this.creatingButtonsAsPerTimeRange(ArrivalAtDestinationAsPerTimeContainer,ArrivalAtDestinationAsPerTime,arrival);
        }

        if(Object.keys(Airline).length>0){
            let AirlineContainer=document.createElement('div');
            AirlineContainer.setAttribute('class','container');
            AirlineContainer.setAttribute('name','Airline');

            let AirlineTitle=document.createElement('p');
            AirlineTitle.setAttribute('class','title');
            AirlineTitle.setAttribute('name','AirlineTitle');
            AirlineTitle.textContent="Airlines";

        }
        var timing = ['0AM-6AM', '6AM-12PM', '12PM-6PM', '6PM-12AM'];


        for (let i = 0; i < Airline.length; i++) {
            let airline = document.createElement('div');
            let airlineNameInput = document.createElement('input');
            airlineNameInput.setAttribute('type', 'checkbox');
            airlineNameInput.setAttribute('name', Airline.name);

            let airlineLabel = document.createElement('label');
            airlineLabel.setAttribute('for', Airline.name);
            airlineLabel.textContent = Airline.name + "(" + Airline.count + ")";

            let airlinePrice = document.createElement('p');
            airlinePrice.setAttribute('class', 'airlinePrice');
            airlinePrice.textContent = Airline.minimumPrice;

            airline.appendChild(airlineNameInput);
            airline.appendChild(airlineLabel);
            airline.appendChild(airlinePrice);
            airline.addEventListener('click', () => {
                if (document.querySelector[`input[name=${Airline.name}]`].checked) {
                    this.appliedFilterCommonData(Airline.name, Airline.result, true);
                } else {
                    this.appliedFilterCommonData(Airline.name, Airline.result, false);
                }
            });
            document.querySelector('[name=oneWayFilter]').shadowRoot.querySelector('[name=airlines]').appendChild(airline);

        }

        for (let i = 0; i < numberOfStopsFromSource.length; i++) {
            let numberOfStops = document.createElement('div');
            let numberOfStopsNameInput = document.createElement('input');
            numberOfStopsNameInput.setAttribute('type', 'checkbox');
            numberOfStopsNameInput.setAttribute('name', numberOfStopsFromSource.name);

            let numberOfStopsLabel = document.createElement('label');
            numberOfStopsLabel.setAttribute('for', numberOfStopsFromSource.name);
            numberOfStopsLabel.textContent = numberOfStopsFromSource.name + "(" + numberOfStopsFromSource.count + ")";

            let numberOfStopsPrice = document.createElement('p');
            numberOfStopsPrice.setAttribute('class', 'numberOfStopsPrice');
            numberOfStopsPrice.textContent = numberOfStopsFromSource.minimumPrice;


            numberOfStops.appendChild(numberOfStopsNameInput);
            numberOfStops.appendChild(numberOfStopsLabel);
            numberOfStops.appendChild(numberOfStopsPrice);
            numberOfStops.addEventListener('click', () => {
                if (document.querySelector[`input[name=numberOfStopsFromSource.name]`].checked) {
                    this.appliedFilterCommonData(numberOfStopsFromSource.name, numberOfStopsFromSource.result, true);
                } else {
                    this.appliedFilterCommonData(numberOfStopsFromSource.name, numberOfStopsFromSource.result, false);
                }
            });
            document.querySelector('[name=oneWayFilter]').shadowRoot.querySelector('[name=stoppage]').appendChild(numberOfStops);

        }
    }

    appliedFilterCommonData(filterName, filterResult, filterAddOrRemove) {
        if (filterAddOrRemove) {
            this.appliedFilterResult[filterName] = filterResult;
            if (Object.keys(this.appliedFilterResult).length == 1) {
                this.appliedFilterResult['common'] = filterResult;
            } else {
                let commonResult = this.appliedFilterResult['common'].filter(object1 => this.appliedFilterResult[filterName].some(object2 => object1.id == object2.id));
                this.appliedFilterResult['common'] = commonResult;
            }
        } else {
            delete this.appliedFilterResult.filterName;
            if (Object.keys(this.appliedFilterResult).length == 1) {
                this.appliedFilterResult['common'] = this.#originalResult;
            } else {
                this.appliedFilterResult['common'] = this.appliedFilterResult[Object.keys(this.appliedFilterResult)[0]];
                for (let i = 1; i < Object.keys(this.appliedFilterResult).length - 1; i++) {
                    let commonResult = this.appliedFilterResult['common'].filter(object1 => this.appliedFilterResult[j].some(object2 => object1.id == object2.id));
                    this.appliedFilterResult['common'] = commonResult;
                }

            }

        }
        this.display(this.appliedFilterResult['common']);
    }




    display(data) {
        document.querySelector('[name=sortPanel]').innerHTML = "";


        for (let i = 0; i < data.length; i++) {
            let value = data[i];
            const card = new FlightCard(1);
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
            document.querySelector(`[name=sortPanel]`).appendChild(card);
        }
    }


    createSortingElement(result) {
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
                    this.OneWaySorting(result, nameOfElement, "descending");
                    paramElement.appendChild(downarrow);
                } else {
                    this.OneWaySorting(result, nameOfElement, "ascending");
                    paramElement.appendChild(uparrow);
                }

                paramElement.style.fontWeight = "bold";
                paramElement.style.color = "#023047";
                paramElement.style.fontSize = "25px";
            });
            buttonContainer.appendChild(paramElement);
        }
        document.querySelector('[name=sortPanel]').appendChild(buttonContainer);

    }

    OneWaySorting(originalData, sortBy, order) {
        if (sortBy == "Duration") {
            this.display(sortByDuration(originalData, order, 0));
        } else if (sortBy == "Price") {
            this.display(sortByPrice(originalData, order, 0));
        } else {
            this.display(sortByTime(originalData, sortBy, order, 0));
        }
    }

    main() {
        this.flightResultColumnCreation();
        this.filterViewCreation(this.source, this.destination, this.#originalResult);
        this.createSortingElement(this.#originalResult);
        this.display(this.#displayData);
    }
}