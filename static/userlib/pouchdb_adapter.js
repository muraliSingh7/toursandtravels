export class DB {
    constructor(databaseName) {
        this.databaseName = databaseName;
        this.db = new PouchDB(this.databaseName,{skip_setup:true});
    }

    async connect() {
        var newDatabaseCreated=false;
        try{
            await this.db.info();
        }catch(error){
            newDatabaseCreated=true;
        }

        if(!newDatabaseCreated){
            await this.db.destroy();
        }
        
        this.db=new PouchDB(this.databaseName);
        
        // var name=(new Date()).toString();
        // this.db = new PouchDB(name);
        //   this.db.info()(()=>{
        //     console.log()
        //   })
        console.log(await this.db.info())
    }


    async createIndex(fields) {
        let result = await this.db.createIndex({ index: { fields: fields } });
        return result;
        //console.log(result);
    }

    async insert(doc) {
        await this.db.post(doc);
    }

    async bulkDocs(docs) {
        await this.db.bulkDocs(docs);
    }

    async getIndex() {
        return await this.db.getIndexes();
    }


    async sort(selectorParameters,sortParameters,indexName) {
        let queryObjectSelector = [selectorParameters];
        let sortBy = [];
        
        Object.keys(sortParameters).forEach((parameter)=>{
            sortBy.push({});
            sortBy[sortBy.length-1][parameter] = sortParameters[parameter]==true ? 'desc' : 'asc';
        });
        // console.log(queryObjectSelector);
        // console.log(sortBy);
        var query={
            selector: {$and:queryObjectSelector},
            sort: sortBy,
            use_index:indexName,
        }
        console.log(query);
        return await this.db.find(query);
    }

    async map(map){
        return await this.db.query(map);
    }

    async find(parameter){
        return await this.db.find(parameter);
    }
}
