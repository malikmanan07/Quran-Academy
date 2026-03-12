import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import PaymentSummaryCard from '../../components/student/payments/PaymentSummaryCard';
import PaymentHistoryTable from '../../components/student/payments/PaymentHistoryTable';
import { getPaymentsByStudent } from '../../features/payments/api';

const PaymentsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <PageHeader title="My Payments" subtitle="View your payment history" />
      <PaymentSummaryCard payments={payments} />
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <PaymentHistoryTable payments={payments} loading={loading} />
      </div>
    </div>
  );
};

export default PaymentsPage;
