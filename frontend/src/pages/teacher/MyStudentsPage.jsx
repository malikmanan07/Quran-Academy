import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import TeacherStudentFilters from '../../components/teacher/students/TeacherStudentFilters';
import TeacherStudentTable from '../../components/teacher/students/TeacherStudentTable';
import { getMyStudents, markCourseComplete } from '../../features/teachers/api';
import { ROUTES } from '../../constants/routes';
import { useToast } from '../../components/common/Toast';
import AppModal from '../../components/common/AppModal';
import AppButton from '../../components/common/AppButton';
import Toast from '../../components/common/Toast';

const MyStudentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getMyStudents();
      const list = res.data?.data?.students || res.data?.students || [];
      const unique = list.filter((student, index, arr) =>
        arr.findIndex(s => s.id === student.id) === index
      );
      setStudents(unique);
    } catch (err) {
      console.error('MyStudentsPage fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetch();
  }, [user]);

  const handleAction = (student, type) => {
    if (type === 'complete') {
      setSelectedStudent(student);
    } else {
      navigate(ROUTES.TEACHER_PROGRESS);
    }
  };

  const onConfirmCompletion = async () => {
    if (!selectedStudent) return;
    setSubmitting(true);
    try {
      await markCourseComplete(selectedStudent.id, { 
        courseId: selectedStudent.courseId || 5, // Nazra Quran fallback
        notes: "Course completed successfully." 
      });
      showToast(`${selectedStudent.name} marked as completed!`, 'success');
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, courseCompleted: true } : s));
      setSelectedStudent(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to mark completion', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return students;
    return students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));
  }, [students, search]);

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="My Students" subtitle={`${students.length} students assigned`} />
      <TeacherStudentFilters search={search} onSearchChange={setSearch} onReset={() => setSearch('')} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <TeacherStudentTable 
          students={filtered} 
          loading={loading}
          onViewProgress={handleAction} 
        />
      </div>

      <AppModal
        show={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="🎓 Mark Course Complete"
      >
        <div className="space-y-4">
          <p className="text-[#4A5568]">
            Are you sure you want to mark <strong>{selectedStudent?.name}</strong> as completed for <strong>{selectedStudent?.courseName || 'Nazra Quran'}</strong>?
          </p>
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
            ⚠ This will notify the admin to generate a graduation certificate.
          </p>
          <div className="flex gap-3 pt-2">
            <AppButton variant="secondary" fullWidth onClick={() => setSelectedStudent(null)}>Cancel</AppButton>
            <AppButton 
              variant="success" 
              fullWidth 
              loading={submitting} 
              onClick={onConfirmCompletion}
            >
              Confirm
            </AppButton>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default MyStudentsPage;
