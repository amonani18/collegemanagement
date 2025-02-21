import React from 'react';
import { FaGraduationCap, FaUserPlus, FaUserShield } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/global.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Student Course Registration System</h1>
                <p>Welcome to the course management portal</p>
            </div>

            <div className="home-content">
                <div className="action-buttons">
                    <Link to="/student-login" className="action-button student">
                        <FaGraduationCap className="icon" />
                        <div className="button-text">
                            <h3>Student Login</h3>
                            <p>Access your course dashboard</p>
                        </div>
                    </Link>

                    <Link to="/register" className="action-button register">
                        <FaUserPlus className="icon" />
                        <div className="button-text">
                            <h3>New Student</h3>
                            <p>Create your account</p>
                        </div>
                    </Link>

                    <Link to="/admin-login" className="action-button admin">
                        <FaUserShield className="icon" />
                        <div className="button-text">
                            <h3>Admin Portal</h3>
                            <p>Administrative access</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
