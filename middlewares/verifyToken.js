const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
    const testToken = req.headers.authorization;
    let token;
  
    if (testToken && testToken.startsWith("Bearer")) {
      token = testToken.split(" ")[1];
    }
  
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
  
    jwt.verify(token, process.env.NODE_APP_JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Failed to authenticate token" });
      }
  
      req.user = decoded.noPasswordUser; // Assuming you want to attach the user data to the request
      next();
    });
  }

  module.exports = verifyToken;


// const jwt = require("jsonwebtoken");

// function verifyToken(req, res, next) {
//     const testToken = req.headers.authorization;
//     let token;

//     if (testToken && testToken.startsWith("Bearer")) {
//         token = testToken.split(" ")[1];
//     }

//     if (!token) {
//         return res.status(403).json({ message: "No token provided" });
//     }

//     jwt.verify(token, process.env.NODE_APP_JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: "Failed to authenticate token" });
//         }

//         // Assuming decoded contains user data directly
//         req.user = decoded;
//         next();
//     });
// }

// module.exports = verifyToken;
