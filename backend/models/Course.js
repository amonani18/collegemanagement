import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    courseCode: { 
        type: String, 
        required: true,
        trim: true,
        uppercase: true,
        unique: true
    },
    courseName: { 
        type: String, 
        required: true,
        trim: true
    },
    sections: [{
        sectionNumber: {
            type: String,
            required: true,
            trim: true
        },
        students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }]
    }],
    semester: { 
        type: String, 
        required: true,
        enum: ['Fall', 'Winter', 'Summer'],
        trim: true
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', CourseSchema);

export default Course;
