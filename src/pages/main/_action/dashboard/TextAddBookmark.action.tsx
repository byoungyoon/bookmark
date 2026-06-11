'use client';

import React, { useState, startTransition } from 'react';
import { User } from 'firebase/auth';
import { useMainStore } from '../../state';
import { Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBookmark } from '../../_lib/createBookmark';

interface TextAddBookmarkActionProps {
  user: User;
  projectId: string;
}

export default function TextAddBookmarkAction({ user, projectId }: TextAddBookmarkActionProps) {
  const setError = useMainStore((state) => state.setError);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['create', 'bookmark'],
    mutationFn: createBookmark,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.uid] });
      setTitle('');
      setUrl('');
      setMemo('');
    },
    onError: (err: any) => {
      setError(`Failed to add link: ${err.message || err}`);
    },
  });

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !url.trim() || isPending) return;
    startTransition(() => {
      mutate({ userId: user.uid, projectId, title, url, memo });
    });
  };

  return (
    <form onSubmit={handleAddBookmark} className="mt-2 grid gap-2">
      <input
        type="text"
        placeholder="Title"
        value={title}
        disabled={isPending}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-sm bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
      />
      <input
        type="url"
        placeholder="URL"
        value={url}
        disabled={isPending}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full text-sm bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
      />
      <input
        type="text"
        placeholder="Memo (Optional)"
        value={memo}
        disabled={isPending}
        onChange={(e) => setMemo(e.target.value)}
        className="w-full text-sm bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 bg-cyan-600 text-white rounded-lg p-2 text-sm font-medium hover:bg-cyan-700 transition-all cursor-pointer disabled:opacity-50"
      >
        {isPending ? (
          'Adding...'
        ) : (
          <>
            <Plus size={16} /> Add Link & Memo
          </>
        )}
      </button>
    </form>
  );
}
