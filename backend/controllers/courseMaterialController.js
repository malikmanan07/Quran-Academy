import db from '../config/db.js';
import { courseMaterial, courses } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

// Get All Materials
export const getAllMaterials = async (req, res) => {
  try {
    const result = await db.select({
      id: courseMaterial.id,
      title: courseMaterial.title,
      fileUrl: courseMaterial.fileUrl,
      createdAt: courseMaterial.createdAt,
      courseName: courses.name,
    })
    .from(courseMaterial)
    .leftJoin(courses, eq(courseMaterial.courseId, courses.id));

    res.json({ success: true, materials: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Material
export const addMaterial = async (req, res) => {
  try {
    const { courseId, title, fileUrl, uploadedBy } = req.body;

    const newMaterial = await db.insert(courseMaterial).values({
      courseId, title, fileUrl, uploadedBy
    }).returning();

    res.status(201).json({ success: true, material: newMaterial[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Material
export const deleteMaterial = async (req, res) => {
  try {
    await db.delete(courseMaterial)
      .where(eq(courseMaterial.id, parseInt(req.params.id)));

    res.json({ success: true, message: 'Material deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};