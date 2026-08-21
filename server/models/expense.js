const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { 
        type: String, 
        default: 'General',
        enum: ['Food & Dining', 'Utilities', 'Entertainment', 'Shopping', 'General'] 
    },
    date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Expense', expenseSchema);