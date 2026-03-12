const steps = [
  { num: 1, icon: '📝', title: 'Register', desc: 'Create your account and tell us your learning goals.' },
  { num: 2, icon: '👨‍🏫', title: 'Get Matched', desc: 'We match you with the perfect teacher based on your needs.' },
  { num: 3, icon: '🚀', title: 'Start Learning', desc: 'Begin your personalized Quran learning journey.' },
];

const Arrow = () => (
  <div className="hidden lg:flex items-center justify-center">
    <svg className="w-16 h-8 text-[#00B4D8]" viewBox="0 0 64 24" fill="none">
      <path d="M0 12h56m0 0l-8-8m8 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F0F4F8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">How It Works</h2>
          <p className="text-[#4A5568]">Get started in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-0 items-start">
          {steps.map((s, i) => (
            <div key={i} className="contents">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#1B3A5C] text-white flex items-center justify-center text-2xl font-extrabold mb-4 shadow-lg">
                  {s.num}
                </div>
                <span className="text-3xl mb-3">{s.icon}</span>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{s.title}</h3>
                <p className="text-sm text-[#4A5568] max-w-[200px] leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && <Arrow />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
