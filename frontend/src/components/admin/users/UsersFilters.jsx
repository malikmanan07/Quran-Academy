import AppInput from '../../common/AppInput';
import AppSelect from '../../common/AppSelect';

const UsersFilters = ({ search, setSearch, roleFilter, setRoleFilter, statusFilter, setStatusFilter }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0] mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <AppInput
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<span className="text-[#A0AEC0]">🔍</span>}
          className="!mb-0"
        />
      </div>
      <div className="w-full md:w-48">
        <AppSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={[
            { value: '', label: 'All Roles' },
            { value: 'student', label: 'Students' },
            { value: 'teacher', label: 'Teachers' }
          ]}
          className="!mb-0"
        />
      </div>
      <div className="w-full md:w-48">
        <AppSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'rejected', label: 'Rejected' }
          ]}
          className="!mb-0"
        />
      </div>
    </div>
  );
};

export default UsersFilters;
