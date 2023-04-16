export class DB {
    constructor(databaseName) {
        this.databaseName=databaseName;
        this.fdb = new ForerunnerDB();
        this.db=null;
        this.collection=null;
    }

    async connect() {
        this.db=this.fdb.db(this.databaseName);
        this.db.debug(true);
        console.log(this.db);
        // var name=(new Date()).toString();
        // this.db = new PouchDB(name);
        //   this.db.info()(()=>{
        //     console.log()
        //   })
    }

    async createCollection(){
        this.collection = await this.db.collection("tripResult");
        console.log(this.collection);
    }


    async createIndex(fields) {
        let result = await this.collection.ensureIndex({ index: { fields: fields } });
        return result;
        //console.log(result);
    }

    async insert(doc) {
        await this.collection.insert(doc);
    }

    async getIndex() {
        return await this.db.getIndexes();
    }

    async map(map){
        return await this.db.query(map);
    }

    async find(parameter){
        return await this.collection.find(parameter).sort(parameter['$orderBy']);
    }

}
