import { OneWayResult } from './OneWayResult/OneWayResult.js';
import { appliedFilter } from '../commonfunctions/sorting.js';

export class RoundWayResult extends OneWayResult {
    constructor(result, source, destination,tripNumber) {
        super(result,source,destination,tripNumber);
    }

    filterViewCreation(source, destination, result) {
        console.log(source+" "+destination);
        let appliedFilterResult = appliedFilter(result);
        console.log(appliedFilterResult);


        var titleTextContent=[`Stops From ${source}`,`Stops From ${destination}`, `Departure From ${source}`,`Departure From ${destination}`,`Arrival To ${destination}`,`Arrival To ${source}`, 'Airlines'];
        var name=[`numberOfStopsFrom${source}`,`numberOfStopsFrom${destination}`,`DepartureFrom${source}AsPerTime`,`DepartureFrom${destination}AsPerTime`,`ArrivalAt${destination}AsPerTime`,`ArrivalAt${source}AsPerTime`,'Airline'];
        var  name2=['numberOfStopsFromSource','numberOfStopsFromSource','DepartureFromSourceAsPerTime','DepartureFromSourceAsPerTime','ArrivalAtDestinationAsPerTime','ArrivalAtDestinationAsPerTime','Airline']

        for(let i=0;i<name.length;i++){
            if (Object.keys(appliedFilterResult[name2[i]]).length > 0) {
                let elementContainer = document.createElement('div');
                elementContainer.setAttribute('class', 'container');
                elementContainer.setAttribute('name', name[i]);
    
    
                let title = document.createElement('p');
                title.setAttribute('class', 'title');
                title.setAttribute('name',  name[i]+'Title');
                title.textContent = titleTextContent[i];
    
    
                elementContainer.appendChild(title);
                switch(name[i]){
                    case name[0]: this.numberOfStopsFilter(elementContainer,appliedFilterResult['numberOfStopsFromSource'][0]);break;
                    case name[1]: this.numberOfStopsFilter(elementContainer,appliedFilterResult['numberOfStopsFromSource'][1]);break;
                    case name[2]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer,appliedFilterResult['DepartureFromSourceAsPerTime'][0], 'departure');break;                    
                    case name[3]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer,appliedFilterResult['DepartureFromSourceAsPerTime'][1], 'departure');break;
                    case name[4]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer, appliedFilterResult['ArrivalAtDestinationAsPerTime'][0], 'arrival');break;
                    case name[5]: this.creatingButtonsAsPerTimeRangeFilter(elementContainer, appliedFilterResult['ArrivalAtDestinationAsPerTime'][1], 'arrival');break;
                    case name[6]: this.airlineFilter(elementContainer,appliedFilterResult['Airline']);break;
                }
               
                document.querySelector('[name=filterPanel]').appendChild(elementContainer);
    
            }
        }
    }




    createSortingElement() {
        let sortingHeaderContainer = document.createElement('div');
        sortingHeaderContainer.setAttribute('name', 'sorting');
        sortingHeaderContainer.setAttribute('class','sortHeaders');


        var sortingColumnContainer = document.createElement('div');
        sortingColumnContainer.style.cssText = "display:flex;flex-wrap:wrap;flex-grow:2;align-items:center;justify-content:space-between;align-items:center";

        var parameters = ['Sort By: ', `Departure_Time_From_${this.source}`, `Arrival_Time_To_${this.destination}`, `Duration_From_${this.source}`, `Departure_Time_From_${this.destination}`, `Arrival_Time_To_${this.source}`,
            `Duration_From_${this.destination}`, 'Price']
        
        


        var uparrow = document.createElement('i');
        uparrow.setAttribute('class', 'fa fa-arrow-up');
        var downarrow = document.createElement('i');
        downarrow.setAttribute('class', 'fa fa-arrow-down');


        for (let i=0;i<parameters.length;i++) {
            const paramElement = document.createElement('div');
            paramElement.setAttribute('name', parameters[i]);
            paramElement.textContent = parameters[i].replaceAll('_', ' ');
            if (parameters[i] == "Price" || parameters[i] == "Sort By: ") {
                paramElement.style.cssText = "flex-grow:1;align-self:center;color:black;font-size:20px;";
            } else {
                paramElement.style.cssText = "flex: 1 1 30%;color:black;font-size:20px;text-align: center;";
            }


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
                            element.style.color = "black";
                            element.style.fontSize = "20px";
                            element.style.fontWeight = "normal";
                        }
                    });


                    if (arrowState == "up") {
                        switch (parameters[i]) {
                            case parameters[1]:
                                this.sorting(this.originalResult, 'Departure', "descending", 0); break;
                            case parameters[2]: this.sorting(this.originalResult, 'Arrival', "descending", 0); break;
                            case parameters[3]: this.sorting(this.originalResult, 'Departure', "descending", 1); break;
                            case parameters[4]: this.sorting(this.originalResult, 'Arrival', "descending", 1); break;
                            case parameters[5]: this.sorting(this.originalResult, 'Duration', "descending", 0); break;
                            case parameters[6]: this.sorting(this.originalResult, 'Duration', "descending", 1); break;
                            case parameters[7]: this.sorting(this.originalResult, 'Price', "descending", 0); break;
                        }
                        paramElement.appendChild(downarrow);
                    } else {
                        switch (parameters[i]) {
                            case parameters[1]:
                                this.sorting(this.originalResult, 'Departure', "ascending", 0); break;
                            case parameters[2]: this.sorting(this.originalResult, 'Arrival', "ascending", 0); break;
                            case parameters[3]: this.sorting(this.originalResult, 'Departure', "ascending", 1); break;
                            case parameters[4]: this.sorting(this.originalResult, 'Arrival', "ascending", 1); break;
                            case parameters[5]: this.sorting(this.originalResult, 'Duration', "ascending", 0); break;
                            case parameters[6]: this.sorting(this.originalResult, 'Duration', "ascending", 1); break;
                            case parameters[7]: this.sorting(this.originalResult, 'Price', "ascending", 0); break;
                        }
                        paramElement.appendChild(uparrow);
                    }

                    paramElement.style.fontWeight = "bold";
                    paramElement.style.color = "#023047";
                    paramElement.style.fontSize = "25px";
                });
            }

            if (parameters[i] == "Sort By: ") {
                sortingHeaderContainer.appendChild(paramElement);
            } else if (parameters[i] == "Price") {
                sortingHeaderContainer.appendChild(sortingColumnContainer);
                sortingHeaderContainer.appendChild(paramElement);
            } else {
                sortingColumnContainer.appendChild(paramElement);
            }

        }
        document.querySelector('[name=sortPanel]').appendChild(sortingHeaderContainer);
    }

    main() {
        this.flightResultColumnCreation();
        this.filterViewCreation(this.source,this.destination,this.originalResult);
        this.display(this.displayData);
    }
}