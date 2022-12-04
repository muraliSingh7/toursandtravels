const legtemplate=document.createElement("template");
const flightcardtemplate = document.createElement("template");

legtemplate.innerHTML=`<div class="flex-row">
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
<div>
    <p class="price" name="price"></p>
</div>
</div>
`;

flightcardtemplate.innerHTML = `
<link rel="stylesheet" href="static/components/FlightCard.css">
<div class="card">
    <header class="carrier-name" name="carrier-name"></header>
</div>`;

class FlightCard extends HTMLElement{
    constructor(result){
        super();
        this.result=result;
    }
    connectedCallBack(){
        const shadow=this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(flightcardtemplate.content.cloneNode('true'));
    };
}

window.customElements.define("flight-card",FlightCard);