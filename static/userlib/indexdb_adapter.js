export class DB {
  constructor() {
    this.db;
    this.upgradeRequest;
  }

  connect() {
    const request = indexedDB.open("database");
    this.upgradeRequest = request;


    request.onerror = (event) => {
      console.error("Error Connecting To Database!!", event);
    };


    request.onsuccess = (event) => {
      this.db = event.target.result;
    };


  }

  createTable(tableName, primaryKey) {
    const objectStore = this.db.createObjectStore(tableName, { keyPath: primaryKey });
    console.log("IndexDb has created the table " + tableName);
  }


  registerUpgradeCallBack(callback) {
    this.upgradeRequest.onupgradeneeded = (event) => {
      callback();
    }
  }

  createIndex(tableName, indexName, uniqueValue) {
    const table = this.db.transaction(tableName, "readwrite").objectStore(tableName);
    table.createIndex(indexName, indexName, { unique: uniqueValue });
  }

  insert(tableName, value) {
    const table = this.db.transaction(tableName, "readwrite").objectStore(tableName);
    table.add(value);
  }


  select(tableName, indexName) {


  }

  count(tableName, indexName) {//countOfIndividualElementFromIndex
    let countResult={}
    let index = db.transaction(tableName, "readOnly").objectStore(tableName).index(indexName);
    index.openCursor().onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        if (!countResult[cursor.value]) {
          countResult[cursor.key] = { 'count': 1, 'data': [cursor.value] };
        } else {
          countResult[cursor.key]['count']++;
          countResult[cursor.key]['data'].push(cursor.value);
        }
        cursor.continue;
      }
    }
    return countResult;
  }

  sort(tableName, indexName, order) {
    let sortresult;
    let index = this.db.transaction(tableName, "readOnly").objectStore(tableName).index(indexName);
    let request;
    if (order == "ascending") {
      request = index.openCursor(null, 'next');//ascending
    } else {
      request = index.openCursor(null, 'prev');//descending
    }
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        sortresult.push(cursor.value);
        cursor.continue;
      }
    }
    return sortresult;
  }
}
