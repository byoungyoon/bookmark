import { db } from '@/src/utils/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { MutationFunction } from '@tanstack/react-query';

export const createProject: MutationFunction<
  string,
  { userId: string; projectName: string }
> = async ({ userId, projectName }) => {
  const id = crypto.randomUUID();
  await setDoc(doc(db, 'projects', id), {
    id,
    name: projectName.trim(),
    userId,
    createdAt: serverTimestamp(),
  });
  return id;
};
