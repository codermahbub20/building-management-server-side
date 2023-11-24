const express = require('express');
const applyMiddleWares = require('./midlewares/applyMiddleWares');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

// import middlewares folder
 applyMiddleWares(app)

app.get('/health', (req, res) => {
    res.send('Building Management Server...!')
  })
  

  app.all("*",(req,res,next)=>{
    console.log(req.url)
    const error = new Error(`The Requested Url is invalid [${req.url}]`)
    error.status = 404;
    next(error);
  })

  app.use((err,req,res,next)=>{
    console.log("From Line 20---->")
    res.status(err.status || 500).json({
        message: err.message
    })
  })

  app.listen(port, () => {
    console.log(`Building Management Server is running ${port}`)
  })