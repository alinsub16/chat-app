import React from "react";

interface Props {
  count?: number; // how many skeleton items
}

const ConversationListSkeleton: React.FC<Props> = ({ count = 6 }) => {
  return (
    <div className="flex flex-col gap-3 p-3 w-full max-w-[330px]">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 animate-pulse"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-700" />

          {/* Text Content */}
          <div className="flex-1 space-y-2">
            {/* Name */}
            <div className="h-4 w-1/3 bg-gray-700 rounded" />

            {/* Last Message */}
            <div className="h-3 w-2/3 bg-gray-800 rounded" />
          </div>

          {/* Time */}
          <div className="h-3 w-10 bg-gray-800 rounded" />
        </div>
      ))}
    </div>
  );
};

export default ConversationListSkeleton;