const template = document.createElement("template");
template.innerHTML = `
                    <link rel="stylesheet" href="static/components/FromtoDepart/FromtoDepart.css">
                    <div>
                        <label for="from" id="from" class="fromtodepartlabel">From : </label>
                        <input type="text" class="from" name="From">
                        <label for="to" id="to" class="fromtodepartlabel">To : </label>
                        <input type="text" class="to" name="To">
                        <label for="depart" id="depart" class="fromtodepartlabel">Depart : </label>
                        <input type="date" class="depart" name="Depart">
                        <button class="add" id="add">+</button>
                        <button class="delete" id="delete">-</button>
                    </div>`;
class FromToDepart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        var value=this.hasAttribute("value")?this.getAttribute("value"):-2;
        value=Number(value);
        this.shadowRoot.querySelector('.add').addEventListener('click',()=>{
            //console.log(`[from-to-depart=from-to-depart_${value+1}]`);
            //console.log(document.querySelector(`[from-to-depart=from-to-depart_${value+1}]`).shadowRoot.querySelector("div").style.display);
            if(document.querySelector(`[from-to-depart=from-to-depart_${value+1}]`).shadowRoot.querySelector("div").style.display!="block"){
                document.querySelector(`[from-to-depart=from-to-depart_${value+1}]`).shadowRoot.querySelector("div").style.display="block";
            }
        });

        this.shadowRoot.querySelector('.delete').addEventListener('click',()=>{
            document.querySelector(`[from-to-depart=from-to-depart_${value}]`).shadowRoot.querySelector("div").style.display="none";
        });
    }

    connectedCallback(){}

}

window.customElements.define("from-to-depart", FromToDepart);