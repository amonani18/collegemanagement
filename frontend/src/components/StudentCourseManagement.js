import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { dropCourse, enrollInCourse, getAllCourses, getEnrolledCourses, updateCourseSection } from '../api/api';
import '../styles/global.css';

const StudentCourseManagement = () => {
    const [availableCourses, setAvailableCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);
    const [selectedSection, setSelectedSection] = useState('');
    const [loading, setLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError('');
            
            const [availableResponse, enrolledResponse] = await Promise.all([
                getAllCourses(),
                getEnrolledCourses()
            ]);
            
            // Get enrolled course codes
            const enrolledCourseCodes = enrolledResponse.data.map(course => course.courseCode);

            // Filter available courses to exclude enrolled course codes
            const availableCoursesList = availableResponse.data.filter(
                course => !enrolledCourseCodes.includes(course.courseCode)
            );
            
            setAvailableCourses(availableCoursesList);
            setEnrolledCourses(enrolledResponse.data);
            setError('');
            setRetryCount(0); // Reset retry count on successful fetch
        } catch (error) {
            console.error('Fetch courses error:', error);
            setError(error.response?.data?.message || 'Failed to fetch courses. Please try again.');
            
            // Implement retry logic
            if (retryCount < 3) {
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    fetchCourses();
                }, 2000); // Retry after 2 seconds
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleRetry = () => {
        setRetryCount(0);
        fetchCourses();
    };

    const handleEnroll = async (courseId, sectionNumber) => {
        try {
            await enrollInCourse(courseId, { sectionNumber });
            setSuccess('Successfully enrolled in course!');
            setError('');
            fetchCourses();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to enroll in course');
            setSuccess('');
        }
    };

    const handleDrop = async (courseId) => {
        if (window.confirm('Are you sure you want to drop this course?')) {
            try {
                await dropCourse(courseId);
                setSuccess('Successfully dropped course!');
                setError('');
                fetchCourses();
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to drop course');
                setSuccess('');
            }
        }
    };

    const handleUpdateSection = async (courseId) => {
        try {
            await updateCourseSection(courseId, { newSectionNumber: selectedSection });
            setSuccess('Successfully updated course section!');
            setError('');
            setEditingCourse(null);
            setSelectedSection('');
            fetchCourses();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update course section');
            setSuccess('');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Course Management</h2>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                    {retryCount >= 3 && (
                        <button 
                            className="btn btn-link text-danger"
                            onClick={handleRetry}
                        >
                            Click here to try again
                        </button>
                    )}
                </div>
            )}
            {success && <div className="alert alert-success">{success}</div>}
            
            <div className="row">
                <div className="col-md-6">
                    <div className="dashboard-card">
                        <h3 className="dashboard-title">Available Courses</h3>
                        {availableCourses.length > 0 ? (
                            availableCourses.map((course) => (
                                <div key={course._id} className="dashboard-card">
                                    <h5>{course.courseName}</h5>
                                    <p className="text-secondary">
                                        Course Code: {course.courseCode}<br />
                                        Semester: {course.semester}
                                    </p>
                                    <div className="mt-3">
                                        <h6>Available Sections:</h6>
                                        {course.sections.map((section, index) => (
                                            <div key={index} className="d-flex align-items-center mb-2">
                                                <span className="me-2">Section {section.sectionNumber}</span>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleEnroll(course._id, section.sectionNumber)}
                                                >
                                                    <FaPlus className="me-1" />
                                                    Enroll
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-secondary">No courses available for enrollment.</p>
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="dashboard-card">
                        <h3 className="dashboard-title">My Enrolled Courses</h3>
                        {enrolledCourses.length > 0 ? (
                            enrolledCourses.map((course) => {
                                const enrolledSection = course.sections.find(section =>
                                    section.students.includes(course.studentId)
                                );

                                return (
                                    <div key={course._id} className="dashboard-card">
                                        <h5>{course.courseName}</h5>
                                        <p className="text-secondary">
                                            Course Code: {course.courseCode}<br />
                                            Current Section: {enrolledSection?.sectionNumber}<br />
                                            Semester: {course.semester}
                                        </p>
                                        
                                        {editingCourse === course._id ? (
                                            <div className="mt-3">
                                                <select
                                                    className="form-select mb-2"
                                                    value={selectedSection}
                                                    onChange={(e) => setSelectedSection(e.target.value)}
                                                >
                                                    <option value="">Select Section</option>
                                                    {course.sections.map((section, index) => (
                                                        <option
                                                            key={index}
                                                            value={section.sectionNumber}
                                                        >
                                                            Section {section.sectionNumber}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="btn-group">
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleUpdateSection(course._id)}
                                                        disabled={!selectedSection}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={() => {
                                                            setEditingCourse(null);
                                                            setSelectedSection('');
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => setEditingCourse(course._id)}
                                                >
                                                    <FaEdit className="me-1" />
                                                    Change Section
                                                </button>
                                                <button 
                                                    className="btn btn-outline-danger ms-2"
                                                    onClick={() => handleDrop(course._id)}
                                                >
                                                    <FaTrash className="me-1" />
                                                    Drop Course
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-secondary">You haven't enrolled in any courses yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCourseManagement; 