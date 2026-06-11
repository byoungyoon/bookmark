'use client';

import React, { startTransition } from 'react';
import { User } from 'firebase/auth';
import { useMainStore } from '../../state';
import { Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '../../_lib/deleteProject';

interface ClickDeleteProjectActionProps {
  user: User;
  projectId: string;
}

export default function ClickDeleteProjectAction({
  user,
  projectId,
}: ClickDeleteProjectActionProps) {
  const setError = useMainStore((state) => state.setError);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['delete', 'project'],
    mutationFn: deleteProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects', user?.uid] });
      await queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.uid] });
    },
    onError: (err: any) => {
      setError(`Failed to delete project: ${err.message || err}`);
    },
  });

  const handleDeleteProject = () => {
    if (!user || isPending) return;
    startTransition(() => {
      mutate({ userId: user.uid, projectId });
    });
  };

  return (
    <button
      onClick={handleDeleteProject}
      disabled={isPending}
      className="text-white/40 hover:text-red-400 cursor-pointer disabled:opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <Trash2 size={18} />
    </button>
  );
}
