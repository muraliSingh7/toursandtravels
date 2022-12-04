//var tripvalues=Arraydocument.querySelectorAll('.triptype');


var tripval=Array.from(document.querySelectorAll('.triptype'));
tripval.forEach((element)=>{
    element.addEventListener('change',(event) =>{
        
        //adult,children and search are activated after selecting radio button
        var commonelement=['adult','adultinput','child','childinput'];
        commonelement.forEach((element)=>{
            document.querySelector('.'+element).style.display="inline-block";
        })
        document.querySelector('.search').style.display="block";



        var triptype;
        var tripvalues=document.getElementsByName('Trip-Type');
        for(var i=0;i<tripvalues.length;i++ ){
            if(tripvalues[i].checked){
                triptype=tripvalues[i].value;    
            }
        }
        //console.log(triptype);

        if(triptype=="One-Way" || triptype=="Round-Trip"){
            document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector("div").style.display="block";
            for(let i=2;i<5;i++){
                document.querySelector(`[from-to-depart=from-to-depart_${i}]`).shadowRoot.querySelector("div").style.display="none";
                document.getElementById('add'+i).style.display="none";
                if(i!=2){
                    document.getElementById('delete'+i).style.display = "none";
                }
            }
        }

        if(triptype=="Multi-City"){
            document.querySelector('[from-to-depart=from-to-depart_2]').shadowRoot.querySelector("div").style.display="block";
            document.getElementById('add2').style.display="inline-block";
            for(var i=3;i<6;i++){
                var parentelement=document.querySelector(`[from-to-depart=from-to-depart_${i}`).shadowRoot.querySelector("div");
                if(parentelement.style.display=="block"){
                    var addButton=document.getElementById('add'+i);
                    var deleteButton=document.getElementById('delete'+i);
                    parentelement.insertAdjacentElement('afterend',add);
                    addButton.insertAdjacentElement('afterend',deleteButton);
                    addButton.style.display="inline-block";
                    addButton.addEventListener('click',(MouseEvent)=>{
                        add(i);
                    });
                    deleteButton.style.display="inline-block";
                    deleteButton.addEventListener('click',(MouseEvent)=>{
                        deleteFromToDepart(i);
                    });
                }
            }
        }


        
        //logic of return date
        var parent=document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector('input.to');
        var returnlabel=document.querySelector('label[for=ReturnDate]');
        var returndate=document.querySelector('input[name=ReturnDate]');
        if(triptype=="One-Way" || triptype=="Multi-City"){
            if(parent.nextSibling.nodeName=='BR'){
                parent.nextSibling.style.display="none";
            }
            if(returnlabel!=null){
                returnlabel.style.display="none";
                returndate.style.display="none";
            }else{
                document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector('label[for=ReturnDate]').style.display='none';
                document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector('input[name=ReturnDate]').style.display='none';
            }
            
        }else{
            if(parent.nextSibling.nodeName!='BR'){
                parent.outerHTML+='<br/>';
            }

            var depart=document.querySelector('[from-to-depart=from-to-depart_1]').shadowRoot.querySelector('input.depart');
            if(depart.nextSibling.nodeName!='LABEL'){
                depart.insertAdjacentElement('afterend',returnlabel);
                if(returnlabel.nextSibling.nodeName!='INPUT'){
                    returnlabel.insertAdjacentElement('afterend',returndate);
                    // returnlabel.appendChild(returndate);
                }
            }
            
            
           
        }


    });
});



function add(i){
    document.getElementById('add'+(i)).style.display="none";
    if(i!=2){
        document.getElementById('delete'+(i)).style.display="none";
    }
    document.querySelector(`[from-to-depart=from-to-depart_${i+1}]`).shadowRoot.querySelector("div").style.display="block";
    if(i+1!=5){
        document.getElementById('add'+(i+1)).style.display="inline-block";
    }
    document.getElementById('delete'+(i+1)).style.display="inline-block";
}



function deleteFromToDepart(i){
    if(i!=5){
        document.getElementById('add'+i).style.display="none";
    }
    document.querySelector(`[from-to-depart=from-to-depart_${i}]`).shadowRoot.querySelector("div").style.display="none";
    document.getElementById('delete'+i).style.display="none";
    document.getElementById('add'+(i-1)).style.display="inline-block";
    if(i-1!=2){  
        document.getElementById('delete'+(i-1)).style.display="inline-block";
    }
}
    