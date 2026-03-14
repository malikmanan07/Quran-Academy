import { Link, useOutletContext } from 'react-router-dom';
import AppButton from '../common/AppButton';
import { ROUTES } from '../../constants/routes';
import { useCurrency } from '../../hooks/useCurrency';
// Removed local utils imports to use context-based formatting

const courses = [
  {
    icon: '📖', title: 'Nazra Quran', level: 'Beginner',
    duration: '3-6 Months', desc: 'Learn to read Quran with proper pronunciation and fluency.',
    price: 2000, badge: 'Most Popular',
  },
  {
    icon: '🧠', title: 'Hifz ul Quran', level: 'Intermediate',
    duration: '2-3 Years', desc: 'Memorize the complete Holy Quran with expert guidance.',
    price: 3500, badge: null,
  },
  {
    icon: '🎵', title: 'Tajweed ul Quran', level: 'All Levels',
    duration: '6-12 Months', desc: 'Master the rules of Quran recitation with perfect pronunciation.',
    price: 2500, badge: null,
  },
  {
    icon: '☪️', title: 'Islamic Studies', level: 'All Ages',
    duration: 'Ongoing', desc: 'Comprehensive Islamic education covering Fiqh, Hadith and Seerah.',
    price: 1500, badge: null,
  },
];

const CoursesSection = () => {
  const { formatCurrency } = useCurrency();

  return (
    <section id="courses" className="py-16 sm:py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Our Courses</h2>
          <p className="text-[#4A5568] max-w-2xl mx-auto">Choose the perfect course for your learning journey</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((c, i) => (
            <div key={i} className="rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex flex-col">
              <div className="relative bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] py-8 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{c.icon}</span>
                {c.badge && (
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#00B4D8] text-white text-xs font-semibold">{c.badge}</span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">{c.title}</h3>
                <div className="flex items-center gap-3 text-xs text-[#4A5568] mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-[#F0F4F8]">{c.level}</span>
                  <span>{c.duration}</span>
                </div>
                <p className="text-sm text-[#4A5568] leading-relaxed mb-4 flex-1">{c.desc}</p>
                <p className="text-2xl font-extrabold text-[#00B4D8] mb-4">
                  {formatCurrency(c.price)}
                  <span className="text-sm font-normal text-[#4A5568]">/month</span>
                </p>
                <Link to={ROUTES.SIGNUP}>
                  <AppButton variant="primary" fullWidth size="md">Enroll Now</AppButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
