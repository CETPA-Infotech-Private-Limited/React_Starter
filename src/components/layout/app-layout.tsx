'use client';

import React from 'react';
import { Outlet } from 'react-router';
import { useAppName } from '@/hooks/useAppName';
import { SidebarProvider } from '../ui/sidebar';
import SiteHeader from '../site-header';
import { AppSidebar } from '../sidebar/app-sidebar';
import { AdminSidebar } from '../sidebar/AdminSidebar';

interface AppLayoutProps {
  isAdmin: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ isAdmin }) => {
  const { fullName } = useAppName();

  return (
    <SidebarProvider>
      {/* Prevent global horizontal scroll */}
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <SiteHeader />
        <div className="flex flex-1 overflow-hidden bg-gray-100">
          {isAdmin ? <AdminSidebar /> : <AppSidebar />}

          {/* Main content area */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Page title */}
            <div className="p-3 text-primary text-center font-bold text-2xl">{fullName}</div>

            {/* Scrollable content area with horizontal containment */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden w-full min-w-0">
              {/* If using a table or wide content inside Outlet, wrap it */}
              <div className="w-full overflow-x-auto">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
