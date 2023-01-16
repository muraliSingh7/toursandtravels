import { getTripType } from "../commonfunctions/triptype.js";
import { DB } from "../userlib/pouchdb_adapter.js";
export class FilterCache {
    constructor(tripCount) {//tripCount,results
        this.init(tripCount)//tripCount,results
    }

    async init(tripCount) {//tripCount,results
        this.databaseForTrip = new Array(tripCount - 1);
        // if(tripCount==2 && getTripType()=="Round-Trip"){
        //     this.databaseForTrip[0] = new DB("Trip0");
        //     await this.databaseForTrip[0].connect();
        //     await this.databaseForTrip[0].createIndex(['numberOfStopsFromSourceFromTrip0',
        //    'departureFromSourceAsPerTimeFromTrip0',
        //    'arrivalAtDestinationAsPerTimeFromTrip0',
        //    'totalDurationFromTrip0','numberOfStopsFromSourceFromTrip1',
        //    'departureFromSourceAsPerTimeFromTrip1',
        //    'arrivalAtDestinationAsPerTimeFromTrip1',
        //    'totalDurationFromTrip1','price',
        //     'currency','airline']);
        //     await this.databaseForTrip[0].getIndex();
        //     await this.databaseForTrip[0].bulkDocs(results[0]);
        // }else{
        //     for(let i=0;i<tripCount;i++){
        //         var indexName=['numberOfStopsFromSourceFromTrip'+i,
        //         'departureFromSourceAsPerTimeFromTrip'+i,
        //         'arrivalAtDestinationAsPerTimeFromTrip'+i,
        //         'totalDurationFromTrip'+i,'price',
        //         'currency','airline'];
        //         this.databaseForTrip[i] = new DB("Trip"+i);
        //         await this.databaseForTrip[i].connect();
        //         await this.databaseForTrip[i].createIndex(indexName);
        //         await this.databaseForTrip[i].getIndex();
        //         await this.databaseForTrip[i].bulkDocs(results[i]);
        //     }
        // }
        this.databaseForTrip[0] = new DB("Trip0");
        console.log(await this.databaseForTrip[0].getIndex());
        this.indexCreatedName = (await this.databaseForTrip[0].getIndex())['indexes'][1]['name'];
        console.log(this.indexCreatedName);
        await this.countofNumberofStops(0, 0);
        await this.random();
        // results.forEach(result => {
        //     this.db.insert(result);
        // });
    }

    async sort(databaseNumber, filterParameters, sortByParameters, indexName) {
        console.log(indexName);
        return await this.databaseForTrip[databaseNumber].sort(filterParameters, sortByParameters, indexName);
    }

    async countofNumberofStops(databaseNumber, tripNumber) {
        let countResult = {};
        let filterParameters = {};
        filterParameters['numberOfStopsFromSourceFromTrip' + tripNumber] = { $gte: 0 }
        filterParameters['price'] = { $gt: 0 };


        let sortParameters = {};
        // sortParameters['numberOfStopsFromSourceFromTrip'+tripNumber]=false;
        sortParameters['price'] = false;

        let indexCreation = await this.databaseForTrip[databaseNumber].createIndex(['price', 'numberOfStopsFromSourceFromTrip' + tripNumber]);
        let indexOfNumberOfStopsAndPriceName = indexCreation['name'];


        let result = await this.sort(databaseNumber, filterParameters, sortParameters, indexOfNumberOfStopsAndPriceName);
        //console.log(result);


        if (result['docs'].length > 1) {
            let min = result['docs'][0]['numberOfStopsFromSourceFromTrip' + tripNumber];
            let max = result['docs'][result.docs.length - 1]['numberOfStopsFromSourceFromTrip' + tripNumber];
            // console.log(min+" "+max);
            for (let i = min; i <= max; i++) {
                filterParameters['numberOfStopsFromSourceFromTrip' + tripNumber] = { $eq: i };
                let filterResult = await this.sort(databaseNumber, filterParameters, sortParameters,
                    indexOfNumberOfStopsAndPriceName);
                console.log(filterResult);
                countResult[i] = { 'count': filterResult.docs.length - 1, 'minimumPrice': filterResult.docs[0]['price'] }
            }
        }


        console.log(countResult);
        //return countResult;
    }

    async getPriceAsPerTime(databaseNumber, tripNumber, arrivalOrDestination, minTime, maxTime) {
        let filterParameters = {};
        let sortParameters = {};

        if (arrivalOrDestination) {
            filterParameters['arrivalAtDestinationAsPerTimeFromTrip' + tripNumber] = { $gte: minTime };
            filterParameters['arrivalAtDestinationAsPerTimeFromTrip' + tripNumber] = { $lt: maxTime };
            sortParameters['arrivalAtDestinationAsPerTimeFromTrip' + tripNumber] = false;
        } else {
            filterParameters['departureFromSourceAsPerTimeFromTrip' + tripNumber] = { $gte: minTime };
            filterParameters['departureFromSourceAsPerTimeFromTrip' + tripNumber] = { $lt: maxTime };
            sortParameters['departureFromSourceAsPerTimeFromTrip' + tripNumber] = false;
        }
        filterParameters['price'] = { $gt: 0 };
        sortParameters['price'] = false;


        let indexCreation = await this.databaseForTrip[databaseNumber].createIndex(Object.keys(sortParameters));
        let priceAsPerTime = indexCreation['name'];


        let result = await this.sort(databaseNumber, filterParameters, sortParameters, priceAsPerTime);
        // console.log(result);


        if (result['docs'].length > 0) {
            console.log(result.docs[0]['price']);
            return result.docs[0]['price'];
        } else {
            console.log(0);
            return 0;
        }
    }


    async getIndexName(fields) {
        let index = (await this.db.getIndex())['indexes'];
        for (let i = 0; i < index.total_rows; i++) {
            let indexFields = index[i].def.fields;
            let flag = 0;
            let indexName;
            if (indexFields.length == fields.length) {
                Object.keys(indexFields).every((parameter, currentPosition) => {
                    if (parameterfields[currentPosition] != parameter) {
                        flag = 1;
                        indexName = '';
                    } else {
                        indexName = index[i].def.name;
                    }
                });

                if (flag == 0) {
                    return indexName;
                }
            }
        }
    }

    async filtering(filterBy, sortBy) {
        let filterParameters = {};
        let sortParameters = {};
        Object.keys(filterBy).forEach((filter) => {
            if (filterBy[filter].length == 1) {
                filterParameters[filter] = { $eq: i };
            } else if (filterBy[filter].length > 1) {
                filterParameters[filter] = { $lte: i };
            }
        })
        filterParameters['price'] = { $gte: 0 };
        sortParameters['price'] = false;


        let indexCreation = await this.databaseForTrip[databaseNumber].createIndex(Object.keys(sortParameters));
        let priceAsPerTime = indexCreation['name'];


        let result = await this.sort(databaseNumber, filterParameters, sortParameters, priceAsPerTime);
        // console.log(result);


        if (result['docs'].length > 0) {
            console.log(result.docs[0]['price']);
            return result.docs[0]['price'];
        } else {
            console.log(0);
            return 0;
        }
    }

    async random() {
        let indexCreation = await this.databaseForTrip[0].createIndex(['arrivalAtDestinationAsPerTimeFromTrip0', 'numberOfStopsFromSourceFromTrip0', 'price']);
        let indexName = indexCreation['name'];
        console.log(indexCreation);
        let result = await this.databaseForTrip[0].find({
            selector: {
                $and: [
                    { 'departureFromSourceAsPerTimeFromTrip0': { $gt: null } },
                    { 'numberOfStopsFromSourceFromTrip0': { $gt: null } },
                    { 'price': { gt: null } },
                    {
                        $or: [
                            {
                                'departureFromSourceAsPerTimeFromTrip0': [{ gte: 0, lte: 21600 }]
                            },
                            {
                                'departureFromSourceAsPerTimeFromTrip0': [{ gte: 21600, lte: 64800 }]
                            }]
                    },
                    {
                        'numberOfStopsFromSourceFromTrip0': { gte: 0 }
                    }, {
                        'price': { gte: 0 }
                    }],
            },
            sort: [{ 'departureFromSourceAsPerTimeFromTrip0': 'asc', 'numberOfStopsFromSourceFromTrip0': 'asc', 'price': 'asc' }],
            use_index: indexName,
        })

        console.log(result.docs);
    }
}