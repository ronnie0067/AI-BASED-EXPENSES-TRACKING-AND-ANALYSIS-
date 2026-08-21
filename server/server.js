require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

// Initialize Google Gemini AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// 1. MONGODB CONNECTION
// ==========================================
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-expense-tracker')
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// ==========================================
// 2. DATABASE SCHEMAS & MODELS
// ==========================================
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const Expense = mongoose.model('Expense', expenseSchema);

// ==========================================
// 3. SECURITY GATEKEEPER (MIDDLEWARE)
// ==========================================
const protectRoute = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No valid authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired session token. Please log in again.' });
    }
};

// ==========================================
// 4. AUTHENTICATION ROUTES
// ==========================================

// Register New Account
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Server failed to register user.' });
    }
});

// Login Existing Account
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Server failed to process login.' });
    }
});

// ==========================================
// 5. PROTECTED EXPENSE ROUTES
// ==========================================

// Fetch logged-in user's expenses
app.get('/api/expenses', protectRoute, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error('Fetch Expenses Error:', err);
        res.status(500).json({ error: 'Failed to retrieve expenses.' });
    }
});

// Save a new expense for the logged-in user
app.post('/api/expenses', protectRoute, async (req, res) => {
    try {
        const { name, amount, category } = req.body;
        if (!name || !amount || !category) {
            return res.status(400).json({ error: 'Please provide all required expense fields.' });
        }

        const newExpense = await Expense.create({
            userId: req.user.id,
            name,
            amount,
            category
        });

        res.status(201).json(newExpense);
    } catch (err) {
        console.error('Save Expense Error:', err);
        res.status(500).json({ error: 'Failed to save expense.' });
    }
});

// ==========================================
// 6. AI ADVISOR ROUTE (WITH AUTO-RETRY LOOP)
// ==========================================
app.get('/api/expenses/routine', protectRoute, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id });
        
        if (expenses.length === 0) {
            return res.json({ 
                error: "No expenses found! Add at least 2 or 3 expenses above so Gemini has patterns to analyze." 
            });
        }

        const expenseListText = expenses.map(e => `${e.name}: ₹${e.amount} (${e.category})`).join('\n');

        const prompt = `
You are an expert financial advisor and budget planner. Analyze this list of a user's recent expenses from their database:

${expenseListText}

Generate a personalized financial routine and daily spending limit based on their real spending habits. 
You must return a JSON object with exactly these three keys:
- "summary": A 2-3 sentence insightful summary analyzing their biggest spending leaks and patterns.
- "dailyLimitGoal": A realistic daily spending limit in ₹ (e.g., '₹450 / day').
- "actionableRoutine": An array of exactly 3 string bullet points (a morning check, a weekly rule, and a savings goal).`;

        // Auto-Retry Loop: Try up to 3 times if Google's servers return a 503 busy signal
        let response;
        let retries = 3;
        let delay = 1500; // Start with a 1.5-second pause

        while (retries > 0) {
            try {
                response = await ai.models.generateContent({
                    model: 'gemini-flash-latest', 
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                    }
                });
                break; // Success! Break out of the loop immediately
            } catch (apiError) {
                retries--;
                console.log(`AI API warning (${apiError.message || 'Busy'}). Retries remaining: ${retries}`);
                if (retries === 0) throw apiError; // Throw error to frontend if all attempts fail
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 1.5; // Double wait time before the next retry
            }
        }

        const generatedRoutine = JSON.parse(response.text);
        res.json(generatedRoutine);

    } catch (err) {
        console.error('Gemini AI Execution Error:', err);
        const errorMessage = err.message || 'Unknown backend failure';
        res.status(500).json({ error: `Google AI Server Error: ${errorMessage}. Please wait a few seconds and try again.` });
    }
});

// ==========================================
// 7. START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});