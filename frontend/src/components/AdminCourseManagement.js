import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { addSection, createCourse, getAllCourses } from '../api/api';

const AdminCourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({
        courseCode: '',
        courseName: '',
        sections: [''],
        semester: 'Fall'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await getAllCourses();
            setCourses(response.data);
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSectionChange = (index, value) => {
        setNewCourse(prev => {
            const newSections = [...prev.sections];
            newSections[index] = value;
            return { ...prev, sections: newSections };
        });
    };

    const addNewSection = () => {
        setNewCourse(prev => ({
            ...prev,
            sections: [...prev.sections, '']
        }));
    };

    const removeSection = (index) => {
        if (newCourse.sections.length === 1) {
            setError('At least one section is required');
            return;
        }
        setNewCourse(prev => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Filter out empty sections and validate
            const validSections = newCourse.sections
                .map(section => section.trim())
                .filter(section => section !== '');

            if (validSections.length === 0) {
                setError('At least one section is required');
                return;
            }

            // Check for duplicate sections
            const uniqueSections = new Set(validSections);
            if (uniqueSections.size !== validSections.length) {
                setError('Duplicate section numbers are not allowed');
                return;
            }

            const courseData = {
                ...newCourse,
                courseCode: newCourse.courseCode.trim().toUpperCase(),
                courseName: newCourse.courseName.trim(),
                sections: validSections
            };

            await createCourse(courseData);
            setSuccess('Course created successfully!');
            setError('');
            setNewCourse({
                courseCode: '',
                courseName: '',
                sections: [''],
                semester: 'Fall'
            });
            fetchCourses();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create course');
            setSuccess('');
        }
    };

    const handleAddSection = async (courseId) => {
        const sectionNumber = prompt('Enter new section number:');
        if (!sectionNumber) return;

        try {
            await addSection(courseId, { sectionNumber });
            setSuccess('Section added successfully!');
            setError('');
            fetchCourses();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add section');
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
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Course Management</h2>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="dashboard-card">
                <h3>Create New Course</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Course Code:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="courseCode"
                            value={newCourse.courseCode}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Course Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="courseName"
                            value={newCourse.courseName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Sections:</label>
                        <div className="mb-2">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={addNewSection}
                            >
                                <FaPlus className="me-2" />
                                Add New Section
                            </button>
                        </div>
                        {newCourse.sections.map((section, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    value={section}
                                    onChange={(e) => handleSectionChange(index, e.target.value)}
                                    placeholder="Section number (e.g., 001, 002)"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeSection(index)}
                                    title="Remove this section"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Semester:</label>
                        <select
                            className="form-select"
                            name="semester"
                            value={newCourse.semester}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="Fall">Fall</option>
                            <option value="Winter">Winter</option>
                            <option value="Summer">Summer</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Create Course
                    </button>
                </form>
            </div>

            <div className="dashboard-card mt-4">
                <h3>Existing Courses</h3>
                {courses.map((course) => (
                    <div key={course._id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{course.courseName}</h5>
                            <p className="card-text">
                                <strong>Course Code:</strong> {course.courseCode}<br />
                                <strong>Semester:</strong> {course.semester}
                            </p>
                            <div className="mt-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">Sections:</h6>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleAddSection(course._id)}
                                        title="Add new section"
                                    >
                                        <FaPlus className="me-1" />
                                        Add Section
                                    </button>
                                </div>
                                <ul className="list-group">
                                    {course.sections.map((section, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>Section {section.sectionNumber}</span>
                                            <span className="badge bg-primary rounded-pill">
                                                {section.students.length} students
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCourseManagement; 