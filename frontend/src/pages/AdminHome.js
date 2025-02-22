import React from 'react';
import { FaBook, FaList, FaSignOutAlt, FaUserGraduate } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogout } from '../api/api';
import '../styles/global.css';

const AdminHome = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await adminLogout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <ul className="menu-list">
                <li className="menu-item">
                    <Link to="/admin/students" className="menu-link">
                        <FaUserGraduate className="icon" />
                        <div>
                            <h3 className="mb-1">Student Management</h3>
                            <p className="text-secondary mb-0">Manage student records and enrollments</p>
                        </div>
                    </Link>
                </li>
                
                <li className="menu-item">
                    <Link to="/create-course" className="menu-link">
                        <FaBook className="icon" />
                        <div>
                            <h3 className="mb-1">Create Course</h3>
                            <p className="text-secondary mb-0">Add new courses to the system</p>
                        </div>
                    </Link>
                </li>
                
                <li className="menu-item">
                    <Link to="/admin/course-management" className="menu-link">
                        <FaList className="icon" />
                        <div>
                            <h3 className="mb-1">Course Management</h3>
                            <p className="text-secondary mb-0">Manage existing courses</p>
                        </div>
                    </Link>
                </li>
            </ul>

            <div className="text-center mt-4">
                <button onClick={handleLogout} className="btn btn-custom">
                    <FaSignOutAlt className="me-2" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminHome;
