import React, { useState } from 'react';
import { FaGraduationCap, FaLock, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import '../styles/global.css';

const Login = () => {
    const [formData, setFormData] = useState({
        studentNumber: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setError('');
        setNetworkError(false);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRetry = () => {
        setLoading(false);
        setNetworkError(false);
        setRetryCount(0);
        handleSubmit();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await login(formData);
            console.log('Login response:', response);
            
            if (response.data && response.data.message === "Login successful") {
                // Store both student info and token
                localStorage.setItem('studentInfo', JSON.stringify(response.data.student));
                localStorage.setItem('token', response.data.token);
                
                navigate('/student-home');
            } else {
                setError('Invalid login response');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <FaGraduationCap className="auth-icon" />
                    <h2>Student Login</h2>
                    <p>Access your course dashboard</p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                className="form-control"
                                name="studentNumber"
                                placeholder="Student Number"
                                value={formData.studentNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Logging in...
                            </>
                        ) : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="auth-link">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
