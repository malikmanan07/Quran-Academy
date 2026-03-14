import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';

const CertificatesPage = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader 
        title="🏆 My Certificates" 
        subtitle="View and download your earned graduation certificates"
      />
      
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-12 text-center">
        <EmptyState 
          icon="🎓" 
          title="No Certificates Yet" 
          message="Complete your courses and exams successfully to earn certificates of completion."
        />
      </div>
    </div>
  );
};

export default CertificatesPage;
