import PendingUserCard from './PendingUserCard';
import EmptyState from '../../common/EmptyState';
import Loader from '../../common/Loader';

const PendingUsersList = ({ users, loading, onApprove, onReject }) => {
  if (loading) return <div className="p-12"><Loader text="Loading pending approvals..." /></div>;
  if (!users?.length) return <EmptyState icon="⏳" title="No Pending Approvals" message="All caught up! There are no users waiting for approval right now." />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {users.map(user => (
        <PendingUserCard 
          key={user.id} 
          user={user} 
          onApprove={onApprove} 
          onReject={onReject} 
        />
      ))}
    </div>
  );
};

export default PendingUsersList;
