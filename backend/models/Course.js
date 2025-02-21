import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    courseCode: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        uppercase: true
    },
    courseName: { 
        type: String, 
        required: true,
        trim: true
    },
    section: { 
        type: String, 
        required: true,
        trim: true
    },
    semester: { 
        type: String, 
        required: true,
        enum: ['Fall', 'Winter', 'Summer'],
        trim: true
    },
    students: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student' 
    }]
}, {
    timestamps: true
});

export default mongoose.model('Course', CourseSchema);
