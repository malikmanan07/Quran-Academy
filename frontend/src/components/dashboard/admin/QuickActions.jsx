import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const actions = [
  { icon: '👨‍🎓', label: 'Add Student', path: ROUTES.ADMIN_STUDENTS, color: 'bg-[#1B3A5C]/10 hover:bg-[#1B3A5C]/20' },
  { icon: '👨‍🏫', label: 'Add Teacher', path: ROUTES.ADMIN_TEACHERS, color: 'bg-[#1B4332]/10 hover:bg-[#1B4332]/20' },
  { icon: '📅', label: 'Schedule Class', path: ROUTES.ADMIN_CLASSES, color: 'bg-[#00B4D8]/10 hover:bg-[#00B4D8]/20' },
  { icon: '💰', label: 'View Payments', path: ROUTES.ADMIN_PAYMENTS, color: 'bg-green-100 hover:bg-green-200' },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="p-5 border-b border-[#E2E8F0]">
        <h3 className="text-base font-semibold text-[#1A1A2E]">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={() => navigate(a.path)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors duration-200 cursor-pointer ${a.color}`}
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs font-medium text-[#1A1A2E]">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
