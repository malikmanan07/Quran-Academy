import { useState, useEffect } from 'react';
import { getMyCertificates } from '../../features/certificates/api';
import { downloadCertificate } from '../../utils/generateCertificate';
import AppButton from '../common/AppButton';
import EmptyState from '../common/EmptyState';
import Toast, { useToast } from '../common/Toast';

const MyCertificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyCertificates();
        setCerts(res.data?.data?.certificates || []);
      } catch { setCerts([]); }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleDownload = async (cert) => {
    try {
      await downloadCertificate({
        studentName: cert.studentName,
        courseName: cert.courseName,
        teacherName: cert.teacherName || 'Academy Instructor',
        completionDate: cert.completionDate || cert.generatedAt,
        certificateNumber: cert.certificateNumber
      });
      showToast('Certificate downloaded! 🏆');
    } catch (err) { 
      showToast('Download failed', 'error'); 
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (certs.length === 0) {
    return <EmptyState icon="🏆" title="No Certificates Yet" message="Complete a course to earn your first certificate!" />;
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <Toast toast={toast} />
      <div className="p-4 border-b border-[#E2E8F0]">
        <h3 className="font-bold text-[#1A1A2E] flex items-center gap-2">🏆 My Certificates</h3>
      </div>
      <div className="divide-y divide-[#E2E8F0]">
        {certs.map(cert => (
          <div key={cert.id} className="flex items-center justify-between p-4 hover:bg-[#F0F4F8] transition-colors">
            <div>
              <p className="font-semibold text-sm text-[#1A1A2E]">{cert.courseName}</p>
              <p className="text-xs text-[#4A5568]">
                {new Date(cert.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <AppButton variant="accent" size="sm" onClick={() => handleDownload(cert)}>
              📥 Download
            </AppButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCertificates;
