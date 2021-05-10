const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('./src/db/mongoose');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'facebook'

MongoClient.connect(connectionURL, {useNewUrlParser:true, useUnifiedTopology: true}, (error,client) => {
    if(error) {
        return console.log("unable to connect to database");
    }
    console.log("connected correctly");

    const db = client.db(databaseName);

    db.collection('users').insertOne({
        name: "Atalia",
        age: 30
    })
})