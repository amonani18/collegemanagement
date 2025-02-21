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

    const fetchCourses = async () => {
        try {
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
        } catch (error) {
            setError('Failed to fetch courses: ' + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

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

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Course Management</h2>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
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