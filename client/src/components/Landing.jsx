import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="box">
            <h1 style={{ backgroundColor: "black", color: "white", fontWeight: "500", textAlign: "center", padding: "10px" }}>
                AI Expense Tracker
            </h1>
            <p style={{ textAlign: "center", margin: "20px 0" }}>
                Track your expenses smarter, with AI-powered insights.
            </p>
            <button onClick={() => navigate('/login')} style={{ width: "100%" }}>
                Get Started
            </button>
        </div>
    );
}