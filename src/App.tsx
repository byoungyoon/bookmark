import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from '@/src/utils/firebase';
import Login from '@/src/pages/login';
import Main from '@/src/pages/main';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Auth Log] App mounted. Listening to onAuthStateChanged...');
    return auth.onAuthStateChanged((u) => {
      console.log('[Auth Log] onAuthStateChanged triggered. User:', u ? u.email : 'null');
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1c2c] via-[#4a1942] to-[#893168] text-white">
        Loading...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Main user={user} /> : <Navigate to="/login" replace />}
          />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
