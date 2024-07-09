const mongoose = require('mongoose');
const {MONGODB_CONNECTION_STRING} = require('../config/index');

const dbConnect = async ()=>{
    try {

       const conn = await mongoose.connect(MONGODB_CONNECTION_STRING);
       console.log(`Database has been connected to host ${conn.connection.host}`)
        
    } catch (error) {
        console.log(`and the error is ${error} `);
        
    }
}

module.exports = dbConnect;