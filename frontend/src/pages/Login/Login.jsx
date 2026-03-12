import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../api/auth';
import { getRolePath } from '../../utils/helpers';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data.user, res.data.token);
      navigate(getRolePath(res.data.user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={6} lg={5}>
            <div className="login-card">

              {/* Logo */}
              <div className="login-logo">
                <span className="logo-quran">Quran</span>
                <span className="logo-academe">ACADEME</span>
              </div>

              <h5 className="login-subtitle">Welcome Back 👋</h5>
              <p className="login-desc">Please login to your account</p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-custom"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-custom">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-custom"
                    required
                  />
                </Form.Group>

                <button
                  type="submit"
                  className="login-btn w-100"
                  disabled={loading}
                >
                  {loading
                    ? <Spinner animation="border" size="sm" />
                    : 'Login'
                  }
                </button>
              </Form>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;