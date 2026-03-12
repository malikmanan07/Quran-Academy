import AppButton from '../common/AppButton';

const teachers = [
  { name: 'Ustaz Ahmad Ali', spec: 'Tajweed Expert', rating: 4.9, students: 120, initials: 'AA' },
  { name: 'Ustaza Fatima Khan', spec: 'Hifz Specialist', rating: 4.8, students: 85, initials: 'FK' },
  { name: 'Ustaz Muhammad Hassan', spec: 'Nazra Teacher', rating: 4.9, students: 200, initials: 'MH' },
  { name: 'Ustaza Aisha Malik', spec: 'Islamic Studies', rating: 4.7, students: 95, initials: 'AM' },
];

const TeachersSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Meet Our Teachers</h2>
          <p className="text-[#4A5568]">Qualified and experienced Quran teachers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] mx-auto flex items-center justify-center text-white text-xl font-bold mb-4">
                {t.initials}
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">{t.name}</h3>
              <p className="text-sm text-[#00B4D8] font-medium mb-3">{t.spec}</p>
              <div className="flex items-center justify-center gap-1 text-sm text-amber-500 mb-1">
                ⭐ <span className="font-semibold">{t.rating}</span>
              </div>
              <p className="text-xs text-[#4A5568] mb-4">{t.students} Students</p>
              <AppButton variant="outline" size="sm" fullWidth>View Profile</AppButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachersSection;
