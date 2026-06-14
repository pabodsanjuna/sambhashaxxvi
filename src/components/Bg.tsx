import React from 'react';

export function Bg({ children, className = '' }: { children?: React.ReactNode, className?: string }) {
  if (children) {
    return (
      <div className={`relative min-h-[100dvh] w-full text-white ${className}`}>
        <div className="fixed inset-0 bg-gradient-to-br from-black via-[#231c17] to-black -z-50 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#5c4b3f]/20 via-transparent to-transparent -z-50 pointer-events-none" />
        {children}
      </div>
    );
  }
  
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-black via-[#231c17] to-black -z-50 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#5c4b3f]/20 via-transparent to-transparent -z-50 pointer-events-none" />
    </>
  );
}
