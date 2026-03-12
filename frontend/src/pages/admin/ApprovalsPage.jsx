import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import ApprovalFilters from '../../components/admin/approvals/ApprovalFilters';
import PendingUsersList from '../../components/admin/approvals/PendingUsersList';
import { useToast } from '../../components/common/Toast';
import http from '../../services/http';
import { API } from '../../constants/apiEndpoints';

const ApprovalsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { showToast } = useToast();

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/admin/pending-users');
      setUsers(data.users || []);
    } catch {
      showToast('error', 'Failed to fetch pending approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await http.put(`/admin/users/${id}/approve`);
      showToast('success', 'User approved successfully');
      fetchPending();
    } catch {
      showToast('error', 'Failed to approve user');
    }
  };

  const handleReject = async (id) => {
    try {
      await http.put(`/admin/users/${id}/reject`);
      showToast('success', 'User rejected');
      fetchPending();
    } catch {
      showToast('error', 'Failed to reject user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pending Approvals" 
        subtitle="Review and manage new student and teacher registrations"
        action={
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2">
            <span>⏳</span> {users.length} Pending
          </div>
        }
      />
      
      <ApprovalFilters 
        search={search} setSearch={setSearch} 
        roleFilter={roleFilter} setRoleFilter={setRoleFilter} 
      />
      
      <PendingUsersList 
        users={filteredUsers} 
        loading={loading} 
        onApprove={handleApprove} 
        onReject={handleReject} 
      />
    </div>
  );
};

export default ApprovalsPage;
