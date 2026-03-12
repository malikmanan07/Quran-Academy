import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import UsersFilters from '../../components/admin/users/UsersFilters';
import UsersTable from '../../components/admin/users/UsersTable';
import { useToast } from '../../components/common/Toast';
import http from '../../services/http';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { showToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);

      const { data } = await http.get(`/admin/users?${params.toString()}`);
      setUsers(data.users || []);
    } catch {
      showToast('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter]);

  const handleApprove = async (id) => {
    try {
      await http.put(`/admin/users/${id}/approve`);
      showToast('success', 'User approved');
      fetchUsers();
    } catch { showToast('error', 'Failed to approve'); }
  };

  const handleReject = async (id) => {
    try {
      await http.put(`/admin/users/${id}/reject`);
      showToast('success', 'User rejected');
      fetchUsers();
    } catch { showToast('error', 'Failed to reject'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="All Users Management" 
        subtitle="View and filter all registered teachers and students"
        action={
          <div className="bg-[#1B3A5C] text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2">
            <span>👥</span> {users.length} Total Users
          </div>
        }
      />
      
      <UsersFilters 
        search={search} setSearch={setSearch} 
        roleFilter={roleFilter} setRoleFilter={setRoleFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <UsersTable 
          users={users} 
          loading={loading}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
};

export default UsersPage;
