import { useState, useEffect } from 'react';
import { Container, Table, Form, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getAllCourses, addCourse, updateCourse, deleteCourse } from '../../../api/courses';
import '../Teachers/Teachers.css';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editData) {
        await updateCourse(editData.id, formData);
        setSuccess('Course updated ✅');
      } else {
        await addCourse(formData);
        setSuccess('Course added ✅');
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditData(null);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred ❌');
    }
  };

  const handleEdit = (course) => {
    setEditData(course);
    setFormData({
      name: course.name,
      description: course.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteCourse(id);
      setSuccess('Course deleted ✅');
      fetchCourses();
    } catch (err) {
      setError('Delete failed ❌');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title mb-0">COURSES</h1>
          <button
            className="btn-add"
            onClick={() => {
              setEditData(null);
              setFormData({ name: '', description: '' });
              setShowModal(true);
            }}
          >
            + Add Course
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
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>
                      <span className="badge-golden">{c.name}</span>
                    </td>
                    <td>{c.description || '—'}</td>
                    <td>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No courses found
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
                <h5>{editData ? 'Edit Course' : 'Add Course'}</h5>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body-custom">
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control
                      className="input-custom"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Madni Qaida-English"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Description (optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="input-custom"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Course description..."
                    />
                  </Form.Group>
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn-action btn-cancel"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-add">
                      {editData ? 'Update' : 'Add Course'}
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

export default Courses;