import React from 'react';
import { Link } from 'react-router';
import { logo } from '@/assets/image/images';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { AlignJustify } from 'lucide-react';
import { useSidebar } from './ui/sidebar';
import LogoutButton from '@/auth/LogoutButton';

const SiteHeader: React.FC<{ showtoggle?: boolean }> = () => {
  const user = useSelector((state: RootState) => state.user);
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-white shadow-md sticky top-0 w-full z-50 border-b-4 border-red-600 h-[80px] px-4">
      <div className="flex items-center justify-between h-full p-2">
        <div className="flex items-center space-x-4 ">
          <div className="md:hidden">
            <AlignJustify className="w-8 h-8 cursor-pointer rounded-md transition-all " onClick={toggleSidebar} />
          </div>
          <img src={logo} alt="Company Logo" className="object-contain h-12 w-auto" />
          <Link to="#" className="hidden sm:flex flex-col text-primary">
            <span className="text-md md:text-lg font-semibold">Dedicated Freight Corridor Corporation of India Limited</span>
            <span className="text-sm md:text-md text-gray-600">A Govt. of India (Ministry of Railways) Enterprise</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-gray-800 text-md md:text-lg font-semibold">{user.unique_name}</div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
