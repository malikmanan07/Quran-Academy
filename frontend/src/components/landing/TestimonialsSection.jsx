const testimonials = [
  {
    text: 'My child learned to read Quran in just 4 months. Amazing teachers and very professional approach!',
    name: 'Sara Ahmed', location: 'Karachi', initials: 'SA',
  },
  {
    text: 'The flexible schedule fits perfectly with my work routine. Highly recommended for working professionals!',
    name: 'Ali Hassan', location: 'Lahore', initials: 'AH',
  },
  {
    text: 'Best online Quran academy. My entire family is enrolled and the kids love their teachers!',
    name: 'Fatima Malik', location: 'Islamabad', initials: 'FM',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] relative overflow-hidden w-full max-w-full">
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#00B4D8]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#00B4D8]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            What Our Students Say
          </h2>
          <p className="text-white/60">Real feedback from our beloved students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-7 border border-white/10 hover:bg-white/15 transition-colors duration-300"
            >
              <div className="flex items-center gap-1 text-amber-400 text-sm mb-4">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00B4D8]/20 border border-[#00B4D8]/30 flex items-center justify-center text-white text-xs font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-white/50 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
