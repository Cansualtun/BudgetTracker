import React from 'react';
import { Search } from 'lucide-react';

const SearchingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="relative">
        <div className="absolute inset-0 rounded-full animate-ping-slow bg-blue-100 w-24 h-24" />
        <div className="absolute inset-0 rounded-full animate-ping-fast bg-blue-200 w-20 h-20 m-2" />
        <div className="relative w-16 h-16 animate-spin-slow">
          <Search
            className="w-16 h-16 text-blue-500"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          Loading
        </h3>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes ping-fast {
          0% {
            transform: scale(0.9);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-ping-fast {
          animation: ping-fast 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default SearchingAnimation;