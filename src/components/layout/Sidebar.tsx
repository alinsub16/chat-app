import { useState } from "react";
import { MessageCircle, Video, Users, Calendar, Bell } from "lucide-react";
import { cn } from "@/lib/utils"; // optional helper if you’re using shadcn or similar
import logo from "@/assets/logo.png";
import { url } from "inspector";

const Sidebar = () => {
  const [active, setActive] = useState("Chat");

  const menu = [
    { name: "Teams", icon: "/icons/teams.svg" }, // custom logo at top
    { name: "Chat", icon: <MessageCircle className="w-6 h-6" />, badge: "" },
    { name: "Calendar", icon: <Calendar className="w-6 h-6" /> },
    { name: "Notify", icon: <Bell className="w-6 h-6" />, badge: "" },
  ];

  return (
    <nav className="flex flex-col items-center bg-primary  w-16 h-screen py-4 space-y-6">
      {/* Top logo */}
      <img src={logo} alt="Teams" className="w-20 h-14" />

      {/* Menu items */}
      <div className="flex flex-col items-center space-y-10">
        {menu.slice(1).map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={cn(
              "relative flex flex-col items-center text-gray-400 hover:text-indigo-400 transition-colors",
              active === item.name && "text-indigo-400"
            )}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
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
