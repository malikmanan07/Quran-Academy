import * as service from './feedback.service.js';

export const create = async (req, res) => {
  try {
    const data = { ...req.body, teacherId: req.user.id };
    const result = await service.create(data);
    res.status(201).json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const getByStudent = async (req, res) => {
  try {
    const data = await service.getByStudent(req.params.id);
    res.json({ success: true, data: { feedback: data } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const getMyFeedback = async (req, res) => {
  try {
    const data = await service.getByStudent(req.user.id);
    res.json({ success: true, data: { feedback: data } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const getMyStudentsFeedback = async (req, res) => {
  try {
    const data = await service.getByTeacher(req.user.id);
    res.json({ success: true, data: { feedback: data } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
