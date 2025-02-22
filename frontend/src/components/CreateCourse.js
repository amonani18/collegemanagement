import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../api/api';

const CreateCourse = () => {
    const [courseData, setCourseData] = useState({
        courseCode: '',
        courseName: '',
        section: '',
        semester: 'Fall'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCourseData({
            ...courseData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await createCourse(courseData);
            setSuccess('Course created successfully!');
            setCourseData({
                courseCode: '',
                courseName: '',
                section: '',
                semester: 'Fall'
            });
            setTimeout(() => {
                navigate('/admin/course-management');
            }, 2000);
        } catch (error) {
            console.error('Create course error:', error);
            if (error.response?.status === 401) {
                setError('Not authorized. Please log in as admin.');
                setTimeout(() => {
                    navigate('/admin-login');
                }, 2000);
            } else {
                setError(error.response?.data?.message || 'Failed to create course');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">
                    <h2>Create New Course</h2>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Course Code</label>
                            <input
                                type="text"
                                className="form-control"
                                name="courseCode"
                                value={courseData.courseCode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Course Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="courseName"
                                value={courseData.courseName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Section</label>
                            <input
                                type="text"
                                className="form-control"
                                name="section"
                                value={courseData.section}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Semester</label>
                            <select
                                className="form-select"
                                name="semester"
                                value={courseData.semester}
                                onChange={handleChange}
                                required
                            >
                                <option value="Fall">Fall</option>
                                <option value="Winter">Winter</option>
                                <option value="Summer">Summer</option>
                            </select>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;