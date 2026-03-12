import { useState, useEffect } from 'react';
import { Container, Table, Alert, Row, Col, Form } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { useAuth } from '../../../context/AuthContext';
import { getAllCourses } from '../../../api/courses';
import { formatDate } from '../../../utils/helpers';
import API from '../../../api/axios';
import '../../Admin/Teachers/Teachers.css';
import './CourseMaterial.css';

const CourseMaterial = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    courseId: '', title: '', fileUrl: ''
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [c, m] = await Promise.all([
        getAllCourses(),
        API.get('/course-material'),
      ]);
      setCourses(c.data.courses);
      setMaterials(m.data.materials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/course-material', {
        ...formData,
        uploadedBy: user.id,
      });
      setSuccess('Material added ✅');
      setShowModal(false);
      setFormData({ courseId: '', title: '', fileUrl: '' });
      fetchAll();
    } catch (err) {
      setError('Error occurred ❌');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API.delete(`/course-material/${id}`);
      setSuccess('Deleted ✅');
      fetchAll();
    } catch (err) {
      setError('Delete failed ❌');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title mb-0">COURSE MATERIAL</h1>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Add Material
          </button>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        <div className="table-card">
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{m.title}</td>
                    <td><span className="badge-golden">{m.courseName}</span></td>
                    <td>{formatDate(m.createdAt)}</td>
                    <td>
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-action btn-join me-1"
                      >
                        View
                      </a>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(m.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {materials.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No materials found
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
                <h5>Add Course Material</h5>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body-custom">
                <Form onSubmit={handleSubmit}>
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
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      className="input-custom"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Lesson 1 - Alif Ba Ta"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>File URL / Link</Form.Label>
                    <Form.Control
                      className="input-custom"
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                      placeholder="Paste Google Drive / Dropbox link..."
                      required
                    />
                  </Form.Group>
                  <div className="d-flex gap-2 justify-content-end">
                    <button type="button" className="btn-action btn-cancel" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-add">
                      Add Material
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

export default CourseMaterial;