import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';

const StudentHome = () => {
    const [student, setStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get('https://college-management-tbyp.onrender.com/api/students/me', { withCredentials: true });
                setStudent(response.data);
            } catch (error) {
                console.log("Not authenticated");
                navigate('/student-login'); // Redirect to login if not authenticated
            }
        };

        fetchStudentData();
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Student Dashboard</h2>
            </div>
            
            {student ? (
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
            ) : (
                <div className="dashboard-card">
                    <p>Loading student data...</p>
                </div>
            )}
        </div>
    );
};

export default StudentHome;
