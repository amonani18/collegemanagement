import React, { useEffect, useState } from 'react';
import { FaBook, FaGraduationCap, FaHome, FaSignInAlt, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminLogout, logout } from '../api/api';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            if (location.pathname.includes('admin')) {
                await adminLogout();
            } else {
                await logout();
            }
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isAdminRoute = location.pathname.includes('admin');
    const isStudentRoute = location.pathname.includes('student') || location.pathname === '/register';
    const isAuthenticated = location.pathname.includes('home') || location.pathname.includes('courses');

    return (
        <header className="navbar-header">
            <nav className={`main-nav ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-brand">
                    <Link to="/">
                        <FaGraduationCap className="nav-logo" />
                        <span>Course Management</span>
                    </Link>
                </div>

                <button 
                    className="mobile-menu-button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <li>
                        <Link to="/">
                            <FaHome /> Home
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            {isAdminRoute ? (
                                <>
                                    <li>
                                        <Link to="/admin/students">
                                            <FaGraduationCap /> Students
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/course-management">
                                            <FaBook /> Courses
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <Link to="/student/courses">
                                        <FaBook /> My Courses
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button onClick={handleLogout} className="nav-button">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            {!isAdminRoute && (
                                <li>
                                    <Link to="/register">
                                        <FaUserPlus /> Register
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link to={isAdminRoute ? "/admin-login" : "/student-login"}>
                                    <FaSignInAlt /> Login
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar; 