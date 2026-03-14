import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import PaymentSummaryCard from '../../components/student/payments/PaymentSummaryCard';
import PaymentHistoryTable from '../../components/student/payments/PaymentHistoryTable';
import PaymentSubmitModal from '../../components/student/PaymentSubmitModal';
import { getPaymentsByStudent } from '../../features/payments/api';

const PaymentsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try { 
        const res = await getPaymentsByStudent();
        // Extract from response.data (axios) -> .data (backend) -> .payments
        const list = res.data?.data?.payments || res.data?.payments || [];
        setPayments(list);
      } catch (err) {
        console.error('PaymentsPage fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetch();
  }, [user]);

  const handleOpenModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getPaymentsByStudent();
      const list = res.data?.data?.payments || res.data?.payments || [];
      setPayments(list);
    } catch (err) {
      console.error('PaymentsPage fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PaymentSummaryCard payments={payments} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <PaymentHistoryTable 
          payments={payments} 
          loading={loading} 
          onSubmitProof={handleOpenModal} 
        />
      </div>

      {selectedPayment && (
        <PaymentSubmitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          month={selectedPayment.month}
          amount={selectedPayment.amount}
          onSuccess={fetchPayments}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
