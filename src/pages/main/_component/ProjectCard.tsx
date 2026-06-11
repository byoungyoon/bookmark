import React from 'react';
import { Bookmark as BookmarkType } from '@/src/model/model';
import { User } from 'firebase/auth';
import ClickDeleteProjectAction from '../_action/dashboard/ClickDeleteProject.action';
import TextAddBookmarkAction from '../_action/dashboard/TextAddBookmark.action';
import TextUpdateBookmarkAction from '../_action/dashboard/TextUpdateBookmark.action';

interface IProjectCardProps {
  user: User;
  project: { id: string; name: string };
  bookmarks: BookmarkType[];
}

export const ProjectCard: React.FC<IProjectCardProps> = ({ user, project, bookmarks }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white group">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight">{project.name}</h2>
        <ClickDeleteProjectAction user={user} projectId={project.id} />
      </div>
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="hover:bg-white/5 rounded-lg p-2 transition-colors">
            <TextUpdateBookmarkAction user={user} projectId={project.id} bookmark={bookmark}>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cyan-400 hover:underline font-medium break-all block"
              >
                {bookmark.title}
              </a>
              {bookmark.memo && (
                <span className="text-xs text-white/60 font-normal italic px-1 block break-words mt-1">
                  {bookmark.memo}
                </span>
              )}
            </TextUpdateBookmarkAction>
          </div>
        ))}
      </div>
      <TextAddBookmarkAction user={user} projectId={project.id} />
    </div>
  );
};
