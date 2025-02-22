import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import { deleteCourse, getAllCourses, updateCourse } from '../api/api';
import '../styles/global.css';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);
    const [showStudents, setShowStudents] = useState(null);
    const [editForm, setEditForm] = useState({
        courseCode: '',
        courseName: '',
        section: '',
        semester: ''
    });

    const fetchCourses = async () => {
        try {
            const response = await getAllCourses();
            setCourses(response.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch courses: ' + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleEditClick = (course) => {
        setEditingCourse(course);
        setEditForm({
            courseCode: course.courseCode,
            courseName: course.courseName,
            section: course.section,
            semester: course.semester
        });
        setShowStudents(null);
    };

    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCourse(editingCourse._id, editForm);
            setSuccess('Course updated successfully!');
            setError('');
            setEditingCourse(null);
            fetchCourses();
        } catch (error) {
            setError('Failed to update course: ' + (error.response?.data?.message || error.message));
            setSuccess('');
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(courseId);
                setSuccess('Course deleted successfully!');
                setError('');
                fetchCourses();
            } catch (error) {
                setError('Failed to delete course: ' + (error.response?.data?.message || error.message));
                setSuccess('');
            }
        }
    };

    const toggleStudentsList = (courseId) => {
        setShowStudents(showStudents === courseId ? null : courseId);
        setEditingCourse(null);
    };

    return (
        <div className="dashboard-container">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="dashboard-card">
                <div className="table-responsive">
                    <table className="table table-custom">
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Section</th>
                                <th>Semester</th>
                                <th>Enrolled Students</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <React.Fragment key={course._id}>
                                    <tr>
                                        <td>{course.courseCode}</td>
                                        <td>{course.courseName}</td>
                                        <td>{course.section}</td>
                                        <td>{course.semester}</td>
                                        <td>
                                            <button 
                                                className="btn btn-custom btn-info btn-sm"
                                                onClick={() => toggleStudentsList(course._id)}
                                            >
                                                <FaUsers className="me-2" />
                                                View Students ({course.students?.length || 0})
                                            </button>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-custom btn-warning btn-sm me-2"
                                                onClick={() => handleEditClick(course)}
                                            >
                                                <FaEdit className="me-1" />
                                                Edit
                                            </button>
                                            <button 
                                                className="btn btn-custom btn-danger btn-sm"
                                                onClick={() => handleDeleteCourse(course._id)}
                                            >
                                                <FaTrash className="me-1" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    {showStudents === course._id && (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="p-3 bg-light rounded">
                                                    <h5>Enrolled Students</h5>
                                                    {course.students && course.students.length > 0 ? (
                                                        <div className="table-responsive">
                                                            <table className="table table-sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Student Number</th>
                                                                        <th>Name</th>
                                                                        <th>Email</th>
                                                                        <th>Program</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {course.students.map(student => (
                                                                        <tr key={student._id}>
                                                                            <td>{student.studentNumber}</td>
                                                                            <td>{student.firstName} {student.lastName}</td>
                                                                            <td>{student.email}</td>
                                                                            <td>{student.program}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <p className="text-muted mb-0">No students enrolled in this course.</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editingCourse && (
                    <div className="mt-4 dashboard-card">
                        <h3 className="dashboard-title">Edit Course</h3>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Course Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="courseCode"
                                    value={editForm.courseCode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Course Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="courseName"
                                    value={editForm.courseName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Section</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="section"
                                    value={editForm.section}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Semester</label>
                                <select
                                    className="form-control"
                                    name="semester"
                                    value={editForm.semester}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    <option value="Fall">Fall</option>
                                    <option value="Winter">Winter</option>
                                    <option value="Summer">Summer</option>
                                </select>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-custom btn-success">
                                    Update Course
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-custom btn-secondary"
                                    onClick={() => setEditingCourse(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseManagement; 