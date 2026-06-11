import React from 'react';
import { User } from 'firebase/auth';
import { useMainStore } from '../state';
import { useShallow } from 'zustand/react/shallow';
import { ProjectCard } from '../_component/ProjectCard';
import TextAddProjectAction from '../_action/dashboard/TextAddProject.action';

interface DashboardAreaProps {
  user: User;
}

export default function DashboardArea({ user }: DashboardAreaProps) {
  const { projects, bookmarks, error, setError } = useMainStore(
    useShallow((state) => ({
      projects: state.projects,
      bookmarks: state.bookmarks,
      error: state.error,
      setError: state.setError,
    }))
  );

  return (
    <main className="max-w-7xl mx-auto">
      {error && (
        <section className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex justify-between items-center text-red-200">
          <div className="text-sm">
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-200/60 hover:text-red-200 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </section>
      )}

      <TextAddProjectAction user={user} />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            user={user}
            project={project}
            bookmarks={bookmarks.filter((b) => b.projectId === project.id)}
          />
        ))}
      </section>
    </main>
  );
}
