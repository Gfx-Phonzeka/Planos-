import React from 'react';
import { CameraType } from './types';

// Estilo comum: Tamanho 100% para se adaptar ao container do App.tsx
const s = { 
  fill: "none", 
  stroke: "#FFF", 
  strokeWidth: "1.8",
  width: "100%",
  height: "100%",
  style: { display: 'block' } // Garante que não há espaços extra
};

export const CAMERA_ASSETS: Record<string, { label: string, icon: React.ReactNode, config?: string, mount?: string, lens?: string }> = {
  [CameraType.STANDARD]: { 
    label: 'Standard', 
    icon: <svg viewBox="0 0 64 64" {...s}><path d="M12 22h36v20H12zM12 32h36M48 26l8-6v24l-8-6"/><path d="M20 42l-4 14M40 42l4 14M30 42v14"/></svg>,
    config: 'System', mount: 'Tripod', lens: '86x'
  },
  [CameraType.HANDHELD]: { 
    label: 'Handheld', 
    icon: <svg viewBox="0 0 64 64" {...s}><circle cx="32" cy="14" r="5"/><path d="M32 19v16l-10 10M32 35l10 10M20 25h24"/><path d="M44 25l6-2v6l-6-2z"/></svg>,
    config: 'System', mount: 'Shoulder', lens: '22x'
  },
  [CameraType.STEADICAM]: { 
    label: 'Steadicam', 
    icon: <svg viewBox="0 0 64 64" {...s}><circle cx="32" cy="16" r="4"/><path d="M32 20v18M24 24h16v10H24z"/><path d="M40 28l12 4l-4 12"/><rect x="44" y="44" width="8" height="6"/></svg>,
    config: 'RF', mount: 'Steadicam', lens: 'Wide'
  },
  [CameraType.TRACKCAM]: { 
    label: 'Trackcam', 
    icon: <svg viewBox="0 0 64 64" {...s}><path d="M4 48h56M12 48v4M52 48v4M12 52h40"/><rect x="22" y="32" width="20" height="12"/><path d="M42 36l8-4v12l-8-4"/></svg>,
    config: 'Remote', mount: 'Rail', lens: 'Wide'
  },
  [CameraType.SKYCAM]: { 
    label: 'Skycam', 
    icon: <svg viewBox="0 0 64 64" {...s}><path d="M4 4l24 24M60 4l-24 24M4 60l24-24M60 60l-24-24"/><circle cx="32" cy="32" r="8"/><circle cx="32" cy="32" r="3"/></svg>,
    config: 'Remote', mount: 'Cable', lens: 'Wide'
  },
  [CameraType.CRANE]: { 
    label: 'Crane', 
    icon: <svg viewBox="0 0 64 64" {...s}><path d="M10 50l20-30l30 20"/><path d="M30 20l-4 30h8z"/><rect x="54" y="36" width="8" height="6"/></svg>,
    config: 'System', mount: 'Jib', lens: 'Wide'
  },
  [CameraType.DRONE]: { 
    label: 'Drone', 
    icon: <svg viewBox="0 0 64 64" {...s}><path d="M12 12l40 40M52 12L12 52"/><circle cx="32" cy="32" r="6"/><circle cx="12" cy="12" r="4"/><circle cx="52" cy="12" r="4"/><circle cx="52" cy="52" r="4"/><circle cx="12" cy="52" r="4"/></svg>,
    config: 'RF', mount: 'Drone', lens: 'Wide'
  },
  [CameraType.MINICAM]: { 
    label: 'Minicam', 
    icon: <svg viewBox="0 0 64 64" {...s}><rect x="20" y="24" width="24" height="16" rx="2"/><path d="M32 40v8M24 48h16"/></svg>,
    config: 'Special', mount: 'Fixed', lens: 'Wide'
  },
  [CameraType.SSM]: { 
    label: 'Super Slow', 
    icon: <svg viewBox="0 0 64 64" {...s}><path d="M10 20h34v24H10zM44 28l10-6v20l-10-6"/><circle cx="27" cy="32" r="8"/><path d="M27 26v6h4"/></svg>,
    config: 'SSM', mount: 'Tripod', lens: '86x'
  },
  [CameraType.POLECAM]: { 
    label: 'Polecam', 
    icon: <svg viewBox="0 0 64 64" {...s}><line x1="10" y1="50" x2="50" y2="20"/><rect x="48" y="16" width="8" height="6"/><path d="M10 50l-5 5M10 50l5 5"/></svg>,
    config: 'Special', mount: 'Pole', lens: 'Wide'
  },
  [CameraType.TEXT]: { 
    label: 'Texto', 
    icon: <svg viewBox="0 0 64 64" width="100%" height="100%"><rect x="4" y="16" width="56" height="32" fill="none" stroke="#FFF" strokeDasharray="4 4"/><text x="32" y="38" textAnchor="middle" fill="white" fontSize="20" stroke="none">TXT</text></svg>
  },
  [CameraType.ARROW]: { 
    label: 'Seta', 
    icon: <svg viewBox="0 0 64 64" {...s}><line x1="10" y1="32" x2="54" y2="32" strokeDasharray="4 4"/><path d="M48 26l6 6l-6 6"/></svg>
  },
  [CameraType.LINE]: { 
    label: 'Linha', 
    icon: <svg viewBox="0 0 64 64" {...s}><line x1="10" y1="10" x2="54" y2="54"/></svg>
  }
};
