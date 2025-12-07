import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-24 right-4 z-[70] animate-fade-in-down">
      <div className="bg-slate-900 text-white px-6 py-4 rounded-sm shadow-2xl flex items-center gap-3 min-w-[200px]">
        <div className="bg-green-500 rounded-full p-1">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;