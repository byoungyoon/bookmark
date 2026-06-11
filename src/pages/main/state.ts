import { create } from 'zustand';

interface MainState {
  projects: any[];
  bookmarks: any[];
  projectName: string;
  error: string | null;
  setProjects: (projects: any[] | ((prev: any[]) => any[])) => void;
  setBookmarks: (bookmarks: any[] | ((prev: any[]) => any[])) => void;
  setProjectName: (name: string) => void;
  setError: (error: string | null) => void;
}

export const useMainStore = create<MainState>((set) => ({
  projects: [],
  bookmarks: [],
  projectName: '',
  error: null,
  setProjects: (projects) =>
    set((state) => ({
      projects: typeof projects === 'function' ? projects(state.projects) : projects,
    })),
  setBookmarks: (bookmarks) =>
    set((state) => ({
      bookmarks: typeof bookmarks === 'function' ? bookmarks(state.bookmarks) : bookmarks,
    })),
  setProjectName: (projectName) => set({ projectName }),
  setError: (error) => set({ error }),
}));
