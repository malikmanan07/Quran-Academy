const countries = [
  { flag: '🇵🇰', name: 'Pakistan' }, { flag: '🇺🇸', name: 'USA' },
  { flag: '🇬🇧', name: 'UK' }, { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇦🇪', name: 'UAE' }, { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇦🇺', name: 'Australia' }, { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇫🇷', name: 'France' }, { flag: '🇹🇷', name: 'Turkey' },
  { flag: '🇲🇾', name: 'Malaysia' }, { flag: '🇮🇩', name: 'Indonesia' },
  { flag: '🇧🇩', name: 'Bangladesh' }, { flag: '🇮🇳', name: 'India' },
  { flag: '🇪🇬', name: 'Egypt' }, { flag: '🇯🇴', name: 'Jordan' },
  { flag: '🇳🇬', name: 'Nigeria' }, { flag: '🇿🇦', name: 'South Africa' },
  { flag: '🇸🇬', name: 'Singapore' }, { flag: '🇶🇦', name: 'Qatar' },
];

const CountriesSection = () => {
  const doubled = [...countries, ...countries];

  return (
    <section className="py-12 sm:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">
          Students From Around The World
        </h2>
        <p className="text-[#4A5568] max-w-xl mx-auto">
          Join our global community of Quran learners from 20+ countries
        </p>
      </div>

      {/* Scrolling banner */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
        
        <div className="flex animate-scroll-x w-max">
          {doubled.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] px-4 py-3 mx-2 rounded-xl bg-[#F0F4F8] hover:bg-[#00B4D8]/10 transition-colors duration-300 flex-shrink-0"
            >
              <span className="text-3xl sm:text-4xl mb-1">{c.flag}</span>
              <span className="text-xs font-medium text-[#4A5568] whitespace-nowrap">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountriesSection;
