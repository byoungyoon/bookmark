import React, { Suspense } from 'react';
import { User } from 'firebase/auth';
import ReadDataAction from './_action/dashboard/ReadData.action';
import HeaderArea from './_area/Header.area';
import DashboardArea from './_area/Dashboard.area';

interface MainProps {
  user: User;
}

export default function Main({ user }: MainProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-brand-start via-brand-via to-brand-end text-white flex items-center justify-center font-medium">
          Loading...
        </div>
      }
    >
      <ReadDataAction user={user}>
        <div className="min-h-screen bg-gradient-to-br from-brand-start via-brand-via to-brand-end text-white p-8">
          <HeaderArea />
          <DashboardArea user={user} />
        </div>
      </ReadDataAction>
    </Suspense>
  );
}
