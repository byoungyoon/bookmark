import { create } from 'zustand';

interface LoginState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
