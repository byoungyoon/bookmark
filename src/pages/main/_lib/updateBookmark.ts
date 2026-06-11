import { db } from '@/src/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { MutationFunction } from '@tanstack/react-query';

export const updateBookmark: MutationFunction<
  void,
  { projectId: string; bookmarkId: string; title: string; url: string; memo: string }
> = async ({ projectId, bookmarkId, title, url, memo }) => {
  await updateDoc(doc(db, `projects/${projectId}/bookmarks`, bookmarkId), {
    title: title.trim(),
    url: url.trim(),
    memo: memo.trim(),
  });
};
