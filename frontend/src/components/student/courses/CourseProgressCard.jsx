import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';

const CourseProgressCard = ({ course }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all">
    <div className="bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] p-6 text-center">
      <span className="text-4xl">📚</span>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">{course.name || course.courseName}</h3>
      <p className="text-sm text-[#4A5568] mb-3">{course.teacherName || 'Teacher'}</p>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-[#4A5568] mb-1">
          <span>Progress</span>
          <span className="font-semibold text-[#00B4D8]">{course.progress || 0}%</span>
        </div>
        <div className="w-full bg-[#E2E8F0] rounded-full h-2">
          <div className="bg-[#00B4D8] h-2 rounded-full transition-all" style={{ width: `${course.progress || 0}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-[#4A5568] mb-4">
        <span>{course.classesAttended || 0} / {course.totalClasses || 0} Classes</span>
        <AppBadge status={course.isActive !== false ? 'Active' : 'Completed'} />
      </div>
      <AppButton variant="outline" size="sm" fullWidth>View Details</AppButton>
    </div>
  </div>
);

export default CourseProgressCard;
