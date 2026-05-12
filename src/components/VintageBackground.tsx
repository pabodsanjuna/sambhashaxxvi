import React from 'react';

export function VintageBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-[#2b1000] via-[#050505] to-[#0a0500] pointer-events-none z-0" />
      {/* Animated Mesh Background Elements */}
      <div className="mesh-blob mesh-orange-1 fixed z-0 pointer-events-none"></div>
      <div className="mesh-blob mesh-orange-2 fixed z-0 pointer-events-none"></div>
      <div className="mesh-blob mesh-orange-3 fixed z-0 pointer-events-none"></div>
    </>
  );
}
