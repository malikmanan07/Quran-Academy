import { useState, useEffect, useCallback } from 'react';
import http from '../../services/http';
import PageHeader from '../../components/common/PageHeader';
import UsersFilters from '../../components/admin/users/UsersFilters';
import UsersTable from '../../components/admin/users/UsersTable';
import { useToast } from '../../components/common/Toast';
import handleApiError from '../../utils/handleApiError';
import { useSearch } from '../../hooks/useSearch';
import SearchInput from '../../components/common/SearchInput';
import AppPagination from '../../components/common/AppPagination';
import TableSkeleton from '../../components/common/TableSkeleton';

const UsersPage = () => {
  const fetchUsers = useCallback(async (params) => {
    return http.get('/admin/users', { params });
  }, []);

  const { 
    data: users, 
    loading, 
    total, 
    page, 
    setPage, 
    pageSize, 
    setPageSize, 
    search, 
    setSearch, 
    setFilters,
    refresh 
  } = useSearch(fetchUsers);

  const { showToast } = useToast();


  const handleApprove = async (id) => {
    try {
      await http.put(`/admin/users/${id}/approve`);
      showToast('success', 'User approved');
      refresh();
    } catch { showToast('error', 'Failed to approve'); }
  };

  const handleReject = async (id) => {
    try {
      await http.put(`/admin/users/${id}/reject`);
      showToast('success', 'User rejected');
      refresh();
    } catch { showToast('error', 'Failed to reject'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="All Users Management" 
        subtitle={`${total} total registered users`}
      />
      
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search by name or email..." 
          className="flex-1"
        />
        <select 
          onChange={(e) => setFilters({ role: e.target.value })}
          className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <select 
          onChange={(e) => setFilters({ status: e.target.value })}
          className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <TableSkeleton rows={pageSize} cols={5} />
        ) : (
          <UsersTable 
            users={users} 
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>

      <AppPagination 
        total={total} 
        page={page} 
        pageSize={pageSize} 
        onPageChange={setPage} 
        onPageSizeChange={setPageSize} 
      />
    </div>
  );
};

export default UsersPage;
