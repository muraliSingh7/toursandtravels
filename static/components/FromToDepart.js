const template = document.createElement("template");
template.innerHTML = `
                    <link rel="stylesheet" href="static/components/FromtoDepart.css">
                    <div>
                        <label for="from" id="from" class="fromtodepartlabel">From : </label>
                        <input type="text" class="from" name="From">
                        <label for="to" id="to" class="fromtodepartlabel">To : </label>
                        <input type="text" class="to" name="To">
                        <label for="depart" id="depart" class="fromtodepartlabel">Depart : </label>
                        <input type="date" class="depart" name="Depart">
                    </div>`;
class FromToDepart extends HTMLElement {
    constructor() {
        super();
        const shadow=this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        /*shadow.addEventListener("change",(event)=>{
            getlocations(this.shadowRoot.querySelector("input.From").value);
            //console.log();
        });*/
        
    }
    connectedCallback(){}
    

    /*show_hide(value){
        if(value=="One-Way" || value="Round-Trip"){
            document.querySelector('#1').style.display="block";
            for(let i=2;i<=5;i++){
                document.getElementById(`#${i}`).style.display="none";
            }
        }else{
            for(let i=2;i<=5;i++){
                document.getElementById(`#${i}`).style.display="block";
            }
        }
    }*/
}

window.customElements.define("from-to-depart", FromToDepart);