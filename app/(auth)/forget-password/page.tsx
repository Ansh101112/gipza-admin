'use client';

import ForgotPassword from './ForgotPassword';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/auth-context';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

const ForgotPasswordPage = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      router.replace('/dashboard');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return <Spinner />;
  }

  // Only show the forgot password form if user is not authenticated
  if (currentUser) {
    return <Spinner />;
  }

  return (
    <div>
      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;