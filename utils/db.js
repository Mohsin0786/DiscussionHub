require('dotenv').config();
const mongoose = require('mongoose');

const db_uri = process.env.MONGO_URI;


mongoose.set("strictQuery",true,"useNewUrlParse",true)

const connectDb = async()=>{

    try {
        await mongoose.connect(db_uri);
        console.log("Connected to DB")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

const disconnectDb = async()=>{

    try {
        await mongoose.disconnect();
        console.log("Db Disconnected......")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = {connectDb, disconnectDb};


