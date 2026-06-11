'use client';

import React, { startTransition } from 'react';
import { User } from 'firebase/auth';
import { useMainStore } from '../../state';
import { useShallow } from 'zustand/react/shallow';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '../../_lib/createProject';

interface TextAddProjectActionProps {
  user: User;
}

export default function TextAddProjectAction({ user }: TextAddProjectActionProps) {
  const { projectName, setProjectName, setError } = useMainStore(
    useShallow((state) => ({
      projectName: state.projectName,
      setProjectName: state.setProjectName,
      setError: state.setError,
    }))
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['create', 'project'],
    mutationFn: createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects', user?.uid] });
      setProjectName('');
    },
    onError: (err: any) => {
      setError(`Failed to add project: ${err.message || err}`);
    },
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectName.trim()) return;
    startTransition(() => {
      mutate({ userId: user.uid, projectName });
    });
  };

  return (
    <form onSubmit={handleAddProject} className="mb-8 flex gap-2">
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="New Project Name"
        className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 w-full max-w-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition-all cursor-pointer disabled:opacity-50"
      >
        {isPending ? 'Adding...' : 'Add Project'}
      </button>
    </form>
  );
}
