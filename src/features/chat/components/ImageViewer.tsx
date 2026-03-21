import React, { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  imageUrl: string;
  onClose: () => void;
};

const ImageViewer: React.FC<Props> = ({ imageUrl, onClose }) => {
  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white"
      >
        <X size={28} />
      </button>

      {/* Image */}
      <img
        src={imageUrl}
        alt="preview"
        className="max-h-[90%] max-w-[90%] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageViewer;