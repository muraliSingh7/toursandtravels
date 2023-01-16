// request.onupgradeneeded = (event) => {
    //   this.db = event.target.result;

    //   // Create an objectStore to hold information about our customers. We're
    //   // going to use "ssn" as our key path because it's guaranteed to be
    //   // unique - or at least that's what I was told during the kickoff meeting.
    //   const objectStore = this.db.createObjectStore("customers", { keyPath: "ssn" });

    //   // Create an index to search customers by name. We may have duplicates
    //   // so we can't use a unique index.
    //   objectStore.createIndex("name", "name", { unique: false });

    //   // Create an index to search customers by email. We want to ensure that
    //   // no two customers have the same email, so use a unique index.
    //   objectStore.createIndex("email", "email", { unique: true });

    //   // Use transaction oncomplete to make sure the objectStore creation is
    //   // finished before adding data into it.

    // }