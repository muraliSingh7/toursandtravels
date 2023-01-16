import { sortByPrice, sortByTime, sortByDuration, appliedFilter } from '../../commonfunctions/sorting.js';
import { getTripType } from '../../commonfunctions/triptype.js';
import { FilterCache } from '../../filterCache/filterCache.js';
export class OneWayResult {
    constructor(tripNumber, source, destination, result) {
        this.source = source;
        this.destination = destination;
        this.originalResult = result['response' + tripNumber].data;
        this.displayData = result['response' + tripNumber].data.slice(0, 50);
        this.filter = new FilterCache(tripNumber, result);
        this.appliedFilterResult = {};
        this.filterApplied = {};
        this.tripNumber=tripNumber;
    }

    async appliedFilter(tripNumber){
        let FilterElementsCreationResult={};
        FilterElementsCreationResult['numberOfStopsFromSourceFromTrip'+tripNumber]=await this.filter.countofNumberofStops(0,0);

        var time=[0,21600,43200,64800,86400];
        for(let i=0;i<time.length-1;i++){
            FilterElementsCreationResult['departureFromSourceAsPerTimeFromTrip'+tripNumber][time[i]+"-"+time[i+1]]=await this.filter.getPriceAsPerTime(0,0,"departure",time[i],time[i+1]);
            FilterElementsCreationResult['arrivalAtDestinationAsPerTimeFromTrip'+tripNumber][time[i]+"-"+time[i+1]]=await this.filter.getPriceAsPerTime(0,0,"arrival",time[i],time[i+1]);
        }
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

    filterViewCreation(source, destination) {
        var FilterElementsCreationResult=appliedFilter(this.tripNumber);
        var titleTextContent = [`Stops From ${source}`, `Departure From ${source}`,
        `Arrival To ${destination}`, 'Airlines'];
        var name = ['numberOfStopsFromSourceFromTrip'+this.tripNumber, 'departureFromSourceAsPerTimeFromTrip'+this.tripNumber,
            'arrivalAtDestinationAsPerTimeFromTrip'+this.tripNumber, 'airline'];
  
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
                switch (name[i]) {
                    case name[0]: this.numberOfStopsFilter(elementContainer, FilterElementsCreationResult[name[0]]); break;
                    case name[1]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer, FilterElementsCreationResult[name[1]], 'departure'); break;
                    case name[2]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer, FilterElementsCreationResult[name[2]], 'arrival'); break;
                    case name[3]: this.airlineFilter(elementContainer, FilterElementsCreationResult[name[3]]); break;
                }

                document.querySelector('[name=filterPanel]').appendChild(elementContainer);

            }
        }
    }


    numberOfStopsFilter(parentElement,filterResult) {
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
            labelForStop.textContent = stopNumber + ' Stop ' + "(" + filterResult[stopNumber]['count'] + ")";


            let minimumPriceForStop = document.createElement('p');
            minimumPriceForStop.setAttribute('name', 'minimumPriceForStop');
            minimumPriceForStop.setAttribute('class', 'price');
            minimumPriceForStop.textContent = filterResult[stopNumber]['minimumPrice'];


            checkBoxAndLabelCombinedContainer.appendChild(checkBoxForStop);
            checkBoxAndLabelCombinedContainer.appendChild(labelForStop);


            individualStopContainer.appendChild(checkBoxAndLabelCombinedContainer);
            individualStopContainer.appendChild(minimumPriceForStop);



            individualStopContainer.addEventListener('click', () => {
                let filterFromNumberOfStopsFromSource={};
                filterFromNumberOfStopsFromSource['numberOfStopsFromSourceFromTrip'+this.tripNumber]=stopNumber;
                if (checkBoxForStop.checked) {
                    this.appliedFilterCommonData(filterFromNumberOfStopsFromSource,true);
                } else {
                    this.appliedFilterCommonData(filterFromNumberOfStopsFromSource,false);
                }
            });


            parentElement.appendChild(individualStopContainer);
        });
    }


    creatingButtonsAsPerTimeRangeFilter(parentElement, departureOrArrival,resultAsPerTimeRange) {
        var timing = ['0AM-6AM', '6AM-12PM', '12PM-6PM', '6PM-12AM'];
        var timeHeader = ['Before 6AM', '6AM-12PM', '12PM-6PM', 'After 6PM']
        var time=[0,21600,43200,64800,86400];
        var imgSource = ["https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_active.png?v=1",
            "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png?v=1",
            "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png?v=1",
            "https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png?v=1"
        ];


        for (let i = 0; i < timing.length; i++) {
            if (resultAsPerTimeRange[time[i]+"-"+time[i+1]]) {
                let timeIntervalButton = document.createElement('div');
                filterByTime={};
                timeIntervalButton.setAttribute('class', 'timeIntervalButton');


                if (departureOrArrival == 'departure') {
                    timeIntervalButton.setAttribute('departure-time', timing[i]);
                    filterByTime['departureFromSourceAsPerTimeFromTrip'+this.tripNumber]=[time[i],time[i+1]];
                } else {
                    timeIntervalButton.setAttribute('arrival-time', timing[i]);
                    filterByTime['arrivalAtDestinationAsPerTimeFromTrip'+this.tripNumber]=[time[i],time[i+1]];
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
                timeIntervalMinimumPrice.textContent = resultAsPerTimeRange[timing[i]];
                timeIntervalButton.appendChild(timeIntervalMinimumPrice);


                timeIntervalButton.addEventListener('click', () => {
                    if (timeIntervalButton.style.backgroundColor == "transparent") {
                        timeIntervalButton.style.backgroundColor = "green";
                        this.appliedFilterCommonData(filterByTime, true);
                    }

                    if (timeIntervalButton.style.backgroundColor == "green") {
                        timeIntervalButton.style.backgroundColor = "transparent";
                        this.appliedFilterCommonData(filterByTime, false);
                    }
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
            individualAirlineContainer.appendChild(airlineMinimumPthis.filterToBeAppliedrice);


            individualAirlineContainer.addEventListener('click', () => {
                if (checkboxForAirline.checked) {
                    this.appliedFilterCommonData(airlineCode, filterResult[airlineCode]['result'], true);
                } else {
                    this.appliedFilterCommonData(airlineCode, filterResult[airlineCode]['result'], false);
                }
            });


            parentELement.appendChild(individualAirlineContainer);
        });

    }

    async appliedFilterCommonData(filterBy,addOrRemove,sortBy){
        if(addOrRemove){
            let keysOfFilterApplied=Objject.keys(this.filterApplied);
            Object.keys(filterBy).forEach(filter=>{
                if(!keysOfFilterApplied.includes(filter)){
                    this.filterApplied[filter]=[];
                }
                this.filterApplied[filter].push(filterBy[filter]);
            });
        }else{
            Object.keys(filterBy).forEach(filter=>{//accessing keys of given filter which is to be removed
                if(keysOfFilterApplied.includes(filter)){//checking that key inside originalfilter which is passed to database for filtering
                    for(let currentIndex=0;currentIndex<this.filterApplied[filter].length;i++)
                    {//if that key is found we access each value of that particular key from original filter
                        let value=this.filterApplied[filter][currentIndex];
                        if(value.length==filterBy[filter].length){
                            //if value of originalfilter key length equals to the value of filter key 
                            //which we want to delete we check that value length 
                            let flagForDeleting=true;
                            for(let i=0;i<value.length;i++){
                                if(value[i]!=filterBy[filter][i]){
                                    flagForDeleting=false;
                                    break;
                                }
                            }
                            if(flagForDeleting==true){
                                delete this.filterApplied[filter][currentIndex];
                                break;
                            }
                        }
                    }
                }
            });
        }
        let result=this.filter.filtering(this.filterApplied);
        this.display(result);
    }

    async sorting(sortBy,direction){
        if(direction=="ascending"){
            this.filter.filtering(this.filterApplied,);
        }else{
            this.filter.filtering(this.filterApplied,);
        }
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

    



    createSortingElement(result) {
        let sortingHeaderContainer = document.createElement('div');
        sortingHeaderContainer.setAttribute('name', 'sorting');
        sortingHeaderContainer.setAttribute('class', 'sortHeaders');


        var sortBy = document.createElement('div');
        sortBy.textContent = "Sort By: ";
        sortBy.setAttribute('class', 'sortBy');
        sortingHeaderContainer.appendChild(sortBy);



        var parameters = ['Departure', 'Duration', 'Arrival', 'Price'];
        var uparrow = document.createElement('i');
        uparrow.setAttribute('class', 'fa fa-arrow-up');
        var downarrow = document.createElement('i');
        downarrow.setAttribute('class', 'fa fa-arrow-down');


        for (let nameOfElement of parameters) {
            const paramElement = document.createElement('div');
            paramElement.setAttribute('name', nameOfElement);
            paramElement.textContent = nameOfElement.replaceAll('_', ' ');
            paramElement.setAttribute('class', 'individualSortELement');
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
                    this.appliedFilterCommonData();
                    paramElement.appendChild(downarrow);
                } else {
                    this.appliedFilterCommonData();
                    paramElement.appendChild(uparrow);
                }

                paramElement.style.fontWeight = "bold";
                paramElement.style.color = "#023047";
                paramElement.style.fontSize = "25px";
            });
            sortingHeaderContainer.appendChild(paramElement);
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


    display(data) {
        document.querySelector('[name=sortPanel]').innerHTML = "";
        this.createSortingElement(data);

        let resultPanel = document.createElement('div');
        resultPanel.setAttribute('name', 'resultPanel');
        resultPanel.setAttribute('class', 'resultPanel');
        document.querySelector('[name=sortPanel]').appendChild(resultPanel);


        for (let i = 0; i < Math.min(data.length, 50); i++) {
            const card = getTripType() == "One-Way" || getTripType() == "Multi-City" ? new FlightCard(1) : new FlightCard(2);
            card.setAttribute('name', "FlightCard" + i);
            card.shadowRoot.querySelector("[name=carrier-name]").textContent = data[i]['airline'];
            for (let j = 0; j < tripNumber; j++) {
                card.shadowRoot.querySelectorAll("[name=depart-time]")[j].textContent = data[i]['departureFromSourceAsPerTime'][j];
                card.shadowRoot.querySelectorAll('[name="depart-place"]')[j].textContent = data[i]['source'][j];
                card.shadowRoot.querySelectorAll("[name=duration]")[j].textContent = data[i]['duration'][j];
                card.shadowRoot.querySelectorAll("[name=stoppage]")[j].textContent = data[i]['numberOfStopsFromSource'][j];
                card.shadowRoot.querySelectorAll("[name=arrival-time]")[j].textContent = data[i]['arrivalAtDestiationAsPerTime'];
                card.shadowRoot.querySelectorAll("[name=arrival-place]")[j].textContent = data[i]['destination'][j];
            }
            card.shadowRoot.querySelector("[name=price]").textContent = data[i]['price'];

            document.querySelector(`[name=resultPanel]`).appendChild(card);
        }
    }

    main() {
        this.flightResultColumnCreation();
        this.filterViewCreation(this.source, this.destination, this.originalResult);
        this.display(this.displayData);
    }
}