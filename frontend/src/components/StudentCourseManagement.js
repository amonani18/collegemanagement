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
    const [newSection, setNewSection] = useState('');
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
            
            // Filter out enrolled courses from available courses
            const enrolledIds = enrolledResponse.data.map(course => course._id);
            const availableCoursesList = availableResponse.data.filter(
                course => !enrolledIds.includes(course._id)
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

    const handleEnroll = async (courseId) => {
        try {
            await enrollInCourse(courseId);
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
            // Validate if the new section exists
            const course = availableCourses.find(c => c._id === courseId);
            const sections = availableCourses
                .filter(c => c.courseCode === course.courseCode)
                .map(c => c.section);

            if (!sections.includes(newSection)) {
                setError(`Section ${newSection} does not exist for this course`);
                return;
            }

            await updateCourseSection(courseId, newSection);
            setSuccess('Successfully updated course section!');
            setError('');
            setEditingCourse(null);
            setNewSection('');
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
                                        Section: {course.section}<br />
                                        Semester: {course.semester}
                                    </p>
                                    <button 
                                        className="btn btn-custom btn-primary"
                                        onClick={() => handleEnroll(course._id)}
                                    >
                                        <FaPlus className="me-2" />
                                        Enroll
                                    </button>
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
                            enrolledCourses.map((course) => (
                                <div key={course._id} className="dashboard-card">
                                    <h5>{course.courseName}</h5>
                                    <p className="text-secondary">
                                        Course Code: {course.courseCode}<br />
                                        Section: {course.section}<br />
                                        Semester: {course.semester}
                                    </p>
                                    
                                    {editingCourse === course._id ? (
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="New Section"
                                                    value={newSection}
                                                    onChange={(e) => setNewSection(e.target.value)}
                                                />
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleUpdateSection(course._id)}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => {
                                                        setEditingCourse(null);
                                                        setNewSection('');
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="btn-group">
                                            <button 
                                                className="btn btn-custom btn-info"
                                                onClick={() => {
                                                    setEditingCourse(course._id);
                                                    setNewSection(course.section);
                                                }}
                                            >
                                                <FaEdit className="me-2" />
                                                Change Section
                                            </button>
                                            <button 
                                                className="btn btn-custom btn-danger ms-2"
                                                onClick={() => handleDrop(course._id)}
                                            >
                                                <FaTrash className="me-2" />
                                                Drop Course
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
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