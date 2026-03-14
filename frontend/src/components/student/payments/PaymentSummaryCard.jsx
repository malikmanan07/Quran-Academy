import { useCurrency } from '../../../hooks/useCurrency';

const PaymentSummaryCard = ({ payments }) => {
  const { formatCurrency } = useCurrency();
  const paid = payments.filter(p => p.status === 'Paid').reduce((a, p) => a + (Number(p.amount) || 0), 0);
  const pending = payments.filter(p => p.status !== 'Paid').reduce((a, p) => a + (Number(p.amount) || 0), 0);
  const nextDue = payments.find(p => p.status !== 'Paid');

  const cards = [
    { label: 'Total Paid', value: formatCurrency(paid), icon: '✅', color: 'bg-green-100 text-green-700' },
    { label: 'Pending Amount', value: formatCurrency(pending), icon: '⏳', color: 'bg-amber-100 text-amber-700' },
    { label: 'Next Due Date', value: nextDue?.dueDate || 'None', icon: '📅', color: 'bg-[#00B4D8]/10 text-[#00B4D8]' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((c, i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#4A5568] mb-1">{c.label}</p>
              <p className="text-xl font-bold text-[#1A1A2E]">{c.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>{c.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentSummaryCard;
