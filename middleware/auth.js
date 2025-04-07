const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  
require("dotenv").config();

const authenticate = async (req, res, next) => {
    try {
        
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: "Access Denied! No token provided." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.TOKEN);

        
        const user = await User.findById(decoded.userId); 
        if (!user) {
            return res.status(401).json({ message: "User Not Found!" });
        }

        // Attach the user to the request object so that it's available
        req.user = user;

        
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
