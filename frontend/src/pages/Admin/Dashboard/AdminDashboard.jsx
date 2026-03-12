import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Spinner } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getAllTeachers } from '../../../api/teachers';
import { getAllStudents } from '../../../api/students';
import { getAllPayments } from '../../../api/payments';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [t, s, p] = await Promise.all([
        getAllTeachers(),
        getAllStudents(),
        getAllPayments(),
      ]);
      setTeachers(t.data.teachers);
      setStudents(s.data.students);
      setPayments(p.data.payments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const paidCount = payments.filter(p => p.status === 'Paid').length;
  const unpaidCount = payments.filter(p => p.status === 'Unpaid').length;

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        {/* Page Title */}
        <h1 className="page-title">DASHBOARD</h1>

        {/* Stat Cards */}
        {loading ? (
          <Row className="mb-4">
            {[1,2,3,4].map(i => (
              <Col key={i} xs={12} sm={6} lg={3} className="mb-3">
                <Skeleton type="card" />
              </Col>
            ))}
          </Row>
        ) : (
          <Row className="mb-4">
            <Col xs={12} sm={6} lg={3} className="mb-3">
              <div className="stat-card stat-blue">
                <div className="stat-icon">👨‍🏫</div>
                <div>
                  <h3 className="stat-value">{teachers.length}</h3>
                  <p className="stat-label">Total Teachers</p>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} lg={3} className="mb-3">
              <div className="stat-card stat-green">
                <div className="stat-icon">👨‍🎓</div>
                <div>
                  <h3 className="stat-value">{students.length}</h3>
                  <p className="stat-label">Total Students</p>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} lg={3} className="mb-3">
              <div className="stat-card stat-purple">
                <div className="stat-icon">💰</div>
                <div>
                  <h3 className="stat-value">{paidCount}</h3>
                  <p className="stat-label">Paid Payments</p>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={6} lg={3} className="mb-3">
              <div className="stat-card stat-coral">
                <div className="stat-icon">⏳</div>
                <div>
                  <h3 className="stat-value">{unpaidCount}</h3>
                  <p className="stat-label">Unpaid Payments</p>
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* Recent Students */}
        <div className="table-card mb-4">
          <h5 className="table-card-title">Recent Students</h5>
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((s, i) => (
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
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {/* Recent Teachers */}
        <div className="table-card">
          <h5 className="table-card-title">Recent Teachers</h5>
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teachers.slice(0, 5).map((t, i) => (
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
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

      </Container>
    </div>
  );
};

export default AdminDashboard;