'use client';

import React from 'react';
import { auth } from '@/src/utils/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function ClickSignOutAction() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-white/60 hover:text-white flex items-center gap-1 cursor-pointer"
    >
      <LogOut size={16} /> Sign out
    </button>
  );
}
