'use client';

import React, { useEffect } from 'react';
import { auth } from '@/src/utils/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useLoginStore } from '../../state';

export default function ClickLoginAction() {
  const { loading, setLoading } = useLoginStore();

  useEffect(() => {
    console.log('[Auth Log] ClickLoginAction mounted. URL:', window.location.href);
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('[Auth Log] getRedirectResult successful. User:', result.user.email);
        } else {
          console.log('[Auth Log] getRedirectResult returned null (no redirect back detected).');
        }
      })
      .catch((error) => {
        console.error('[Auth Log] getRedirectResult failed:', error);
      });
  }, []);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    console.log('[Auth Log] Starting signInWithRedirect...');
    try {
      await signInWithRedirect(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error('[Auth Log] signInWithRedirect error:', error);
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
