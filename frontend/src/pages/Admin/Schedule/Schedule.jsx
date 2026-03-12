import { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getAllTeachers } from '../../../api/teachers';
import { getAllStudents } from '../../../api/students';
import { getAllCourses } from '../../../api/courses';
import { addClass, getClassesByTeacher, updateClassStatus, deleteClass } from '../../../api/classes';
import { formatDate, formatTime } from '../../../utils/helpers';
import '../Teachers/Teachers.css';
import './Schedule.css';

const PLATFORMS = ['Zoom', 'Google Meet', 'Microsoft Teams', 'Skype', 'Other'];

const Schedule = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [formData, setFormData] = useState({
    teacherId: '',
    studentId: '',
    courseId: '',
    teacherTime: '',
    studentTime: '',
    classDate: '',
    meetingPlatform: 'Zoom',
    meetingLink: '',
    meetingId: '',
    meetingPassword: '',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedTeacher) fetchClasses(selectedTeacher);
  }, [selectedTeacher]);

  const fetchAll = async () => {
    try {
      const [t, s, c] = await Promise.all([
        getAllTeachers(),
        getAllStudents(),
        getAllCourses(),
      ]);
      setTeachers(t.data.teachers);
      setStudents(s.data.students);
      setCourses(c.data.courses);
      if (t.data.teachers.length > 0) {
        setSelectedTeacher(t.data.teachers[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async (teacherId) => {
    try {
      const res = await getClassesByTeacher(teacherId);
      setClasses(res.data.classes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addClass(formData);
      setSuccess('Class scheduled ✅');
      setShowModal(false);
      setFormData({
        teacherId: '', studentId: '', courseId: '',
        teacherTime: '', studentTime: '', classDate: '',
        meetingPlatform: 'Zoom', meetingLink: '',
        meetingId: '', meetingPassword: '',
      });
      if (selectedTeacher) fetchClasses(selectedTeacher);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred ❌');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateClassStatus(id, { status });
      setSuccess('Status updated ✅');
      if (selectedTeacher) fetchClasses(selectedTeacher);
    } catch (err) {
      setError('Update failed ❌');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteClass(id);
      setSuccess('Class deleted ✅');
      if (selectedTeacher) fetchClasses(selectedTeacher);
    } catch (err) {
      setError('Delete failed ❌');
    }
  };

  const getPlatformBadge = (platform) => {
    const colors = {
      'Zoom': 'primary',
      'Google Meet': 'success',
      'Microsoft Teams': 'purple',
      'Skype': 'info',
      'Other': 'secondary',
    };
    return colors[platform] || 'secondary';
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title mb-0">SCHEDULE</h1>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Add Class
          </button>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        {/* Teacher Filter */}
        <div className="table-card mb-4">
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Filter by Teacher</Form.Label>
                <Form.Select
                  className="input-custom"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </div>

     
        <div className="table-card">
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Teacher Time</th>
                  <th>Student Time</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls, i) => (
                  <tr key={cls.id}>
                    <td>{i + 1}</td>
                    <td>{formatDate(cls.classDate)}</td>
                    <td>{formatTime(cls.teacherTime)}</td>
                    <td>{formatTime(cls.studentTime)}</td>
                    <td>{cls.studentName}</td>
                    <td>
                      <span className="badge-golden">{cls.courseName}</span>
                    </td>
                    <td>
                      <Badge bg={getPlatformBadge(cls.meetingPlatform)}>
                        {cls.meetingPlatform}
                      </Badge>
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        className="status-select"
                        value={cls.status}
                        onChange={(e) => handleStatusChange(cls.id, e.target.value)}
                      >
                        <option>Regular</option>
                        <option>Leave</option>
                        <option>Cancelled</option>
                      </Form.Select>
                    </td>
                    <td>
                      {cls.meetingLink && (
                        <a
                          href={cls.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-action btn-join me-1"
                        >
                          Join
                        </a>
                      )}
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(cls.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {classes.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      No classes found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>

        
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box modal-lg-custom" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-custom">
                <h5>Schedule New Class</h5>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body-custom">
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Teacher</Form.Label>
                        <Form.Select
                          className="input-custom"
                          value={formData.teacherId}
                          onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                          required
                        >
                          <option value="">Select Teacher</option>
                          {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Student</Form.Label>
                        <Form.Select
                          className="input-custom"
                          value={formData.studentId}
                          onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                          required
                        >
                          <option value="">Select Student</option>
                          {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Course</Form.Label>
                        <Form.Select
                          className="input-custom"
                          value={formData.courseId}
                          onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                          required
                        >
                          <option value="">Select Course</option>
                          {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Class Date</Form.Label>
                        <Form.Control
                          type="date"
                          className="input-custom"
                          value={formData.classDate}
                          onChange={(e) => setFormData({...formData, classDate: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Teacher Time</Form.Label>
                        <Form.Control
                          type="time"
                          className="input-custom"
                          value={formData.teacherTime}
                          onChange={(e) => setFormData({...formData, teacherTime: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Student Time</Form.Label>
                        <Form.Control
                          type="time"
                          className="input-custom"
                          value={formData.studentTime}
                          onChange={(e) => setFormData({...formData, studentTime: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Meeting Section */}
                  <div className="meeting-section">
                    <h6 className="meeting-title">📹 Meeting Details</h6>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Platform</Form.Label>
                          <Form.Select
                            className="input-custom"
                            value={formData.meetingPlatform}
                            onChange={(e) => setFormData({...formData, meetingPlatform: e.target.value})}
                          >
                            {PLATFORMS.map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Meeting ID (optional)</Form.Label>
                          <Form.Control
                            className="input-custom"
                            value={formData.meetingId}
                            onChange={(e) => setFormData({...formData, meetingId: e.target.value})}
                            placeholder="e.g. 123 456 789"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Meeting Link</Form.Label>
                      <Form.Control
                        className="input-custom"
                        value={formData.meetingLink}
                        onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                        placeholder="Paste meeting link here..."
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Meeting Password (optional)</Form.Label>
                      <Form.Control
                        className="input-custom"
                        value={formData.meetingPassword}
                        onChange={(e) => setFormData({...formData, meetingPassword: e.target.value})}
                        placeholder="e.g. abc123"
                      />
                    </Form.Group>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn-action btn-cancel"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-add">
                      Schedule Class
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )}

      </Container>
    </div>
  );
};

export default Schedule;