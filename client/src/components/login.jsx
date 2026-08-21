import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="box">
            <h1>AI Expense Tracker</h1>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Enter Email" required style={{ width: "100%", marginBottom: "10px", padding: "10px" }} />
                <input type="password" placeholder="Enter Password" required style={{ width: "100%", marginBottom: "15px", padding: "10px" }} />
                <button type="submit" style={{ width: "100%", marginBottom: "10px" }}>Login</button>
            </form>
            <button onClick={() => alert("Register page coming soon!")} style={{ width: "100%", backgroundColor: "#6c757d" }}>
                Register
            </button>
        </div>
    );
}