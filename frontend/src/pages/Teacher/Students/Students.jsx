import { useState, useEffect } from 'react';
import { Container, Table, Badge, Alert } from 'react-bootstrap';
import Navbar from '../../../components/Navbar/Navbar';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { getAllStudents } from '../../../api/students';
import { getClassesByTeacher } from '../../../api/classes';
import { useAuth } from '../../../context/AuthContext';
import '../../Admin/Teachers/Teachers.css';

const TeacherStudents = () => {
  const { user } = useAuth();
  const [myStudents, setMyStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyStudents();
  }, []);

  const fetchMyStudents = async () => {
    try {
      const res = await getClassesByTeacher(user.id);
      const classes = res.data.classes;
      const uniqueStudents = [];
      const seen = new Set();
      classes.forEach(cls => {
        if (!seen.has(cls.studentName)) {
          seen.add(cls.studentName);
          uniqueStudents.push({
            name: cls.studentName,
            course: cls.courseName,
            totalClasses: classes.filter(c => c.studentName === cls.studentName).length,
          });
        }
      });
      setMyStudents(uniqueStudents);
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

        <h1 className="page-title">MY STUDENTS</h1>

        <div className="table-card">
          {loading ? <Skeleton type="table" /> : (
            <Table responsive hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Total Classes</th>
                </tr>
              </thead>
              <tbody>
                {myStudents.map((s, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{s.name}</td>
                    <td><span className="badge-golden">{s.course}</span></td>
                    <td>
                      <Badge bg="primary">{s.totalClasses}</Badge>
                    </td>
                  </tr>
                ))}
                {myStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No students found
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

export default TeacherStudents;