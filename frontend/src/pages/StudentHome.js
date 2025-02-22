import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';
import API from '../api/api';

const StudentHome = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const studentInfo = localStorage.getItem('studentInfo');
        
        if (!token || !studentInfo) {
            navigate('/student-login');
            return;
        }

        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const response = await API.get('/students/me');
                setStudent(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching student data:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('studentInfo');
                    navigate('/student-login');
                } else {
                    setError('Failed to load student data');
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
            <div className="dashboard-header">
                <h2>Student Dashboard</h2>
            </div>
            
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
