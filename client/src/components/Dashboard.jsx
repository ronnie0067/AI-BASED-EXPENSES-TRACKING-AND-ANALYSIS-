import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food & Dining');
    
    // AI Routine State
    const [routineData, setRoutineData] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token} `} };
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/expenses', getAuthHeaders());
            setExpenses(res.data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!name || !amount) return;

        try {
            const res = await axios.post(
                'http://localhost:5001/api/expenses', 
                { name, amount: Number(amount), category }, 
                getAuthHeaders()
            );
            setExpenses([res.data, ...expenses]);
            setName('');
            setAmount('');
            setCategory('Food & Dining');
        } catch (err) {
            console.error('Error saving expense:', err);
        }
    };

    const generateRoutine = async () => {
        setLoadingAnalysis(true);
        setErrorMessage(null);
        setRoutineData(null);

        try {
            const res = await axios.get('http://localhost:5001/api/expenses/routine', getAuthHeaders());
            if (res.data.error) {
                setErrorMessage(res.data.error);
            } else {
                setRoutineData(res.data);
            }
        } catch (err) {
            console.error('Error generating routine:', err);
            const serverError = err.response?.data?.error || err.message || "Backend server failed to respond.";
            setErrorMessage(serverError);
        }
        setLoadingAnalysis(false);
    };

    return (
        <div className="main-container">
            {/* Add Expense Form Card */}
            <div className="card">
                <h3 style={{ marginBottom: '1rem', color: '#0f172a', fontSize: '1.25rem', fontWeight: '600' }}>Add New Expense</h3>
                <form onSubmit={handleAddExpense} className="form-group" style={{ marginTop: '0.5rem' }}>
                    <input 
                        type="text" 
                        placeholder="Expense Name (e.g., Starbucks, Amazon)" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                    <div className="form-row">
                        <input 
                            type="number" 
                            placeholder="Amount (₹)" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                        />
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="Food & Dining">Food & Dining</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                        + Record Expense
                    </button>
                </form>
            </div>

            {/* AI Financial Advisor Card */}
            <div className="card ai-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.5rem' }}>✨</span>
                    <h3 style={{ color: '#065f46', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>AI Financial Advisor</h3>
                </div>
                <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.25rem' }}>
                    Let Gemini analyze your database patterns to build a customized budgeting strategy.
                </p>
                
                <button 
                    onClick={generateRoutine} 
                    disabled={loadingAnalysis}
                    className="btn btn-ai"
                    style={{ width: '100%' }}
                >
                    {loadingAnalysis ? "Analyzing Patterns..." : "Generate My Budget Routine"}
                </button>

                {errorMessage && <div className="alert-error"><strong>Notice:</strong> {errorMessage}</div>}

                {routineData && (
                    <div className="routine-box">
                        <h4 style={{ color: '#0f172a', marginBottom: '8px', fontSize: '1.05rem' }}>Your Personalized Strategy</h4>
                        <p style={{ fontSize: '0.95rem', color: '#334155', marginBottom: '16px' }}>{routineData.summary}</p>
                        
                        <div style={{ textAlign: 'center', margin: '16px 0' }}>
                            <div className="daily-limit-badge">
                                Target Daily Limit: {routineData.dailyLimitGoal}
                            </div>
                        </div>

                        <h5 style={{ color: '#065f46', marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Actionable Steps:</h5>
                        <ul style={{ paddingLeft: '20px', fontSize: '0.95rem', color: '#334155' }}>
                            {routineData.actionableRoutine?.map((step, idx) => (
                                <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Expense History List */}
            <h3 style={{ margin: '2rem 0 1rem 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: '600' }}>Expense History</h3>
            <div>
                {expenses.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', color: '#64748b', padding: '2.5rem' }}>
                        No expenses recorded yet. Add your first expense above!
                    </div>
                ) : (
                    expenses.map((exp) => (
                        <div key={exp._id} className="expense-item">
                            <div>
                                <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '1rem' }}>{exp.name}</span>
                                <span className="category-tag">{exp.category}</span>
                            </div>
                            <span style={{ fontWeight: '700', color: '#ef4444', fontSize: '1.1rem' }}>
                                ₹{exp.amount}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Dashboard;