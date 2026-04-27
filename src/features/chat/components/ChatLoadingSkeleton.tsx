import React from "react";

const SkeletonBubble: React.FC<{ own?: boolean }> = ({ own = false }) => (
    <div className="md:hidden block">
        <div className={`flex items-end gap-3 my-2 ${own ? "flex-row-reverse" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse flex-shrink-0" />
            <div className={`flex flex-col gap-2 ${own ? "items-end" : "items-start"}`}>
            <div className="bg-gray-700 animate-pulse rounded-lg h-10 w-48" />
            <div className="bg-gray-700 animate-pulse rounded-lg h-3 w-24" />
            </div>
        </div>
  </div>
);

const ChatLoadingSkeleton: React.FC = () => (
  <>
    <SkeletonBubble />
    <SkeletonBubble own />
    <SkeletonBubble />
    <SkeletonBubble />
    <SkeletonBubble own />
  </>
);

export default ChatLoadingSkeleton;