'use client';

import React, { useEffect } from 'react';
import { User } from 'firebase/auth';
import { useMainStore } from '../../state';
import { useShallow } from 'zustand/react/shallow';
import {
  useQuery,
  useSuspenseQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { getProjects } from '../../_lib/getProjects';
import { getBookmarks } from '../../_lib/getBookmarks';
import { useRef } from 'react';

interface ReadDataActionProps {
  user: User;
  children: React.ReactNode;
}

export default function ReadDataAction({ user, children }: ReadDataActionProps) {
  const isInitialRef = useRef(true);
  const queryClient = useQueryClient();

  const { setProjects, setBookmarks } = useMainStore(
    useShallow((state) => ({
      setProjects: state.setProjects,
      setBookmarks: state.setBookmarks,
    }))
  );

  const { data: projectsData } = useSuspenseQuery({
    queryKey: ['projects', user.uid] as [_1: string, userId: string],
    queryFn: getProjects,
  });

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData, setProjects]);

  const projectIds = projectsData.map((p) => p.id);

  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks', user.uid, projectIds] as [
      _1: string,
      userId: string,
      projectIds: string[],
    ],
    queryFn: getBookmarks,
    placeholderData: keepPreviousData,
  });

  if (isInitialRef.current && !bookmarksData && projectIds.length > 0) {
    const promise = queryClient.fetchQuery({
      queryKey: ['bookmarks', user.uid, projectIds] as [
        _1: string,
        userId: string,
        projectIds: string[],
      ],
      queryFn: getBookmarks,
    });
    throw promise;
  }

  useEffect(() => {
    if (bookmarksData) {
      setBookmarks(bookmarksData);
    }
  }, [bookmarksData, setBookmarks]);

  useEffect(() => {
    isInitialRef.current = false;
  }, []);

  return <>{children}</>;
}
