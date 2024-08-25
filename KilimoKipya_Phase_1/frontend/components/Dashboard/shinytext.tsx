import React from 'react';
import { Text, TextProps } from '@mantine/core';

interface ShinyTextProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ children, className = '', ...props }) => {
  return (
    <div className="relative overflow-hidden">
      <Text 
        className={`
          relative
          inline-block
          text-transparent
          bg-clip-text
          bg-gradient-to-r from-purple-400 via-pink-500 to-red-500
          animate-shine
          ${className}
        `}
        {...props}
      >
        {children}
      </Text>
      <style jsx>{`
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
        .animate-shine {
          background-size: 200% auto;
          animation: shine 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ShinyText;