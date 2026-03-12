import { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getAllPayments, addPayment, updatePaymentStatus } from '../../../api/payments';
import { getAllStudents } from '../../../api/students';
import { formatDate } from '../../../utils/helpers';
import '../Teachers/Teachers.css';
import './Payments.css';

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    studentId: '', amount: '', month: ''
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [p, s] = await Promise.all([
        getAllPayments(),
        getAllStudents(),
      ]);
      setPayments(p.data.payments);
      setStudents(s.data.students);
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
      await addPayment(formData);
      setSuccess('Payment added ✅');
      setShowModal(false);
      setFormData({ studentId: '', amount: '', month: '' });
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred ❌');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updatePaymentStatus(id, { status });
      setSuccess('Payment status updated ✅');
      fetchAll();
    } catch (err) {
      setError('Update failed ❌');
    }
  };

  const paidTotal = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title mb-0">PAYMENTS</h1>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + Add Payment
          </button>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <div className="payment-summary-card green">
              <p className="summary-label">Total Paid</p>
              <h3 className="summary-value">£{paidTotal}</h3>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="payment-summary-card blue">
              <p className="summary-label">Total Records</p>
              <h3 className="summary-value">{payments.length}</h3>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="payment-summary-card coral">
              <p className="summary-label">Unpaid</p>
              <h3 className="summary-value">
                {payments.filter(p => p.status === 'Unpaid').length}
              </h3>
            </div>
          </Col>
        </Row>

        {/* Payments Table */}
        <div className="table-card">
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.studentName}</td>
                    <td>{p.month}</td>
                    <td>£{p.amount}</td>
                    <td>
                      <Badge bg={p.status === 'Paid' ? 'success' : 'danger'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td>{p.paidAt ? formatDate(p.paidAt) : '—'}</td>
                    <td>
                      {p.status === 'Unpaid' ? (
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleStatusUpdate(p.id, 'Paid')}
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleStatusUpdate(p.id, 'Unpaid')}
                        >
                          Mark Unpaid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>

        {/* Add Payment Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-custom">
                <h5>Add Payment</h5>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body-custom">
                {error && <Alert variant="danger">{error}</Alert>}
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
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Month</Form.Label>
                        <Form.Select
                          className="input-custom"
                          value={formData.month}
                          onChange={(e) => setFormData({...formData, month: e.target.value})}
                          required
                        >
                          <option value="">Select Month</option>
                          {MONTHS.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Amount (£)</Form.Label>
                        <Form.Control
                          type="number"
                          className="input-custom"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          placeholder="e.g. 50"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn-action btn-cancel"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-add">
                      Add Payment
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

export default Payments;