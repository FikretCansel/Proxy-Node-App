const {MongoClient} = require('mongodb');

let _db;

exports.mongoConnect=(callback, mongoDbConnectionString)=>{
    MongoClient.connect(mongoDbConnectionString)
    .then((client)=>{
        console.log("Connected MongoDb");
        callback(client);
        _db=client.db();
    }).catch((err)=>console.log("Detected error. "+err));
}

exports.getDb=()=> {
    if(_db){
        return _db;
    }
    
    console.log("No database");
    throw "No database";
}