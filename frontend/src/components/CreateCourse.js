import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, getAllCourses } from '../api/api';

const CreateCourse = () => {
    const [courseData, setCourseData] = useState({
        courseCode: '',
        courseName: '',
        section: '',
        semester: 'Fall'
    });
    const [existingCourses, setExistingCourses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExistingCourses();
    }, []);

    const fetchExistingCourses = async () => {
        try {
            const response = await getAllCourses();
            setExistingCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({
            ...prev,
            [name]: value
        }));

        // If courseCode changes, find and auto-fill courseName
        if (name === 'courseCode') {
            const existingCourse = existingCourses.find(
                course => course.courseCode.toLowerCase() === value.toLowerCase()
            );
            if (existingCourse) {
                setCourseData(prev => ({
                    ...prev,
                    courseName: existingCourse.courseName
                }));
            }
        }
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
            fetchExistingCourses(); // Refresh the courses list
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

    // Group courses by courseCode
    const coursesByCode = existingCourses.reduce((acc, course) => {
        if (!acc[course.courseCode]) {
            acc[course.courseCode] = [];
        }
        acc[course.courseCode].push(course);
        return acc;
    }, {});

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
                            {courseData.courseCode && coursesByCode[courseData.courseCode.toUpperCase()] && (
                                <small className="text-info">
                                    Existing sections for this course: {
                                        coursesByCode[courseData.courseCode.toUpperCase()]
                                            .map(course => course.section)
                                            .join(', ')
                                    }
                                </small>
                            )}
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

                    {Object.keys(coursesByCode).length > 0 && (
                        <div className="mt-4">
                            <h4>Existing Courses and Sections</h4>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Course Code</th>
                                            <th>Course Name</th>
                                            <th>Sections</th>
                                            <th>Semester</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(coursesByCode).map(([code, courses]) => (
                                            <tr key={code}>
                                                <td>{code}</td>
                                                <td>{courses[0].courseName}</td>
                                                <td>{courses.map(c => c.section).join(', ')}</td>
                                                <td>{courses[0].semester}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;