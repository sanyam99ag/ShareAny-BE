require('dotenv').config();

const mongoose = require('mongoose')

function connectDB() {
    // Database Connection
    // mongoose.connect(uri, options).then
    mongoose.connect(
        process.env.MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        // The connect() function also returns a promise. 
    ).then(
        () => console.log('Database connected')
    ).catch(
        err => console.log("Database Connectivity Error:- " + err)
    );

}

module.exports = connectDB;