//var tripvalues=Arraydocument.querySelectorAll('.triptype');


// var tripval=Array.from(document.querySelectorAll('.triptype'));
// tripval.forEach((element)=>{
//     element.addEventListener('change',(event) =>{

//         //adult,children and search are activated after selecting radio button
//         var commonelement=['adult','adultinput','child','childinput'];
//         commonelement.forEach((element)=>{
//             document.querySelector('.'+element).style.display="inline-block";
//         });
//         document.querySelector('.search').style.display="block";

//         //hiding add and delete button of first fromtodepart
//         document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector("div").style.display="flex";
//         document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector('.add').style.display="none";
//         document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector('.delete').style.display="none";


//         var triptype;
//         var tripvalues=document.getElementsByName('Trip-Type');
//         for(var i=0;i<tripvalues.length;i++ ){
//             if(tripvalues[i].checked){
//                 triptype=tripvalues[i].value;    
//             }
//         }
//         //console.log(triptype);

//         if(triptype=="One-Way" || triptype=="Round-Trip"){
//             for(let i=2;i<=5;i++){
//                 document.querySelector(`[from-to-depart=from-to-depart_${i}]`).shadowRoot.querySelector("div").style.display="none";
//             }
//         }

//         if(triptype=="Multi-City"){
//             document.querySelector('[from-to-depart=from-to-depart_2]').shadowRoot.querySelector("div").style.display="block";
//             document.querySelector('[from-to-depart=from-to-depart_2]').shadowRoot.querySelector('.delete').style.display="none";
//             document.querySelector('[from-to-depart=from-to-depart_5]').shadowRoot.querySelector('.add').style.display="none";
//         }



//         //logic of return date
//         var parent=document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector('input.to');
//         var returnlabel=document.querySelector('label[for=ReturnDate]');
//         var returndate=document.querySelector('input[name=ReturnDate]');
//         if(returnlabel==null){
//             returnlabel= document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector('label[for=ReturnDate]');
//             returndate=document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector('input[name=ReturnDate]');
//         }
//         if(triptype=="One-Way" || triptype=="Multi-City"){
//             if(parent.nextSibling.nodeName=='BR'){
//                 parent.nextSibling.style.display="none";
//             }
//             returnlabel.style.display="none";
//             returndate.style.display="none";
//         }else{
//             if(parent.nextSibling.nodeName!='BR'){
//                 let newLine=document.createElement("br");
//                 parent.insertAdjacentElement("afterend",newLine);
//                 // parent.outerHTML+='<br/>';
//             }else{
//                 parent.nextSibling.style.display="inline-block";
//             }

//             var depart=document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector('input.depart');
//             if(depart.nextSibling.nodeName!='LABEL'){
//                 depart.style.margin="0px 65px 5px 5px"
//                 depart.insertAdjacentElement('afterend',returnlabel);
//                 if(returnlabel.nextSibling.nodeName!='INPUT'){
//                     returnlabel.insertAdjacentElement('afterend',returndate);
//                     // returnlabel.appendChild(returndate);
//                 }
//             }
//             returnlabel.style.display="inline-block";
//             returndate.style.display="inline-block";
//         }


//     });
// });



var tripval = Array.from(document.querySelectorAll('.triptype'));
var multiTripCount = 1;

tripval.forEach((element) => {
    element.addEventListener('change', (event) => {
        var tripvalues = document.getElementsByName('Trip-Type');
        for (var i = 0; i < tripvalues.length; i++) {
            if (tripvalues[i].checked) {
                triptype = tripvalues[i].value;
            }
        }

        if (triptype == "One-Way" || triptype == "Round-Trip") {
            for (let i = 2; i <= multiTripCount; i++) {
                if (document.querySelector(`[from-to-depart=from-to-depart_${i}]`) != null) {
                    document.querySelector(`[from-to-depart=from-to-depart_${i}]`).remove();
                }
            }
        }

        if (triptype == "One-Way") {
            multiTripCount = 1;
            if (document.querySelector("[from-to-depart=from-to-depart_1]") != null) {
                document.querySelector("[from-to-depart=from-to-depart_1]").setAttribute("triptype", triptype);
            } else {
                let newFromToDepart = document.createElement("from-to-depart");
                newFromToDepart.setAttribute("value", 1);
                newFromToDepart.setAttribute("from-to-depart", "from-to-depart_1");
                newFromToDepart.setAttribute("triptype", triptype);
                document.querySelector('.search').insertAdjacentElement("beforebegin", newFromToDepart);
            }

        }

        if (triptype == "Round-Trip") {
            multiTripCount = 1;
            if (document.querySelector("[from-to-depart=from-to-depart_1]") != null) {
                document.querySelector("[from-to-depart=from-to-depart_1]").setAttribute("triptype", triptype);
            } else {
                let newFromToDepart = document.createElement("from-to-depart");
                newFromToDepart.setAttribute("value", 1);
                newFromToDepart.setAttribute("from-to-depart", "from-to-depart_1");
                newFromToDepart.setAttribute("triptype", triptype);
                
                document.querySelector('.search').insertAdjacentElement("beforebegin", newFromToDepart);
            }
          
        }

        if (triptype == "Multi-City") {
            if (document.querySelector("[from-to-depart=from-to-depart_1]") != null) {
                document.querySelector("[from-to-depart=from-to-depart_1]").setAttribute("triptype", triptype);
            } else {
                let newFromToDepart = document.createElement("from-to-depart");
                newFromToDepart.setAttribute("value", 1);
                newFromToDepart.setAttribute("from-to-depart", "from-to-depart_1");
                newFromToDepart.setAttribute("triptype", triptype);
                document.querySelector('.search').insertAdjacentElement("beforebegin", newFromToDepart);
            }
            if(multiTripCount<2){
                document.querySelector("[from-to-depart=from-to-depart_1]").querySelector('.add').click();
            }
        }
        document.querySelector('.search').style.display = "block";
    });
});