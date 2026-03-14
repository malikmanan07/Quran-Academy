import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/apiResponse.js';
import * as service from './daily-progress.service.js';
import { sendNotification } from '../../services/socketService.js';

export const createDailyProgress = asyncHandler(async (req, res) => {
  try {
    const allowedFields = [
      'studentId', 'date', 'sabaqSurah', 'sabaqAyatFrom', 
      'sabaqAyatTo', 'sabaqGrade', 'sabqiGrade', 'manzilGrade', 'notes'
    ];
    
    const data = { teacherId: parseInt(req.user.id) };
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });

    if (data.studentId) data.studentId = parseInt(data.studentId);
    
    console.log('Creating Daily Progress:', data);
    const progress = await service.createDailyProgress(data);
    
    sendNotification(data.studentId, `Your teacher logged your sabaq progress for ${data.date}`, 'success');
    sendCreated(res, 'Daily progress logged successfully', { progress });
  } catch (error) {
    console.error('Create Daily Progress error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export const getDailyProgressByStudent = asyncHandler(async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? parseInt(req.user.id) : parseInt(req.params.id);
    const progress = await service.getDailyProgressByStudent(studentId);
    sendSuccess(res, 'Daily progress fetched', { progress });
  } catch (error) {
    console.error('Get Daily Progress error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export const getMyDailyProgress = asyncHandler(async (req, res) => {
  try {
    const progress = await service.getDailyProgressByStudent(parseInt(req.user.id));
    sendSuccess(res, 'My daily progress fetched', { progress });
  } catch (error) {
    console.error('Get My Daily Progress error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export const updateDailyProgress = asyncHandler(async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('Updating Daily Progress ID:', id, 'Body:', req.body);
    
    // List of allowed fields for daily_progress table
    const allowedFields = [
      'studentId', 'date', 'sabaqSurah', 'sabaqAyatFrom', 
      'sabaqAyatTo', 'sabaqGrade', 'sabqiGrade', 'manzilGrade', 'notes'
    ];
    
    const data = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });

    if (data.studentId) data.studentId = parseInt(data.studentId);
    // teacherId is usually not updated for a record, but we can set it if needed
    // In this app, teacherId is set on creation.

    console.log('Final data for update:', data);

    const progress = await service.updateDailyProgress(id, data);
    sendSuccess(res, 'Daily progress updated', { progress });
  } catch (error) {
    console.error('Update Daily Progress error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export const deleteDailyProgress = asyncHandler(async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await service.deleteDailyProgress(id);
    sendSuccess(res, 'Daily progress deleted successfully');
  } catch (error) {
    console.error('Delete Daily Progress error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
