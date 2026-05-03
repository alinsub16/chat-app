import React from "react";
import { Atom } from "react-loading-indicators";
import logo from "@/assets/logo.png";

const ServerWakeLoader = () => {
  return (
    <div className="h-dvh w-full bg-primary flex items-center justify-center px-6 overflow-hidden">
      <div className="w-full max-w-md text-center space-y-8">
        
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
            <img
              src={logo}
              alt="Chat Circle"
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Welcome to Chat Circle
          </h1>

          <p className="text-sm leading-relaxed text-white/70 max-w-sm mx-auto">
            Chat confidently and stay connected with secure,
            seamless, and private conversations anytime.
          </p>
        </div>

        {/* Loader */}
        <div className="flex flex-col items-center gap-4">
          <Atom
            color="#ffffff"
            size="small"
            textColor="#ffffff"
          />

          <p className="text-sm text-white/60">
            Waiting for the server...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerWakeLoader;