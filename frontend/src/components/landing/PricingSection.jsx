import { Link } from 'react-router-dom';
import AppButton from '../common/AppButton';
import { ROUTES } from '../../constants/routes';

const plans = [
  {
    name: 'Basic', price: '1,500', popular: false,
    features: ['1 Class per week', '1 Course access', 'Progress reports', 'Email support'],
  },
  {
    name: 'Standard', price: '2,500', popular: true,
    features: ['3 Classes per week', 'All courses access', 'Progress reports', 'Priority support', 'Recorded sessions'],
  },
  {
    name: 'Premium', price: '4,000', popular: false,
    features: ['Daily classes', 'All courses access', 'Progress reports', '24/7 support', 'Recorded sessions', 'Family plan (3 students)'],
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-[#F0F4F8] scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-[#4A5568]">Choose the plan that works for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                p.popular
                  ? 'bg-[#1B3A5C] text-white shadow-xl scale-100 md:scale-105 border-2 border-[#00B4D8] relative'
                  : 'bg-white text-[#1A1A2E] shadow-md border border-[#E2E8F0] hover:shadow-lg'
              }`}
            >
              {p.popular && (
                <div className="bg-[#00B4D8] text-white text-center text-xs font-bold py-2 uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="p-7 flex flex-col flex-1">
                <h3 className={`text-xl font-bold mb-1 ${p.popular ? 'text-white' : 'text-[#1A1A2E]'}`}>
                  {p.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${p.popular ? 'text-[#00B4D8]' : 'text-[#00B4D8]'}`}>
                    PKR {p.price}
                  </span>
                  <span className={`text-sm ${p.popular ? 'text-white/60' : 'text-[#4A5568]'}`}>/month</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-3 text-sm ${
                      p.popular ? 'text-white/80' : 'text-[#4A5568]'
                    }`}>
                      <svg className="w-4 h-4 text-[#00B4D8] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to={ROUTES.SIGNUP}>
                  {p.popular ? (
                    <AppButton variant="accent" fullWidth size="lg">Get Started</AppButton>
                  ) : (
                    <AppButton variant="outline" fullWidth size="lg">Get Started</AppButton>
                  )}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
