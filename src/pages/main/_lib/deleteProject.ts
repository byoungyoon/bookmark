import { db } from '@/src/utils/firebase';
import { doc, deleteDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { MutationFunction } from '@tanstack/react-query';

export const deleteProject: MutationFunction<void, { userId: string; projectId: string }> = async ({
  userId,
  projectId,
}) => {
  const bookmarksSnapshot = await getDocs(
    query(collection(db, `projects/${projectId}/bookmarks`), where('userId', '==', userId))
  );
  for (const docSnapshot of bookmarksSnapshot.docs) {
    await deleteDoc(docSnapshot.ref);
  }
  await deleteDoc(doc(db, 'projects', projectId));
};
