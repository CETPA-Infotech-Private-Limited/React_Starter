import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, NavLink } from 'react-router';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar';
import { NavItem } from '@/types/types';

export function NavMain({ items }: { items: NavItem[] }) {
  const { state: sidebarState, setOpenMobile } = useSidebar();
  const location = useLocation();

  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    const activeParents: string[] = [];

    items.forEach((item) => {
      if (item.children?.some((child) => location.pathname === child.url)) {
        activeParents.push(item.title);
      }
    });

    setOpenItems((prev) => Array.from(new Set([...prev, ...activeParents])));
  }, [location.pathname, items]);

  const toggleOpen = (title: string) => {
    setOpenItems((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = !!item.children?.length;
          const isOpen = openItems.includes(item.title);

          return (
            <SidebarMenuItem key={item.title}>
              {/* Parent Item */}
              {hasChildren ? (
                <SidebarMenuButton
                  onClick={() => toggleOpen(item.title)}
                  tooltip={item.title}
                  className="flex items-center justify-between gap-2 hover:bg-primary hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon size={24} />}
                    {sidebarState !== 'collapsed' && <span>{item.title}</span>}
                  </div>
                  {sidebarState !== 'collapsed' && (isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />)}
                </SidebarMenuButton>
              ) : (
                // Single Link Item
                <NavLink to={item.url!} onClick={() => setOpenMobile(false)}>
                  {({ isActive }) => (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`transition-all duration-300 hover:bg-primary active:bg-primary [&>svg]:size-7 ease-in-out ${
                        isActive ? 'bg-primary text-white h-full w-full' : 'hover:text-white h-full'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon size={24} />}
                        {sidebarState !== 'collapsed' && <span className={isActive ? 'font-bold' : 'font-normal'}>{item.title}</span>}
                      </div>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              )}

              {/* Children (Collapsible) - Hidden when sidebar collapsed */}
              {hasChildren && isOpen && sidebarState !== 'collapsed' && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <NavLink key={child.title} to={child.url!} onClick={() => setOpenMobile(false)}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          asChild
                          tooltip={child.title}
                          className={`transition-all duration-300 hover:bg-primary active:bg-primary [&>svg]:size-7 h-12 ease-in-out ${
                            isActive ? 'bg-primary text-white h-full w-full' : 'hover:text-white h-full'
                          }`}
                        >
                          <div className="flex items-center gap-2 pl-2">
                            <span className={isActive ? 'font-bold' : 'font-normal'}>{child.title}</span>
                          </div>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
