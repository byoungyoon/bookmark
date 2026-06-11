import { db } from '@/src/utils/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { MutationFunction } from '@tanstack/react-query';

export const deleteBookmark: MutationFunction<
  void,
  { projectId: string; bookmarkId: string }
> = async ({ projectId, bookmarkId }) => {
  await deleteDoc(doc(db, `projects/${projectId}/bookmarks`, bookmarkId));
};
