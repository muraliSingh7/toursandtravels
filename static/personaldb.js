export function filteringDatabase(tripResult) {
  let db;
  let filterResult = {};
  const request = indexedDB.open("TripResult", 0);

  request.onerror = (event) => {
    console.log("Error in Adding Database");
  }

  request.onsuccess = (event) => {
    db = event.target.result;

    const objectStore = db.createObjectStore("Trip", { keyPath: "id" });
    objectStore.createIndex("numberOfStopsFromSource", "numberOfStopsFromSource[0]", { unique: false });
    objectStore.createIndex("DepartureTimeFromSource", "departureTimeFromSource[0]", { unique: false });
    objectStore.createIndex("ArrivalTimeToDestination", "arrivalTimeToDestination[0]", { unique: false });
    objectStore.createIndex("Duration", "duration[0]", { unique: false });
    objectStore.createIndex("Price", "price", { unique: false });
    objectStore.createIndex("Airline", "Airline", { unique: false });

    objectStore.transaction.oncomplete = (event) => {
      const tripResultObjectStore = db.transaction("Trip", "readwrite").objectStore("Trip");
      tripResult.forEach((trip) => {
        tripResultObjectStore.add(trip);
      });
    }
    filterResult['price']=sort('price','Trip',"ascending");
  };
}

function countOfIndividualElementFromIndex(indexName, tableName, countResult) {
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
  console.log(countResult);
  return countResult;
}

function sort(indexName,tableName,order){
  let sortresult;
  let index = db.transaction(tableName, "readOnly").objectStore(tableName).index(indexName);
  let request;
  if(order=="ascending"){
    request=index.openCursor(null,'next');//ascending
  }else{
    request=index.openCursor(null,'prev');//descending
  }
  request.onsuccess=(event)=>{
    const cursor=event.target.result;
    if(cursor){
      sortresult.push(cursor.value);
      cursor.continue;
    }
  }
  console.log(sortresult);
  return sortresult;
}