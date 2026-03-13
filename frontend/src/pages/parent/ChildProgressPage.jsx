import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import DashboardLoadingSkeleton from '../../components/common/DashboardLoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { getChildProgress } from '../../features/parent/api';

const ChildProgressPage = () => {
  const { id } = useParams();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getChildProgress(id);
        setProgress(res.data?.data?.progress || []);
      } catch { setProgress([]); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <DashboardLoadingSkeleton />;

  return (
    <div>
      <PageHeader title="📈 Child's Progress" subtitle="Detailed progress reports" />
      <Link to="/parent/dashboard" className="text-sm text-[#00B4D8] hover:underline mb-4 inline-block">← Back to Dashboard</Link>
      {progress.length === 0 ? (
        <EmptyState icon="📈" title="No Progress Yet" message="Progress reports will appear here" />
      ) : (
        <div className="space-y-3">
          {progress.map(p => (
            <div key={p.id} className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-[#1A1A2E]">{p.lesson}</h3>
                {p.rating && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#00B4D8]/10 text-[#00B4D8] font-medium">
                    ⭐ {p.rating}/5
                  </span>
                )}
              </div>
              {p.lessonCovered && <p className="text-xs text-[#4A5568] mb-1">📖 {p.lessonCovered}</p>}
              {p.tajweedNotes && <p className="text-xs text-[#4A5568] mb-1">🎵 {p.tajweedNotes}</p>}
              {p.homework && <p className="text-xs text-[#4A5568]">📝 {p.homework}</p>}
              <p className="text-[10px] text-[#4A5568] mt-2">{new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildProgressPage;
