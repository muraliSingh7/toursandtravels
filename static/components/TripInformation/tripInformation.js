const template = document.createElement("template");
template.innerHTML = `
                    <link rel="stylesheet" href="static/components/TripInformation/style.css">
                    <div class="fromToDepartContainer">
                        <div name="from">
                            <label for="from" id="from" class="fromtodepartlabel">From : </label>
                            <input type="text" class="from" name="From" required>
                            <div class="autoCompleteContainer"></div>
                        </div>
                        <div name="to">
                            <label for="to" id="to" class="fromtodepartlabel">To : </label>
                            <input type="text" class="to" name="To" required>
                            <div class="autoCompleteContainer"></div>
                        </div>
                        <div name="departDateContainer">
                            <label for="depart" id="depart" class="fromtodepartlabel">Depart : </label>
                            <input type="date" class="depart" name="DepartDate" required>
                        </div>
                        <div name="addDeleteButton">
                            <button id="add" class="add" >+</button>
                            <button id="delete" class="delete" >-</button>
                        </div>
                        <div name="returnDateContainer">
                            <label for="ReturnDate" id="ReturnDate" class="returndate" >Return : </label>
                            <input class="returninput" type="date" name="ReturnDate" required>
                        </div>
                        <div name="adult">
                            <label for="Adult" id="Adult" class="adultAndChildLabel" >Adult : </label>
                            <input type="number" id="Adult" name="Adult" min="1" max="5" class="adultinput" required>
                        </div>
                        <div name="child">
                            <label for="Children" id="Children" class="adultAndChildLabel" >Children : </label>
                            <input type="number" id="Children" name="Children" min="0" max="5" class="childinput" required>
                        </div>
                    </div>`;
class TripInformation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.addButtonEventHandler();
        this.deleteButtonEventHandler();
        this.autocompleteInputSearchBox();

    }



    deleteButtonEventHandler() {
        this.shadowRoot.querySelector('.delete').addEventListener('click', () => {
            if (this.hasAttribute("value")) {
                document.body.querySelector(`[from-to-depart=from-to-depart_${this.getAttribute("value")}]`).style.display = "none";
                for (let start = Number(this.getAttribute("value")) + 1; start <= multiTripCount; start++) {
                    document.body.querySelector(`[from-to-depart=from-to-depart_${start}]`).setAttribute("value", start - 1);
                    document.body.querySelector(`[from-to-depart=from-to-depart_${start}]`).setAttribute("from-to-depart", `from-to-depart_${start - 1}`);
                }

                multiTripCount--;
                this.adultAndChildShowAndHideMultiCityTrip();
                document.body.querySelectorAll(`[from-to-depart=from-to-depart_${this.getAttribute("value")}]`)[0].remove();

            }
        });
    }



    addButtonEventHandler() {
        this.shadowRoot.querySelector('.add').addEventListener('click', () => {
            if (this.hasAttribute("value") && multiTripCount < 5) {
                var newElement = document.createElement("from-to-depart");
                newElement.setAttribute("value", ++multiTripCount);
                newElement.setAttribute("from-to-depart", `from-to-depart_${multiTripCount}`);
                newElement.setAttribute("triptype", "Multi-City");
                // console.log(newElement);
                document.querySelector(`[from-to-depart=from-to-depart_${multiTripCount - 1}]`).insertAdjacentElement("afterend", newElement);
                // this.adultAndChildShowAndHideMultiCityTrip();
            }

            if (multiTripCount > 1) {
                this.adultAndChildShowAndHideMultiCityTrip();
            }
        });
    }



    static get observedAttributes() { return ['triptype', 'value']; }



    attributeChangedCallback() {

        if (this.hasAttribute("triptype") && this.hasAttribute("value")) {
            let value = this.getAttribute("value");
            let triptype = this.getAttribute("triptype");


            if (triptype === "One-Way" && value === "1") {
                this.setOneWayTripClasses();
                this.addButtonDisable();
                this.deleteButtonDisable();
            }


            if (triptype === "Round-Trip" && value === "1") {
                this.setRoundTripClasses();
                this.addButtonDisable();
                this.deleteButtonDisable();
            }


            if (triptype === "Multi-City" && value === "1") {
                this.setMultiCityTripClasses();
                this.addButtonDisable();
                this.deleteButtonDisable();
            }


            if (triptype === "Multi-City" && value === "2") {
                this.setMultiCityTripClasses();
                this.addButtonEnable();
                this.deleteButtonDisable();
            }


            if (triptype === "Multi-City" && value === "3" || value === "4") {
                this.setMultiCityTripClasses();
                this.addButtonEnable();
                this.deleteButtonEnable();
            }


            if (triptype === "Multi-City" && value === "5") {
                this.setMultiCityTripClasses();
                this.addButtonDisable();
                this.deleteButtonEnable();
            }

        }
    }



    adultAndChildShowAndHideMultiCityTrip() {

        let childValue, adultValue, adultElement, childElement;


        for (let i = 1; i < multiTripCount; i++) {
            adultElement = document.body.querySelector(`[from-to-depart=from-to-depart_${i}]`).shadowRoot.querySelector(".adultMultiCityShow");
            childElement = document.body.querySelector(`[from-to-depart=from-to-depart_${i}]`).shadowRoot.querySelector(".childMultiCityShow");


            if (adultElement != null) {
                adultValue = adultElement.querySelector("input").value;
                this.addClassesToElement(adultElement, ["adultMultiCityHide"]);
                this.removeClassesFromElement(adultElement, ["adultOneWay", "adultRoundTrip", "adultMultiCityShow"]);

            }


            if (childElement != null) {
                childValue = childElement.querySelector("input").value;
                this.addClassesToElement(childElement, ["childMultiCityHide"]);
                this.removeClassesFromElement(childElement, ["childOneWay", "childRoundTrip", "childMultiCityShow"]);
            }

        }


        let lastMultiCityTripInformationActive = document.body.querySelectorAll(`[from-to-depart=from-to-depart_${multiTripCount}]`);
        lastMultiCityTripInformationActive = lastMultiCityTripInformationActive[lastMultiCityTripInformationActive.length - 1];


        if (adultValue != null) {
            lastMultiCityTripInformationActive.shadowRoot.querySelector("[name=adult]").querySelector("input").value = adultValue;
        }


        if (childValue != null) {
            lastMultiCityTripInformationActive.shadowRoot.querySelector("[name=child]").querySelector("input").value = childValue;
        }


        this.addClassesToElement(lastMultiCityTripInformationActive.shadowRoot.querySelector("[name=adult]"), ["adultMultiCityShow"]);
        this.removeClassesFromElement(lastMultiCityTripInformationActive.shadowRoot.querySelector("[name=adult]"), ["adultOneWay", "adultRoundTrip", "adultMultiCityHide"]);


        this.addClassesToElement(lastMultiCityTripInformationActive.shadowRoot.querySelector("[name=child]"), ["childMultiCityShow"]);
        this.removeClassesFromElement(lastMultiCityTripInformationActive.shadowRoot.querySelector("[name=child]"), ["childOneWay", "childRoundTrip", "childMultiCityHide"]);
    }



    parent() {
        return this.shadowRoot.querySelector(".fromToDepartContainer");
    }



    addButtonEnable() {
        this.addClassesToElement(this.parent().querySelector(".add"), ["addButtonShow"]);
        this.removeClassesFromElement(this.parent().querySelector(".add"), ["addButtonHide"]);
    }



    addButtonDisable() {
        this.addClassesToElement(this.parent().querySelector(".add"), ["addButtonHide"]);
        this.removeClassesFromElement(this.parent().querySelector(".add"), ["addButtonShow"]);
    }



    deleteButtonEnable() {
        this.addClassesToElement(this.parent().querySelector(".delete"), ["deleteButtonShow"]);
        this.removeClassesFromElement(this.parent().querySelector(".delete"), ["deleteButtonHide"]);
    }



    deleteButtonDisable() {
        this.addClassesToElement(this.parent().querySelector(".delete"), ["deleteButtonHide"]);
        this.removeClassesFromElement(this.parent().querySelector(".delete"), ["deleteButtonShow"]);
    }



    setOneWayTripClasses() {
        let parent = this.parent();

        this.addClassesToElement(parent, ["oneWay"]);
        this.removeClassesFromElement(parent, ["roundTrip", "multiCity"]);

        this.addClassesToElement(parent.querySelector("[name=from]"), ["fromOneWay"]);
        this.removeClassesFromElement(parent.querySelector("[name=from]"), ["fromRoundTrip", "fromMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=to]"), ["toOneWay"]);
        this.removeClassesFromElement(parent.querySelector("[name=to]"), ["toRoundTrip", "toMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=departDateContainer]"), ["departDateOneWay"]);
        this.removeClassesFromElement(parent.querySelector("[name=departDateContainer]"), ["departDateRoundTrip", "departDateMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=returnDateContainer]"), ["returnDateOneWay"]);
        this.removeClassesFromElement(parent.querySelector("[name=returnDateContainer]"), ["returnDateRoundTrip", "returnDateMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=addDeleteButton]"), ["addDeleteButtonOneWay"]);
        this.removeClassesFromElement(parent.querySelector("[name=addDeleteButton]"), ["addDeleteButtonRoundTrip", "addDeleteButtonMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=adult]"), ["adultOneWay"]);
        this.removeClassesFromElement(parent.querySelector("[name=adult]"), ["adultRoundTrip", "adultMultiCityShow", "adultMultiCityHide"]);

        this.addClassesToElement(parent.querySelector("[name=child]"), ["childOneWay"]);
        this.removeClassesFromElement(parent.querySelector("[name=child]"), ["childRoundTrip", "childMultiCityShow", "childMultiCityHide"]);
    }



    setRoundTripClasses() {
        let parent = this.parent();

        this.addClassesToElement(parent, ["roundTrip"]);
        this.removeClassesFromElement(parent, ["oneWay", "multiCity"]);

        this.addClassesToElement(parent.querySelector("[name=from]"), ["fromRoundTrip"]);
        this.removeClassesFromElement(parent.querySelector("[name=from]"), ["fromOneWay", "fromMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=to]"), ["toRoundTrip"]);
        this.removeClassesFromElement(parent.querySelector("[name=to]"), ["toOneWay", "toMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=departDateContainer]"), ["departDateRoundTrip"]);
        this.removeClassesFromElement(parent.querySelector("[name=departDateContainer]"), ["departDateOneWay", "departDateMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=returnDateContainer]"), ["returnDateRoundTrip"]);
        this.removeClassesFromElement(parent.querySelector("[name=returnDateContainer]"), ["returnDateOneWay", "returnDateMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=addDeleteButton]"), ["addDeleteButtonRoundTrip"]);
        this.removeClassesFromElement(parent.querySelector("[name=addDeleteButton]"), ["addDeleteButtonOneWay", "addDeleteButtonMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=adult]"), ["adultRoundTrip"]);
        this.removeClassesFromElement(parent.querySelector("[name=adult]"), ["adultOneWay", "adultMultiCityShow", "adultMultiCityHide"]);


        this.addClassesToElement(parent.querySelector("[name=child]"), ["childRoundTrip"]);
        this.removeClassesFromElement(parent.querySelector("[name=child]"), ["childOneWay", "childMultiCityShow", "childMultiCityHide"]);
    }



    setMultiCityTripClasses() {
        let parent = this.parent();

        this.addClassesToElement(parent, ["multiCity"]);
        this.removeClassesFromElement(parent, ["oneWay", "roundTrip"]);

        this.addClassesToElement(parent.querySelector("[name=from]"), ["fromMultiCity"]);
        this.removeClassesFromElement(parent.querySelector("[name=from]"), ["fromOneWay", "fromRoundTrip"]);

        this.addClassesToElement(parent.querySelector("[name=to]"), ["toRoundTrip"]);
        this.removeClassesFromElement(parent.querySelector("[name=to]"), ["toOneWay", "toMultiCity"]);

        this.addClassesToElement(parent.querySelector("[name=departDateContainer]"), ["departDateMultiCity"]);
        this.removeClassesFromElement(parent.querySelector("[name=departDateContainer]"), ["departDateOneWay", "departDateRoundTrip"]);

        this.addClassesToElement(parent.querySelector("[name=returnDateContainer]"), ["returnDateMultiCity"]);
        this.removeClassesFromElement(parent.querySelector("[name=returnDateContainer]"), ["returnDateOneWay", "returnDateRoundTrip"]);

        this.addClassesToElement(parent.querySelector("[name=addDeleteButton]"), ["addDeleteButtonMultiCity"]);
        this.removeClassesFromElement(parent.querySelector("[name=addDeleteButton]"), ["addDeleteButtonOneWay", "addDeleteButtonRoundTrip"]);

        this.addClassesToElement(parent.querySelector("[name=adult]"), ["adultMultiCityHide"]);
        this.removeClassesFromElement(parent.querySelector("[name=adult]"), ["adultOneWay", "adultMultiCityShow", "adultRoundTrip"]);

        this.addClassesToElement(parent.querySelector("[name=child]"), ["childMultiCityHide"]);
        this.removeClassesFromElement(parent.querySelector("[name=child]"), ["childOneWay", "childMultiCityShow", "childRoundTrip"]);
    }



    addClassesToElement(element, arrayOfClassesToBeAdded) {

        arrayOfClassesToBeAdded.forEach((className) => {
            if (!element.classList.contains(className)) {
                element.classList.add(className);
            }
        });

    }



    removeClassesFromElement(element, arrayOfClassesToBeRemoved) {

        arrayOfClassesToBeRemoved.forEach((className) => {
            if (element.classList.contains(className)) {
                element.classList.remove(className);
            }
        });

    }



    autocompleteInputSearchBox() {
        var userInputFromTimerID;
        var userInputToTimerID;

        this.shadowRoot.querySelector("input[name=From]").addEventListener("input", async (event) => {
            clearTimeout(userInputFromTimerID);
            let userInput = event.target.value;
            if (userInput != "") {
                userInputFromTimerID = setTimeout(async () => {
                    await this.populateAirportDropdownOfFromInput(userInput);
                }, 1000);
            }
        });


        this.shadowRoot.querySelector("input[name=To]").addEventListener("input", async (event) => {
            clearTimeout(userInputToTimerID);
            let userInput = event.target.value;
            if (userInput != "") {
                userInputToTimerID = setTimeout(async () => {
                    await this.populateAirportDropdownOfToInput(userInput);
                }, 1000);
            }
        });

    }

    async populateAirportDropdownOfFromInput(userInput) {
        let autoCompleteContainer = this.shadowRoot.querySelector("div[name=from]").querySelector(".autoCompleteContainer");


        if (userInput === '') {
            this.hideAirportSearchSuggestionResult(autoCompleteContainer);

        } else {


            if (autoCompleteContainer.querySelector("ul")) {
                autoCompleteContainer.querySelector("ul").remove();
            }


            let suggestedAirports = await this.AirportSearch(userInput);
            // console.log(suggestedAirports);
            let filteredAirportSuggestion = this.filteringAirportSearchSuggestion(suggestedAirports, userInput);
            // console.log(filteredAirportSuggestion);
            let sortedAirportSuggestion = this.sortingAirportSearchSuggestion(filteredAirportSuggestion);


            if (Object.keys(sortedAirportSuggestion).length >= 5) {
                suggestedAirports = sortedAirportSuggestion.slice(0, 5);
            }

            let inputElement = this.shadowRoot.querySelector("input[name=From]");
            let airportNamesDropdownList = this.createSearchSuggestionList(inputElement, autoCompleteContainer, suggestedAirports);
            Array.from(autoCompleteContainer.querySelectorAll('ul')).forEach((autoCompleteDropdownList)=>{
                autoCompleteDropdownList.remove();
            });
            autoCompleteContainer.appendChild(airportNamesDropdownList);

            this.showAirportSearchSuggestionResult(autoCompleteContainer);
        }
    }


    async populateAirportDropdownOfToInput(userInput) {
        let autoCompleteContainer = this.shadowRoot.querySelector("div[name=to]").querySelector(".autoCompleteContainer");


        if (userInput === '') {

            this.hideAirportSearchSuggestionResult(autoCompleteContainer);

        } else {

            let suggestedAirports = await this.AirportSearch(userInput);
            // console.log(suggestedAirports);
            let filteredAirportSuggestion = this.filteringAirportSearchSuggestion(suggestedAirports, userInput);
            // console.log(filteredAirportSuggestion);
            let sortedAirportSuggestion = this.sortingAirportSearchSuggestion(filteredAirportSuggestion);


            if (Object.keys(sortedAirportSuggestion).length >= 5) {
                suggestedAirports = sortedAirportSuggestion.slice(0, 5);
            }

            let inputElement = this.shadowRoot.querySelector("input[name=To]");
            let airportNamesDropdownList = this.createSearchSuggestionList(inputElement, autoCompleteContainer, suggestedAirports);
            Array.from(autoCompleteContainer.querySelectorAll('ul')).forEach((autoCompleteDropdownList)=>{
                autoCompleteDropdownList.remove();
            });
            autoCompleteContainer.appendChild(airportNamesDropdownList);

            this.showAirportSearchSuggestionResult(autoCompleteContainer);
        }
    }

    hideAirportSearchSuggestionResult(airportSearchSuggestionContainer) {
        this.addClassesToElement(airportSearchSuggestionContainer, ['autoCompleteFormContainerHide']);
        this.removeClassesFromElement(airportSearchSuggestionContainer, ['autoCompleteFormContainerShow']);
    }

    showAirportSearchSuggestionResult(airportSearchSuggestionContainer) {
        this.addClassesToElement(airportSearchSuggestionContainer, ['autoCompleteFormContainerShow']);
        this.removeClassesFromElement(airportSearchSuggestionContainer, ['autoCompleteFormContainerHide']);
    }


    async AirportSearch(query) {
        console.log(query);
        var response = await fetch(`http://127.0.0.1:3000/airportsearch/${query}`)
        var data = await response.json();
        data = data.data;
        return data;
    }



    filteringAirportSearchSuggestion(airportData, searchInputByUser) {
        airportData = airportData.filter((airportInformation) => {
            return airportInformation.detailedName.toLowerCase().startsWith(searchInputByUser.toLowerCase());
        });
        return airportData;
    }



    sortingAirportSearchSuggestion(airportData) {
        airportData.sort(function (firstairport, secondAiport) {
            return firstairport.iataCode < secondAiport.iataCode ? -1 : 1;
        });
        return airportData;
    }



    createSearchSuggestionList(inputElement, autoCompleteContainer, airportData) {
        let unorderedList = document.createElement("ul");
        airportData.forEach((airport) => {
            let listItem = document.createElement("li");
            listItem.textContent = airport.name + ", " + airport.iataCode;
            listItem.setAttribute("value", airport.iataCode);
            listItem.setAttribute("class", "listItemShow");
            listItem.addEventListener("click", (event) => {
                inputElement.value = airport.iataCode;
                this.hideAirportSearchSuggestionResult(autoCompleteContainer);
            });
            unorderedList.appendChild(listItem);
        });
        return unorderedList;
    }



}






window.customElements.define("from-to-depart", TripInformation);










/*-------------------------------------------------------------
constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    // var value=this.hasAttribute("value")?this.getAttribute("value"):-2;
    // value=Number(value);
    // this.shadowRoot.querySelector('.add').addEventListener('click', () => {
    //     // if(document.querySelector(`[from-to-depart=from-to-depart_${value+1}]`).shadowRoot.querySelector(".fromToDepartContainer").style.display!="grid"){
    //     //     document.querySelector(`[from-to-depart=from-to-depart_${value+1}]`).shadowRoot.querySelector(".fromToDepartContainer").style.display="grid";
    //     // }
    //     multiTripCount++;
    //     if (document.querySelector(`[from-to-depart=from-to-depart_${multiTripCount}]`).shadowRoot.querySelector(".fromToDepartContainer").style.display != "grid") {
    //         document.querySelector(`[from-to-depart=from-to-depart_${multiTripCount}]`).shadowRoot.querySelector(".fromToDepartContainer").style.display = "grid";
    //     }

    // });

    // this.shadowRoot.querySelector('.delete').addEventListener('click', () => {
    //     document.querySelector(`[from-to-depart=from-to-depart_${value}]`).shadowRoot.querySelector(".fromToDepartContainer").style.display = "none";
    // });
}*/


//logic for autocompletecdropdown airport
/*var fromtodepart=document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector("input.from");
            fromtodepart.addEventListener("input",function(e){
                var iatacode=fromtodepart.value;
                if(iatacode!=''){
                    iatacodefetchtime=Date.now();
                    console.log("Event Fired At:",iatacode,(iatacodefetchtime%10000));
                    setTimeout(async()=>{
                        console.log("CallBack Time Diff:",iatacode,Date.now()-iatacodefetchtime,Date.now()%10000,iatacodefetchtime%10000);
                        if(Date.now()-iatacodefetchtime>500){
                            var result=await AirportSearch(iatacode);
                            DropDownMenuIataCode(fromtodepart,iatacode,result);
                        }
                    },1000);
                    
                }
            })*/