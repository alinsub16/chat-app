import React from "react";
import logo from "@/assets/logo.png";

const EmptyChatState: React.FC = () => {
  return (
    <div className="flex flex-col w-full items-center h-full justify-center  text-center text-gray-400 overflow-hidden">
      
      <div className="mb-4">
        <img src={logo} alt="Teams" className="w-20 " />
      </div>

      <h2 className="text-lg font-semibold text-gray-200">
        Start a conversation
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Select a chat or search for someone to begin messaging.
      </p>
    </div>
  );
};

export default EmptyChatState;