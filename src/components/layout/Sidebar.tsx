import React from 'react';
import { MessageCircle, Calendar, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import { ActiveView, MenuItem } from '@/types/sidebarTypes';

// Typed props interface
interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

// Moved outside component — it's a constant, no reason to recreate on each render
const menu: MenuItem[] = [
  { name: 'Chat',     icon: <MessageCircle className="w-6 h-6" />},
  { name: 'Calendar', icon: <Calendar className="w-6 h-6" /> },
  { name: 'Notify',   icon: <Bell className="w-6 h-6" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <nav className="md:flex-col bg-primary md:max-w-16 md:h-screen md:relative md:py-4 py-2 space-y-6 items-center ">
      <img src={logo} alt="Logo" className="hidden w-20 h-14 md:block" />

      <div className="flex md:flex-col items-center justify-evenly md:space-y-10 flex-row w-full">
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
    </nav>
  );
};

export default Sidebar;