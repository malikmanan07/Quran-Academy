import { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import ApprovalFilters from '../../components/admin/approvals/ApprovalFilters';
import PendingUsersList from '../../components/admin/approvals/PendingUsersList';
import { useToast } from '../../components/common/Toast';
import handleApiError from '../../utils/handleApiError';
import { useSearch } from '../../hooks/useSearch';
import SearchInput from '../../components/common/SearchInput';
import AppPagination from '../../components/common/AppPagination';
import TableSkeleton from '../../components/common/TableSkeleton';

const ApprovalsPage = () => {
  const fetchPending = async (params) => {
    const { data } = await http.get('/admin/users', { 
      params: { ...params, status: 'pending' } 
    });
    return { data };
  };

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
  } = useSearch(fetchPending);

  const { showToast } = useToast();


  const handleApprove = async (id) => {
    try {
      await http.put(`/admin/users/${id}/approve`);
      showToast('success', 'User approved successfully');
      refresh();
    } catch { showToast('error', 'Failed to approve user'); }
  };

  const handleReject = async (id) => {
    try {
      await http.put(`/admin/users/${id}/reject`);
      showToast('success', 'User rejected');
      refresh();
    } catch { showToast('error', 'Failed to reject user'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pending Approvals" 
        subtitle="Review and manage new student and teacher registrations"
        action={
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2">
            <span>⏳</span> {total} Pending
          </div>
        }
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
        </select>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <TableSkeleton rows={pageSize} cols={5} />
        ) : (
          <PendingUsersList 
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

export default ApprovalsPage;
