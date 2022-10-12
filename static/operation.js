function selectoperation() {
    var triptype = document.querySelector("select").value;
    if(triptype=="One-Way" || triptype=="Round-Trip"){
        document.getElementById('1').style.display = "block";
        for(let i=2;i<=5;i++){
            document.getElementById(`${i}`).style.display = "none";
        }
        
    }else{
        for(let i=2;i<=5;i++){
            document.getElementById(`${i}`).style.display = "block";
        }
    }

    var returnElement=Array.from(document.querySelectorAll(".return"));
    if(triptype=="One-Way" || triptype=="Multi-City"){
        returnElement.forEach((element)=>{
            element.style.display="none";
        })
    }else{
        returnElement.forEach((element)=>{
            element.style.display="block";
        })
    }

}