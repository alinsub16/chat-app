
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppFooterProps {
  version?: string;
  developer?: string;
  appName?: string;
  year?: number;
  onClose: () => void;
}

const Footer = ({ version = "", developer = "", appName = "", year = new Date().getFullYear(),onClose, }: AppFooterProps) => {
  return (
     <footer className={cn(
        "fixed bottom-0 left-0 w-full z-50",
        "bg-primary border-t border-white/10 px-10 md:py-4 py-2 shadow-lg",
        "animate-slide-up"
      )} >
        <button
        onClick={onClose} 
        className="absolute md:top-4 md:left-4 left-1 top-1 text-white/50 hover:text-white transition-colors cursor-pointer"
        aria-label="Close info panel"
        >
        <X className="md:w-5 md:h-5 w-3.5 h-3.5" />
      </button>
      <div className="flex sm:flex-row flex-col-reverse flex-wrap items-center justify-center sm:gap-4 gap-1">

        {/* Left — version + copyright */}
        <div className="flex sm:flex-row flex-col-reverse items-center sm:gap-3 gap-0">
          <span className="rounded bg-muted px-2 py-0.5 font-mono sm:text-sm text-white text-xs font-medium tracking-wide text-muted-foreground">
            v{version}
          </span>

          <div className="sm:h-3.5 h-0 w-px bg-border/30" aria-hidden="true" />

          <p className="sm:text-sm text-xs text-muted-foreground text-white">
            &copy; {year} {appName}. All rights reserved.
          </p>
        </div>

        {/* Right — developer credit */}
        <p className="sm:text-sm text-xs text-muted-foreground/70 text-white">
          Developed by:{" "}
          <span className="font-medium text-muted-foreground">{developer}</span>
        </p>

      </div>
    </footer>
  );
};

export default Footer;