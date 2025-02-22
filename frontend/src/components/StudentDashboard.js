import React, { useEffect, useState } from 'react';
import { enrollInCourse, getAllCourses } from '../api/api';
import '../styles/global.css';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await getAllCourses();  // Changed from getCourses
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleEnroll = async (courseId) => {
        try {
            await enrollInCourse(courseId);  // Changed from addCourse
            alert('Enrolled successfully!');
        } catch (error) {
            alert('Error enrolling: ' + error.message);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                {courses.map((course) => (
                    <div key={course._id} className="card-custom mb-3">
                        <h3 className="dashboard-title">{course.courseName}</h3>
                        <p className="text-secondary">
                            Course Code: {course.courseCode}<br />
                            Section: {course.section}<br />
                            Semester: {course.semester}
                        </p>
                        <button 
                            onClick={() => handleEnroll(course._id)}
                            className="btn btn-custom"
                        >
                            Enroll
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;
