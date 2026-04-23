import React from 'react';
import { Bell } from 'lucide-react';

const NotificationPanel: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full text-gray-400 space-y-4">
      <Bell className="w-16 h-16 opacity-30" />
      <h2 className="text-xl font-semibold text-gray-300">Notifications</h2>
      <p className="text-sm text-gray-500">
        This feature is not yet developed. Please check back soon!
      </p>
    </div>
  );
};

export default NotificationPanel;