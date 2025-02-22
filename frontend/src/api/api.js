import axios from 'axios';

// Create an Axios instance with base configuration
const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://college-management-tbyp.onrender.com/api'
        : 'http://localhost:5000/api',
    withCredentials: true, // Important for handling cookies (JWT auth)
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000, // 10 second timeout
});

// Add request interceptor
API.interceptors.request.use(
    (config) => {
        const token = document.cookie.split('token=')[1];
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.message === 'Network Error') {
            console.error('Network Error - Unable to connect to the server');
            return Promise.reject({
                response: {
                    data: {
                        message: 'Unable to connect to the server. Please check your internet connection or try again later.'
                    }
                }
            });
        }

        if (error.response?.status === 401) {
            // Check if the current path includes 'admin'
            if (window.location.pathname.includes('admin')) {
                window.location.href = '/admin-login';
            } else {
                window.location.href = '/student-login';
            }
        }
        return Promise.reject(error);
    }
);

// Authentication
export const login = (credentials) => API.post('/students/login', credentials);
export const register = (studentData) => API.post('/students/register', studentData);
export const logout = () => API.post('/students/logout');

// Student Profile
export const getStudentProfile = () => API.get('/students/me');

// Courses
export const getAllCourses = () => API.get('/courses');
export const getEnrolledCourses = () => API.get('/courses/my-courses');
export const enrollInCourse = (courseId) => API.post(`/courses/enroll/${courseId}`);
export const updateCourseSection = (courseId, section) => 
    API.put(`/courses/update-section/${courseId}`, { section });
export const dropCourse = (courseId) => API.delete(`/courses/drop/${courseId}`);

// Admin
export const adminLogin = (credentials) => API.post('/admin/login', credentials);
export const adminLogout = () => API.post('/admin/logout');
export const getAllStudents = () => API.get('/admin/students');
export const createCourse = (courseData) => API.post('/courses', courseData);
export const updateCourse = (id, courseData) => API.put(`/courses/${id}`, courseData);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// Admin Student Management
export const addStudent = (studentData) => API.post('/admin/students', studentData);
export const updateStudent = (id, studentData) => API.put(`/admin/students/${id}`, studentData);
export const deleteStudent = (id) => API.delete(`/admin/students/${id}`);

export default API;
