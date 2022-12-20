import{shallowCopy} from '../commonfunctions/deepcopy.js';



export function sortByPrice(data,order,itinerariesValue) {
    let result_By_Price = shallowCopy(data);
    result_By_Price.sort((a, b) => {
        let result=priceCompare(Number(a.price.total), Number(b.price.total), order);
        if(result!=0){
            return result;
        }else{
            let duration_Of_A=a.itineraries[itinerariesValue].duration.split('T')[1].match(/\d+/g);
            let duration_Of_B=b.itineraries[itinerariesValue].duration.split('T')[1].match(/\d+/g);
            let hour_Of_A=Number(duration_Of_A[0]);
            let hour_Of_B=Number(duration_Of_B[0]);
            let minutes_Of_A=Number(duration_Of_A[1]);
            let minutes_Of_B=Number(duration_Of_B[1]);
            let result_Of_Time=timeCompare(hour_Of_A,hour_Of_B,minutes_Of_A,minutes_Of_B,order);
            return result_Of_Time;
        }
    });
    
    if (result_By_Price.length > 50) {
        result_By_Price = result_By_Price.slice(0, 50);
    }
    // result_By_Price.forEach((element) => {
    //     console.log(element.price.total+" "+element.itineraries[itinerariesValue].duration);
    // });
    console.log("price");
    return result_By_Price;
}

export function sortByTime(data, time, order,itinerariesValue) {
    console.log(time+" "+order);
    let result_By_Time = shallowCopy(data);
    if (time == "departure") {
        result_By_Time.sort((a, b) => {
            let departure_Of_A=a.itineraries[itinerariesValue].segments[0].departure.at.split('T')[1];
            let departure_Of_B=b.itineraries[itinerariesValue].segments[0].departure.at.split('T')[1];
            if(order=="descending"){
                if(departure_Of_A<departure_Of_B){
                    return 1;
                }else if(departure_Of_A>departure_Of_B){
                    return -1;
                }else{
                    return priceCompare(Number(a.price.total), Number(b.price.total),order);
                }
            }else{
                if(departure_Of_A<departure_Of_B){
                    return -1;
                }else if(departure_Of_A>departure_Of_B){
                    return 1;
                }else{
                    return priceCompare(Number(a.price.total), Number(b.price.total),order);
                }
            }
            
        });
    } else {
        result_By_Time.sort((a, b) => {
            let arrival_Of_A=a.itineraries[itinerariesValue].segments[a.itineraries[itinerariesValue].segments.length-1].arrival.at.split('T')[1];
            let arrival_Of_B=b.itineraries[itinerariesValue].segments[b.itineraries[itinerariesValue].segments.length-1].arrival.at.split('T')[1];
            if(order=="descending"){
                if(arrival_Of_A<arrival_Of_B){
                    return 1;
                }else if(arrival_Of_A>arrival_Of_B){
                    return -1;
                }else{
                    return priceCompare(Number(a.price.total), Number(b.price.total),order);
                }
            }else{
                if(arrival_Of_A<arrival_Of_B){
                    return -1;
                }else if(arrival_Of_A>arrival_Of_B){
                    return 1;
                }else{
                    return priceCompare(Number(a.price.total), Number(b.price.total),order);
                }
            }
        });
    }

    if (result_By_Time.length > 50) {
        result_By_Time = result_By_Time.slice(0, 50);
    }

    // result_By_Time.forEach(element => {
    //     if (time == "departure") {
    //         console.log(element.price.total+" "+element.itineraries[itinerariesValue].segments[0].departure.at);
    //     }else{
    //         console.log(element.price.total+" "+element.itineraries[itinerariesValue].segments[element.itineraries[itinerariesValue].segments.length-1].arrival.at);
    //     }
    // });

    console.log("Time");
    return result_By_Time;

}

export function sortByDuration(data,order,itinerariesValue) {
    let result_By_Duration = shallowCopy(data);
    result_By_Duration.sort((a, b) => {
        let duration_Of_A=a.itineraries[itinerariesValue].duration.split('T')[1].match(/\d+/g);
        let duration_Of_B=b.itineraries[itinerariesValue].duration.split('T')[1].match(/\d+/g);
        let hour_Of_A=Number(duration_Of_A[0]);
        let hour_Of_B=Number(duration_Of_B[0]);
        let minutes_Of_A=Number(duration_Of_A[1]);
        let minutes_Of_B=Number(duration_Of_B[1]);
        let result=timeCompare(hour_Of_A,hour_Of_B,minutes_Of_A,minutes_Of_B,0,0,order);
        if(result!=0){
            return result;
        }else {
            return priceCompare(Number(a.price.total), Number(b.price.total),order);
        }
    });
    // if (result_By_Duration.length > 50) {
    //     result_By_Duration = result_By_Duration.slice(0, 50);
    // }
    // result_By_Duration.forEach(element => {
    //     console.log(element.price.total+" "+element.itineraries[itinerariesValue].duration);
    // });
    console.log("Duration");
    return result_By_Duration;
}

function priceCompare(price_A, price_B,order) {
    if(order=="ascending"){
        if (price_A > price_B) {
            return 1;
        } else if (price_A < price_B) {
            return -1;
        } else {
            return 0;
        }
    }else{
        if (price_A > price_B) {
            return -1;
        } else if (price_A < price_B) {
            return 1;
        } else {
            return 0;
        }
    }
    
}

function timeCompare(hour_Of_A,hour_Of_B,minutes_Of_A,minutes_Of_B,order){
    if(order=="ascending"){
        if(hour_Of_A<hour_Of_B){
            return 1;
        }else if(hour_Of_A>hour_Of_B){
            return -1;
        }else{
            if(minutes_Of_A<minutes_Of_B){
                return 1;
            }else if(minutes_Of_A>minutes_Of_B){
                return -1;
            }else{
                return 0;
            }
        }
    }else{
        if(hour_Of_A<hour_Of_B){
            return -1;
        }else if(hour_Of_A>hour_Of_B){
            return 1;
        }else{
            if(minutes_Of_A<minutes_Of_B){
                return -1;
            }else if(minutes_Of_A>minutes_Of_B){
                return 1;
            }else{
                return 0;
            }
        }
    }
    
}