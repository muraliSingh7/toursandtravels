//import { sortByPrice, sortByTime, sortByDuration, appliedFilter } from '../../commonfunctions/sorting.js';
import { FilterCache } from '../../filterCache/filterCache.js';
export class OneWayResult {
    constructor(triptype, tripNumber, source, destination, result) {
        console.log(triptype);
        this.source = source;
        this.destination = destination;
        // this.originalResult = result['response' + tripNumber];
        // this.displayData = result['response' + tripNumber].slice(0, 50);
        this.originalResult = result;
        this.displayData = result.slice(0, 50);
        this.filter = new FilterCache(tripNumber, this.originalResult);
        this.appliedFilterResult = {};
        this.filterApplied = {};
        this.triptype = triptype;
        this.tripNumber = tripNumber;
    }

    async appliedFilter(tripCount) {
        await this.filter.init(this.tripNumber, this.originalResult);
        let FilterElementsCreationResult = {};
        for (let tripNumber = 0; tripNumber < tripCount; tripNumber++) {
            FilterElementsCreationResult['numberOfStopsFromSourceFromTrip' + tripNumber] = await this.filter.countofNumberofStops(tripNumber);
            FilterElementsCreationResult['arrivalAtDestinationAsPerTimeFromTrip' + tripNumber] = {};
            FilterElementsCreationResult['departureFromSourceAsPerTimeFromTrip' + tripNumber] = {};
            var time = [0, 21600, 43200, 64800, 86400];
            for (let i = 0; i < time.length - 1; i++) {
                FilterElementsCreationResult['departureFromSourceAsPerTimeFromTrip' + tripNumber][time[i] + "_" + time[i + 1]] = await this.filter.getPriceAsPerTime(tripNumber, "departure", time[i], time[i + 1]);
                FilterElementsCreationResult['arrivalAtDestinationAsPerTimeFromTrip' + tripNumber][time[i] + "_" + time[i + 1]] = await this.filter.getPriceAsPerTime(tripNumber, "arrival", time[i], time[i + 1]);
            }
        }


        FilterElementsCreationResult['airline'] = await this.filter.getUniqueAirline(0);
        console.log(FilterElementsCreationResult);
        return FilterElementsCreationResult;
    }

    flightResultColumnCreation() {
        let container = document.createElement('div');
        container.setAttribute('name', 'trip');
        container.setAttribute('class', 'resultViewContainer');
        document.body.appendChild(container);
        document.querySelector("[name=trip]").innerHTML = "";

        let filterPanel = document.createElement('div');
        filterPanel.setAttribute('name', 'filterPanel');
        filterPanel.setAttribute('class', 'filterPanel');
        document.querySelector('[name=trip]').appendChild(filterPanel);

        let sortPanel = document.createElement('div');
        sortPanel.setAttribute('name', 'sortPanel');
        sortPanel.setAttribute('class', 'sortPanel');
        document.querySelector('[name=trip]').appendChild(sortPanel);


    }

    async filterViewCreation(source, destination) {
        var FilterElementsCreationResult;
        var titleTextContent;
        var name;
        if (this.triptype == "Round-Trip") {
            FilterElementsCreationResult = await this.appliedFilter(2);
            name = ['numberOfStopsFromSourceFromTrip0', 'numberOfStopsFromSourceFromTrip1',
                'departureFromSourceAsPerTimeFromTrip0', 'departureFromSourceAsPerTimeFromTrip1',
                'arrivalAtDestinationAsPerTimeFromTrip0', 'arrivalAtDestinationAsPerTimeFromTrip1',
                'airline'];
            titleTextContent = [`Stops From ${source}`, `Stops From ${destination}`,
            `Departure From ${source}`, `Departure From ${destination}`,
            `Arrival To ${destination}`, `Arrival To ${source}`,
                'Airlines'];
        } else {
            FilterElementsCreationResult = await this.appliedFilter(1);
            name = ['numberOfStopsFromSourceFromTrip0', 'departureFromSourceAsPerTimeFromTrip0',
                'arrivalAtDestinationAsPerTimeFromTrip0', 'airline'];
            titleTextContent = [`Stops From ${source}`, `Departure From ${source}`,
            `Arrival To ${destination}`, 'Airlines'];
        }

        for (let i = 0; i < name.length; i++) {
            if (Object.keys(FilterElementsCreationResult[name[i]]).length > 0) {
                let elementContainer = document.createElement('div');
                elementContainer.setAttribute('class', 'container');
                elementContainer.setAttribute('name', name[i]);


                let title = document.createElement('p');
                title.setAttribute('class', 'title');
                title.setAttribute('name', name[i] + 'Title');
                title.textContent = titleTextContent[i];


                elementContainer.appendChild(title);
                if (this.triptype == "Round-Trip") {
                    switch (name[i]) {
                        case name[0]: this.numberOfStopsFilter(elementContainer, name[0], FilterElementsCreationResult[name[0]]); break;
                        case name[1]: this.numberOfStopsFilter(elementContainer, name[1], FilterElementsCreationResult[name[1]]); break;
                        case name[2]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer, 'departure', name[2], FilterElementsCreationResult[name[2]]); break;
                        case name[3]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer, 'departure', name[3], FilterElementsCreationResult[name[3]]); break;
                        case name[4]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer, 'arrival', name[4], FilterElementsCreationResult[name[4]]); break;
                        case name[5]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer, 'arrival', name[5], FilterElementsCreationResult[name[5]]); break;
                        case name[6]: this.airlineFilter(elementContainer, FilterElementsCreationResult[name[6]]); break;
                    }
                } else {
                    switch (name[i]) {
                        case name[0]: this.numberOfStopsFilter(elementContainer, name[0], FilterElementsCreationResult[name[0]]); break;
                        case name[1]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer, 'departure', name[1], FilterElementsCreationResult[name[1]]); break;
                        case name[2]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer, 'arrival', name[2], FilterElementsCreationResult[name[2]]); break;
                        case name[3]: this.airlineFilter(elementContainer, FilterElementsCreationResult[name[3]]); break;
                    }
                }

                document.querySelector('[name=filterPanel]').appendChild(elementContainer);

            }
        }
    }


    numberOfStopsFilter(parentElement, filterName, filterResult) {
        Object.keys(filterResult).forEach(stopNumber => {
            let individualStopContainer = document.createElement('div');
            individualStopContainer.setAttribute('class', 'subContainer');

            let checkBoxAndLabelCombinedContainer = document.createElement('div');
            checkBoxAndLabelCombinedContainer.setAttribute('class', ' checkBoxAndLabelCombinedContainer');

            let checkBoxForStop = document.createElement('input');
            checkBoxForStop.setAttribute('type', 'checkbox');
            checkBoxForStop.setAttribute('name', stopNumber + '-Stop');


            let labelForStop = document.createElement('label');
            labelForStop.setAttribute('for', stopNumber + ' Stop');
            labelForStop.setAttribute('class', 'titlelabel');
            if (stopNumber == 0) {
                labelForStop.textContent = "Non-Stop (" + filterResult[stopNumber]['count'] + ")";
            } else {
                labelForStop.textContent = stopNumber + ' Stop ' + "(" + filterResult[stopNumber]['count'] + ")";
            }



            let minimumPriceForStop = document.createElement('p');
            minimumPriceForStop.setAttribute('name', 'minimumPriceForStop');
            minimumPriceForStop.setAttribute('class', 'price');
            minimumPriceForStop.textContent = filterResult[stopNumber]['minimumPrice'];


            checkBoxAndLabelCombinedContainer.appendChild(checkBoxForStop);
            checkBoxAndLabelCombinedContainer.appendChild(labelForStop);


            individualStopContainer.appendChild(checkBoxAndLabelCombinedContainer);
            individualStopContainer.appendChild(minimumPriceForStop);



            individualStopContainer.addEventListener('click', () => {
                if (!this.filterApplied.hasOwnProperty(filterName)) {
                    this.filterApplied[filterName] = [];
                }

                if (checkBoxForStop.checked) {
                    this.filterApplied[filterName].push(stopNumber);           
                } else {
                    if (this.filterApplied[filterName].length > 0 && this.filterApplied[filterName].indexOf(stopNumber) > -1) {
                        this.filterApplied.splice(this.filterApplied[filterName].indexOf(stopNumber), 1)
                    }
                }
                this.appliedFilterCommonData();
            });


            parentElement.appendChild(individualStopContainer);
        });
    }


    creatingButtonsAsPerTimeRangeFilter(parentElement, departureOrArrival, filterName, resultAsPerTimeRange) {
        var timing = ['0AM-6AM', '6AM-12PM', '12PM-6PM', '6PM-12AM'];
        var timeHeader = ['Before 6AM', '6AM-12PM', '12PM-6PM', 'After 6PM']
        var time = [0, 21600, 43200, 64800, 86400];
        var imgSource = ["https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_active.png?v=1",
            "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png?v=1",
            "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png?v=1",
            "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png?v=1"
        ];
        console.log(resultAsPerTimeRange);

        for (let i = 0; i < timing.length; i++) {
            if (resultAsPerTimeRange[time[i] + "_" + time[i + 1]]) {
                let timeIntervalButton = document.createElement('div');
                timeIntervalButton.setAttribute('class', 'timeIntervalButton');


                if (departureOrArrival == 'departure') {
                    timeIntervalButton.setAttribute('departure-time', timing[i]);
                } else {
                    timeIntervalButton.setAttribute('arrival-time', timing[i]);
                }



                let timeIntervalImage = document.createElement('img');
                timeIntervalImage.setAttribute('src', imgSource[i]);
                timeIntervalImage.setAttribute('class', 'timeIntervalImage');
                timeIntervalButton.appendChild(timeIntervalImage);


                let timeIntervalTitle = document.createElement('p');
                timeIntervalTitle.setAttribute('class', 'timeIntervalTitle');
                timeIntervalTitle.textContent = timeHeader[i];
                timeIntervalButton.appendChild(timeIntervalTitle);


                let timeIntervalMinimumPrice = document.createElement('p');
                timeIntervalMinimumPrice.setAttribute('class', 'buttonPrice');
                timeIntervalMinimumPrice.textContent = resultAsPerTimeRange[time[i] + "_" + time[i + 1]];
                timeIntervalButton.appendChild(timeIntervalMinimumPrice);


                timeIntervalButton.addEventListener('click', () => {
                    if (!this.filterApplied.hasOwnProperty(filterName)) {
                        this.filterApplied[filterName] = [];
                    }

                    filterByTime[filterName] = [time[i], time[i + 1]];
                    if (timeIntervalButton.style.backgroundColor == "transparent") {
                        timeIntervalButton.style.backgroundColor = "green";
                        this.filterApplied[filterName].push([time[i], time[i + 1]]);
                    }

                    if (timeIntervalButton.style.backgroundColor == "green") {
                        timeIntervalButton.style.backgroundColor = "transparent";
                        if (this.filterApplied[filterName].length > 0) {
                            Array.prototype.getIndexFromNestedArray = (value) => {
                                value = JSON.stringify(value);
                                var arrayJSON = this.map(JSON.stringify);
                                return arrayJSON.indexOf(value);
                            }
                            this.filterApplied.splice(getIndexFromNestedArray([time[i], time[i + 1]]), 1);
                        }
                    }

                    this.appliedFilterCommonData();
                });


                parentElement.appendChild(timeIntervalButton);

            }
        }
    }


    airlineFilter(parentELement, filterResult) {
        Object.keys(filterResult).forEach(airlineCode => {
            let individualAirlineContainer = document.createElement('div');
            individualAirlineContainer.setAttribute('class', 'subContainer');

            let checkBoxAndLabelCombinedContainer = document.createElement('div');
            checkBoxAndLabelCombinedContainer.setAttribute('class', ' checkBoxAndLabelCombinedContainer');

            let checkboxForAirline = document.createElement('input');
            checkboxForAirline.setAttribute('type', 'checkbox');
            checkboxForAirline.setAttribute('name', airlineCode);


            let labelForAirline = document.createElement('label');
            labelForAirline.setAttribute('for', airlineCode);
            labelForAirline.setAttribute('class', 'titlelabel');
            individualAirlineContainer.appendChild(checkboxForAirline);
            labelForAirline.textContent = airlineCode + "(" + filterResult[airlineCode]['count'] + ")";


            let airlineMinimumPrice = document.createElement('p');
            airlineMinimumPrice.setAttribute('class', 'airlineMinimumPrice');
            airlineMinimumPrice.setAttribute('class', 'price');
            airlineMinimumPrice.textContent = filterResult[airlineCode]['minimumPrice'];

            checkBoxAndLabelCombinedContainer.appendChild(checkboxForAirline);
            checkBoxAndLabelCombinedContainer.appendChild(labelForAirline);


            individualAirlineContainer.appendChild(checkBoxAndLabelCombinedContainer);
            individualAirlineContainer.appendChild(airlineMinimumPrice);


            individualAirlineContainer.addEventListener('click', () => {
                if (!this.filterApplied.hasOwnProperty('airline')) {
                    this.filterApplied[filterName] = [];
                }

                if (checkboxForAirline.checked) {
                    this.filterApplied[filterName].push(airlineCode);
                } else {
                    if (this.filterApplied[filterName].length > 0 && this.filterApplied[filterName].indexOf(airlineCode) > -1) {
                        this.filterApplied.splice(this.filterApplied[filterName].indexOf(airlineCode), 1)
                    }
                }
                this.appliedFilterCommonData();
            });


            parentELement.appendChild(individualAirlineContainer);
        });

    }

    async appliedFilterCommonData() {
        
        let result = this.filter.filtering(this.filterApplied);
        this.display(result);
    }


    // appliedFilterCommonData(filterName, filterResult, filterAddOrRemove) {
    //     if (filterAddOrRemove) {
    //         this.appliedFilterResult[filterName] = filterResult;
    //         if (Object.keys(this.appliedFilterResult).length == 1) {
    //             this.appliedFilterResult['common'] = filterResult;
    //         } else {
    //             let commonResult = this.appliedFilterResult['common'].filter(object1 => this.appliedFilterResult[filterName].some(object2 => object1.id == object2.id));
    //             this.appliedFilterResult['common'] = commonResult;
    //         }
    //     } else {
    //         delete this.appliedFilterResult[filterName];
    //         if (Object.keys(this.appliedFilterResult).length <= 1) {
    //             this.appliedFilterResult['common'] = this.originalResult;
    //         } else {
    //             this.appliedFilterResult['common'] = this.appliedFilterResult[Object.keys(this.appliedFilterResult)[0]];
    //             for (let i = 1; i < Object.keys(this.appliedFilterResult).length - 1; i++) {
    //                 let commonResult = this.appliedFilterResult['common'].filter(object1 => this.appliedFilterResult[i].some(object2 => object1.id == object2.id));
    //                 this.appliedFilterResult['common'] = commonResult;
    //             }

    //         }

    //     }

    //     console.log(this.appliedFilterResult);
    //     this.display(this.appliedFilterResult['common']);
    // }





    createSortingElement() {
        let sortingHeaderContainer = document.createElement('div');
        sortingHeaderContainer.setAttribute('name', 'sorting');
        sortingHeaderContainer.setAttribute('class', 'sortHeaders');


        var name, parameters, sortingColumnContainer;
        if (this.triptype == "Round-Trip") {
            name = ['numberOfStopsFromSourceFromTrip0', 'numberOfStopsFromSourceFromTrip1',
                'departureFromSourceAsPerTimeFromTrip0', 'departureFromSourceAsPerTimeFromTrip1',
                'arrivalAtDestinationAsPerTimeFromTrip0', 'arrivalAtDestinationAsPerTimeFromTrip1',
                'price'];
            parameters = ['Sort By: ', `Departure_Time_From_${this.source}`, `Arrival_Time_To_${this.destination}`,
                `Duration_From_${this.source}`, `Departure_Time_From_${this.destination}`, `Arrival_Time_To_${this.source}`,
                `Duration_From_${this.destination}`, 'Price'];

            sortingColumnContainer = document.createElement('div');
            sortingColumnContainer.setAttribute('class', 'sortingColumnContainer');

        } else {
            name = ['numberOfStopsFromSourceFromTrip0', 'departureFromSourceAsPerTimeFromTrip0',
                'arrivalAtDestinationAsPerTimeFromTrip0', 'price'];
            parameters = ['Sort By: ', 'Departure', 'Duration', 'Arrival', 'Price'];
        }


        var uparrow = document.createElement('i');
        uparrow.setAttribute('class', 'fa fa-arrow-up');
        var downarrow = document.createElement('i');
        downarrow.setAttribute('class', 'fa fa-arrow-down');


        for (let i = 0; i < parameters.length; i++) {
            let nameOfElement = parameters[i];
            const paramElement = document.createElement('div');
            paramElement.setAttribute('name', nameOfElement);
            paramElement.textContent = nameOfElement.replaceAll('_', ' ');



            if (parameters[i] !== "Sort By: ") {
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
                            if (this.triptype == "Round-Trip" && paramElement.classList.contains('roundWayIndividualSortELementAfterClicked')) {
                                paramElement.classList.add('roundWayIndividualSortELement');
                            } else if (this.triptype != "Round-Trip" && paramElement.classList.contains('individualSortELementAfterClicked')) {
                                paramElement.classList.add('individualSortELement');
                            }
                        }
                    });

                    if (!this.filterApplied.hasOwnProperty('sort')) {
                        this.filterApplied['sort'] = [];
                    }

                    if (arrowState == "up") {
                        if (this.filterApplied['sort'].length > 0 && this.filterApplied['sort'].indexOf(name[i]+1) > -1) {
                            this.filterApplied['sort'].splice(this.filterApplied['sort'].indexOf(name[i]+1), 1);
                        }
                        this.filterApplied['sort'].push(name[i]+0);//0 for descending
                        paramElement.appendChild(downarrow);
                    } else {
                        if (this.filterApplied['sort'].length > 0 && this.filterApplied['sort'].indexOf(name[i]+0) > -1) {
                            this.filterApplied['sort'].splice(this.filterApplied['sort'].indexOf(name[i]+0), 1);
                        }
                        this.filterApplied['sort'].push(name[i]+1);//1 for ascending
                        paramElement.appendChild(uparrow);
                    }


                    if (this.triptype == "Round-Trip" && paramElement.classList.contains('roundWayIndividualSortELement')) {
                        paramElement.classList.add('roundWayIndividualSortELementAfterClicked');
                    } else if (this.triptype != "Round-Trip" && paramElement.classList.contains('individualSortELement')) {
                        paramElement.classList.add('individualSortELementAfterClicked');
                    }

                    this.appliedFilterCommonData();
                });
            }


            if (this.triptype == "Round-Trip") {
                if (nameOfElement == "Price" || nameOfElement == "Sort By: ") {
                    paramElement.setAttribute('class', 'roundWayPrice');
                } else {
                    paramElement.setAttribute('class', 'roundWayIndividualSortELement');
                }

                if (nameOfElement == "Sort By: ") {
                    sortingHeaderContainer.appendChild(paramElement);
                } else if (nameOfElement == "Price") {
                    sortingHeaderContainer.appendChild(sortingColumnContainer);
                    sortingHeaderContainer.appendChild(paramElement);
                } else {
                    sortingColumnContainer.appendChild(paramElement);
                }
            } else {
                if (nameOfElement == "Sort By:") {
                    paramElement.setAttribute('class', 'sortBy');
                } else {
                    paramElement.setAttribute('class', 'individualSortELement');
                }
                sortingHeaderContainer.appendChild(paramElement);
            }
        }
        document.querySelector('[name=sortPanel]').appendChild(sortingHeaderContainer);

    }

    // sorting(originalData, sortBy, order, itinerariesValue) {
    //     if (sortBy == "Duration") {
    //         this.display(sortByDuration(originalData, order, itinerariesValue));
    //     } else if (sortBy == "Price") {
    //         this.display(sortByPrice(originalData, order, itinerariesValue));
    //     } else {
    //         this.display(sortByTime(originalData, sortBy, order, itinerariesValue));
    //     }
    // }


    display(data, numberOfLegs) {
        document.querySelector('[name=sortPanel]').innerHTML = "";
        this.createSortingElement(data);

        let resultPanel = document.createElement('div');
        resultPanel.setAttribute('name', 'resultPanel');
        resultPanel.setAttribute('class', 'resultPanel');
        document.querySelector('[name=sortPanel]').appendChild(resultPanel);


        for (let i = 0; i < Math.min(data.length, 50); i++) {
            const card = new FlightCard(numberOfLegs);
            card.setAttribute('name', "FlightCard" + i);
            card.shadowRoot.querySelector("[name=carrier-name]").textContent = data[i]['airline'];
            for (let j = 0; j < numberOfLegs; j++) {
                card.shadowRoot.querySelectorAll("[name=depart-time]")[j].textContent = data[i]['departureFromSourceAsPerTimeFromTrip' + j];
                card.shadowRoot.querySelectorAll('[name="depart-place"]')[j].textContent = data[i]['sourceFromTrip' + j];
                card.shadowRoot.querySelectorAll("[name=duration]")[j].textContent = data[i]['durationFromTrip' + j];
                card.shadowRoot.querySelectorAll("[name=stoppage]")[j].textContent = data[i]['numberOfStopsFromSourceFromTrip' + j];
                card.shadowRoot.querySelectorAll("[name=arrival-time]")[j].textContent = data[i]['arrivalAtDestinationAsPerTimeFromTrip' + j];
                card.shadowRoot.querySelectorAll("[name=arrival-place]")[j].textContent = data[i]['destinationFromTrip' + j];
            }
            card.shadowRoot.querySelector("[name=price]").textContent = data[i]['price'];

            document.querySelector(`[name=resultPanel]`).appendChild(card);
        }
    }

    main() {
        this.flightResultColumnCreation();
        this.filterViewCreation(this.source, this.destination, this.originalResult);
        if (this.triptype == "Round-Trip") {
            this.display(this.displayData, 2);
        } else {
            this.display(this.displayData, 1);
        }

    }
}