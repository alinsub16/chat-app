import React from "react";

type AvatarProps = {
  avatar?: string | null;      
  name: string;        
  alt?: string;         
  size?: number;        
  className?: string;   
};

const Avatar: React.FC<AvatarProps> = ({ avatar, name, alt, size = 40, className = "" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2); 

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={alt ?? name}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-[#1553ea] text-white flex items-center justify-center font-semibold ${className}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;