import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api'; // Import the API instance

const StudentLogin = () => {
    const [studentNumber, setStudentNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await API.get('/students/me');
            if (response.data) {
                navigate('/student-home'); // Redirect if already logged in
            }
        } catch (err) {
            console.log("Not authenticated");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await API.post('/students/login', { 
                studentNumber, 
                password 
            });
            
            if (response.data) {
                navigate('/student-home');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Student Login</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Student Number:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={studentNumber} 
                        onChange={(e) => setStudentNumber(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default StudentLogin;
