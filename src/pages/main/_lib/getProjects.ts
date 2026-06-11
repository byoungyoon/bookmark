import { db, handleFirestoreError, OperationType } from '@/src/utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { QueryFunction } from '@tanstack/react-query';
import { Project } from '@/src/model/model';

export const getProjects: QueryFunction<Project[], [_1: string, userId: string]> = async ({
  queryKey,
}) => {
  const [_1, userId] = queryKey;
  if (!userId) return [];

  try {
    const q = query(collection(db, 'projects'), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project);
  } catch (err: any) {
    handleFirestoreError(err, OperationType.LIST, 'projects');
    return [];
  }
};
