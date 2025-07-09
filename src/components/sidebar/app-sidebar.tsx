import * as React from 'react';
import { LayoutDashboard, FileText, CreditCard, Stamp, Search, BadgeCheck, Power, ChevronLeft, ChevronRight, Briefcase, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarRail, SidebarSeparator, useSidebar } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { environment } from '@/config';
import { clearAllStorage } from '@/lib/helperFunction';
import { UserRole } from '@/types/auth';
import { NavItem } from '@/types/types';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const Roles = useAppSelector((state: RootState) => state.user.Roles) || [];
  const { state, toggleSidebar } = useSidebar();

  const canAccessAdminDashboard = (['admin', 'superAdmin', 'user'] as UserRole[]).some((role) => Roles?.includes(role));

  const allNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      roles: ['user'],
    },
    {
      title: 'Raise Claim',
      url: '/raise-claim',
      icon: FileText,
      roles: ['user'],
    },
    {
      title: 'Request Advance',
      url: '/request-advance',
      icon: CreditCard,
      roles: ['user'],
    },
    
    {
      title: 'My Claim',
      url: '/my-claim',
      icon: CreditCard,
      roles: ['user'],
    },
    {
      title: 'Doctor Review',
      url: '/doctor-review',
      icon: FileText,
      roles: ['user'],
    },

    {
      title: 'Approve Advance',
      url: '/approve-advance',
      icon: Stamp,
      roles: ['HR1', 'HR2'],
    },
    {
      title: 'Review Claim',
      url: '/review-claim',
      icon: Search,
      roles: ['HR1', 'HR2'],
    },
    {
      title: 'Approve Claim',
      url: '/ClaimAfterDoctorReview',
      icon: BadgeCheck,
      roles: ['HR1', 'HR2'],
    },
    {
      title: 'Banking',
      url: '/banking',
      icon: CreditCard,
      roles: ['Finance'],
    },
  ];

  const navMainItems = allNavItems.filter((item) => item.roles.some((role) => Roles.includes(role)));

  const handleLogout = () => {
    clearAllStorage();
    window.location.href = environment.exitUrl;
  };

  const ToggleIcon = state === 'collapsed' ? ChevronRight : ChevronLeft;

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
          {canAccessAdminDashboard && (
            <SidebarMenuButton
              onClick={() => navigate('/admin-dashboard')}
              tooltip="Manage Organization"
              asChild
              className={`${menuButtonBaseClass} text-black`}
            >
              <div className="flex items-center gap-2">
                <Briefcase size={24} />
                <span>Manage Organization</span>
              </div>
            </SidebarMenuButton>
          )}
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
