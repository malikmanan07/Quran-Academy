import { useState } from 'react';
import AppModal from '../common/AppModal';
import AppSelect from '../common/AppSelect';
import AppButton from '../common/AppButton';
import Toast, { useToast } from '../common/Toast';
import http from '../../services/http';

const PAYMENT_METHODS = [
  { value: 'JazzCash', label: 'JazzCash' },
  { value: 'Easypaisa', label: 'Easypaisa' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Card', label: 'Debit/Credit Card' },
  { value: 'PayPal', label: 'PayPal' },
];

const inputClass = "w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40 focus:border-[#00B4D8]";
const labelClass = "block text-sm font-medium text-[#1A1A2E] mb-1.5";

const PaymentSubmitModal = ({ isOpen, onClose, studentId, month, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useToast();
  const [formData, setFormData] = useState({
    paymentMethod: 'JazzCash',
    transactionId: '',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.transactionId) { showToast('Transaction ID is required', 'error'); return; }

    setLoading(true);
    try {
      const endpoint = studentId ? '/payments/parent/submit' : '/payments/student/submit';
      const payload = { ...formData, month, amount };
      if (studentId) payload.studentId = studentId;

      await http.post(endpoint, payload);
      showToast('Payment submitted for verification');
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal show={isOpen} onClose={onClose} title="Submit Payment Proof">
      <Toast toast={toast} />
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="bg-[#00B4D8]/5 p-4 rounded-xl border border-[#00B4D8]/20 mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#4A5568]">Month:</span>
            <span className="font-bold text-[#1A1A2E]">{month}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#4A5568]">Amount:</span>
            <span className="font-bold text-[#1A1A2E]">PKR {amount?.toLocaleString()}</span>
          </div>
        </div>

        <AppSelect
          label="Payment Method"
          value={formData.paymentMethod}
          onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
          options={PAYMENT_METHODS}
          required
        />

        <div className="mb-4">
          <label className={labelClass}>Transaction ID / Reference Number *</label>
          <input
            type="text"
            placeholder="Enter the transaction ID from your receipt"
            value={formData.transactionId}
            onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
            required
            className={inputClass}
          />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Additional Notes (Optional)</label>
          <textarea
            placeholder="Any extra details..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </AppButton>
          <AppButton type="submit" variant="primary" loading={loading}>
            Submit Payment
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};

export default PaymentSubmitModal;
