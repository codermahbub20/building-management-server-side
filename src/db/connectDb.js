// const mongoose = require("mongoose")
// require('dotenv').config()

// const getConnectionString = () =>{
//     let connectionUri;
//     connectionUri = process.env.DATABASE_LOCAL
//     connectionUri = connectionUri.replace('<username>',process.env.DB_USER)
//     connectionUri = connectionUri.replace('<password>',process.env.DB_PASS)

//     return connectionUri;
// }

// const connectDb = async () =>{
//     const uri = getConnectionString()
//     await mongoose.connect(uri,{dbName:process.env.DB_NAME})

//     console.log("connected to database")
// }

// module.exports = connectDb