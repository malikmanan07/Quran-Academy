import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';

const TeacherStudentFilters = ({ search, onSearchChange, onReset }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E2E8F0] mb-6">
    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
      <div className="flex-1">
        <AppInput placeholder="Search by name..." value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<span className="text-xs">🔍</span>} className="!mb-0" />
      </div>
      <AppButton variant="outline" size="md" onClick={onReset}>Reset</AppButton>
    </div>
  </div>
);

export default TeacherStudentFilters;
