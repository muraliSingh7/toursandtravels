export async function processingData(result) {
    let flightResult = [];
    // console.log(Object.keys(result).length);

    
    for (let responseNumber = 0; responseNumber < Object.keys(result).length; responseNumber++) {
        let flightDetails = result['response' + responseNumber];
        console.log(flightDetails);
        flightResult.push([]);
        for (let flightResultNumber = 0; flightResultNumber < flightDetails.length; flightResultNumber++) {
            flightResult[responseNumber].push({});


            let flight = flightResult[responseNumber][flightResultNumber];


            flight['price'] = Number(flightDetails[flightResultNumber]["price"]["grandTotal"]);
            flight['currency'] = flightDetails[flightResultNumber]["price"]["currency"];
            flight['airline'] = flightDetails[flightResultNumber]['validatingAirlineCodes'][0];


            for (let tripNumber = 0; tripNumber < flightDetails[flightResultNumber]['itineraries'].length; tripNumber++) {
                let itineraries = flightDetails[flightResultNumber]['itineraries'][tripNumber];
                
                
                flight['numberOfStopsFromSourceFromTrip'+tripNumber] = itineraries['segments'].length - 1;
                flight['durationFromTrip'+tripNumber] = itineraries["duration"].split('PT')[1];
                flight['totalDurationFromTrip'+tripNumber] = totalduration(itineraries["duration"].split('PT')[1]);
                

                for (let k = 0; k < itineraries['segments'].length; k++) {
                    
                    if (k == 0) {
                        let departure = itineraries['segments'][k]['departure'];
                        flight['sourceFromTrip'+tripNumber] = departure['iataCode'];
                        flight['departureFromSourceAsPerTimeFromTrip'+tripNumber] = departure['at'].split('T')[1];
                        flight['departureFromSourceAsPerTimeInSecondsFromTrip'+tripNumber]=convertTimeSeconds(departure['at'].split('T')[1].match(/\d+/g));
                    }
                    
                    
                    flight['numberOfStopsFromSourceFromTrip'+tripNumber] += itineraries['segments'][k]['numberOfStops'];
                    
                    
                    if (k == itineraries['segments'].length - 1) {
                        let arrival = itineraries['segments'][k]['arrival'];
                        flight['destinationFromTrip'+tripNumber] = arrival['iataCode'];
                        flight['arrivalAtDestinationAsPerTimeFromTrip'+tripNumber] = arrival['at'].split('T')[1];
                        flight['arrivalAtDestinationAsPerTimeInSecondsFromTrip'+tripNumber]=convertTimeSeconds(arrival['at'].split('T')[1].match(/\d+/g));
                    }
                }
            }
        }
    }


    return flightResult;
}


function totalduration(durationInTermsOfHoursMinutesSeconds) {
    let duration = 0;
    let positionOfHourInDuration = durationInTermsOfHoursMinutesSeconds.indexOf('H');
    let positionOfMinutesInDuration = durationInTermsOfHoursMinutesSeconds.indexOf('M');
    let positionOfSecondsInDuration = durationInTermsOfHoursMinutesSeconds.indexOf('S');

    if (positionOfHourInDuration != -1) {
        duration = Number(durationInTermsOfHoursMinutesSeconds.slice(0, positionOfHourInDuration)) * 60 * 60;
    }


    if (positionOfMinutesInDuration != -1) {
        duration += Number(durationInTermsOfHoursMinutesSeconds.slice(positionOfHourInDuration + 1, positionOfMinutesInDuration)) * 60;
    }


    if (positionOfHourInDuration != -1) {
        duration += Number(durationInTermsOfHoursMinutesSeconds.slice(positionOfMinutesInDuration, positionOfSecondsInDuration - 1));
    }

    return duration;
}

function convertTimeSeconds(time){
    let result=0;
    time.forEach((element,index)=>{
        result+=(Number(element)*Math.pow(60,time.length-1-index));
    })
    return result;
}