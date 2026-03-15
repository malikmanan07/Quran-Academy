import { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { getClassesByStudent as fetchStudentClasses } from '../../features/classes/api';
import AppBadge from '../../components/common/AppBadge';
import AppButton from '../../components/common/AppButton';
import EmptyState from '../../components/common/EmptyState';
import Toast, { useToast } from '../../components/common/Toast';
import handleApiError from '../../utils/handleApiError';
import { useAuth } from '../../context/AuthContext';
import { cachedRequest, getCache } from '../../services/apiCache';
import GridSkeleton from '../../components/common/GridSkeleton';

// Vanilla date helpers
const formatDate = (date, pattern) => {
  const d = new Date(date);
  if (pattern === 'EEEE, MMM do') {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }
  if (pattern === 'hh:mm a') {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  return d.toLocaleString();
};
const addMins = (d, m) => new Date(d.getTime() + m * 60000);
const subMins = (d, m) => new Date(d.getTime() - m * 60000);

const statusMap = {
  scheduled: 'warning',
  completed: 'success',
  cancelled: 'danger',
  'in-progress': 'accent'
};

const platformIcons = {
  zoom: '📹',
  meet: '🌐',
  teams: '👥',
  other: '🔗'
};

const ClassesPage = () => {
  const { user } = useAuth();
  const cacheKey = `student:classes:${user?.id}`;
  const initialCache = getCache(cacheKey);
  
  const [classes, setClasses] = useState(initialCache || []);
  const [loading, setLoading] = useState(!initialCache);
  const [activeTab, setActiveTab] = useState('upcoming');
  const { toast, showToast } = useToast();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const fetch = async () => {
    // Only show loading if we don't have cached data
    if (!initialCache) setLoading(true);
    
    try {
      const data = await cachedRequest(cacheKey, async () => {
        const res = await fetchStudentClasses();
        const body = res.data?.data || res.data;
        return body.classes || [];
      }, 120); // 2 min cache
      
      setClasses(data);
    } catch (err) {
      showToast(handleApiError(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user?.id) fetch(); 
  }, [user?.id]);

  const filteredClasses = useMemo(() => {
    const sorted = [...classes].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    if (activeTab === 'upcoming') {
      return sorted.filter(c => new Date(c.scheduledAt) > subMins(now, 60) && c.status !== 'cancelled');
    }
    return sorted.filter(c => new Date(c.scheduledAt) < subMins(now, 60) || c.status === 'cancelled').reverse();
  }, [classes, activeTab, now]);

  const getJoinStatus = (scheduledAt) => {
    const startTime = new Date(scheduledAt);
    const windowStart = subMins(startTime, 10);
    const windowEnd = addMins(startTime, 60);
    
    if (now > windowStart && now < windowEnd) return 'join';
    if (now < windowStart) return 'early';
    return 'expired';
  };

  const getTimeRemaining = (scheduledAt) => {
    const diff = new Date(scheduledAt) - now;
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) return `${Math.floor(hours / 24)}d left`;
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Toast toast={toast} />
      <PageHeader 
        title="📅 My Classes" 
        subtitle="Manage your upcoming lessons and join your virtual classroom"
      />

      <div className="flex bg-white/50 p-1 rounded-xl border border-[#E2E8F0] w-fit mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'upcoming' ? 'bg-[#00B4D8] text-white shadow-md' : 'text-[#4A5568] hover:bg-white'}`}
        >
          Upcoming Classes
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'past' ? 'bg-[#00B4D8] text-white shadow-md' : 'text-[#4A5568] hover:bg-white'}`}
        >
          Past Classes
        </button>
      </div>

      {loading && classes.length === 0 ? (
        <GridSkeleton items={3} />
      ) : filteredClasses.length === 0 ? (
        <EmptyState 
          icon="📅" 
          title={activeTab === 'upcoming' ? "No Upcoming Classes" : "No Past Classes"} 
          message={activeTab === 'upcoming' ? "Your scheduled classes will appear here." : "Your past class history is empty."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map(c => {
            const joinStatus = getJoinStatus(c.scheduledAt);
            const timeRemaining = getTimeRemaining(c.scheduledAt);
            const platform = (c.meetingUrl || '').includes('zoom.us') ? 'zoom' : 
                            (c.meetingUrl || '').includes('google.com') ? 'meet' : 
                            (c.meetingUrl || '').includes('microsoft.com') ? 'teams' : 'other';

            return (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all group">
                <div className="h-2 bg-[#1B4332]/10 group-hover:bg-[#00B4D8] transition-colors" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider">{c.courseName}</p>
                      <h3 className="text-lg font-bold text-[#1A1A2E]">{formatDate(c.scheduledAt, 'EEEE, MMM do')}</h3>
                      <p className="text-sm text-[#4A5568] font-medium flex items-center gap-1.5">
                        <span className="text-base">🕒</span> {formatDate(c.scheduledAt, 'hh:mm a')} ({c.duration} mins)
                      </p>
                    </div>
                    <AppBadge variant={statusMap[c.status] || 'neutral'}>{c.status}</AppBadge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">
                        👨‍🏫
                      </div>
                      <div>
                        <p className="text-[10px] text-[#94A3B8] font-bold uppercase">Teacher</p>
                        <p className="text-sm font-bold text-[#1A1A2E]">{c.teacherName || 'Not Assigned'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-medium text-[#4A5568] flex items-center gap-1.5">
                        <span className="text-lg">{platformIcons[platform]}</span>
                        Via {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                      {timeRemaining && (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                          ⏳ {timeRemaining}
                        </span>
                      )}
                    </div>
                  </div>

                  {c.status !== 'cancelled' && (
                    <AppButton 
                      fullWidth 
                      variant={joinStatus === 'join' ? 'accent' : 'secondary'}
                      disabled={joinStatus !== 'join' || !c.meetingUrl}
                      onClick={() => window.open(c.meetingUrl, '_blank')}
                      className="rounded-xl h-12 text-sm font-bold"
                    >
                      {joinStatus === 'join' ? '🚀 Join Class Now' : 
                       joinStatus === 'early' ? '⌛ Available Soon' : '✅ Class Concluded'}
                    </AppButton>
                  )}
                  
                  {joinStatus === 'early' && c.meetingUrl && (
                    <p className="text-[10px] text-center mt-2 text-[#94A3B8] font-medium">
                      Join button activates 10 mins before start
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
