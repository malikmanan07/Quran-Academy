import { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Toast, { useToast } from '../../components/common/Toast';
import PaymentStats from '../../components/admin/payments/PaymentStats';
import PaymentFilters from '../../components/admin/payments/PaymentFilters';
import PaymentTable from '../../components/admin/payments/PaymentTable';
import { getAllPayments, updatePaymentStatus } from '../../features/payments/api';
import handleApiError from '../../utils/handleApiError';
import { useSearch } from '../../hooks/useSearch';
import SearchInput from '../../components/common/SearchInput';
import AppPagination from '../../components/common/AppPagination';
import TableSkeleton from '../../components/common/TableSkeleton';
import http from '../../services/http';

const PaymentsPage = () => {
  const { 
    data: payments, 
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
  } = useSearch(getAllPayments);

  const { toast, showToast } = useToast();

  const onMarkPaid = async (payment) => {
    try {
      await updatePaymentStatus(payment.id, { status: 'Paid' });
      showToast('Payment marked as paid');
      refresh();
    } catch (err) { showToast(handleApiError(err), 'error'); }
  };

  const onVerify = async (payment) => {
    try {
      await http.put(`/payments/${payment.id}/verify`);
      showToast('Payment verified successfully');
      refresh();
    } catch (err) { showToast(handleApiError(err), 'error'); }
  };

  const onReject = async (payment) => {
    const reason = prompt('Enter reason for rejection:');
    if (reason === null) return;
    try {
      await http.put(`/payments/${payment.id}/reject`, { reason });
      showToast('Payment rejected');
      refresh();
    } catch (err) { showToast(handleApiError(err), 'error'); }
  };


  return (
    <div>
      <Toast toast={toast} />
      <PageHeader title="Payments" subtitle={`${total} total payment records`} />
      <PaymentStats payments={payments} />
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search by student or course..." 
          className="flex-1"
        />
        <select 
          onChange={(e) => setFilters({ status: e.target.value })}
          className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid / Verified</option>
          <option value="Unpaid">Unpaid</option>
          <option value="submitted">To Verify</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <TableSkeleton rows={pageSize} cols={5} />
        ) : (
          <PaymentTable 
            payments={payments} 
            loading={loading} 
            onMarkPaid={onMarkPaid} 
            onVerify={onVerify}
            onReject={onReject}
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

export default PaymentsPage;
