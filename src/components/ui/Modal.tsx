import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface ModalProps {
  show?: boolean;
  title?: string;
  message: string;
  onClose?: () => void;
  showButton?: boolean;
  buttonText?: string;
  variant?: "success" | "error" | "info";
}

const Modal: React.FC<ModalProps> = ({
  show,
  title,
  message,
  onClose,
  showButton = true,
  buttonText = "Continue",
  variant = "info",
}) => {
  const iconMap = {
    success: <CheckCircle2 className="w-10 h-10 text-green-500" />,
    error: <AlertCircle className="w-10 h-10 text-red-500" />,
    info: <AlertCircle className="w-10 h-10 text-blue-500" />,
  };

  const buttonMap = {
    success: "bg-green-600 hover:bg-green-700",
    error: "bg-red-600 hover:bg-red-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Background */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.25 }}
          >
            <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 p-8 text-center overflow-hidden">

              {/* Close Button */}
              {showButton && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
                >
                  <X size={18} />
                </button>
              )}

              {/* Glow Circle */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl" />

              {/* Icon */}
              <motion.div
                className="flex justify-center mb-4 relative z-10"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {iconMap[variant]}
              </motion.div>

              {/* Title */}
              {title && (
                <motion.h2
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-2 relative z-10"
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {title}
                </motion.h2>
              )}

              {/* Message */}
              <motion.p
                className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed mb-6 px-2 relative z-10"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.p>

              {/* Button */}
              {showButton && (
                <motion.button
                  onClick={onClose}
                  className={`w-full py-3 rounded-xl text-white font-medium shadow-lg transition ${buttonMap[variant]}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {buttonText}
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;