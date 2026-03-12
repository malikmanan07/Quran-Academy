import { useState, useEffect } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getProgressByStudent } from '../../../api/progress';
import { useAuth } from '../../../context/AuthContext';
import { formatDate } from '../../../utils/helpers';
import '../../Admin/Teachers/Teachers.css';
import './Progress.css';

const StudentProgress = () => {
  const { user } = useAuth();
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await getProgressByStudent(user.id);
      setProgressList(res.data.progress);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <h1 className="page-title">MY PROGRESS</h1>

        <div className="table-card">
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Teacher</th>
                  <th>Lesson Covered</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {progressList.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{formatDate(p.date)}</td>
                    <td className="fw-semibold">{p.teacherName}</td>
                    <td>
                      <span className="badge-golden">{p.lessonCovered || '—'}</span>
                    </td>
                    <td>{p.notes || '—'}</td>
                  </tr>
                ))}
                {progressList.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No progress records found
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

export default StudentProgress;