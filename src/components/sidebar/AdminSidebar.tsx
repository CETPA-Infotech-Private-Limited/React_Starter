import * as React from 'react';
import { LayoutGrid, LogOut, Hotel, ChevronsLeft, ChevronsRight, FileText, UserRoundCog } from 'lucide-react';
import { useNavigate } from 'react-router';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarRail, SidebarSeparator, useSidebar } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { environment } from '@/config';
import { clearAllStorage } from '@/lib/helperFunction';
import { NavItem } from '@/types/types';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const Roles = useAppSelector((state: RootState) => state.user.Roles) || [];
  const { state, toggleSidebar } = useSidebar();

  const allNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      url: '/admin-dashboard',
      icon: LayoutGrid,
      roles: ['admin', 'superAdmin', 'HR Admin'],
    },
    {
      title: 'Manage Admin',
      url: '/manage-admin',
      icon: UserRoundCog,
      roles: ['superAdmin', 'HR Admin'],
    },
  ];

  const navMainItems = allNavItems.filter((item) => Array.isArray(item.roles) && item.roles.some((role) => Roles.includes(role)));

  const handleLogout = () => {
    clearAllStorage();
    window.location.href = environment.exitUrl;
  };

  const ToggleIcon = state === 'collapsed' ? ChevronsRight : ChevronsLeft;

  const menuButtonBaseClass =
    'transition-all duration-300 ease-in-out h-full w-full cursor-pointer active:bg-primary hover:bg-primary hover:text-white [&>svg]:size-7';

  return (
    <Sidebar collapsible="icon" {...props}>
      <div className="flex justify-end md:pt-[90px] px-2">
        <ToggleIcon onClick={toggleSidebar} className="w-8 h-8 cursor-pointer" />
      </div>
      <SidebarSeparator />
      <SidebarContent className="flex justify-between">
        <NavMain items={navMainItems} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton onClick={() => navigate('/dashboard')} tooltip={'Manage Personal View'} asChild className={menuButtonBaseClass + ' text-black'}>
            <div className="flex items-center gap-2">
              <Hotel size={24} />
              <span>Manage Personal View</span>
            </div>
          </SidebarMenuButton>

          <Separator />
          <SidebarMenuButton onClick={handleLogout} tooltip="Exit" asChild className={menuButtonBaseClass}>
            <div className="flex items-center gap-2">
              <LogOut size={24} />
              <span>Exit</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
