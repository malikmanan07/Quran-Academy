import { useState, useEffect } from 'react';
import Select from 'react-select';
import AppModal from '../common/AppModal';
import AppButton from '../common/AppButton';
import http from '../../services/http';
import { useCurrency } from '../../hooks/useCurrency';
import { TIMEZONE_CURRENCY } from '../../context/CurrencyContext';

const countries = [
  { value: 'PK', label: 'Pakistan', timezone: 'Asia/Karachi', dialCode: '+92' },
  { value: 'US', label: 'United States', timezone: 'America/New_York', dialCode: '+1' },
  { value: 'GB', label: 'United Kingdom', timezone: 'Europe/London', dialCode: '+44' },
  { value: 'SA', label: 'Saudi Arabia', timezone: 'Asia/Riyadh', dialCode: '+966' },
  { value: 'AE', label: 'UAE', timezone: 'Asia/Dubai', dialCode: '+971' },
  { value: 'CA', label: 'Canada', timezone: 'America/Toronto', dialCode: '+1' },
  { value: 'AU', label: 'Australia', timezone: 'Australia/Sydney', dialCode: '+61' },
  { value: 'DE', label: 'Germany', timezone: 'Europe/Berlin', dialCode: '+49' },
  { value: 'FR', label: 'France', timezone: 'Europe/Paris', dialCode: '+33' },
  { value: 'TR', label: 'Turkey', timezone: 'Europe/Istanbul', dialCode: '+90' },
  { value: 'MY', label: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', dialCode: '+60' },
  { value: 'ID', label: 'Indonesia', timezone: 'Asia/Jakarta', dialCode: '+62' },
  { value: 'BD', label: 'Bangladesh', timezone: 'Asia/Dhaka', dialCode: '+880' },
  { value: 'IN', label: 'India', timezone: 'Asia/Kolkata', dialCode: '+91' },
  { value: 'EG', label: 'Egypt', timezone: 'Africa/Cairo', dialCode: '+20' },
  { value: 'JO', label: 'Jordan', timezone: 'Asia/Amman', dialCode: '+962' },
  { value: 'NG', label: 'Nigeria', timezone: 'Africa/Lagos', dialCode: '+234' },
  { value: 'ZA', label: 'South Africa', timezone: 'Africa/Johannesburg', dialCode: '+27' },
  { value: 'SG', label: 'Singapore', timezone: 'Asia/Singapore', dialCode: '+65' },
  { value: 'QA', label: 'Qatar', timezone: 'Asia/Qatar', dialCode: '+974' },
  { value: 'KW', label: 'Kuwait', timezone: 'Asia/Kuwait', dialCode: '+965' },
  { value: 'OM', label: 'Oman', timezone: 'Asia/Muscat', dialCode: '+968' },
  { value: 'BH', label: 'Bahrain', timezone: 'Asia/Bahrain', dialCode: '+973' },
];

const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;

const dayOptions = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'white',
    borderColor: state.isFocused ? '#00B4D8' : '#D1D5DB',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(0, 180, 216, 0.4)' : null,
    '&:hover': {
      borderColor: state.isFocused ? '#00B4D8' : '#9CA3AF',
    },
    minHeight: '44px',
    borderRadius: '0.5rem',
  }),
  option: (base, state) => ({
    ...base,
    color: '#111827',
    backgroundColor: state.isFocused ? '#F3F4F6' : 'white',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#E5E7EB',
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: '#111827',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9CA3AF',
  }),
};

const TrialBookingModal = ({ show, onClose }) => {
  const { rates, currency, formatCurrency, setCurrency, setCurrencyByCountry } = useCurrency();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: null,
    timezone: '',
    courseId: '',
    preferredTime: '',
    preferredDays: [],
    message: '',
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      const fetchCourses = async () => {
        try {
          const response = await http.get('/courses');
          console.log('Courses fetched:', response.data);
          setCourses(response.data.data.courses || []);
        } catch (error) {
          console.error("Failed to fetch courses:", error);
          setCourses([]);
        }
      };
      fetchCourses();

      // Detect timezone and country
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const detectedCountry = countries.find(c => c.timezone === tz) || countries[0];
      setForm(prev => ({
        ...prev,
        timezone: tz,
        country: detectedCountry
      }));

      // Sync currency to detected country
      if (detectedCountry.value) {
        setCurrencyByCountry(detectedCountry.value);
      }
    }
  }, [show]);

  const handleCountryChange = (selected) => {
    setForm(prev => ({
      ...prev,
      country: selected,
      timezone: selected.timezone,
    }));
    // Sync currency globally
    if (selected?.value) {
      setCurrencyByCountry(selected.value);
    }
  };

  const handleDayToggle = (day) => {
    setForm(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day]
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.phone) e.phone = 'Phone number is required';
    if (!form.courseId) e.courseId = 'Please select a course';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await http.post('/trial/book', {
        ...form,
        phone: `${form.country?.dialCode || '+92'}${form.phone || ''}`,
        country: form.country?.label,
        courseId: parseInt(form.courseId),
        preferredDays: form.preferredDays.join(', '),
      });
      setSuccess(true);
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset to local timezone currency
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localCurrency = TIMEZONE_CURRENCY[tz] || 'USD';
    setCurrency(localCurrency);

    setSuccess(false);
    setForm({
      fullName: '', email: '', phone: '', country: null, timezone: '',
      courseId: '', preferredTime: '', preferredDays: [], message: ''
    });
    setErrors({});
    onClose();
  };

  if (success) {
    return (
      <AppModal show={show} onClose={handleClose} title="Request Submitted! 🎉" size="sm">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-green-600">✅</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-1">Your request has been submitted successfully.</p>
          <p className="text-gray-600 mb-6">We'll contact you within 24 hours at <strong className="text-gray-900">{form.email}</strong></p>
          <AppButton variant="accent" fullWidth onClick={handleClose}>Close</AppButton>
        </div>
      </AppModal>
    );
  }

  return (
    <AppModal show={show} onClose={handleClose} title="📖 Book Free Trial Class" size="md">
      <form onSubmit={handleSubmit} className="space-y-5 py-2">
        {errors.form && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{errors.form}</div>}

        {/* Row 1: Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name*</label>
          <input
            id="fullName"
            type="text"
            className={`w-full bg-white border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8]`}
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>

        {/* Row 2: Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address*</label>
          <input
            id="email"
            type="email"
            className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8]`}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Row 3: Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number*</label>
          {(() => {
            const selectedCountry = form.country || countries[0];
            const selectedDialCode = selectedCountry?.dialCode || '+92';
            const countryCode = selectedCountry?.value || 'PK';
            return (
              <div
                className={`flex border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#00B4D8]/40 focus-within:border-[#00B4D8]`}
              >
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border-r border-gray-300 min-w-[80px]">
                  <img
                    src={getFlagUrl(countryCode)}
                    alt={selectedCountry?.label}
                    width="24"
                    height="18"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.classList.remove('hidden');
                      }
                    }}
                  />
                  <span className="hidden bg-[#00B4D8] text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    {countryCode}
                  </span>
                  <span className="text-gray-700 font-medium text-sm">
                    {selectedDialCode}
                  </span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="300 1234567"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value.replace(/[^\d\s]/g, '') })
                  }
                  className="flex-1 px-3 py-2.5 outline-none text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
            );
          })()}
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        {/* Row 4: Country | Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">Country*</label>
            <Select
              inputId="country"
              options={countries}
              value={form.country}
              onChange={handleCountryChange}
              styles={customStyles}
              placeholder="Select country"
              formatOptionLabel={(country) => (
                <div className="flex items-center gap-2">
                  <img
                    src={getFlagUrl(country.value)}
                    width="24"
                    height="18"
                    alt={country.label}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.classList.remove('hidden');
                      }
                    }}
                  />
                  <span className="hidden bg-[#00B4D8] text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    {country.value}
                  </span>
                  <span>{country.label}</span>
                </div>
              )}
            />
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1.5">Timezone*</label>
            <input
              id="timezone"
              type="text"
              readOnly
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-600 text-sm outline-none"
              value={form.timezone}
              placeholder="Auto-filled"
            />
          </div>
        </div>

        {/* Row 5: Preferred Course */}
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Course*</label>
          <select
            id="courseId"
            aria-label="Preferred Course*"
            className={`w-full bg-white border ${errors.courseId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8]`}
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
          >
            <option value="">Select a course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} — {formatCurrency(c.price)}/month
              </option>
            ))}
          </select>
          {errors.courseId && <p className="mt-1 text-xs text-red-500">{errors.courseId}</p>}
        </div>

        {/* Row 6: Preferred Time | Preferred Days */}
        <div className="space-y-4">
          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Time</label>
            <select
              id="preferredTime"
              aria-label="Preferred Time"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8]"
              value={form.preferredTime}
              onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
            >
              <option value="">Select preferred time</option>
              <option value="morning">🌅 Morning (6AM - 12PM)</option>
              <option value="afternoon">☀️ Afternoon (12PM - 5PM)</option>
              <option value="evening">🌆 Evening (5PM - 10PM)</option>
              <option value="night">🌙 Night (10PM - 12AM)</option>
              <option value="flexible">🕐 Flexible (Any Time)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Days</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {dayOptions.map(day => (
                <label key={day} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-[#00B4D8] checked:bg-[#00B4D8] transition-all"
                      checked={form.preferredDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                    />
                    <svg className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Row 7: Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message (Optional)</label>
          <textarea
            id="message"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8] resize-none"
            placeholder="Any specific requirements or questions..."
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>

        {/* Row 8: Submit */}
        <AppButton
          type="submit"
          variant="accent"
          fullWidth
          size="lg"
          loading={loading}
          className="shadow-md hover:shadow-lg transform transition-all active:scale-[0.98]"
        >
          {loading ? 'Submitting...' : 'Book Free Trial Now'}
        </AppButton>
      </form>

    </AppModal>
  );
};

export default TrialBookingModal;
