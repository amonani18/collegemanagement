import React, { useEffect, useState } from 'react';
import { addStudent, deleteStudent, getAllCourses, getAllStudents, updateStudent } from '../api/api';

const AdminStudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        studentNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        program: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentsResponse, coursesResponse] = await Promise.all([
                getAllStudents(),
                getAllCourses()
            ]);
            setStudents(studentsResponse.data);
            setCourses(coursesResponse.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch data: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await addStudent(formData);
            setSuccess('Student added successfully!');
            setError('');
            setFormData({
                studentNumber: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                program: ''
            });
            fetchData();
            setShowAddForm(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add student');
            setSuccess('');
        }
    };

    const handleEditClick = (student) => {
        setEditingStudent(student);
        setFormData({
            studentNumber: student.studentNumber,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            program: student.program
        });
        setShowAddForm(false);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            await updateStudent(editingStudent._id, formData);
            setSuccess('Student updated successfully!');
            setError('');
            setEditingStudent(null);
            setFormData({
                studentNumber: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                program: ''
            });
            fetchData();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update student');
            setSuccess('');
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await deleteStudent(studentId);
                setSuccess('Student deleted successfully!');
                setError('');
                fetchData();
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to delete student');
                setSuccess('');
            }
        }
    };

    const getFilteredStudents = () => {
        if (selectedCourse === 'all') {
            return students;
        }
        return students.filter(student => 
            student.courses?.some(course => course._id === selectedCourse)
        );
    };

    if (loading) {
        return <div className="container mt-5">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="dashboard-card">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <button 
                        className="btn btn-custom btn-primary"
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setEditingStudent(null);
                            setFormData({
                                studentNumber: '',
                                firstName: '',
                                lastName: '',
                                email: '',
                                password: '',
                                program: ''
                            });
                        }}
                    >
                        {showAddForm ? 'Cancel' : 'Add New Student'}
                    </button>

                    <select 
                        className="form-select w-auto"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="all">All Students</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>
                                {course.courseName} ({course.courseCode})
                            </option>
                        ))}
                    </select>
                </div>

                {(showAddForm || editingStudent) && (
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                            <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="studentNumber"
                                        placeholder="Student Number"
                                        value={formData.studentNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                {!editingStudent && (
                                    <div className="mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="program"
                                        placeholder="Program"
                                        value={formData.program}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-custom btn-success">
                                        {editingStudent ? 'Update Student' : 'Add Student'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-custom btn-secondary"
                                        onClick={() => {
                                            setEditingStudent(null);
                                            setShowAddForm(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="table-responsive">
                    <table className="table table-custom">
                        <thead>
                            <tr>
                                <th>Student Number</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Program</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredStudents().map(student => (
                                <tr key={student._id}>
                                    <td>{student.studentNumber}</td>
                                    <td>{student.firstName} {student.lastName}</td>
                                    <td>{student.email}</td>
                                    <td>{student.program}</td>
                                    <td>
                                        <button
                                            className="btn btn-custom btn-info btn-sm me-2"
                                            onClick={() => handleEditClick(student)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-custom btn-danger btn-sm"
                                            onClick={() => handleDeleteStudent(student._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminStudentManagement;