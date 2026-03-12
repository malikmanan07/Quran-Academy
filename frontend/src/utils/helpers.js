// Date Format
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Time Format
export const formatTime = (time) => {
  if (!time) return '';
  const [hour, minute] = time.split(':');
  const h = parseInt(hour);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
};

// Get Role Dashboard Path
export const getRolePath = (role) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'teacher') return '/teacher/dashboard';
  if (role === 'student') return '/student/dashboard';
  return '/';
};

// Meeting Platform Badge Color
export const getPlatformColor = (platform) => {
  if (platform === 'Zoom') return '#2D8CFF';
  if (platform === 'Google Meet') return '#4CAF82';
  if (platform === 'Microsoft Teams') return '#7C6FCD';
  if (platform === 'Skype') return '#00AFF0';
  return '#1B2A4A';
};

// Class Status Color
export const getStatusColor = (status) => {
  if (status === 'Regular') return 'var(--teal)';
  if (status === 'Leave') return 'var(--coral)';
  if (status === 'Cancelled') return 'var(--pink)';
  return 'var(--navy)';
};

// Truncate Text
export const truncate = (text, length = 30) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};