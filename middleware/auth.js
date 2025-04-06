const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  // Mongoose model import
require("dotenv").config();

const authenticate = async (req, res, next) => {
    try {
        // Check if the Authorization header exists
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: "Access Denied! No token provided." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.TOKEN);

        // Find the user by decoded userId (Assuming that the payload contains userId)
        const user = await User.findById(decoded.userId);  // Use `findById` for Mongoose
        if (!user) {
            return res.status(401).json({ message: "User Not Found!" });
        }

        // Attach the user to the request object so that it's available in the next middleware
        req.user = user;

        // Call the next middleware
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
