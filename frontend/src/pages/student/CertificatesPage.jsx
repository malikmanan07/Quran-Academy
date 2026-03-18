import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { getMyCertificates } from '../../features/certificates/api';
import TableSkeleton from '../../components/common/TableSkeleton';
import { downloadCertificate } from '../../utils/generateCertificate';
import { useToast } from '../../components/common/Toast';
import Toast from '../../components/common/Toast';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const { toast, showToast } = useToast();

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const res = await getMyCertificates();
      const body = res.data?.data || res.data || [];
      const list = Array.isArray(body) ? body : body.certificates || [];
      setCertificates(list);
    } catch (err) {
      showToast('Failed to fetch certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleDownload = async (cert) => {
    setDownloadingId(cert.id);
    try {
      await downloadCertificate({
        studentName: cert.studentName,
        courseName: cert.courseName,
        teacherName: cert.teacherName,
        completionDate: cert.completionDate || cert.generatedAt,
        certificateNumber: cert.certificateNumber
      });
      showToast('Certificate downloaded successfully! 🏆', 'success');
    } catch (err) {
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Toast toast={toast} />
      <PageHeader 
        title="🎓 My Certificates" 
        subtitle="View and download your official graduation certificates"
      />
      
      {loading ? (
        <TableSkeleton rows={4} />
      ) : certificates.length === 0 ? (
        <EmptyState 
          icon="🎓" 
          title="No Certificates Yet" 
          message="Complete your course and have your teacher mark it as finished to earn your certificate."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <div key={cert.id} className="relative bg-white p-8 rounded-3xl shadow-sm border border-[#E2E8F0] flex flex-col items-center text-center group hover:shadow-xl transition-all overflow-hidden border-t-4 border-t-[#00B4D8]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00B4D8]/5 rounded-bl-full flex items-center justify-center -mr-4 -mt-4 group-hover:bg-[#00B4D8]/10 transition-colors">
                 <span className="text-4xl opacity-20">🏆</span>
              </div>
              
              <div className="w-20 h-20 bg-[#F8FAFC] rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-[#E2E8F0] rotate-3 group-hover:rotate-0 transition-transform">
                🎓
              </div>
              
              <div className="space-y-1 mb-2">
                 <p className="text-[10px] font-bold text-[#00B4D8] uppercase tracking-widest">{cert.certificateNumber}</p>
                 <h3 className="text-xl font-black text-[#1A1A2E] leading-tight">{cert.courseName}</h3>
                 <p className="text-sm font-medium text-[#4A5568]">Instructor: {cert.teacherName}</p>
              </div>
              
              <div className="w-12 h-0.5 bg-[#D4AF37] my-4 rounded-full opacity-50 group-hover:w-20 transition-all"></div>
              
              <p className="text-xs text-[#94A3B8] mb-6">Generated on: {new Date(cert.generatedAt).toLocaleDateString()}</p>
              
              <button 
                onClick={() => handleDownload(cert)}
                disabled={downloadingId === cert.id}
                className={`w-full py-3.5 rounded-2xl font-bold bg-[#1B3A5C] text-white hover:bg-[#1B4332] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1B3A5C]/10 ${downloadingId === cert.id ? 'opacity-70 cursor-wait' : ''}`}
              >
                {downloadingId === cert.id ? (
                  <>⌛ Generating PDF...</>
                ) : (
                  <>📥 Download Certificate</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
