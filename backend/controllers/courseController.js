import Course from '../models/Course.js';

export const createCourse = async (req, res) => {
    try {
        const { courseCode, courseName, sections, semester } = req.body;
        
        // Check if course already exists
        const existingCourse = await Course.findOne({ courseCode });
        if (existingCourse) {
            // If course exists, add new sections
            const newSections = sections.filter(newSection => 
                !existingCourse.sections.some(existingSection => 
                    existingSection.sectionNumber === newSection.sectionNumber
                )
            );
            
            if (newSections.length > 0) {
                existingCourse.sections.push(...newSections);
                await existingCourse.save();
                return res.status(200).json(existingCourse);
            }
            return res.status(400).json({ message: 'All sections already exist for this course' });
        }

        // Create new course with sections
        const course = new Course({
            courseCode,
            courseName,
            sections: sections.map(section => ({ sectionNumber: section, students: [] })),
            semester
        });

        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('sections.students', 'name email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEnrolledCourses = async (req, res) => {
    try {
        const studentId = req.user._id;
        const courses = await Course.find({
            'sections.students': studentId
        }).populate('sections.students', 'name email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { courseCode, courseName, section, semester } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.courseCode = courseCode || course.courseCode;
        course.courseName = courseName || course.courseName;
        course.section = section || course.section;
        course.semester = semester || course.semester;

        await course.save();
        res.json({ message: 'Course updated successfully', course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.remove();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to check if student is enrolled in any section of a course
const isEnrolledInAnyCourseSection = async (courseCode, studentId) => {
    const courses = await Course.find({ 
        courseCode: courseCode.toUpperCase(),
        sections: { $elemMatch: { students: studentId } }
    });
    return courses.length > 0;
};

export const enrollInCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { sectionNumber } = req.body;
        const studentId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if student is already enrolled in any section
        const isEnrolled = course.sections.some(section => 
            section.students.includes(studentId)
        );

        if (isEnrolled) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Find the requested section
        const section = course.sections.find(s => s.sectionNumber === sectionNumber);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Add student to section
        section.students.push(studentId);
        await course.save();

        res.json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCourseSection = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { newSectionNumber } = req.body;
        const studentId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Find current and new sections
        const currentSection = course.sections.find(section => 
            section.students.includes(studentId)
        );
        const newSection = course.sections.find(section => 
            section.sectionNumber === newSectionNumber
        );

        if (!currentSection) {
            return res.status(404).json({ message: 'Not enrolled in this course' });
        }
        if (!newSection) {
            return res.status(404).json({ message: 'New section not found' });
        }

        // Remove student from current section and add to new section
        currentSection.students = currentSection.students.filter(id => !id.equals(studentId));
        newSection.students.push(studentId);
        
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const dropCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Find and remove student from their section
        const section = course.sections.find(section => 
            section.students.includes(studentId)
        );

        if (!section) {
            return res.status(404).json({ message: 'Not enrolled in this course' });
        }

        section.students = section.students.filter(id => !id.equals(studentId));
        await course.save();

        res.json({ message: 'Successfully dropped course' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const addSection = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { sectionNumber } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if section already exists
        if (course.sections.some(s => s.sectionNumber === sectionNumber)) {
            return res.status(400).json({ message: 'Section already exists' });
        }

        course.sections.push({ sectionNumber, students: [] });
        await course.save();

        res.json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
