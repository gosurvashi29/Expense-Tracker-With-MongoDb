const Expense = require('../models/expense'); 
const User =require('../models/userModel');
const AWS = require('aws-sdk');
const Downloaded =require('../models/Downloaded');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');


const mongoose = require('mongoose');

const addExpense = async (req, res) => {
  const session = await mongoose.startSession(); // For Start a session for the transaction
  session.startTransaction();

  const { description, amount, category } = req.body;
  const userId = req.user.id;

  try {
    
    const newExpense = new Expense({
      description,
      amount,
      category,
      userId,
    });

    // for saving the new expense within the transaction session
    await newExpense.save({ session });

  
    const user = await User.findById(userId).session(session); 

    if (!user) {
      await session.abortTransaction(); // Rollback transaction if user not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's totalAmount
    const updatedTotalAmount = (user.totalAmount || 0) + amount;
    user.totalAmount = updatedTotalAmount;

    // Save the updated user document within the same session
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    
    res.status(201).json({
      message: 'Expense added successfully',
      newExpenseDetail: newExpense,
    });

  } catch (error) {
    // Rollback if there's an error
    await session.abortTransaction();
    res.status(500).json({ message: 'Error adding expense', error: error.message });
  } finally {
    // End the session
    session.endSession();
  }
};



const deleteExpense = async (req, res) => {
  const session = await mongoose.startSession(); 
  session.startTransaction();

  const { id } = req.params;
  console.log(req.params)
  console.log(req.params.expenseId)
  console.log(id)

  try {
  
    const deletedExpense = await Expense.findOneAndDelete({ 
      _id: id, 
      userId: req.user.id 
    }).session(session); 

    if (!deletedExpense) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Expense not found' });
    }

    
    await session.commitTransaction();
    
   
    res.status(200).json({ message: 'Expense deleted successfully' });

  } catch (error) {
    await session.abortTransaction(); 
    console.error(error);
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  } finally {
    session.endSession(); 
  }
};


const getExpenses = async (req, res) => {
  try {
    const user = req.user; 

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit; // Offset calculation

    // Fetch the expenses with pagination
    const expenses = await Expense.find({ userId: user.id })
      .skip(skip) // Skip the first (page - 1) * limit documents
      .limit(limit); // Limit the results to the specified limit

    // Count total expenses for the user
    const count = await Expense.countDocuments({ userId: user.id });

   
    const isPremium = user.isPremium;

    // with pagination data
    res.json({
      expenses,
      isPremium,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

async function uploadToS3(data, fileName){ 
  const s3bucket = new AWS.S3({
      accessKeyId: process.env.IAM_USER_KEY, 
      secretAccessKey: process.env.IAM_USER_SECRET,
      bucket_name: process.env.BUCKET_NAME
  });

  s3bucket.createBucket(()=>{
      var params={
          Bucket : process.env.BUCKET_NAME,
          Key : fileName,
          Body : data,
          ACL: "public-read"
      }
      return new Promise((resolve, reject)=>{
      s3bucket.upload(params,(err,s3response)=>{
          if(err){
              console.log("cant upload to s3", err)
              reject(err)
          }
          else{
              console.log("upload to s3 success", s3response.Location)
              resolve(s3response.Location)
          }
      })
  })
  })

}


const downloadExpenses = async (req, res) => {
    try {
      const userId = req.user.id;
      const expenses = await Expense.find({ userId }) 
    .select('amount category description createdAt')  
    .exec();
  
      // Convert JSON to CSV
      const fields = ['amount', 'category', 'description', 'createdAt'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(expenses);
  
      
      const fileName = `myExpenses-${userId}-${Date.now()}.csv`;
  
      
      const filePath = path.join(__dirname, '..', 'Public', 'downloads', fileName); 
  
      
      fs.writeFileSync(filePath, csv);
  
      
      const fileUrl = filePath;
  
      
      const fileInfo = { fileName, url: fileUrl };
      const uploadResult = await uploadToS3(csv, fileName);
      console.log(uploadResult)

      const newDownloaded = new Downloaded({
        fileName,
        url:fileUrl,
        userId: req.user.id,
      });
  
      // Save the 'Downloaded' document
      await newDownloaded.save();
      
     
      res.download(fileUrl)
      
    } catch (err) {
      console.error('Error in downloadExpenses controller:', err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  
  

module.exports = { addExpense, getExpenses, deleteExpense , downloadExpenses};
