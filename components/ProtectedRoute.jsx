"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth-context';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // If not logged in, don't render children
  if (!currentUser) {
    return null;
  }

  // If logged in, render children
  return children;
}