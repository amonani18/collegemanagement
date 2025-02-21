import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AdminStudentManagement from './components/AdminStudentManagement';
import CourseManagement from './components/CourseManagement';
import CreateCourse from './components/CreateCourse';
import Login from './components/Login';
import Register from './components/Register';
import StudentCourseManagement from './components/StudentCourseManagement';
import StudentDashboard from './components/StudentDashboard';
import AdminHome from './pages/AdminHome';
import Home from './pages/Home';
import StudentHome from './pages/StudentHome';
import './styles/global.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/student-login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/student-home" element={<StudentHome />} />
                <Route path="/admin-home" element={<AdminHome />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/admin/course-management" element={<CourseManagement />} />
                <Route path="/create-course" element={<CreateCourse />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin/students" element={<AdminStudentManagement />} />
                <Route path="/student/courses" element={<StudentCourseManagement />} />
            </Routes>
        </Router>
    );
}

export default App;
