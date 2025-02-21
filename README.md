# 🎓 Student Course Registration System

A full-stack web application for managing student course registrations, built with the MERN stack.

## 📁 Project Structure 

student-course-registration/
├── frontend/ # React frontend application
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── api/ # API integration
│ │ └── styles/ # Global styles
│ └── public/ # Static files
│
└── backend/ # Node.js backend application
├── controllers/ # Route controllers
├── models/ # Database models
├── routes/ # API routes
├── middleware/ # Custom middleware
└── config/ # Configuration files

## ✨ Features

### Student Features
- 👤 Account Management
  - Register new account with detailed information
  - Login/Logout functionality
  - View and update personal profile
  - Secure authentication
- 📚 Course Management
  - View available courses
  - Enroll in courses
  - Drop courses
  - Change course sections
  - View enrolled courses

### Admin Features
- 👥 Student Management
  - View all students
  - Add new students
  - Edit student information
  - Delete student records
  - View student enrollments
- 📖 Course Management
  - Create new courses
  - Update course details
  - Delete courses
  - View enrolled students per course
  - Manage course sections

## 🚀 Quick Start

1. **Clone the repository**

2. **Set up the backend**

3. **Set up the frontend**

4. **Run the application**

## 🛠️ Built With

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - API requests
- **Bootstrap** - Styling
- **React Icons** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 🔐 Security Features

- HTTP-only cookies for JWT storage
- Password encryption using bcrypt
- Protected API routes
- Input validation and sanitization
- CORS protection
- Secure session management

## 🌐 API Endpoints

### Student Routes
```bash
POST   /api/students/register    # Register new student
POST   /api/students/login      # Student login
GET    /api/students/me         # Get student profile
POST   /api/students/logout     # Logout
```

### Course Routes
```bash
GET    /api/courses             # Get all courses
POST   /api/courses/enroll/:id  # Enroll in course
DELETE /api/courses/drop/:id    # Drop course
PUT    /api/courses/:id         # Update course section
```

### Admin Routes
```bash
POST   /api/admin/login         # Admin login
GET    /api/admin/students      # Get all students
POST   /api/courses            # Create course
PUT    /api/courses/:id        # Update course
DELETE /api/courses/:id        # Delete course
```

## 🔄 Database Schema

### Student Model
```javascript
{
  studentNumber: String,    // Unique identifier
  password: String,        // Encrypted
  firstName: String,
  lastName: String,
  address: String,
  city: String,
  phoneNumber: String,
  email: String,          // Unique
  program: String,
  favoriteTopic: String,
  strongestSkill: String
}
```

### Course Model
```javascript
{
  courseCode: String,     // Unique identifier
  courseName: String,
  section: String,
  semester: String,       // Fall, Winter, Summer
  students: [ObjectId]    // Reference to Student model
}
```

## 💻 Development


## 🚦 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Acknowledgments

- MongoDB Documentation
- React.js Documentation
- Node.js Documentation
- Express.js Documentation
- Bootstrap Documentation

## 📧 Support

For support, email: ak.monani@outlook.com

Developed with ❤️ by Aniket Monani