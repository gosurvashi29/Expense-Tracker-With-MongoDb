const User = require('../models/userModel');
const Expense = require('../models/expense');
const e = require('express');


const getUserLeaderBoard = async (req, res) => {
    try{
        const leaderboardofusers = await User.find().sort({ totalAmount: -1 }); // sorting in descending order

       
        res.status(200).json(leaderboardofusers)
    
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}

module.exports = {
    getUserLeaderBoard
}


