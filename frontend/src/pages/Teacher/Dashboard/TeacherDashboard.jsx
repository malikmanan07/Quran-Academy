import { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getClassesByTeacher, updateClassStatus, updateMeetingLink } from '../../../api/classes';
import { useAuth } from '../../../context/AuthContext';
import { formatDate, formatTime, getPlatformColor } from '../../../utils/helpers';
import './TeacherDashboard.css';

const PLATFORMS = ['Zoom', 'Google Meet', 'Microsoft Teams', 'Skype', 'Other'];

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [meetingForm, setMeetingForm] = useState({
    meetingPlatform: 'Zoom',
    meetingLink: '',
    meetingId: '',
    meetingPassword: '',
  });

  useEffect(() => {
    fetchClasses();
  }, [date]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await getClassesByTeacher(user.id);
      const filtered = res.data.classes.filter(
        cls => cls.classDate === date
      );
      setClasses(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateClassStatus(id, { status });
      setSuccess('Status updated ✅');
      fetchClasses();
    } catch (err) {
      setError('Update failed ❌');
    }
  };

  const openMeetingModal = (cls) => {
    setSelectedClass(cls);
    setMeetingForm({
      meetingPlatform: cls.meetingPlatform || 'Zoom',
      meetingLink: cls.meetingLink || '',
      meetingId: cls.meetingId || '',
      meetingPassword: cls.meetingPassword || '',
    });
    setShowMeetingModal(true);
  };

  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMeetingLink(selectedClass.id, meetingForm);
      setSuccess('Meeting link updated ✅');
      setShowMeetingModal(false);
      fetchClasses();
    } catch (err) {
      setError('Update failed ❌');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Regular') return 'success';
    if (status === 'Leave') return 'danger';
    if (status === 'Cancelled') return 'warning';
    return 'secondary';
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <h1 className="page-title">DASHBOARD</h1>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        {/* Date Filter */}
        <div className="table-card mb-4">
          <Row className="align-items-center">
            <Col md={4}>
              <Form.Group className="d-flex align-items-center gap-3">
                <Form.Label className="mb-0 fw-semibold text-nowrap">
                  List of Classes on:
                </Form.Label>
                <Form.Control
                  type="date"
                  className="input-custom"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={8} className="text-end">
              <span className="classes-count">
                {classes.length} class{classes.length !== 1 ? 'es' : ''} today
              </span>
            </Col>
          </Row>
        </div>

        {/* Classes Table */}
        <div className="table-card">
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Teacher Time</th>
                  <th>Student Time</th>
                  <th>Student Name</th>
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
                    <td>
                      <span className="time-badge">{formatTime(cls.teacherTime)}</span>
                      <br />
                      <small className="text-muted">{formatDate(cls.classDate)}</small>
                    </td>
                    <td>
                      <span className="time-badge">{formatTime(cls.studentTime)}</span>
                    </td>
                    <td className="fw-semibold">{cls.studentName}</td>
                    <td>
                      <span className="badge-golden">{cls.courseName}</span>
                    </td>
                    <td>
                      <span
                        className="platform-badge"
                        style={{ color: getPlatformColor(cls.meetingPlatform) }}
                      >
                        {cls.meetingPlatform || '—'}
                      </span>
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(cls.status)}>
                        {cls.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {/* Join Class */}
                        {cls.meetingLink ? (
                          <a
                            href={cls.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-action btn-join"
                          >
                            🎥 Join Class
                          </a>
                        ) : (
                          <button
                            className="btn-action btn-edit"
                            onClick={() => openMeetingModal(cls)}
                          >
                            + Add Link
                          </button>
                        )}

                        {/* Update Meeting Link */}
                        {cls.meetingLink && (
                          <button
                            className="btn-action btn-edit"
                            onClick={() => openMeetingModal(cls)}
                          >
                            Edit Link
                          </button>
                        )}

                        {/* Status Buttons */}
                        <button
                          className="btn-action btn-activate"
                          onClick={() => handleStatusChange(cls.id, 'Regular')}
                        >
                          Activate
                        </button>
                        <button
                          className="btn-action btn-leave"
                          onClick={() => handleStatusChange(cls.id, 'Leave')}
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {classes.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-5">
                      😔 No classes on this date
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>

        {/* Meeting Link Modal */}
        {showMeetingModal && (
          <div className="modal-overlay" onClick={() => setShowMeetingModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-custom">
                <h5>📹 Update Meeting Link</h5>
                <button onClick={() => setShowMeetingModal(false)}>✕</button>
              </div>
              <div className="modal-body-custom">
                <Form onSubmit={handleMeetingSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Platform</Form.Label>
                    <Form.Select
                      className="input-custom"
                      value={meetingForm.meetingPlatform}
                      onChange={(e) => setMeetingForm({...meetingForm, meetingPlatform: e.target.value})}
                    >
                      {PLATFORMS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Meeting Link</Form.Label>
                    <Form.Control
                      className="input-custom"
                      value={meetingForm.meetingLink}
                      onChange={(e) => setMeetingForm({...meetingForm, meetingLink: e.target.value})}
                      placeholder="Paste meeting link here..."
                      required
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Meeting ID (optional)</Form.Label>
                        <Form.Control
                          className="input-custom"
                          value={meetingForm.meetingId}
                          onChange={(e) => setMeetingForm({...meetingForm, meetingId: e.target.value})}
                          placeholder="e.g. 123 456 789"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Password (optional)</Form.Label>
                        <Form.Control
                          className="input-custom"
                          value={meetingForm.meetingPassword}
                          onChange={(e) => setMeetingForm({...meetingForm, meetingPassword: e.target.value})}
                          placeholder="e.g. abc123"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn-action btn-cancel"
                      onClick={() => setShowMeetingModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-add">
                      Save Link
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

export default TeacherDashboard;