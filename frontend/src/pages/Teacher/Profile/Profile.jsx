import { useState } from 'react';
import { Container, Form, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import { useAuth } from '../../../context/AuthContext';
import API from '../../../api/axios';
import '../../Admin/Teachers/Teachers.css';
import './Profile.css';

const TeacherProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match ❌');
    }
    try {
      await API.put(`/teachers/${user.id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ...(formData.password && { password: formData.password }),
      });
      setSuccess('Profile updated ✅');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed ❌');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">
        <h1 className="page-title">TEACHER PROFILE</h1>

        <div className="profile-card">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h4 className="profile-name">{user?.name}</h4>
          <span className="profile-role">Teacher</span>

          <div className="profile-form-wrapper">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
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
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      className="input-custom"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Leave empty to keep same"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      className="input-custom"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <button type="submit" className="btn-add">
                Update Profile
              </button>
            </Form>
          </div>
        </div>

      </Container>
    </div>
  );
};

export default TeacherProfile;