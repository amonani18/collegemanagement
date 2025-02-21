import React, { useState } from 'react';
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

    const handleChange = (e) => {
        setCourseData({
            ...courseData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCourse(courseData);
            setSuccess('Course created successfully!');
            setError('');
            // Reset form
            setCourseData({
                courseCode: '',
                courseName: '',
                section: '',
                semester: 'Fall'
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create course');
            setSuccess('');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create New Course</h2>
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
                <button type="submit" className="btn btn-primary">Create Course</button>
            </form>
        </div>
    );
};

export default CreateCourse;