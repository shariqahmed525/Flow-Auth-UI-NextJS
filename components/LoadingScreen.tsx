'use client';

import React from 'react';
import { Fingerprint } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="text-center">
        <div className="relative">
          <Fingerprint className="w-16 h-16 text-white mx-auto mb-4 animate-pulse-slow" />
          <div className="absolute inset-0 w-16 h-16 mx-auto border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">FlowAuth</h2>
        <p className="text-white/80">Initializing secure authentication...</p>
      </div>
    </div>
  );
}