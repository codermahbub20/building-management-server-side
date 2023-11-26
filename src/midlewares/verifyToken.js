// const jwt = require('jsonwebtoken');
// require('dotenv').config()

// const verifyToken = (req, res, next) => {
//     if (!req.headers.authorization) {
//       return res.status(401).send({ message: 'forbidden access' })
//     }

//     const token = req.headers.authorization.split(' ')[1];

//     jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).send({ message: 'forbidden access' })
//       }
//       req.decoded = decoded;
//       next();
//     })
//   }

//   module.exports = verifyToken