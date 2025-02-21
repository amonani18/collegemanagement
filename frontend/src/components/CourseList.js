import { useEffect, useState } from 'react';
import { addCourse, getCourses } from '../api/api';

const CourseList = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await getCourses();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const enrollCourse = async (courseId) => {
        try {
            await addCourse(courseId);
            alert('Successfully enrolled in the course!');
        } catch (error) {
            alert('Error enrolling in course: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Available Courses</h2>
            {courses.length > 0 ? (
                courses.map((course) => (
                    <div key={course._id}>
                        <p>{course.courseName} - {course.section}</p>
                        <button onClick={() => enrollCourse(course._id)}>Enroll</button>
                    </div>
                ))
            ) : (
                <p>No courses available.</p>
            )}
        </div>
    );
};

export default CourseList;
