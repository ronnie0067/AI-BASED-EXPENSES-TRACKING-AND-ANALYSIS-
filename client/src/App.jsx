import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

function App() {
    const [token, setToken] = useState(null);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedEmail = localStorage.getItem('userEmail');
        if (savedToken) {
            setToken(savedToken);
            setUserEmail(savedEmail || '');
        }
    }, []);

    const handleLoginSuccess = (newToken) => {
        setToken(newToken);
        setUserEmail(localStorage.getItem('userEmail') || '');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setToken(null);
        setUserEmail('');
    };

    return (
        <div>
            {/* Frosted Glass Navigation Bar */}
            <header className="navbar">
                <div className="nav-brand">
                    <span>⚡ AI Expense Tracker</span>
                </div>
                {token && (
                    <div className="nav-user">
                        <span>Logged in as <strong style={{ color: '#0f172a' }}>{userEmail}</strong></span>
                        <button onClick={handleLogout} className="btn btn-danger">
                            Sign Out
                        </button>
                    </div>
                )}
            </header>

            {/* Main Application Router */}
            <main style={{ paddingTop: '40px' }}>
    {!token ? <Auth onLoginSuccess={handleLoginSuccess} /> : <Dashboard />}
</main>
        </div>
    );
}

export default App;