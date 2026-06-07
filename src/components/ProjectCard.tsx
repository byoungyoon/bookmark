import React, { useState } from 'react';
import { Bookmark, Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import { Bookmark as BookmarkType } from '@/src/lib/types';

interface IProjectCardProps {
  project: { id: string; name: string };
  bookmarks: BookmarkType[];
  onAddBookmark: (projectId: string, title: string, url: string, memo: string) => Promise<void> | void;
  onUpdateBookmark: (bookmarkId: string, title: string, url: string, memo: string) => Promise<void> | void;
  onDeleteBookmark: (bookmarkId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectCard: React.FC<IProjectCardProps> = ({ project, bookmarks, onAddBookmark, onUpdateBookmark, onDeleteBookmark, onDeleteProject }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');

  // Editing states for inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editMemo, setEditMemo] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || isAdding) return;
    setIsAdding(true);
    try {
      await onAddBookmark(project.id, title, url, memo);
      setTitle('');
      setUrl('');
      setMemo('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleStartEdit = (bookmark: BookmarkType) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
    setEditMemo(bookmark.memo || '');
  };

  const handleSaveEdit = async (bookmarkId: string) => {
    if (!editTitle || !editUrl || isSaving) return;
    setIsSaving(true);
    try {
      await onUpdateBookmark(bookmarkId, editTitle, editUrl, editMemo);
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight">{project.name}</h2>
        <button onClick={() => onDeleteProject(project.id)} className="text-white/40 hover:text-red-400">
          <Trash2 size={18} />
        </button>
      </div>
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id}>
            {editingId === bookmark.id ? (
              <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-xl mt-1">
                <input
                  type="text"
                  placeholder="Title"
                  value={editTitle}
                  disabled={isSaving}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs bg-white/10 border border-white/10 rounded-lg p-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={editUrl}
                  disabled={isSaving}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full text-xs bg-white/10 border border-white/10 rounded-lg p-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder="Memo"
                  value={editMemo}
                  disabled={isSaving}
                  onChange={(e) => setEditMemo(e.target.value)}
                  className="w-full text-xs bg-white/10 border border-white/10 rounded-lg p-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                />
                <div className="flex justify-end gap-1.5 mt-1">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex items-center gap-1 text-white/70 hover:text-white px-2.5 py-1 text-xs border border-white/10 rounded bg-white/5 hover:bg-white/10 transition-all font-medium cursor-pointer disabled:opacity-50"
                  >
                    <X size={12} /> Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(bookmark.id)}
                    disabled={isSaving}
                    className="flex items-center gap-1 bg-cyan-600 text-white px-2.5 py-1 text-xs rounded hover:bg-cyan-700 transition-all font-medium cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : <><Check size={12} /> Save</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col p-2 hover:bg-white/5 rounded-lg group gap-1 transition-colors">
                <div className="flex justify-between items-center">
                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline font-medium break-all">
                    {bookmark.title}
                  </a>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-2 shrink-0">
                    <button onClick={() => handleStartEdit(bookmark)} className="text-white/40 hover:text-cyan-400 p-1 rounded hover:bg-white/5 transition-all cursor-pointer">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => onDeleteBookmark(bookmark.id)} className="text-white/40 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-all cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {bookmark.memo && (
                  <span className="text-xs text-white/60 font-normal italic px-1 block break-words">
                    {bookmark.memo}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-2 grid gap-2">
        <input type="text" placeholder="Title" value={title} disabled={isAdding} onChange={(e) => setTitle(e.target.value)} className="w-full text-sm bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50" />
        <input type="url" placeholder="URL" value={url} disabled={isAdding} onChange={(e) => setUrl(e.target.value)} className="w-full text-sm bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50" />
        <input type="text" placeholder="Memo (Optional)" value={memo} disabled={isAdding} onChange={(e) => setMemo(e.target.value)} className="w-full text-sm bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50" />
        <button type="submit" disabled={isAdding} className="flex items-center justify-center gap-2 bg-cyan-600 text-white rounded-lg p-2 text-sm font-medium hover:bg-cyan-700 transition-all cursor-pointer disabled:opacity-50">
          {isAdding ? 'Adding...' : <><Plus size={16} /> Add Link & Memo</>}
        </button>
      </form>
    </div>
  );
}
