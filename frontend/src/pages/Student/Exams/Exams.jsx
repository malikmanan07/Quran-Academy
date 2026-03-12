import { useState, useEffect } from 'react';
import { Container, Table, Badge, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getExamsByStudent } from '../../../api/exams';
import { useAuth } from '../../../context/AuthContext';
import { formatDate } from '../../../utils/helpers';
import '../../Admin/Teachers/Teachers.css';
import './Exams.css';

const StudentExams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await getExamsByStudent(user.id);
      setExams(res.data.exams);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGrade = (marks, total) => {
    const percent = (marks / total) * 100;
    if (percent >= 90) return { grade: 'A+', color: 'success' };
    if (percent >= 80) return { grade: 'A', color: 'success' };
    if (percent >= 70) return { grade: 'B', color: 'primary' };
    if (percent >= 60) return { grade: 'C', color: 'warning' };
    return { grade: 'F', color: 'danger' };
  };

  const avgPercent = exams.length > 0
    ? Math.round(exams.reduce((sum, e) => sum + ((e.marks / e.totalMarks) * 100), 0) / exams.length)
    : 0;

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <h1 className="page-title">MY EXAMS</h1>

        {/* Summary */}
        {!loading && exams.length > 0 && (
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <div className="exam-summary-card green">
                <p className="summary-label">Total Exams</p>
                <h3 className="summary-value">{exams.length}</h3>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="exam-summary-card blue">
                <p className="summary-label">Average Score</p>
                <h3 className="summary-value">{avgPercent}%</h3>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="exam-summary-card purple">
                <p className="summary-label">Best Score</p>
                <h3 className="summary-value">
                  {Math.round(Math.max(...exams.map(e => (e.marks / e.totalMarks) * 100)))}%
                </h3>
              </div>
            </Col>
          </Row>
        )}

        <div className="table-card">
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Course</th>
                  <th>Teacher</th>
                  <th>Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, i) => {
                  const { grade, color } = getGrade(exam.marks, exam.totalMarks);
                  return (
                    <tr key={exam.id}>
                      <td>{i + 1}</td>
                      <td>{formatDate(exam.date)}</td>
                      <td className="fw-semibold">{exam.title}</td>
                      <td><span className="badge-golden">{exam.courseName}</span></td>
                      <td>{exam.teacherName}</td>
                      <td>
                        <span className="marks-text">
                          {exam.marks} / {exam.totalMarks}
                        </span>
                        <div className="marks-bar-wrapper">
                          <div
                            className="marks-bar"
                            style={{ width: `${(exam.marks / exam.totalMarks) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        <Badge bg={color}>{grade}</Badge>
                      </td>
                    </tr>
                  );
                })}
                {exams.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No exams found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>

      </Container>
    </div>
  );
};

export default StudentExams;