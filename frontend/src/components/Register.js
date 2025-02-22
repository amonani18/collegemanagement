import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/api';

const Register = () => {
    const [formData, setFormData] = useState({
        studentNumber: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        phoneNumber: '',
        email: '',
        program: '',
        favoriteTopic: '',
        strongestSkill: ''
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
            await register(formData);
            navigate('/student-login');
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <FaUserPlus className="auth-icon" />
                    <h2>Student Registration</h2>
                    <p>Create your student account</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
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
                        <div className="col-md-6">
                            <div className="form-group">
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
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="program"
                            placeholder="Program"
                            value={formData.program}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="favoriteTopic"
                            placeholder="Favorite Topic"
                            value={formData.favoriteTopic}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="strongestSkill"
                            placeholder="Strongest Technical Skill"
                            value={formData.strongestSkill}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Register
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account?</p>
                    <Link to="/student-login" className="auth-link">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
