import { useState, useEffect } from 'react';
import { Container, Table, Badge, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getClassesByStudent } from '../../../api/classes';
import { useAuth } from '../../../context/AuthContext';
import { formatDate, formatTime, getPlatformColor } from '../../../utils/helpers';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayClasses, setTodayClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await getClassesByStudent(user.id);
      const all = res.data.classes;
      const today = new Date().toISOString().split('T')[0];
      const todayList = all.filter(cls => cls.classDate === today);
      setClasses(all);
      setTodayClasses(todayList);
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

        <h1 className="page-title">DASHBOARD</h1>

        {/* Welcome Card */}
        <div className="welcome-card mb-4">
          <div>
            <h4 className="welcome-title">Assalamu Alaikum, {user?.name}! 👋</h4>
            <p className="welcome-sub">
              {todayClasses.length > 0
                ? `You have ${todayClasses.length} class${todayClasses.length > 1 ? 'es' : ''} today`
                : 'No classes today — enjoy your day! 😊'}
            </p>
          </div>
          <div className="welcome-icon">📖</div>
        </div>

        {/* Stats */}
        {loading ? (
          <Row className="mb-4">
            {[1,2,3].map(i => (
              <Col key={i} md={4} className="mb-3">
                <Skeleton type="card" />
              </Col>
            ))}
          </Row>
        ) : (
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <div className="student-stat-card blue">
                <div className="student-stat-icon">📅</div>
                <div>
                  <h3 className="stat-value">{classes.length}</h3>
                  <p className="stat-label">Total Classes</p>
                </div>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="student-stat-card green">
                <div className="student-stat-icon">✅</div>
                <div>
                  <h3 className="stat-value">
                    {classes.filter(c => c.status === 'Regular').length}
                  </h3>
                  <p className="stat-label">Regular Classes</p>
                </div>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="student-stat-card coral">
                <div className="student-stat-icon">🎯</div>
                <div>
                  <h3 className="stat-value">{todayClasses.length}</h3>
                  <p className="stat-label">Today's Classes</p>
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* Today's Classes */}
        <div className="table-card mb-4">
          <h5 className="table-card-title">📅 Today's Classes</h5>
          {loading ? <Skeleton type="table" /> : (
            <>
              {todayClasses.length === 0 ? (
                <div className="no-class-box">
                  <p>No classes today 😊</p>
                </div>
              ) : (
                todayClasses.map(cls => (
                  <div key={cls.id} className="class-card">
                    <div className="class-card-info">
                      <div className="class-time">
                        🕐 {formatTime(cls.studentTime)}
                      </div>
                      <div className="class-details">
                        <span className="class-teacher">👨‍🏫 {cls.teacherName}</span>
                        <span className="badge-golden ms-2">{cls.courseName}</span>
                      </div>
                      {cls.meetingId && (
                        <div className="class-meeting-info">
                          <small>Meeting ID: {cls.meetingId}</small>
                          {cls.meetingPassword && (
                            <small className="ms-2">Password: {cls.meetingPassword}</small>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="class-card-actions">
                      <Badge
                        bg={cls.status === 'Regular' ? 'success' : 'danger'}
                        className="me-2"
                      >
                        {cls.status}
                      </Badge>
                      {cls.meetingLink ? (
                        <a
                          href={cls.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="join-btn"
                          style={{ backgroundColor: getPlatformColor(cls.meetingPlatform) }}
                        >
                          🎥 Join {cls.meetingPlatform}
                        </a>
                      ) : (
                        <span className="no-link-badge">Link not added yet</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* All Classes Table */}
        <div className="table-card">
          <h5 className="table-card-title">📋 All Classes</h5>
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Teacher</th>
                  <th>Course</th>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Join</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls, i) => (
                  <tr key={cls.id}>
                    <td>{i + 1}</td>
                    <td>{formatDate(cls.classDate)}</td>
                    <td><span className="time-badge">{formatTime(cls.studentTime)}</span></td>
                    <td className="fw-semibold">{cls.teacherName}</td>
                    <td><span className="badge-golden">{cls.courseName}</span></td>
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
                          Join
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {classes.length === 0 && (
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

export default StudentDashboard;