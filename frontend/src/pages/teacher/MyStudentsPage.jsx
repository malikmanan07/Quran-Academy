import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import TeacherStudentFilters from '../../components/teacher/students/TeacherStudentFilters';
import TeacherStudentTable from '../../components/teacher/students/TeacherStudentTable';
import { getAllStudents } from '../../features/students/api';
import { ROUTES } from '../../constants/routes';

const MyStudentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllStudents({ teacherId: user?.id });
        // Extract from response.data (axios) -> .data (backend) -> .students
        const list = res.data?.data?.students || res.data?.students || [];
        setStudents(list);
      } catch (err) {
        console.error('MyStudentsPage fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const filtered = useMemo(() => {
    if (!search) return students;
    return students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));
  }, [students, search]);

  return (
    <div>
      <PageHeader title="My Students" subtitle={`${students.length} students assigned`} />
      <TeacherStudentFilters search={search} onSearchChange={setSearch} onReset={() => setSearch('')} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <TeacherStudentTable students={filtered} loading={loading}
          onViewProgress={(s) => navigate(ROUTES.TEACHER_PROGRESS)} />
      </div>
    </div>
  );
};

export default MyStudentsPage;
