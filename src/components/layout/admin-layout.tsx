import React from 'react';

import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import SiteHeader from '@/components/site-header';
import { AdminSidebar } from '../sidebar/AdminSidebar';
import { useAppName } from '@/hooks/useAppName';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fullName } = useAppName();

  return (
    <SidebarProvider className="flex flex-col w-full h-screen">
      <SiteHeader />
      <div className="w-full bg-gray-100 flex-1 overflow-hidden">
        <div className="flex flex-row h-full">
          <AdminSidebar className="w-64 bg-gray-800 text-white flex-shrink-0" />
          <div className="w-full flex flex-col h-full">
            <div className="flex items-center mt-2 gap-0 justify-center text-primary text-center rounded-md font-bold text-3xl">
              {fullName}
            </div>
            <div className="bg-white flex-1 overflow-auto">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
