const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongodbUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(mongodbUrl, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to the database!!!');
    }

    const db = client.db(databaseName);

    // db.collection('users').insertOne(
    //     {
    //         name: 'Istiak',
    //         age: 21,
    //     },
    //     (err, result) => {
    //         if (err) {
    //             return console.log('Error!');
    //         }
    //         console.log(result);
    //     }
    // );

    // db.collection('users').insertMany(
    //     [
    //         {
    //             name: 'Toha',
    //             age: 21,
    //         },
    //         {
    //             name: 'Arif',
    //             age: 21,
    //         },
    //     ],
    //     (error, result) => {
    //         console.log(result.ops);
    //     }
    // );

    db.collection('users').findOne({ name: 'Istiak' }, (err, result) => {
        if (err) {
            return console.log(err);
        }

        console.log(result);
    });

    db.collection('users')
        .find({})
        .toArray((err, result) => {
            if (err) {
                return console.log(err);
            }

            console.log(result);
        });
});
