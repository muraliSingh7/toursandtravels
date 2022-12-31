import { shallowCopy } from '../commonfunctions/deepcopy.js';



export function sortByPrice(data, order, itinerariesValue) {
    let result_By_Price = data;
    result_By_Price.sort((a, b) => {
        let result = priceCompare(Number(a.price.total), Number(b.price.total), order);
        if (result != 0) {
            return result;
        } else {
            let duration_Of_A = a.itineraries[itinerariesValue].duration.split('T')[1].match(/\d+/g);
            let duration_Of_B = b.itineraries[itinerariesValue].duration.split('T')[1].match(/\d+/g);
            let hour_Of_A = Number(duration_Of_A[0]);
            let hour_Of_B = Number(duration_Of_B[0]);
            let minutes_Of_A = Number(duration_Of_A[1]);
            let minutes_Of_B = Number(duration_Of_B[1]);
            let result_Of_Time = timeCompare(hour_Of_A, hour_Of_B, minutes_Of_A, minutes_Of_B, order);
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
    console.log(result_By_Price);
    return result_By_Price;
}

export function sortByTime(data, time, order, itinerariesValue) {
    console.log(time + " " + order);
    let result_By_Time = data;
    if (time == "Departure") {
        result_By_Time.sort((a, b) => {
            let departure_Of_A = a.itineraries[itinerariesValue].segments[0].departure.at.split('T')[1];
            let departure_Of_B = b.itineraries[itinerariesValue].segments[0].departure.at.split('T')[1];
            if (order == "descending") {
                if (departure_Of_A < departure_Of_B) {
                    return 1;
                } else if (departure_Of_A > departure_Of_B) {
                    return -1;
                } else {
                    return priceCompare(Number(a.price.total), Number(b.price.total), order);
                }
            } else {
                if (departure_Of_A < departure_Of_B) {
                    return -1;
                } else if (departure_Of_A > departure_Of_B) {
                    return 1;
                } else {
                    return priceCompare(Number(a.price.total), Number(b.price.total), order);
                }
            }

        });
    } else {
        result_By_Time.sort((a, b) => {
            let arrival_Of_A = a.itineraries[itinerariesValue].segments[a.itineraries[itinerariesValue].segments.length - 1].arrival.at.split('T')[1];
            let arrival_Of_B = b.itineraries[itinerariesValue].segments[b.itineraries[itinerariesValue].segments.length - 1].arrival.at.split('T')[1];
            if (order == "descending") {
                if (arrival_Of_A < arrival_Of_B) {
                    return 1;
                } else if (arrival_Of_A > arrival_Of_B) {
                    return -1;
                } else {
                    return priceCompare(Number(a.price.total), Number(b.price.total), order);
                }
            } else {
                if (arrival_Of_A < arrival_Of_B) {
                    return -1;
                } else if (arrival_Of_A > arrival_Of_B) {
                    return 1;
                } else {
                    return priceCompare(Number(a.price.total), Number(b.price.total), order);
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
    console.log(result_By_Time);
    return result_By_Time;

}

export function sortByDuration(data, order, itinerariesValue) {
    let result_By_Duration = data;
    result_By_Duration.sort((a, b) => {
        let duration_Of_A = a.itineraries[itinerariesValue].duration.split('T')[1].match(/\d+/g);
        let duration_Of_B = b.itineraries[itinerariesValue].duration.split('T')[1].match(/\d+/g);
        let hour_Of_A = Number(duration_Of_A[0]);
        let hour_Of_B = Number(duration_Of_B[0]);
        let minutes_Of_A = Number(duration_Of_A[1]);
        let minutes_Of_B = Number(duration_Of_B[1]);
        let result = timeCompare(hour_Of_A, hour_Of_B, minutes_Of_A, minutes_Of_B, order);
        if (result != 0) {
            return result;
        } else {
            return priceCompare(Number(a.price.total), Number(b.price.total), order);
        }
    });
    // if (result_By_Duration.length > 50) {
    //     result_By_Duration = result_By_Duration.slice(0, 50);
    // }
    // result_By_Duration.forEach(element => {
    //     console.log(element.price.total+" "+element.itineraries[itinerariesValue].duration);
    // });
    console.log("Duration");
    console.log(result_By_Duration);
    return result_By_Duration;
}

function priceCompare(price_A, price_B, order) {
    if (order == "ascending") {
        if (price_A > price_B) {
            return 1;
        } else if (price_A < price_B) {
            return -1;
        } else {
            return 0;
        }
    } else {
        if (price_A > price_B) {
            return -1;
        } else if (price_A < price_B) {
            return 1;
        } else {
            return 0;
        }
    }

}

function timeCompare(hour_Of_A, hour_Of_B, minutes_Of_A, minutes_Of_B, order) {
    if (order == "ascending") {
        if (hour_Of_A < hour_Of_B) {
            return 1;
        } else if (hour_Of_A > hour_Of_B) {
            return -1;
        } else {
            if (minutes_Of_A < minutes_Of_B) {
                return 1;
            } else if (minutes_Of_A > minutes_Of_B) {
                return -1;
            } else {
                return 0;
            }
        }
    } else {
        if (hour_Of_A > hour_Of_B) {
            return 1;
        } else if (hour_Of_A < hour_Of_B) {
            return -1;
        } else {
            if (minutes_Of_A > minutes_Of_B) {
                return 1;
            } else if (minutes_Of_A < minutes_Of_B) {
                return -1;
            } else {
                return 0;
            }
        }
    }

}


 export function appliedFilter(result) {
    var numberOfStopsFromSource = {};
    var DepartureFromSourceAsPerTime = {};
    var ArrivalAtDestinationAsPerTime = {};
    var Airline = {};
    
    for (let i = 0; i < result.length; i++) {
        let value = result[i];
        let airlineCode = value.validatingAirlineCodes;
        let price = value.price.total;
        let numberOfStops=value.itineraries[0].segments.length;
        let arrivalTime=value.itineraries[0].segments[numberOfStops - 1].arrival.at.split('T')[1].match(/\d+/g);
        let departureTime=value.itineraries[0].segments[0].departure.at.split('T')[1].match(/\d+/g);
        if (Airline[airlineCode]) {
            Airline[airlineCode]['count'] = Airline[airlineCode]['count'] + 1;
            Airline[airlineCode]['result'].push(value);
            Airline[airlineCode]['minimumPrice'] = Math.min(Number(Airline[airlineCode]['minimumPrice']), Number(price));
        } else {
            Airline[airlineCode]={};
            Airline[airlineCode] = { 'count': 1, 'result': [value], 'minimumPrice': price };
        }

        if(numberOfStopsFromSource[numberOfStops]){
            numberOfStopsFromSource[numberOfStops]['count']=Number(numberOfStopsFromSource[numberOfStops]['count'])+1;
            numberOfStopsFromSource[numberOfStops]['minimumPrice']=Math.min(Number(numberOfStopsFromSource[numberOfStops]['minimumPrice']),price);
            numberOfStopsFromSource[numberOfStops]['result'].push(value);
        }else{
            numberOfStopsFromSource[numberOfStops]={'count':1,'minimumPrice': price,'result':[value]};
        }
        DepartureFromSourceAsPerTime =timeFilter(value,departureTime,price,DepartureFromSourceAsPerTime);
        ArrivalAtDestinationAsPerTime =timeFilter(value,arrivalTime,price,ArrivalAtDestinationAsPerTime);
    }

    return {'numberOfStopsFromSource':numberOfStopsFromSource,'DepartureFromSourceAsPerTime':DepartureFromSourceAsPerTime,'ArrivalAtDestinationAsPerTime':ArrivalAtDestinationAsPerTime,'Airline':Airline}
    
}


function timeFilter(result,time,price,filterTimeStoringResult){
    if(Number(time[0])>=6 && Number(time[0])<=12 && Number(time[1])<=0 && Number(time[2])<=0 ){
        if((Number(time[0])==12 && Number(time[1])<=0 && Number(time[2])<=0) ||(Number(time[0])<12)) {
            if(filterTimeStoringResult.hasOwnProperty('6AM-12PM')){
                filterTimeStoringResult['6AM-12PM']['result'].push(result);
                //console.log(filterTimeStoringResult);
                filterTimeStoringResult['6AM-12PM']['price'] = Math.min(Number(filterTimeStoringResult['6AM-12PM']['price']), Number(price));
            }else{
                filterTimeStoringResult['6AM-12PM']={'result':[result],'price':price};
            }
        }
    }else if(Number(time[0])<6 && Number(time[0])>=0){
        if(filterTimeStoringResult.hasOwnProperty('0AM-6AM')){
            filterTimeStoringResult['0AM-6AM']['result'].push(result);
            //console.log(filterTimeStoringResult);
            filterTimeStoringResult['0AM-6AM']['price']= Math.min(Number(filterTimeStoringResult['0AM-6AM']['price']), Number(price));
        }else{ 
            filterTimeStoringResult['0AM-6AM']={'result':[result],'price':price};
        }
    }else if(Number(time[0])>=12 && Number(time[1])>0 && Number(time[2])>0 && Number(time[0])<18){
        if(filterTimeStoringResult.hasOwnProperty('12PM-6PM')){
            //console.log(filterTimeStoringResult);
           filterTimeStoringResult['12PM-6PM']['result'].push(result);
            filterTimeStoringResult['12PM-6PM']['price'] = Math.min(Number(filterTimeStoringResult['12PM-6PM']['price']), Number(price));
        }else{
            filterTimeStoringResult['12PM-6PM']={'result':[result],'price':price};
        }
    }else{
        if(filterTimeStoringResult.hasOwnProperty('6PM-12AM')){
            //console.log(filterTimeStoringResult);
           filterTimeStoringResult['6PM-12AM']['result'].push(result);
            filterTimeStoringResult['6PM-12AM']['price'] = Math.min(Number(filterTimeStoringResult['6PM-12AM']['price']), Number(price));
        }else{
            filterTimeStoringResult['6PM-12AM']={'result':[result],'price':price};
        }
    }
    return filterTimeStoringResult;

}

