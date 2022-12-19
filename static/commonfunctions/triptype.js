export function getTripType(){
    var tripType;
    var tripValues=document.getElementsByName('Trip-Type');
    for(var i=0;i<tripValues.length;i++ ){
        if(tripValues[i].checked){
            tripType=tripValues[i].value;    
        }
    }
    return tripType;
}
