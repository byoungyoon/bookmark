'use client';

import React, { useState, startTransition } from 'react';
import { User } from 'firebase/auth';
import { useMainStore } from '../../state';
import { Bookmark as BookmarkType } from '@/src/model/model';
import { Edit2, Check, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBookmark } from '../../_lib/updateBookmark';

import ClickDeleteBookmarkAction from './ClickDeleteBookmark.action';

interface TextUpdateBookmarkActionProps {
  user: User;
  projectId: string;
  bookmark: BookmarkType;
  children: React.ReactNode;
}

export default function TextUpdateBookmarkAction({
  user,
  projectId,
  bookmark,
  children,
}: TextUpdateBookmarkActionProps) {
  const setError = useMainStore((state) => state.setError);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(bookmark.title);
  const [editUrl, setEditUrl] = useState(bookmark.url);
  const [editMemo, setEditMemo] = useState(bookmark.memo || '');

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['update', 'bookmark'],
    mutationFn: updateBookmark,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.uid] });
      setEditing(false);
    },
    onError: (err: any) => {
      setError(`Failed to update link: ${err.message || err}`);
    },
  });

  const handleSaveEdit = () => {
    if (!user || !editTitle.trim() || !editUrl.trim() || isPending) return;
    startTransition(() => {
      mutate({
        projectId,
        bookmarkId: bookmark.id,
        title: editTitle,
        url: editUrl,
        memo: editMemo,
      });
    });
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-xl mt-1 w-full">
        <input
          type="text"
          placeholder="Title"
          value={editTitle}
          disabled={isPending}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-xs bg-white/10 border border-white/10 rounded-lg p-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
        />
        <input
          type="url"
          placeholder="URL"
          value={editUrl}
          disabled={isPending}
          onChange={(e) => setEditUrl(e.target.value)}
          className="w-full text-xs bg-white/10 border border-white/10 rounded-lg p-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
        />
        <input
          type="text"
          placeholder="Memo"
          value={editMemo}
          disabled={isPending}
          onChange={(e) => setEditMemo(e.target.value)}
          className="w-full text-xs bg-white/10 border border-white/10 rounded-lg p-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
        />
        <div className="flex justify-end gap-1.5 mt-1">
          <button
            onClick={() => setEditing(false)}
            disabled={isPending}
            className="flex items-center gap-1 text-white/70 hover:text-white px-2.5 py-1 text-xs border border-white/10 rounded bg-white/5 hover:bg-white/10 transition-all font-medium cursor-pointer disabled:opacity-50"
          >
            <X size={12} /> Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={isPending}
            className="flex items-center gap-1 bg-cyan-600 text-white px-2.5 py-1 text-xs rounded hover:bg-cyan-700 transition-all font-medium cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              'Saving...'
            ) : (
              <>
                <Check size={12} /> Save
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center w-full group">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <button
          onClick={() => setEditing(true)}
          className="text-white/40 hover:text-cyan-400 p-1 rounded hover:bg-white/5 transition-all cursor-pointer opacity-0 group-hover:opacity-100 shrink-0"
        >
          <Edit2 size={14} />
        </button>
        <ClickDeleteBookmarkAction user={user} projectId={projectId} bookmarkId={bookmark.id} />
      </div>
    </div>
  );
}
