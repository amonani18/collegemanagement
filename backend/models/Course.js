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

// Remove all indexes first
CourseSchema.indexes().forEach(async (index) => {
    try {
        await mongoose.model('Course').collection.dropIndex(index.name);
    } catch (error) {
        // Index might not exist, which is fine
    }
});

// Create only the compound index
CourseSchema.index({ courseCode: 1, section: 1 }, { 
    unique: true,
    background: true,
    name: 'courseCode_section_unique'
});

const Course = mongoose.model('Course', CourseSchema);

// Force index recreation
Course.syncIndexes().then(() => {
    console.log('Course indexes synchronized successfully');
}).catch(err => {
    console.error('Error synchronizing indexes:', err);
});

export default Course;
