function OneWaySearch(payload){
    fetch(`http://127.0.0.1:3000/flights/one-way/${payload.from}/${payload.to}/${payload.departdate}/1/0`)
    .then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
    });
}

addEventListener('DOMContentLoaded', (event) => {


    var form=document.querySelector("#flight-search");
    form.addEventListener("submit",function(event){
        event.preventDefault();
        var payload={
            "from":document.querySelector("#one").shadowRoot.querySelector("input.from").value,
            "to":document.querySelector("#one").shadowRoot.querySelector("input.to").value,
            "departdate":document.querySelector("#one").shadowRoot.querySelector("input.depart").value,
            "adult":1,
            "child":0,
        };

        console.log(payload);



        OneWaySearch(payload);
    });
});


