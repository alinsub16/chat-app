import React from "react";

type Props = {
  onRetry: () => void;
};

const ServerErrorScreen: React.FC<Props> = ({ onRetry }) => {
  return (
    <div className="h-dvh w-full flex items-center justify-center bg-black px-6">
      <div className="text-center space-y-5 max-w-sm">
        
        {/* Icon */}
        <div className="mx-auto h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-white">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-sm text-white/60">
          Unable to connect to the server. Please try again.
        </p>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ServerErrorScreen;