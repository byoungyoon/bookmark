import { db } from '@/src/utils/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { MutationFunction } from '@tanstack/react-query';

export const createBookmark: MutationFunction<
  string,
  { userId: string; projectId: string; title: string; url: string; memo: string }
> = async ({ userId, projectId, title, url, memo }) => {
  const id = crypto.randomUUID();
  await setDoc(doc(db, `projects/${projectId}/bookmarks`, id), {
    id,
    projectId,
    title: title.trim(),
    url: url.trim(),
    memo: memo.trim(),
    userId,
    createdAt: serverTimestamp(),
  });
  return id;
};
