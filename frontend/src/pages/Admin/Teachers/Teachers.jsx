import { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import Modal from '../../../components/Skeleton/Skeleton';
import { getAllTeachers, addTeacher, updateTeacher, deleteTeacher } from '../../../api/teachers';
import './Teachers.css';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await getAllTeachers();
      setTeachers(res.data.teachers);
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
        await updateTeacher(editData.id, formData);
        setSuccess('Teacher updated ✅');
      } else {
        await addTeacher(formData);
        setSuccess('Teacher added ✅');
      }
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', phone: '' });
      setEditData(null);
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred ❌');
    }
  };

  const handleEdit = (teacher) => {
    setEditData(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: '',
      phone: teacher.phone || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteTeacher(id);
      setSuccess('Teacher deleted ✅');
      fetchTeachers();
    } catch (err) {
      setError('Delete failed ❌');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title mb-0">TEACHERS</h1>
          <button
            className="btn-add"
            onClick={() => {
              setEditData(null);
              setFormData({ name: '', email: '', password: '', phone: '' });
              setShowModal(true);
            }}
          >
            + Add Teacher
          </button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className="table-card">
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i + 1}</td>
                    <td>{t.name}</td>
                    <td>{t.email}</td>
                    <td>{t.phone || '—'}</td>
                    <td>
                      <Badge bg={t.isActive ? 'success' : 'danger'}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No teachers found
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
                <h5>{editData ? 'Edit Teacher' : 'Add Teacher'}</h5>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body-custom">
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          className="input-custom"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          className="input-custom"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      className="input-custom"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>
                      Password {editData && <small className="text-muted">(leave empty to keep same)</small>}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      className="input-custom"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required={!editData}
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
                      {editData ? 'Update' : 'Add Teacher'}
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

export default Teachers;