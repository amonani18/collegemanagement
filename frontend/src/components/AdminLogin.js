import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/api';
import '../styles/global.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await adminLogin(formData);
            navigate('/admin-home');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card admin">
                <div className="auth-header">
                    <FaUserShield className="auth-icon" />
                    <h2>Admin Login</h2>
                    <p>Access administrative dashboard</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <div className="input-group">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
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

                    <button type="submit" className="auth-button admin">
                        Login as Admin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin; 