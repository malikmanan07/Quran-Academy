const features = [
  { icon: '🎯', title: 'One-on-One Classes', desc: 'Personalized attention for every student with dedicated teacher sessions.' },
  { icon: '👨‍🏫', title: 'Expert Teachers', desc: 'Certified Quran teachers with years of experience in Quranic education.' },
  { icon: '📅', title: 'Flexible Schedule', desc: 'Learn at your own pace with convenient class timings that suit you.' },
  { icon: '📱', title: 'Learn Anywhere', desc: 'Access from any device, anywhere in the world with online classes.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your learning journey with detailed reports and milestones.' },
  { icon: '🏆', title: 'Certificates', desc: 'Earn recognized certificates upon successful course completion.' },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F0F4F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">
            Why Choose Quran Academy?
          </h2>
          <p className="text-[#4A5568] max-w-2xl mx-auto">
            Everything you need for a complete Quran learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-7 shadow-md border border-[#E2E8F0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#00B4D8]/10 flex items-center justify-center text-2xl mb-5 group-hover:bg-[#00B4D8]/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">{f.title}</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
