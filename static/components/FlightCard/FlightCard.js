const FlightCardTemplate = document.createElement("template");
const oneTripDetailTemplate = document.createElement("template");
oneTripDetailTemplate.innerHTML = `<div class="flex-row">
    <div>
        <p class="time" name="depart-time" ></p>
        <p class="place" name="depart-place"></p>
    </div>
    <div>
        <p class="duration" name="duration"></p>
        <p class="stoppage" name="stoppage"></p>
    </div>
    <div>
        <p class="time" name="arrival-time"></p>
        <p class="place" name="arrival-place"></p>
    </div>
</div>`
    ;

FlightCardTemplate.innerHTML =
    `<link rel="stylesheet" href="static/components/FlightCard/FlightCard.css">
        <div class="card">
            <header class="carrier-name" name="carrier-name"></header>
            <table>
                <tr>
                    <td>
                        <div class="selectedFlight">
                            <input type="radio" name="selectedFlight"></input>
                        </div>
                    </td>
                    <td name="flight">
                    </td>
                    <td>
                        <div>
                            <p class="price" name="price"></p>
                        </div>
                    </td>
                </tr>
            </table>
        </div>`;


class FlightCard extends HTMLElement {
    constructor(tripcount) {
        super();
        this.tripcount = tripcount;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(FlightCardTemplate.content.cloneNode(true));
       
        //console.log(this.shadowRoot);
        //console.log(tripcount);
       
        while (tripcount != 0) {

            //console.log(this.shadowRoot.querySelector('header[name=carrier-name]'))
            this.shadowRoot.querySelector('td[name=flight]').innerHTML+=oneTripDetailTemplate.innerHTML;
            tripcount--;

        }

        //console.log(this.shadowRoot);
    }
    connectedCallBack() {

    };
}

window.customElements.define("flight-card", FlightCard);