const mongoose = require('mongoose');
require('dotenv').config({ path:'variables.env'});

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        })
        console.log('DB connected')
    } catch (error) {
        console.log(error);
        process.exit(1) // if there is a error, stop the app
    }
}
module.exports = connectDB;