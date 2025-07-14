'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/components/AuthPage';
import { Dashboard } from '@/components/Dashboard';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return user ? <Dashboard /> : <AuthPage />;
}