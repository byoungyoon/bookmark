import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import ClickSignOutAction from '../_action/header/ClickSignOut.action';

export default function HeaderArea() {
  return (
    <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <LayoutDashboard className="text-cyan-400" /> Bookmark Dashboard
      </h1>
      <ClickSignOutAction />
    </header>
  );
}
