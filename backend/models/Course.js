import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    courseCode: { 
        type: String, 
        required: true,
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

// Compound unique index for courseCode and section
CourseSchema.index({ courseCode: 1, section: 1 }, { unique: true });

export default mongoose.model('Course', CourseSchema);
