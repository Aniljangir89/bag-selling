const mongoose = require('mongoose');

mongoose.set("strictQuery", false);
const connectToDB = async () => {
    try {
        const connection= await mongoose.connect('mongodb://127.0.0.1:27017/scatch');
        if(connection) console.log("connected to db");
        
    } catch (error) {
        console.log("not connected");
        process.exit(1);
    }
}

module.exports= connectToDB;