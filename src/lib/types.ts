export interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  projectId: string;
  title: string;
  url: string;
  userId: string;
  createdAt: string;
  memo?: string;
}
