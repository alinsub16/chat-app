import React, { useState } from "react";
import { UIMessage } from "@/features/chat/types/messageTypes";
import ImageViewer from "@/features/chat/components/ImageViewer";

type Props = {
  messages: UIMessage[];
};

const ChatFilesView: React.FC<Props> = ({ messages }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const files = messages.flatMap((msg) => msg.attachments || []);

  if (files.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No files shared yet
      </div>
    );
  }

  return (
    <>
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {files.map((file, index) => {
          const isImage = file.fileType === "image";

          return (
            <div
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden p-2"
            >
              {isImage ? (
                <img
                  src={file.url}
                  alt={file.fileName}
                  className="w-full h-auto object-cover rounded cursor-pointer hover:opacity-90 transition"
                  onClick={() => setSelectedImage(file.url)}
                />
              ) : (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 underline truncate block"
                >
                  {file.fileName || "Download file"}
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Image Viewer */}
      {selectedImage && (
        <ImageViewer
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};

export default ChatFilesView;