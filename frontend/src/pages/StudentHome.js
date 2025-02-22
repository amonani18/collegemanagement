import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';

const StudentHome = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://college-management-tbyp.onrender.com/api/students/me', {
                    withCredentials: true
                });
                setStudent(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching student data:', err);
                setError(err.message);
                if (err.response?.status === 401) {
                    navigate('/student-login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [navigate]);

    if (loading) {
        return <div className="dashboard-card">Loading student data...</div>;
    }

    if (error) {
        return <div className="dashboard-card text-danger">Error: {error}</div>;
    }

    if (!student) {
        return <div className="dashboard-card">No student data available</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <div className="row">
                    <div className="col-md-6">
                        <h3 className="dashboard-title">Profile Information</h3>
                        <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>Program:</strong> {student.program}</p>
                    </div>
                    <div className="col-md-6">
                        <h3 className="dashboard-title">Quick Actions</h3>
                        <Link to="/student/courses" className="btn btn-custom btn-primary">
                            Manage Courses
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentHome;
