// const express = require('express');
// const applyMiddleWares = require('./midlewares/applyMiddleWares');
// const connectDb = require('./db/connectDb');
// require('dotenv').config();
// const app = express()
// const port = process.env.PORT || 5000;

// const authenticationRoutes = require('./routes/authentication/index') 
// const apartmentRoutes = require('./routes/authentication/Apartments/index')
// // import middlewares folder
//  applyMiddleWares(app)

// //  token related api
// app.use(authenticationRoutes)
// app.use(apartmentRoutes)






// app.get('/health', (req, res) => {
//     res.send('Building Management Server...!')
//   })
  

//   app.all("*",(req,res,next)=>{
//     console.log(req.url)
//     const error = new Error(`The Requested Url is invalid [${req.url}]`)
//     error.status = 404;
//     next(error);
//   })

//   app.use((err,req,res,next)=>{
//     console.log("From Line 20---->")
//     res.status(err.status || 500).json({
//         message: err.message
//     })
//   })


//   const main =async () =>{
//     await connectDb()
//     app.listen(port, () => {
//         console.log(`Building Management Server is running ${port}`)
//       })
//   }

//   main()