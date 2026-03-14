import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

export const markAttendance = (data) => http.post(API.MARK_ATTENDANCE, data);
export const getMyAttendance = () => http.get(API.MY_ATTENDANCE);
export const getAttendanceByStudent = (id) => http.get(API.ATTENDANCE_BY_STUDENT(id));
export const getAttendanceByClass = (id) => http.get(API.ATTENDANCE_BY_CLASS(id));
export const getAttendanceStats = (studentId) => http.get(API.ATTENDANCE_STATS(studentId));
