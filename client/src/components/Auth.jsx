import React, { useState } from 'react';
import axios from 'axios';

function Auth({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setLoading(true);

        const endpoint = isLogin ? '/api/login' : '/api/register';
        
        try {
            const res = await axios.post(`http://localhost:5001${endpoint}`, { email, password });
            
            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userEmail', res.data.user.email);
                onLoginSuccess(res.data.token);
            } else {
                setSuccessMessage('Account created successfully! Please log in.');
                setIsLogin(true);
            }
        } catch (err) {
            const serverError = err.response?.data?.error || err.message || 'Authentication failed.';
            setErrorMessage(serverError);
        }
        setLoading(false);
    };

    return (
        <div className="auth-wrapper">
            <div className="card auth-card">
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
                    {isLogin ? 'Enter your details to access your AI budget dashboard.' : 'Start tracking your expenses with Google Gemini AI.'}
                </p>

                <form onSubmit={handleSubmit} className="form-group">
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '8px' }}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                {errorMessage && <div className="alert-error">{errorMessage}</div>}
                {successMessage && <div className="alert-success">{successMessage}</div>}

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setErrorMessage(null); setSuccessMessage(null); }}
                        className="btn btn-outline"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;