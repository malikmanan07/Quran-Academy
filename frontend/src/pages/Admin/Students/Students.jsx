import { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getAllStudents, addStudent, updateStudent, deleteStudent } from '../../../api/students';
import '../Teachers/Teachers.css';
import './Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data.students);
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
        await updateStudent(editData.id, formData);
        setSuccess('Student updated ✅');
      } else {
        await addStudent(formData);
        setSuccess('Student added ✅');
      }
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', phone: '' });
      setEditData(null);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred ❌');
    }
  };

  const handleEdit = (student) => {
    setEditData(student);
    setFormData({
      name: student.name,
      email: student.email,
      password: '',
      phone: student.phone || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteStudent(id);
      setSuccess('Student deleted ✅');
      fetchStudents();
    } catch (err) {
      setError('Delete failed ❌');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title mb-0">STUDENTS</h1>
          <button
            className="btn-add"
            onClick={() => {
              setEditData(null);
              setFormData({ name: '', email: '', password: '', phone: '' });
              setShowModal(true);
            }}
          >
            + Add Student
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.phone || '—'}</td>
                    <td>
                      <Badge bg={s.isActive ? 'success' : 'danger'}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No students found
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
                <h5>{editData ? 'Edit Student' : 'Add Student'}</h5>
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
                      {editData ? 'Update' : 'Add Student'}
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

export default Students;