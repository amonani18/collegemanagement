import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/students/me', { withCredentials: true });
            if (response.data) {
                navigate('/student-home'); // Redirect if already logged in
            }
        } catch (err) {
            console.log("Not authenticated");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(
                'http://localhost:5000/api/students/login',
                { email, password },
                { withCredentials: true } // Sends cookies
            );

            if (response.status === 200) {
                alert('Login Successful!');
                navigate('/student-home'); // Redirect after login
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Student Login</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email:</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Password:</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default StudentLogin;
