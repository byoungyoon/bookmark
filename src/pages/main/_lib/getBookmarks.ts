import { db, handleFirestoreError, OperationType } from '@/src/utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { QueryFunction } from '@tanstack/react-query';
import { Bookmark } from '@/src/model/model';

export const getBookmarks: QueryFunction<
  Bookmark[],
  [_1: string, userId: string, projectIds: string[]]
> = async ({ queryKey }) => {
  const [_1, userId, projectIds] = queryKey;
  if (!userId || !projectIds || projectIds.length === 0) return [];
  try {
    const promises = projectIds.map(async (projectId) => {
      const q = query(
        collection(db, `projects/${projectId}/bookmarks`),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, projectId, ...doc.data() }) as Bookmark);
    });

    const results = await Promise.all(promises);
    return results.flat();
  } catch (err: any) {
    handleFirestoreError(err, OperationType.LIST, 'bookmarks');
    return [];
  }
};
