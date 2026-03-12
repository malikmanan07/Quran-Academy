import { useState, useEffect } from 'react';
import { Container, Table, Badge, Form, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getClassesByStudent } from '../../../api/classes';
import { useAuth } from '../../../context/AuthContext';
import { formatDate, formatTime, getPlatformColor } from '../../../utils/helpers';
import '../../Admin/Teachers/Teachers.css';
import './Schedule.css';

const StudentSchedule = () => {
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
      const res = await getClassesByStudent(user.id);
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

        <h1 className="page-title">MY SCHEDULE</h1>

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
                  <th>My Time</th>
                  <th>Teacher</th>
                  <th>Course</th>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Join</th>
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
                    <td>
                      <span className="time-badge">{formatTime(cls.studentTime)}</span>
                    </td>
                    <td className="fw-semibold">{cls.teacherName}</td>
                    <td>
                      <span className="badge-golden">{cls.courseName}</span>
                    </td>
                    <td>
                      <span
                        className="platform-badge"
                        style={{ color: getPlatformColor(cls.meetingPlatform) }}
                      >
                        {cls.meetingPlatform || '—'}
                      </span>
                    </td>
                    <td>
                      <Badge bg={
                        cls.status === 'Regular' ? 'success' :
                        cls.status === 'Leave' ? 'danger' : 'warning'
                      }>
                        {cls.status}
                      </Badge>
                    </td>
                    <td>
                      {cls.meetingLink ? (
                        <a
                          href={cls.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-action btn-join"
                        >
                          🎥 Join
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
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

export default StudentSchedule;