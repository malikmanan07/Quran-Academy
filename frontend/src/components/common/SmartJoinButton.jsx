import { useState, useEffect } from 'react';

// Platform icons mapping
export const PLATFORM_ICONS = {
  zoom: '🎥',
  meet: '📹',
  teams: '🔵',
  whereby: '🟣',
  other: '📞'
};

export const PLATFORM_COLORS = {
  zoom: 'bg-blue-100 text-blue-800 border-blue-200',
  meet: 'bg-green-100 text-green-800 border-green-200',
  teams: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  whereby: 'bg-purple-100 text-purple-800 border-purple-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200'
};

const SmartJoinButton = ({ meetingLink, meetingPlatform = 'other', date, time, status }) => {
  const [btnState, setBtnState] = useState({ text: 'Join Class', disabled: true, style: 'bg-gray-300 text-gray-500 cursor-not-allowed' });
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!meetingLink || status === 'cancelled' || status === 'completed') {
      let text = !meetingLink ? 'No Link' : status === 'completed' ? 'Class Ended' : 'Cancelled';
      setBtnState({ text, disabled: true, style: 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300' });
      setCountdown('');
      return;
    }

    const updateTimer = () => {
      if (!date || !time) {
        setBtnState({ text: 'Join Now', disabled: false, style: 'bg-[#00B4D8] text-white hover:bg-[#0096B4]' });
        return;
      }

      // Convert class time to Date object
      const classDateTime = new Date(`${date}T${time}`);
      const now = new Date();
      const diffMs = classDateTime - now;
      const diffMins = Math.floor(diffMs / 60000);

      // Past class logic (assuming classes are ~1 hour long)
      if (diffMins < -60) {
        setBtnState({ text: 'Class Ended', disabled: true, style: 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300' });
        setCountdown('');
        return;
      }

      // Live class logic (between start time and 1 hr after)
      if (diffMins <= 0 && diffMins > -60) {
        setBtnState({ text: 'Live • Join Now', disabled: false, style: 'bg-green-500 text-white hover:bg-green-600 animate-pulse border border-green-600 shadow-md' });
        setCountdown('Class is live now');
        return;
      }

      // Upcoming class logic
      if (diffMins <= 15) {
        setBtnState({ text: 'Join Now →', disabled: false, style: 'bg-[#00B4D8] text-white hover:bg-[#0096B4] shadow-md border border-[#0096B4]' });
        setCountdown(`Starts in ${diffMins} min`);
      } else {
        setBtnState({ text: 'Join Class', disabled: true, style: 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' });
        
        // Format countdown smoothly
        const hrs = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        if (hrs > 24) {
          const days = Math.floor(hrs / 24);
          setCountdown(`In ${days} day${days > 1 ? 's' : ''}`);
        } else if (hrs > 0) {
          setCountdown(`In ${hrs}h ${mins}m`);
        } else {
          setCountdown(`In ${mins} min`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [meetingLink, date, time, status]);

  const platform = meetingPlatform?.toLowerCase() || 'other';

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 leading-none h-5 ${PLATFORM_COLORS[platform] || PLATFORM_COLORS.other}`}>
          {PLATFORM_ICONS[platform] || PLATFORM_ICONS.other} {platform.toUpperCase()}
        </span>
        <button 
          disabled={btnState.disabled}
          onClick={() => {
            if (!btnState.disabled && meetingLink) {
              window.open(meetingLink, '_blank', 'noopener,noreferrer');
            }
          }}
          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${btnState.style}`}
        >
          {btnState.text}
        </button>
      </div>
      {countdown && <span className="text-[10px] text-[#4A5568] font-medium px-1">{countdown}</span>}
    </div>
  );
};

export default SmartJoinButton;
