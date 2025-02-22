import axios from 'axios';

// Create an Axios instance
const API = axios.create({
    baseURL: 'https://college-management-tbyp.onrender.com/api',
    withCredentials: true, // Important for handling cookies (JWT auth)
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add an interceptor to handle 401 responses
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login page
            window.location.href = '/student-login';
        }
        return Promise.reject(error);
    }
);

// Authentication
export const login = (credentials) => API.post('/students/login', credentials);
export const register = (studentData) => API.post('/students/register', studentData);

// Courses
export const getCourses = () => API.get('/courses');  // Alias for getAllCourses
export const getAllCourses = () => API.get('/courses');
export const getEnrolledCourses = () => API.get('/courses/my-courses');
export const addCourse = (courseId) => API.post(`/courses/enroll/${courseId}`);  // Alias for enrollInCourse
export const enrollInCourse = (courseId) => API.post(`/courses/enroll/${courseId}`);
export const updateCourseSection = (courseId, section) => 
    API.put(`/courses/update-section/${courseId}`, { section });
export const dropCourse = (courseId) => API.delete(`/courses/drop/${courseId}`);

// Admin
export const getAllStudents = () => API.get('/admin/students');
export const createCourse = (courseData) => API.post('/courses', courseData);
export const updateCourse = (id, courseData) => API.put(`/courses/${id}`, courseData);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// Admin Authentication
export const adminLogin = (credentials) => API.post('/admin/login', credentials);

// Admin Student Management
export const addStudent = (studentData) => API.post('/admin/students', studentData);
export const updateStudent = (id, studentData) => API.put(`/admin/students/${id}`, studentData);
export const deleteStudent = (id) => API.delete(`/admin/students/${id}`);

export const logout = async () => {
    try {
        await API.post('/students/logout');
    } catch (error) {
        console.error('Logout error:', error);
    }
};

export const adminLogout = async () => {
    try {
        await API.post('/admin/logout');
    } catch (error) {
        console.error('Admin logout error:', error);
    }
};

export default API;
