//import { sortByPrice, sortByTime, sortByDuration, appliedFilter } from '../../commonfunctions/sorting.js';
import { FilterCache } from '../../filterCache/filterCache.js';
export class OneWayAndRoundTripHandler {
    constructor(triptype, tripNumber, source, destination, result) {
        // console.log(triptype);
        this.source = source;
        this.destination = destination;
        this.flightData = result;
        this.flightDataToBeDisplayedToViewer = result.slice(0, 50);
        this.filter = new FilterCache(tripNumber, this.flightData);
        // this.appliedFilterResult = {};
        this.filterAndSortParametersSelectedByViewer = {};
        this.triptype = triptype;
        this.tripNumber = tripNumber;
        this.sortDirection = this.triptype == "Round-Trip" ? new Array(8).fill(-1) : new Array(5).fill(-1);
    }

    main() {
        this.createFlightDataContainerForViewer();
        this.createElementForFilterParameters(this.source, this.destination, this.flightData);
        if (this.triptype == "Round-Trip") {
            this.display(this.flightDataToBeDisplayedToViewer, 2);
        } else {
            this.display(this.flightDataToBeDisplayedToViewer, 1);
        }

    }

    createFlightDataContainerForViewer() {
        let resultViewContainer = document.createElement('div');
        resultViewContainer.setAttribute('name', 'trip');
        resultViewContainer.setAttribute('class', 'resultViewContainer');
        document.body.appendChild(resultViewContainer);
        document.querySelector("[name=trip]").innerHTML = "";
        this.filterPanelCreation();
        this.sortPanelCreation();
    }

    filterPanelCreation() {
        let filterPanel = document.createElement('div');
        filterPanel.setAttribute('name', 'filterPanel');
        filterPanel.setAttribute('class', 'filterPanel');
        document.querySelector('[name=trip]').appendChild(filterPanel);
    }

    sortPanelCreation() {
        let sortPanel = document.createElement('div');
        sortPanel.setAttribute('name', 'sortPanel');
        sortPanel.setAttribute('class', 'sortPanel');
        document.querySelector('[name=trip]').appendChild(sortPanel);
    }

    async createElementForFilterParameters(source, destination) {
        await this.initializingFilterCache();
        var filterResult;
        var titleTextContent;
        var name;
        if (this.triptype == "Round-Trip") {
            filterResult = await this.getKeyStatisticsOfEachFilter(2);
            name = ['numberOfStopsFromSourceFromTrip0', 'numberOfStopsFromSourceFromTrip1',
                'departureFromSourceAsPerTimeFromTrip0', 'departureFromSourceAsPerTimeFromTrip1',
                'arrivalAtDestinationAsPerTimeFromTrip0', 'arrivalAtDestinationAsPerTimeFromTrip1',
                'airline'];
            titleTextContent = [`Stops From ${source}`, `Stops From ${destination}`,
            `Departure From ${source}`, `Departure From ${destination}`,
            `Arrival To ${destination}`, `Arrival To ${source}`,
                'Airlines'];
        } else {
            filterResult = await this.getKeyStatisticsOfEachFilter(1);
            name = ['numberOfStopsFromSourceFromTrip0', 'departureFromSourceAsPerTimeFromTrip0',
                'arrivalAtDestinationAsPerTimeFromTrip0', 'airline'];
            titleTextContent = [`Stops From ${source}`, `Departure From ${source}`,
            `Arrival To ${destination}`, 'Airlines'];
        }

        for (let i = 0; i < name.length; i++) {
            if (Object.keys(filterResult[name[i]]).length > 0) {
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
                        case name[0]: this.filterByNumberOfStops(elementContainer, name[0], filterResult[name[0]]); break;
                        case name[1]: this.filterByNumberOfStops(elementContainer, name[1], filterResult[name[1]]); break;
                        case name[2]: this.filterByArrivalAndDepartureTimeInterval(elementContainer, 'departure', 0, name[2], filterResult[name[2]]); break;
                        case name[3]: this.filterByArrivalAndDepartureTimeInterval(elementContainer, 'departure', 1, name[3], filterResult[name[3]]); break;
                        case name[4]: this.filterByArrivalAndDepartureTimeInterval(elementContainer, 'arrival', 0, name[4], filterResult[name[4]]); break;
                        case name[5]: this.filterByArrivalAndDepartureTimeInterval(elementContainer, 'arrival', 1, name[5], filterResult[name[5]]); break;
                        case name[6]: this.filterByAirline(elementContainer, filterResult[name[6]]); break;
                    }
                } else {
                    switch (name[i]) {
                        case name[0]: this.filterByNumberOfStops(elementContainer, name[0], filterResult[name[0]]); break;
                        case name[1]: this.filterByArrivalAndDepartureTimeInterval(elementContainer, 'departure', 0, name[1], filterResult[name[1]]); break;
                        case name[2]: this.filterByArrivalAndDepartureTimeInterval(elementContainer, 'arrival', 0, name[2], filterResult[name[2]]); break;
                        case name[3]: this.filterByAirline(elementContainer, filterResult[name[3]]); break;
                    }
                }

                document.querySelector('[name=filterPanel]').appendChild(elementContainer);

            }
        }
    }


    async initializingFilterCache(){
        await this.filter.init(this.tripNumber, this.flightData);
    }


    async getKeyStatisticsOfEachFilter(tripCount) {
        let filterResult = {};
        for (let tripNumber = 0; tripNumber < tripCount; tripNumber++) {
            filterResult['numberOfStopsFromSourceFromTrip' + tripNumber] = await this.filter.getFlightCountAndMinimumPriceByStoppages(tripNumber);
            filterResult['arrivalAtDestinationAsPerTimeFromTrip' + tripNumber] = {};
            filterResult['departureFromSourceAsPerTimeFromTrip' + tripNumber] = {};
            var time = [0, 21600, 43200, 64800, 86400];
            for (let i = 0; i < time.length - 1; i++) {
                filterResult['departureFromSourceAsPerTimeFromTrip' + tripNumber][time[i] + "_" + time[i + 1]] = await this.filter.getMinimumPriceOfFlightAsPerTime(tripNumber, "departure", time[i], time[i + 1]);
                filterResult['arrivalAtDestinationAsPerTimeFromTrip' + tripNumber][time[i] + "_" + time[i + 1]] = await this.filter.getMinimumPriceOfFlightAsPerTime(tripNumber, "arrival", time[i], time[i + 1]);
            }
        }


        filterResult['airline'] = await this.filter.getFlightStatisticsByAirlines();
        // console.log(filterResult);
        return filterResult;
    }


    filterByNumberOfStops(parentElement, filterName, filterResult) {
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
                labelForStop.textContent = "Non-Stop (" + filterResult[stopNumber]['numberOfFlights'] + ")";
            } else {
                labelForStop.textContent = stopNumber + ' Stop ' + "(" + filterResult[stopNumber]['numberOfFlights'] + ")";
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
                stopNumber = Number(stopNumber);
                if (!this.filterAndSortParametersSelectedByViewer.hasOwnProperty(filterName)) {
                    this.filterAndSortParametersSelectedByViewer[filterName] = [];
                }

                if (checkBoxForStop.checked) {
                    this.filterAndSortParametersSelectedByViewer[filterName].push(stopNumber);
                } else {
                    if (this.filterAndSortParametersSelectedByViewer[filterName].length > 0 && this.filterAndSortParametersSelectedByViewer[filterName].indexOf(stopNumber) > -1) {
                        this.filterAndSortParametersSelectedByViewer[filterName].splice(this.filterAndSortParametersSelectedByViewer[filterName].indexOf(stopNumber), 1)
                    }
                }
                this.displayFilteredFlightData();
            });


            parentElement.appendChild(individualStopContainer);
        });
    }


    filterByArrivalAndDepartureTimeInterval(parentElement, departureOrArrival, tripNumber, filterName, resultAsPerTimeRange) {
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
                //if stats are available for particular time interval we creating element called button for each time interval 
                let timeIntervalButton = document.createElement('div');
                timeIntervalButton.setAttribute('class', 'timeIntervalButtonBeforeClicked');


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

                //addition or removal of time Interval from filterAndSortParametersSelectedByViewer
                timeIntervalButton.addEventListener('click', () => {
                    if (!this.filterAndSortParametersSelectedByViewer.hasOwnProperty(departureOrArrival + tripNumber)) {
                        this.filterAndSortParametersSelectedByViewer[departureOrArrival + tripNumber] = [];
                    }

                    if (timeIntervalButton.classList.contains('timeIntervalButtonBeforeClicked')) {
                        timeIntervalButton.classList.remove('timeIntervalButtonBeforeClicked');
                        timeIntervalButton.classList.add('timeIntervalButtonAfterClicked');
                        this.filterAndSortParametersSelectedByViewer[departureOrArrival + tripNumber].push([time[i], time[i + 1]]);
                        console.log(this.filterAndSortParametersSelectedByViewer);
                    } else if (timeIntervalButton.classList.contains('timeIntervalButtonAfterClicked')) {
                        timeIntervalButton.classList.remove('timeIntervalButtonAfterClicked');
                        timeIntervalButton.classList.add('timeIntervalButtonBeforeClicked');
                        if (this.filterAndSortParametersSelectedByViewer[departureOrArrival + tripNumber].length > 0) {
                            // function getIndexFromNestedArray(arr, value) {
                            //     for (let i = 0; i < arr.length; i++) {
                            //         if (arr[i][0] == value[0] && arr[i][1] == value[1]) {
                            //             return i;
                            //         }
                            //     }
                            //     return -1;
                            // }
                            function getIndexFromNestedArray(arr, value) {
                                // return arr.reduce((index)=>{
                                //     return arr[index][0]==value[0] && arr[index][1]==value[1] ?index:-1;
                                // })
                                return (arr.map((item) => {
                                    return item[0] == value[0] && item[1] == value[1];
                                })).indexOf(true);
                            }
                            let index = getIndexFromNestedArray(this.filterAndSortParametersSelectedByViewer[departureOrArrival + tripNumber], [time[i], time[i + 1]]);
                            if (index > -1) {
                                this.filterAndSortParametersSelectedByViewer[departureOrArrival + tripNumber].splice(index, 1);
                            }

                            console.log(this.filterAndSortParametersSelectedByViewer);
                        }
                    }
                    this.displayFilteredFlightData();
                });


                parentElement.appendChild(timeIntervalButton);

            }
        }
    }


    filterByAirline(parentELement, filterResult) {
        Object.keys(filterResult).forEach(airlineCode => {
            //creating element for each airline
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
            labelForAirline.textContent = airlineCode + "(" + filterResult[airlineCode]['numberOfFlights'] + ")";


            let airlineMinimumPrice = document.createElement('p');
            airlineMinimumPrice.setAttribute('class', 'airlineMinimumPrice');
            airlineMinimumPrice.setAttribute('class', 'price');
            airlineMinimumPrice.textContent = filterResult[airlineCode]['minimumPrice'];

            checkBoxAndLabelCombinedContainer.appendChild(checkboxForAirline);
            checkBoxAndLabelCombinedContainer.appendChild(labelForAirline);


            individualAirlineContainer.appendChild(checkBoxAndLabelCombinedContainer);
            individualAirlineContainer.appendChild(airlineMinimumPrice);

            //addition or removal of airline from filterAndSortParametersSelectedByViewer
            individualAirlineContainer.addEventListener('click', () => {
                if (!this.filterAndSortParametersSelectedByViewer.hasOwnProperty('airline')) {
                    this.filterAndSortParametersSelectedByViewer['airline'] = [];
                }

                if (checkboxForAirline.checked) {
                    this.filterAndSortParametersSelectedByViewer['airline'].push(airlineCode);
                } else {
                    if (this.filterAndSortParametersSelectedByViewer['airline'].length > 0 && this.filterAndSortParametersSelectedByViewer['airline'].indexOf(airlineCode) > -1) {
                        this.filterAndSortParametersSelectedByViewer['airline'].splice(this.filterAndSortParametersSelectedByViewer['airline'].indexOf(airlineCode), 1)
                    }
                }
                this.displayFilteredFlightData();
            });


            parentELement.appendChild(individualAirlineContainer);
        });

    }

    async responseOfFilterAndSortParametersSelectedByViewer(){
        const response = await this.filter.filtering(this.filterAndSortParametersSelectedByViewer);
        return response;
    }

    async displayFilteredFlightData() {
        let result = this.responseOfFilterAndSortParametersSelectedByViewer();
        // console.log(result);
        if (this.triptype == "Round-Trip") {
            this.display(result, 2);
        } else {
            this.display(result, 1);
        }
    }



    createElementForSortParameters() {
        let sortingHeaderContainer = document.createElement('div');
        sortingHeaderContainer.setAttribute('name', 'sorting');
        sortingHeaderContainer.setAttribute('class', 'sortHeaders');


        var name, parameters, sortingColumnContainer;
        if (this.triptype == "Round-Trip") {
            name = ['Sort By: ', 'departureFromSourceAsPerTimeFromTrip0', 'departureFromSourceAsPerTimeFromTrip1',
                'durationFromTrip0', 'durationFromTrip1',
                'arrivalAtDestinationAsPerTimeFromTrip0', 'arrivalAtDestinationAsPerTimeFromTrip1',
                'price'];
            parameters = ['Sort By: ', `Departure_Time_From_${this.source}`, `Arrival_Time_To_${this.destination}`,
                `Duration_From_${this.source}`, `Departure_Time_From_${this.destination}`, `Arrival_Time_To_${this.source}`,
                `Duration_From_${this.destination}`, 'Price'];

            sortingColumnContainer = document.createElement('div');
            sortingColumnContainer.setAttribute('class', 'sortingColumnContainer');

        } else {
            name = ['Sort By: ', 'departureFromSourceAsPerTimeFromTrip0', 'durationFromTrip0',
                'arrivalAtDestinationAsPerTimeFromTrip0', 'price'];
            parameters = ['Sort By: ', 'Departure', 'Duration', 'Arrival', 'Price'];
        }



        for (let i = 0; i < parameters.length; i++) {
            let nameOfElement = parameters[i];
            const paramElement = document.createElement('div');
            paramElement.setAttribute('name', nameOfElement);
            paramElement.textContent = nameOfElement.replaceAll('_', ' ');
            if (this.sortDirection[i] == 1) {
                paramElement.textContent = paramElement.textContent + "↑";
            } else if (this.sortDirection[i] == 0) {
                paramElement.textContent = paramElement.textContent + "↓";
            }


            if (parameters[i] !== "Sort By: ") {
                paramElement.addEventListener('click', () => {
                    let direction = this.sortDirection[i];

                    parameters.forEach((elementName, index) => {
                        if (elementName != "Sort By: ") {
                            let element = document.querySelector(`[name=${elementName}]`);
                            if (element.textContent.includes("↑") || element.textContent.includes("↓")) {
                                element.textContent = element.textContent.slice(0, element.length - 1);
                            }
                            if (this.triptype == "Round-Trip" && element.classList.contains('roundWayIndividualSortELementAfterClicked')) {
                                element.classList.add('roundWayIndividualSortELement');
                            } else if (this.triptype != "Round-Trip" && element.classList.contains('individualSortELementAfterClicked')) {
                                element.classList.add('individualSortELement');
                            }
                            this.sortDirection[index] = -1;
                        }
                    });

                    if (!this.filterAndSortParametersSelectedByViewer.hasOwnProperty('sort')) {
                        this.filterAndSortParametersSelectedByViewer['sort'] = [];
                    }

                    if (direction == 1) {
                        //1 for ascending
                        this.filterAndSortParametersSelectedByViewer['sort'] = [];
                        this.sortDirection[i] = 0;
                        this.filterAndSortParametersSelectedByViewer['sort'].push(name[i] + 0);//0 for descending
                    } else {
                        this.filterAndSortParametersSelectedByViewer['sort'] = [];
                        this.sortDirection[i] = 1;
                        this.filterAndSortParametersSelectedByViewer['sort'].push(name[i] + 1);//1 for ascending

                    }


                    if (this.triptype == "Round-Trip" && paramElement.classList.contains('roundWayIndividualSortELement')) {
                        paramElement.classList.add('roundWayIndividualSortELementAfterClicked');
                    } else if (this.triptype != "Round-Trip" && paramElement.classList.contains('individualSortELement')) {
                        paramElement.classList.add('individualSortELementAfterClicked');
                    }

                    console.log(this.filterAndSortParametersSelectedByViewer);

                    this.displayFilteredFlightData();
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


    display(data, numberOfLegs) {
        document.querySelector('[name=sortPanel]').innerHTML = "";
        this.createElementForSortParameters();

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
}