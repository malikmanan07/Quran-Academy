import { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getClassesByTeacher } from '../../../api/classes';
import { useAuth } from '../../../context/AuthContext';
import { formatDate, formatTime } from '../../../utils/helpers';
import '../../Admin/Teachers/Teachers.css';
import './Schedule.css';

const Schedule = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDay, setFilterDay] = useState('All');

  const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await getClassesByTeacher(user.id);
      setClasses(res.data.classes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDay = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  };

  const filtered = filterDay === 'All'
    ? classes
    : classes.filter(cls => getDay(cls.classDate) === filterDay);

  return (
    <div className="page-wrapper">
      <Navbar />
      <Container className="py-4">

        <h1 className="page-title">REGULAR SCHEDULE</h1>

        {/* Day Filter */}
        <div className="table-card mb-4">
          <div className="day-filter-wrapper">
            {DAYS.map(day => (
              <button
                key={day}
                className={`day-btn ${filterDay === day ? 'active' : ''}`}
                onClick={() => setFilterDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Table */}
        <div className="table-card">
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Day</th>
                  <th>Date</th>
                  <th>Teacher Time</th>
                  <th>Student Time</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cls, i) => (
                  <tr key={cls.id}>
                    <td>{i + 1}</td>
                    <td>
                      <span className="day-badge">{getDay(cls.classDate)}</span>
                    </td>
                    <td>{formatDate(cls.classDate)}</td>
                    <td><span className="time-badge">{formatTime(cls.teacherTime)}</span></td>
                    <td><span className="time-badge">{formatTime(cls.studentTime)}</span></td>
                    <td className="fw-semibold">{cls.studentName}</td>
                    <td><span className="badge-golden">{cls.courseName}</span></td>
                    <td>
                      <Badge bg={
                        cls.status === 'Regular' ? 'success' :
                        cls.status === 'Leave' ? 'danger' : 'warning'
                      }>
                        {cls.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      No classes found
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

export default Schedule;