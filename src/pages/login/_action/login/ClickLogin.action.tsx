'use client';

import React from 'react';
import { auth } from '@/src/utils/firebase';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useLoginStore } from '../../state';

export default function ClickLoginAction() {
  const { loading, setLoading } = useLoginStore();

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithRedirect(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-50"
    >
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
}
