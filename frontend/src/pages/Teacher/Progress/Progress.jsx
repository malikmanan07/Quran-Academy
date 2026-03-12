import { useState, useEffect } from 'react';
import { Container, Table, Form, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getProgressByStudent, addProgress, updateProgress, deleteProgress } from '../../../api/progress';
import { getAllStudents } from '../../../api/students';
import { useAuth } from '../../../context/AuthContext';
import { formatDate } from '../../../utils/helpers';
import '../../Admin/Teachers/Teachers.css';
import './Progress.css';

const TeacherProgress = () => {
  const { user } = useAuth();
  const [progressList, setProgressList] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    notes: '',
    lessonCovered: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) fetchProgress(selectedStudent);
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data.students);
      if (res.data.students.length > 0) {
        setSelectedStudent(res.data.students[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async (studentId) => {
    try {
      const res = await getProgressByStudent(studentId);
      setProgressList(res.data.progress);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editData) {
        await updateProgress(editData.id, formData);
        setSuccess('Progress updated ✅');
      } else {
        await addProgress({ ...formData, teacherId: user.id });
        setSuccess('Progress added ✅');
      }
      setShowModal(false);
      setFormData({
        studentId: '', notes: '', lessonCovered: '',
        date: new Date().toISOString().split('T')[0],
      });
      setEditData(null);
      if (selectedStudent) fetchProgress(selectedStudent);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred ❌');
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setFormData({
      studentId: selectedStudent,
      notes: item.notes || '',
      lessonCovered: item.lessonCovered || '',
      date: item.date || new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteProgress(id);
      setSuccess('Deleted ✅');
      if (selectedStudent) fetchProgress(selectedStudent);
    } catch (err) {
      setError('Delete failed ❌');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title mb-0">PROGRESS</h1>
          <button
            className="btn-add"
            onClick={() => {
              setEditData(null);
              setFormData({
                studentId: selectedStudent,
                notes: '', lessonCovered: '',
                date: new Date().toISOString().split('T')[0],
              });
              setShowModal(true);
            }}
          >
            + Add Progress
          </button>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        {/* Student Filter */}
        <div className="table-card mb-4">
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Select Student</Form.Label>
                <Form.Select
                  className="input-custom"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Progress Table */}
        <div className="table-card">
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Lesson Covered</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {progressList.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{formatDate(p.date)}</td>
                    <td><span className="badge-golden">{p.lessonCovered || '—'}</span></td>
                    <td>{p.notes || '—'}</td>
                    <td>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {progressList.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No progress found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-custom">
                <h5>{editData ? 'Edit Progress' : 'Add Progress'}</h5>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body-custom">
                <Form onSubmit={handleSubmit}>
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
                  <Form.Group className="mb-3">
                    <Form.Label>Lesson Covered</Form.Label>
                    <Form.Control
                      className="input-custom"
                      value={formData.lessonCovered}
                      onChange={(e) => setFormData({...formData, lessonCovered: e.target.value})}
                      placeholder="e.g. Page 5 - Huroof"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="input-custom"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Student progress notes..."
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      className="input-custom"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <div className="d-flex gap-2 justify-content-end">
                    <button type="button" className="btn-action btn-cancel" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-add">
                      {editData ? 'Update' : 'Add Progress'}
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

export default TeacherProgress;