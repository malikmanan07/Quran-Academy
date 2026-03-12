import { useState } from 'react';
import AppButton from '../../common/AppButton';
import AppBadge from '../../common/AppBadge';
import { formatDate } from '../../../utils/formatDate';

const PendingUserCard = ({ user, onApprove, onReject }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-gradient-to-r from-[#1B3A5C] to-[#1B4332] p-4 flex items-center gap-4">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-white/20 object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xl font-bold text-white uppercase backdrop-blur-sm">
            {initials}
          </div>
        )}
        <div className="flex-1 text-white">
          <h3 className="font-semibold text-lg truncate">{user.name}</h3>
          <AppBadge variant={user.role === 'teacher' ? 'accent' : 'warning'} size="sm" className="mt-1">
            {user.role}
          </AppBadge>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="text-sm text-[#4A5568] flex items-center gap-2">
          <span>✉️</span> <span className="truncate">{user.email}</span>
        </div>
        <div className="text-sm text-[#4A5568] flex items-center gap-2">
          <span>📞</span> <span>{user.phone || 'N/A'}</span>
        </div>
        <div className="text-sm text-[#4A5568] flex items-center gap-2">
          <span>📅</span> <span>Signed up: {formatDate(user.createdAt)}</span>
        </div>
      </div>

      <div className="p-4 border-t border-[#E2E8F0] flex gap-3">
        {showConfirm ? (
          <div className="flex-1 flex gap-2">
            <AppButton variant="danger" fullWidth onClick={() => onReject(user.id)}>Ensure Reject</AppButton>
            <AppButton variant="outline" fullWidth onClick={() => setShowConfirm(false)}>Cancel</AppButton>
          </div>
        ) : (
          <>
            <AppButton variant="outline" fullWidth onClick={() => setShowConfirm(true)} className="!text-red-500 hover:!bg-red-50 hover:!border-red-200">
              Reject
            </AppButton>
            <AppButton variant="primary" fullWidth onClick={() => onApprove(user.id)} className="!bg-green-600 hover:!bg-green-700">
              Approve
            </AppButton>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingUserCard;
