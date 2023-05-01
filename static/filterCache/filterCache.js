import { getTripType } from "../commonfunctions/triptype.js";
import { DB } from "../userlib/forerrunnerdb_adapter.js";
export class FilterCache {
   
    constructor(tripNumber, results) {//tripCount,results
        results = (results || []);
        this.init(tripNumber, results)//tripCount,results
    }



    async init(tripNumber, results) {//tripCount,results
        this.databaseForTrip = new DB("Trip" + tripNumber);
        await this.databaseForTrip.connect();
        await this.databaseForTrip.createCollection();
        await this.databaseForTrip.insert(results);
    }



    async getFlightCountAndMinimumPriceByStoppages(tripNumber) {

        let stoppageDetails = {};
        let filterParameters = [{}, {}];
        filterParameters[0]['numberOfStopsFromSourceFromTrip' + tripNumber] = { $gte: 0 }
        filterParameters[1]['price'] = { $gt: 0 };
        let sortParameters = {};
        sortParameters['numberOfStopsFromSourceFromTrip' + tripNumber] = 1;


        let result = await this.databaseForTrip.find({ $and: filterParameters }, { $orderBy: sortParameters });
        console.log(result);
        // result.forEach((data)=>{
        //     console.log(data);
        // })


        if (result.length > 1) {
            let minimumStoppages = result[0]['numberOfStopsFromSourceFromTrip' + tripNumber];
            let maximumStoppages = result[result.length - 1]['numberOfStopsFromSourceFromTrip' + tripNumber];
            // console.log(min+" "+max);
        
            for (let i = minimumStoppages; i <= maximumStoppages; i++) {
            
                filterParameters[0]['numberOfStopsFromSourceFromTrip' + tripNumber] = { $eq: i };
                sortParameters['price'] = 1;

                let filterResult = await this.databaseForTrip.find({ $and: filterParameters }, { $orderBy: sortParameters });
                // console.log(filterResult);
                
                stoppageDetails[i] = { 'numberOfFlights': filterResult.length - 1, 'minimumPrice': filterResult[0]['price'] }

            }

        }


        console.log(stoppageDetails);
        return stoppageDetails;

    }



    async getMinimumPriceOfFlightAsPerTime(tripNumber, arrivalOrDestination, minimumTimeInSeconds, maximumTimeInSeconds) {
     
        let filterParameters = [{}, {}];
        let sortParameters = {};

        if (arrivalOrDestination == "arrival") {
            filterParameters[0]['arrivalAtDestinationAsPerTimeInSecondsFromTrip' + tripNumber] = { $gte: minimumTimeInSeconds, $lt: maximumTimeInSeconds };
            sortParameters['arrivalAtDestinationAsPerTimeInSecondsFromTrip' + tripNumber] = 1;
        
        } else {
            filterParameters[0]['departureFromSourceAsPerTimeInSecondsFromTrip' + tripNumber] = { $gte: minimumTimeInSeconds, $lt: maximumTimeInSeconds };
            sortParameters['departureFromSourceAsPerTimeInSecondsFromTrip' + tripNumber] = 1;
     
        }


        filterParameters[1]['price'] = { $gt: 0 };
        sortParameters['price'] = 1;
        // console.log({ $and: filterParameters }, { $orderBy: sortParameters });
        
        
        let flightsSortedByPrice = await this.databaseForTrip.find({ $and: filterParameters }, { $orderBy: sortParameters });
        // console.log(result);


        if (flightsSortedByPrice.length > 0) {
            // console.log(result[0]['price']);
            return flightsSortedByPrice[0]['price'];

        } else {
            // console.log(0);
            return 0;

        }

    }



    async getFlightStatisticsByAirlines() {
        let airlineStats = {}
        let uniqueAirlines = await this.databaseForTrip.find({ $distinct: { 'airline': 1 } });
        // console.log(uniqueAirlines);


        uniqueAirlines.forEach(async (airlineInformation) => {

            // console.log(data.airline);
            let filterParameters = [{ 'airline': { $eq: airlineInformation.airline } }, { 'price': { $gt: 0 } }];
            let sortParameters = { 'airline': 1, 'price': 1 };
            
            let flightsSortedByPriceForAirline = await this.databaseForTrip.find({ $and: filterParameters }, { $orderBy: sortParameters });
            // console.log({ $and: filterParameters }, { $orderBy: sortParameters });
            // console.log(result);
            
            if (flightsSortedByPriceForAirline.length > 0) {
                airlineStats[airlineInformation.airline] = { 'numberOfFlights': flightsSortedByPriceForAirline.length, 'minimumPrice': flightsSortedByPriceForAirline[0].price };
            }
        
        });


        // console.log(airlineStats);
        return airlineStats;
    }


    async filtering(filterBy) {
        let filterParameters = [];
        let sortParameters = {};
        Object.keys(filterBy).forEach((filter) => {
            // if (filter == "sort") {
            //     filterBy['sort'].forEach((value) => {
            //         let obj={};
            //         if (value.includes("departure")) {
                        
            //             obj["departureFromSourceAsPerTimeInSecondsFromTrip" + value.slice(value.length - 2,value.length - 1)]={$gte:0}
            //             sortParameters["departureFromSourceAsPerTimeInSecondsFromTrip" + value.slice(value.length - 2,value.length - 1)] = value.slice(value.length - 1) == 0 ? -1 : 1;
            //         } else if (value.includes("arrival")) {
            //             obj["arrivalAtDestinationAsPerTimeInSecondsFromTrip" + value.slice(value.length - 2,value.length - 1)]={$gte:0}
            //             sortParameters["arrivalAtDestinationAsPerTimeInSecondsFromTrip" + value.slice(value.length - 2,value.length - 1)] = value.slice(value.length - 1) == 0 ? -1 : 1;
            //         } else if(value.includes('duration')){
            //             obj["totalDurationFromTrip"+ value.slice(value.length - 2,value.length - 1)]={$gte:0}
            //             sortParameters["totalDurationFromTrip"+value.slice(value.length - 2,value.length - 1)] = value.slice(value.length - 1) == 0 ? -1 : 1;
            //         }else{
            //             obj["price"]={$gte:0}
            //             sortParameters[value.slice(0, value.length - 1)] = value.slice(value.length - 1) == 0 ? -1 : 1;
            //         }
            //         filterParameters.push(obj);
            //     });
    
            // }
            if (filter.includes("numberOfStopsFromSource") || filter.includes("airline")) {
                let obj = {};
                if (filterBy[filter].length > 0) {
                    if (filterBy[filter].length == 1) {
                        obj[filter] = { $eq: filterBy[filter][0] };
                        filterParameters.push(obj);
                        //filterParameters=filterParameters+"{"+filter+":{$eq:"+filterBy[filter][0]+"}},"
                    } else {
                        //filterParameters=filterParameters+"{"+filter+":{$in:"+filterBy[filter]+"}},"
                        obj[filter] = { $in: filterBy[filter] };
                        filterParameters.push(obj);
                    }
                }
            } else if (filter.includes("departure") || filter.includes("arrival")) {
                let obj = {};
                if (filterBy[filter].length > 0) {
                    if (filterBy[filter].length == 1) {
                        if (filter.includes("departure")) {
                            obj["departureFromSourceAsPerTimeInSecondsFromTrip" + filter.substring(filter.length - 1)] = { $gte: filterBy[filter][0][0], $lt: filterBy[filter][0][1] }

                        } else {
                            obj["arrivalAtDestinationAsPerTimeInSecondsFromTrip" + filter.substring(filter.length - 1)] = { $gte: filterBy[filter][0][0], $lt: filterBy[filter][0][1] }
                            
                        }
                    } else {
                        let values = [];
                        filterBy[filter].forEach((value) => {
                            values.push({ $gte: value[0], $lt: value[1] });
                        });

                        if (filter.includes("departure")) {
                            obj["departureFromSourceAsPerTimeInSecondsFromTrip" + filter.substring(filter.length - 1)] = { $or: values };
                        } else {
                            obj["arrivalAtDestinationAsPerTimeInSecondsFromTrip" + filter.substring(filter.length - 1)] = { $or: values };
                        }
                    }
                    filterParameters.push(obj);
                }
            }
        });
        console.log({ $and: filterParameters });
        let result = await this.databaseForTrip.find({ $and: filterParameters });
        console.log(filterBy['sort']);
        if(filterBy['sort']) {
            filterBy['sort'].forEach((value) => {
                if (value.includes("departure")) {
                    let parameter="departureFromSourceAsPerTimeInSecondsFromTrip" + value.slice(value.length - 2,value.length - 1);
                    result.sort((a,b)=>{
                        return a[parameter]-b[parameter];
                    });
                    if(value.slice(value.length-1)==0){
                        result.reverse();
                    }
                } else if (value.includes("arrival")) {
                    let parameter="arrivalAtDestinationAsPerTimeInSecondsFromTrip"  + value.slice(value.length - 2,value.length - 1);
                    result.sort((a,b)=>{
                        return a[parameter]-b[parameter];
                    });
                    if(value.slice(value.length-1)==0){
                        result.reverse();
                    }
                } else if(value.includes('duration')){
                    let parameter="totalDurationFromTrip"+ value.slice(value.length - 2,value.length - 1);
                    result.sort((a,b)=>{
                        return a[parameter]-b[parameter];
                    });
                    if(value.slice(value.length-1)==0){
                        result.reverse();
                    }
                }else{
                    result.sort((a,b)=>{
                        return a["price"]-b["price"];
                    });
                    if(value.slice(value.length-1)==0){
                        result.reverse();
                    }
                }
            });

        }
        console.log(result);
        return result;
    }
}