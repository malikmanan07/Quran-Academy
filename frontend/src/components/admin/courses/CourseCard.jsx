import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { useCurrency } from '../../../hooks/useCurrency';

const CourseCard = ({ course, onEdit, onDelete }) => {
  const { formatCurrency } = useCurrency();
  return (
  <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col">
    <div className="bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] p-6 text-center relative">
      <span className="text-4xl group-hover:scale-110 transition-transform inline-block">📚</span>
      {course.level && (
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">{course.level}</span>
      )}
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">{course.name}</h3>
      <p className="text-sm text-[#4A5568] mb-3 line-clamp-2 flex-1">{course.description || 'No description'}</p>
      <div className="flex items-center gap-2 mb-3">
        {course.duration && <span className="text-xs bg-[#F0F4F8] text-[#4A5568] px-2 py-0.5 rounded-full">{course.duration}</span>}
        <AppBadge status={course.isActive !== false ? 'Active' : 'Inactive'} />
      </div>
      {course.price && (
        <p className="text-xl font-bold text-[#00B4D8] mb-4">{formatCurrency(course.price)}<span className="text-xs text-[#4A5568] font-normal">/month</span></p>
      )}
      <div className="flex gap-2">
        <AppButton variant="outline" size="sm" fullWidth onClick={() => onEdit(course)}>Edit</AppButton>
        <AppButton variant="danger" size="sm" fullWidth onClick={() => onDelete(course)}>Delete</AppButton>
      </div>
    </div>
  </div>
  );
};

export default CourseCard;
