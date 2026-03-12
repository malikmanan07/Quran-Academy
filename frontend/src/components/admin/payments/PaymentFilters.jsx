import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';

const PaymentFilters = ({ search, onSearchChange, statusFilter, onStatusChange, onReset }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E2E8F0] mb-6">
    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
      <div className="flex-1">
        <AppInput placeholder="Search by student name..." value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<span className="text-xs">🔍</span>} className="!mb-0" />
      </div>
      <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40">
        <option value="">All Status</option>
        <option value="Paid">Paid</option>
        <option value="Unpaid">Unpaid</option>
        <option value="Pending">Pending</option>
      </select>
      <AppButton variant="outline" size="md" onClick={onReset}>Reset</AppButton>
    </div>
  </div>
);

export default PaymentFilters;
