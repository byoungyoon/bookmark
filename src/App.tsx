/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, setDoc, deleteDoc, updateDoc, doc, query, where, onSnapshot, serverTimestamp, getDocs } from 'firebase/firestore';
import { ProjectCard } from '@/src/components/ProjectCard';
import { Bookmark, LayoutDashboard, LogOut } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [projects, setProjects] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return auth.onAuthStateChanged((u) => setUser(u));
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'projects'), where('userId', '==', user.uid));
    return onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      setError(`Failed to load projects: ${err.message}`);
      handleFirestoreError(err, OperationType.LIST, 'projects');
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsubscribes = projects.map(project => 
      onSnapshot(
        query(collection(db, `projects/${project.id}/bookmarks`), where('userId', '==', user.uid)),
        (snapshot) => {
          setBookmarks(prev => [...prev.filter(b => b.projectId !== project.id), ...snapshot.docs.map(doc => ({ id: doc.id, projectId: project.id, ...doc.data() }))]);
        },
        (err) => {
          setError(`Failed to load bookmarks for ${project.name}: ${err.message}`);
          handleFirestoreError(err, OperationType.LIST, `projects/${project.id}/bookmarks`);
        }
      )
    );
    return () => unsubscribes.forEach(unsub => unsub());
  }, [user, projects]);

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectName) return;
    const id = crypto.randomUUID();
    try {
      setError(null);
      await setDoc(doc(db, 'projects', id), { id, name: projectName, userId: user.uid, createdAt: serverTimestamp() });
      setProjectName('');
    } catch (err: any) {
      setError(`Failed to add project: ${err.message || err}`);
      handleFirestoreError(err, OperationType.CREATE, 'projects');
    }
  };

  const addBookmark = async (projectId: string, title: string, url: string, memo: string) => {
    if (!user) return;
    const id = crypto.randomUUID();
    try {
      setError(null);
      await setDoc(doc(db, `projects/${projectId}/bookmarks`, id), { 
        id, 
        projectId, 
        title, 
        url, 
        memo: memo.trim(), 
        userId: user.uid, 
        createdAt: serverTimestamp() 
      });
    } catch (err: any) {
      setError(`Failed to add link: ${err.message || err}`);
      handleFirestoreError(err, OperationType.CREATE, `projects/${projectId}/bookmarks`);
    }
  };

  const deleteBookmark = async (projectId: string, bookmarkId: string) => {
    try {
      setError(null);
      await deleteDoc(doc(db, `projects/${projectId}/bookmarks`, bookmarkId));
    } catch (err: any) {
      setError(`Failed to delete link: ${err.message || err}`);
      handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}/bookmarks/${bookmarkId}`);
    }
  };

  const updateBookmark = async (projectId: string, bookmarkId: string, title: string, url: string, memo: string) => {
    if (!user) return;
    try {
      setError(null);
      await updateDoc(doc(db, `projects/${projectId}/bookmarks`, bookmarkId), {
        title: title.trim(),
        url: url.trim(),
        memo: memo.trim(),
      });
    } catch (err: any) {
      setError(`Failed to update link: ${err.message || err}`);
      handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}/bookmarks/${bookmarkId}`);
    }
  };

  const deleteProject = async (projectId: string) => {
      if (!user) return;
      try {
        setError(null);
        const bookmarksSnapshot = await getDocs(query(collection(db, `projects/${projectId}/bookmarks`), where('userId', '==', user.uid)));
        for (const docSnapshot of bookmarksSnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
        }
        await deleteDoc(doc(db, 'projects', projectId));
      } catch (err: any) {
        setError(`Failed to delete project: ${err.message || err}`);
        handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}`);
      }
  };


  if (!user) return <div className="h-screen flex items-center justify-center"><button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium">Sign in with Google</button></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2c] via-[#4a1942] to-[#893168] text-white p-8">
      <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold flex items-center gap-2"><LayoutDashboard className="text-cyan-400" /> Bookmark Dashboard</h1>
        <button onClick={() => signOut(auth)} className="text-sm text-white/60 hover:text-white flex items-center gap-1"><LogOut size={16}/> Sign out</button>
      </header>
      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex justify-between items-center text-red-200">
            <div className="text-sm">
              <strong>Error:</strong> {error}
            </div>
            <button onClick={() => setError(null)} className="text-red-200/60 hover:text-red-200 font-bold ml-4 cursor-pointer">✕</button>
          </div>
        )}
        <form onSubmit={addProject} className="mb-8 flex gap-2">
            <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="New Project Name" className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 w-full max-w-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
            <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition-all">Add Project</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              bookmarks={bookmarks.filter(b => b.projectId === project.id)} 
              onAddBookmark={addBookmark} 
              onUpdateBookmark={(bid, title, url, memo) => updateBookmark(project.id, bid, title, url, memo)}
              onDeleteBookmark={(bid) => deleteBookmark(project.id, bid)} 
              onDeleteProject={deleteProject}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
