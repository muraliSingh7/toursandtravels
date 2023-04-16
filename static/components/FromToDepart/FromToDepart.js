const template = document.createElement("template");
template.innerHTML = `
                    <link rel="stylesheet" href="static/components/FromtoDepart/FromtoDepart.css">
                    <div class="fromToDepartContainer">
                        <div name="from">
                            <label for="from" id="from" class="fromtodepartlabel">From : </label>
                            <input type="text" class="from" name="From">
                        </div>
                        <div name="to">
                            <label for="to" id="to" class="fromtodepartlabel">To : </label>
                            <input type="text" class="to" name="To">
                        </div>
                        <div name="departDate">
                            <label for="depart" id="depart" class="fromtodepartlabel">Depart : </label>
                            <input type="date" class="depart" name="Depart">
                        </div>
                        <div name="addDeleteButton">
                            <button id="add" class="add" >+</button>
                            <button id="delete" class="delete" >-</button>
                        </div>
                        <div name="returnDate">
                            <label for="ReturnDate" id="ReturnDate" class="returndate" >Return : </label>
                            <input class="returninput" type="date" name="ReturnDate">
                        </div>
                        <div name="adult">
                            <label for="Adult" id="Adult" class="adultAndChildLabel" >Adult : </label>
                            <input type="number" id="Adult" name="Adult" min="1" max="5" class="adultinput">
                        </div>
                        <div name="child">
                            <label for="Children" id="Children" class="adultAndChildLabel" >Children : </label>
                            <input type="number" id="Children" name="Children" min="0" max="5" class="childinput">
                        </div>
                    </div>`;
class FromToDepart extends HTMLElement {
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
        this.addButtonEventHandler();
        this.deleteButtonEventHandler();
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
                this.adultAndChildEnableMultiCity();
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
                // this.adultAndChildEnableMultiCity();
            }

            if(multiTripCount>1){
                this.adultAndChildEnableMultiCity();
            }
        });
    }

    static get observedAttributes() { return ['triptype', 'value']; }

    attributeChangedCallback() {
        // console.log(this.hasAttribute("triptype"), this.hasAttribute("value"));
        if (this.hasAttribute("triptype") && this.hasAttribute("value")) {
            let value = this.getAttribute("value");
            let triptype = this.getAttribute("triptype");
            // console.log(this.getAttribute("triptype"));
            // console.log(this.getAttribute("value"));
            if (triptype === "One-Way" && value === "1") {
                this.oneWay();
                this.addButtonDisable();
                this.deleteButtonDisable();
            }

            if (triptype === "Round-Trip" && value === "1") {
                this.roundTrip();
                this.addButtonDisable();
                this.deleteButtonDisable();
            }

            if (triptype === "Multi-City" && value === "1") {
                this.multiCity();
                this.addButtonDisable();
                this.deleteButtonDisable();
            }
            if (triptype === "Multi-City" && value === "2") {
                this.multiCity();
                this.addButtonEnable();
                this.deleteButtonDisable();
            }
            if (triptype === "Multi-City" && value === "3" || value === "4") {
                this.multiCity();
                this.addButtonEnable();
                this.deleteButtonEnable();
            }
            if (triptype === "Multi-City" && value === "5") {
                this.multiCity();
                this.addButtonDisable();
                this.deleteButtonEnable();
            }

        } else {
        }

    }

    adultAndChildEnableMultiCity() {
        let childValue, adultValue,adult,child;
        for (let i = 1; i < multiTripCount; i++) {
           adult = document.body.querySelector(`[from-to-depart=from-to-depart_${i}]`).shadowRoot.querySelector(".adultMultiCityShow");
            if (adult != null) {
                child = document.body.querySelector(`[from-to-depart=from-to-depart_${i}]`).shadowRoot.querySelector(".childMultiCityShow");
                adultValue = adult.querySelector("input").value;
                childValue = child.querySelector("input").value;
                // console.log(adultValue);
                // console.log(childValue);
                this.addAndRemoveClass(adult, ["adultMultiCityHide"], ["adultOneWay", "adultRoundTrip", "adultMultiCityShow"]);
                this.addAndRemoveClass(child, ["childMultiCityHide"], ["childOneWay", "childRoundTrip", "childMultiCityShow"]);
            }
        }

        let lastMultiCityFromToDepartActive=document.body.querySelectorAll(`[from-to-depart=from-to-depart_${multiTripCount}]`);
        lastMultiCityFromToDepartActive=lastMultiCityFromToDepartActive[lastMultiCityFromToDepartActive.length-1];
        if (adultValue != null) {
            lastMultiCityFromToDepartActive.shadowRoot.querySelector("[name=adult]").querySelector("input").value = adultValue;
            lastMultiCityFromToDepartActive.shadowRoot.querySelector("[name=child]").querySelector("input").value = childValue;
        }
        // console.log(lastMultiCityFromToDepartActive);
     
        this.addAndRemoveClass(lastMultiCityFromToDepartActive.shadowRoot.querySelector("[name=adult]"), ["adultMultiCityShow"], ["adultOneWay", "adultRoundTrip", "adultMultiCityHide"]);
        this.addAndRemoveClass(lastMultiCityFromToDepartActive.shadowRoot.querySelector("[name=child]"), ["childMultiCityShow"], ["childOneWay", "childRoundTrip", "childMultiCityHide"]);
    }

    parent() {
        return this.shadowRoot.querySelector(".fromToDepartContainer");
    }

    addButtonEnable() {
        this.addAndRemoveClass(this.parent().querySelector(".add"), ["addButtonShow"], ["addButtonHide"]);
    }

    addButtonDisable() {
        this.addAndRemoveClass(this.parent().querySelector(".add"), ["addButtonHide"], ["addButtonShow"]);
    }

    deleteButtonEnable() {
        this.addAndRemoveClass(this.parent().querySelector(".delete"), ["deleteButtonShow"], ["deleteButtonHide"]);
    }

    deleteButtonDisable() {
        this.addAndRemoveClass(this.parent().querySelector(".delete"), ["deleteButtonHide"], ["deleteButtonShow"]);
    }


    oneWay() {
        let parent = this.parent();
        this.addAndRemoveClass(parent, ["oneWay"], ["roundTrip", "multiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=from]"), ["fromOneWay"], ["fromRoundTrip", "fromMultiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=to]"), ["toOneWay"], ["toRoundTrip", "toMultiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=departDate]"), ["departDateOneWay"], ["departDateRoundTrip", "departDateMultiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=returnDate]"), ["returnDateOneWay"], ["returnDateRoundTrip", "returnDateMultiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=addDeleteButton]"), ["addDeleteButtonOneWay"], ["addDeleteButtonRoundTrip", "addDeleteButtonMultiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=adult]"), ["adultOneWay"], ["adultRoundTrip", "adultMultiCityShow", "adultMultiCityHide"]);
        this.addAndRemoveClass(parent.querySelector("[name=child]"), ["childOneWay"], ["childRoundTrip", "childMultiCityShow", "childMultiCityHide"]);
    }

    roundTrip() {
        let parent = this.parent();
        this.addAndRemoveClass(parent, ["roundTrip"], ["oneWay", "multiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=from]"), ["fromRoundTrip"], ["fromOneWay", "fromMultiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=to]"), ["toRoundTrip"], ["toOneWay", "toMultiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=departDate]"), ["departDateRoundTrip"], ["departDateOneWay", "departDateMultiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=returnDate]"), ["returnDateRoundTrip"], ["returnDateOneWay", "returnDateMultiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=addDeleteButton]"), ["addDeleteButtonRoundTrip"], ["addDeleteButtonOneWay", "addDeleteButtonMultiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=adult]"), ["adultRoundTrip"], ["adultOneWay", "adultMultiCityShow", "adultMultiCityHide"]);
        this.addAndRemoveClass(parent.querySelector("[name=child]"), ["childRoundTrip"], ["childOneWay", "childMultiCityShow", "childMultiCityHide"]);
    }

    multiCity() {
        let parent = this.parent();
        this.addAndRemoveClass(parent, ["multiCity"], ["oneWay", "multiCity"]);
        this.addAndRemoveClass(parent.querySelector("[name=from]"), ["fromMultiCity"], ["fromOneWay", "fromRoundTrip"]);
        this.addAndRemoveClass(parent.querySelector("[name=to]"), ["toMultiCity"], ["toOneWay", "toRoundTrip"]);
        this.addAndRemoveClass(parent.querySelector("[name=departDate]"), ["departDateMultiCity"], ["departDateOneWay", "departDateRoundTrip"]);
        this.addAndRemoveClass(parent.querySelector("[name=returnDate]"), ["returnDateMultiCity"], ["returnDateOneWay", "returnDateRoundTrip"]);
        this.addAndRemoveClass(parent.querySelector("[name=addDeleteButton]"), ["addDeleteButtonMultiCity"], ["addDeleteButtonOneWay", "addDeleteButtonRoundTrip"]);
        this.addAndRemoveClass(parent.querySelector("[name=adult]"), ["adultMultiCityHide"], ["adultOneWay", "adultRoundTrip", "adultMultiCityShow"]);
        this.addAndRemoveClass(parent.querySelector("[name=child]"), ["childMultiCityHide"], ["childOneWay", "childRoundTrip", "childMultiCityShow"]);
        
    }

    addAndRemoveClass(element, listOfClassToBeAdded, listOfClassToBeRemoved) {
        // console.log(element);

        listOfClassToBeRemoved.forEach((className) => {
            if (element.classList.contains(className)) {
                element.classList.remove(className);
            }
            // for(let value in element.classList.values()){
            //     console.log(value);
            // }
        });

        listOfClassToBeAdded.forEach((className) => {
            if (!element.classList.contains(className)) {
                element.classList.add(className);
            }
        });

        // console.log(element.classList);
    }
}

window.customElements.define("from-to-depart", FromToDepart);