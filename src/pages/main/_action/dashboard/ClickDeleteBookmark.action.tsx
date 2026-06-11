'use client';

import React, { startTransition } from 'react';
import { User } from 'firebase/auth';
import { useMainStore } from '../../state';
import { Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBookmark } from '../../_lib/deleteBookmark';

interface ClickDeleteBookmarkActionProps {
  user: User;
  projectId: string;
  bookmarkId: string;
}

export default function ClickDeleteBookmarkAction({
  user,
  projectId,
  bookmarkId,
}: ClickDeleteBookmarkActionProps) {
  const queryClient = useQueryClient();

  const setError = useMainStore((state) => state.setError);

  const { mutate, isPending } = useMutation({
    mutationKey: ['delete', 'bookmark'],
    mutationFn: deleteBookmark,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.uid] });
    },
    onError: () => {
      setError('User not logged in');
      console.error('User not logged in');
    },
  });

  const handleDeleteBookmark = () => {
    if (!user || isPending) return;

    startTransition(() => {
      mutate({ projectId, bookmarkId });
    });
  };

  return (
    <button
      onClick={handleDeleteBookmark}
      disabled={isPending}
      className="text-white/40 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <Trash2 size={14} />
    </button>
  );
}
