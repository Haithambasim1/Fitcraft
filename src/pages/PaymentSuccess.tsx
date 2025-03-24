import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verify the payment with your backend
    // Update user subscription status
    // Redirect to dashboard after verification
    setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-4">Redirecting to dashboard...</p>
    </div>
  );
}
