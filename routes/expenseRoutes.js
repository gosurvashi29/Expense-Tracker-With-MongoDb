const express = require('express');
const { addExpense, getExpenses, deleteExpense,downloadExpenses } = require('../controllers/expenseController');
const router = express.Router();
const authenticate= require("../middleware/auth")
// POST route to add a new expense
router.post('/add-expense',authenticate, addExpense);

// GET route to fetch all expenses
router.get('/expenses',authenticate, getExpenses);

// DELETE route to delete an expense by ID
router.delete('/delete-expense/:id', authenticate,deleteExpense);

router.get("/download", authenticate, downloadExpenses);



module.exports = router;
