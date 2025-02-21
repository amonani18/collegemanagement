import { useEffect, useState } from 'react';
import { createCourse, getAllStudents } from '../api/api';

const AdminDashboard = () => {
    const [students, setStudents] = useState([]);
    const [newCourse, setNewCourse] = useState({
        courseName: '',
        section: '',
        instructor: '',
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await getAllStudents();
                setStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, []);

    const handleInputChange = (e) => {
        setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await createCourse(newCourse);
            alert('Course created successfully!');
            setNewCourse({ courseName: '', section: '', instructor: '' }); // Reset form
        } catch (error) {
            alert('Error creating course: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>

            <h3>Registered Students</h3>
            {students.length > 0 ? (
                students.map((student) => (
                    <div key={student._id}>
                        <p>{student.firstName} {student.lastName} - {student.studentNumber}</p>
                    </div>
                ))
            ) : (
                <p>No students registered.</p>
            )}

            <h3>Create New Course</h3>
            <form onSubmit={handleCreateCourse}>
                <input
                    type="text"
                    name="courseName"
                    placeholder="Course Name"
                    value={newCourse.courseName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="section"
                    placeholder="Section"
                    value={newCourse.section}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="instructor"
                    placeholder="Instructor"
                    value={newCourse.instructor}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Create Course</button>
            </form>
        </div>
    );
};

export default AdminDashboard;
