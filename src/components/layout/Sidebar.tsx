import React from 'react';
import { MessageCircle, Calendar, Bell, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import { ActiveView, MenuItem } from '@/types/sidebarTypes';


// Typed props interface
interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenInfo: () => void;
}

// Moved outside component — it's a constant, no reason to recreate on each render
const menu: MenuItem[] = [
  { name: 'Chat',     icon: <MessageCircle className="w-6 h-6" />},
  { name: 'Calendar', icon: <Calendar className="w-6 h-6" /> },
  { name: 'Notify',   icon: <Bell className="w-6 h-6" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate,onOpenInfo }) => {
  return (
    <nav className="md:flex-col bg-primary md:max-w-16 md:h-screen relative md:py-4 py-2 space-y-6 items-center ">
      <img src={logo} alt="Logo" className="hidden w-20 h-14 md:block" />

      <div className="flex md:flex-col items-center justify-evenly md:space-y-10 flex-row w-full m-0">
        {menu.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavigate(item.name)}
            className={cn(
              'relative flex flex-col items-center text-gray-400 hover:text-indigo-400 transition-colors',
              activeView === item.name && 'text-indigo-400'
            )}
          >
            <div className="relative">
              {item.icon}
              {item.badge !== undefined && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-semibold rounded-full px-[5px] py-[1px]">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1">{item.name}</span>
          </button>
        ))}
      </div>
        <span onClick={onOpenInfo} className='absolute md:bottom-4 md:left-1/2 md:-translate-x-1/2 cursor-pointer left-1 bottom-1' ><Info className="md:w-4 md:h-4 w-3 h-3 text-white hover:text-gray-500" /></span>
    </nav>
  );
};

export default Sidebar;