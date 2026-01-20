import React from 'react';
import { CameraType } from './types';

// Estilo comum: Tamanho 100% para se adaptar ao container do App.tsx
const s = { 
  fill: "none", 
  stroke: "#FFF", 
  strokeWidth: "1.5",
  width: "100%",
  height: "100%",
  style: { display: 'block' }
};

export const CAMERA_ASSETS: Record<string, { label: string, icon: React.ReactNode, config?: string, mount?: string, lens?: string }> = {
  [CameraType.STANDARD]: { 
    label: 'Standard', 
    icon: <svg viewBox="0 0 24 24" {...s}><path d="M2 7h12v10H2z" fill="#FFF" fillOpacity="0.1"/><path d="M14 9l8-3v12l-8-3V9z"/><rect x="5" y="10" width="6" height="4" rx="1"/></svg>,
    config: 'System', mount: 'Tripod', lens: '86x'
  },
  
  [CameraType.TRACKCAM]: { 
    label: 'Track', 
    icon: <svg viewBox="0 0 24 24" {...s}><path d="M6 2v20M10 2v20" strokeOpacity="0.5" strokeDasharray="2,2"/><rect x="4" y="8" width="8" height="8" fill="#FFF" fillOpacity="0.1"/><path d="M12 10l10-3v10l-10-3V10z"/></svg>,
    config: 'Remote', mount: 'Rail', lens: 'Wide'
  },
  
  [CameraType.SSM]: { 
    label: 'SuperSlow', 
    icon: <svg viewBox="0 0 24 24" {...s}><rect x="2" y="6" width="14" height="12" rx="1" fill="#FFF" fillOpacity="0.1"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><path d="M16 8h6v8h-6z"/></svg>,
    config: 'SSM', mount: 'Tripod', lens: '86x'
  },

  // --- NOVOS ASSETS ---
  [CameraType.ULTRASLOW]: { 
    label: 'UltraSlow', 
    // Corpo robusto com indicador de velocidade (setas) e lente grande
    icon: <svg viewBox="0 0 24 24" {...s}><rect x="2" y="5" width="14" height="14" rx="2" fill="#FFF" fillOpacity="0.1"/><path d="M16 8l6 4l-6 4z" fill="#FFF"/><path d="M5 8l3 4l-3 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 8l3 4l-3 4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    config: 'HFR', mount: 'Tripod', lens: '86x'
  },

  [CameraType.PTZ]: { 
    label: 'PTZ', 
    // Vista de cima: Base redonda com cabeça rotativa e eixo
    icon: <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="8" strokeOpacity="0.5"/><rect x="8" y="8" width="8" height="8" rx="2" fill="#FFF"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>,
    config: 'Remote', mount: 'Fixed', lens: 'Int'
  },

  [CameraType.PERICAM]: { 
    label: 'Pericam', 
    // Periscópio: Tubo vertical com dobra a 90 graus no topo
    icon: <svg viewBox="0 0 24 24" {...s}><path d="M10 21L14 21" strokeWidth="3"/><line x1="12" y1="21" x2="12" y2="6"/><path d="M12 6h5v5"/><rect x="17" y="6" width="4" height="5" fill="#FFF"/></svg>,
    config: 'Special', mount: 'Periscope', lens: 'Wide'
  },
  // --------------------

  [CameraType.HANDHELD]: { 
    label: 'Handheld', 
    icon: <svg viewBox="0 0 24 24" {...s}><rect x="7" y="8" width="10" height="8" rx="1"/><path d="M17 10l5-2v8l-5-2"/><path d="M7 9l-4-2M7 15l-4 2"/></svg>,
    config: 'System', mount: 'Shoulder', lens: '22x'
  },

  [CameraType.STEADICAM]: { 
    label: 'Steadi', 
    icon: <svg viewBox="0 0 24 24" {...s}><circle cx="5" cy="12" r="3"/><path d="M8 12h4l3-4h4"/><rect x="17" y="6" width="5" height="8" transform="rotate(15 19.5 10)"/></svg>,
    config: 'RF', mount: 'Steadicam', lens: 'Wide'
  },

  [CameraType.CRANE]: { 
    label: 'Crane', 
    icon: <svg viewBox="0 0 24 24" {...s}><rect x="2" y="9" width="6" height="6"/><line x1="8" y1="12" x2="18" y2="12"/><rect x="18" y="10" width="4" height="4" fill="#FFF"/></svg>,
    config: 'System', mount: 'Jib', lens: 'Wide'
  },

  [CameraType.SKYCAM]: { 
    label: 'Skycam', 
    icon: <svg viewBox="0 0 24 24" {...s}><line x1="3" y1="3" x2="21" y2="21" strokeOpacity="0.5"/><line x1="3" y1="21" x2="21" y2="3" strokeOpacity="0.5"/><circle cx="12" cy="12" r="4" fill="#FFF" fillOpacity="0.1"/><circle cx="12" cy="12" r="1.5" fill="#FFF"/></svg>,
    config: 'Remote', mount: 'Cable', lens: 'Wide'
  },

  [CameraType.POLECAM]: { 
    label: 'Polecam', 
    icon: <svg viewBox="0 0 24 24" {...s}><circle cx="4" cy="12" r="2"/><line x1="6" y1="12" x2="20" y2="12"/><rect x="20" y="10" width="2" height="4" fill="#FFF"/></svg>,
    config: 'Special', mount: 'Pole', lens: 'Wide'
  },

  [CameraType.MINICAM]: { 
    label: 'Minicam', 
    icon: <svg viewBox="0 0 24 24" {...s}><rect x="6" y="8" width="8" height="8" rx="1"/><rect x="14" y="10" width="4" height="4" fill="#FFF"/></svg>,
    config: 'Special', mount: 'Fixed', lens: 'Wide'
  },

  [CameraType.DRONE]: { 
    label: 'Drone', 
    icon: <svg viewBox="0 0 24 24" {...s}><path d="M6 6l12 12M18 6L6 18"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>,
    config: 'RF', mount: 'Drone', lens: 'Wide'
  },

  [CameraType.TEXT]: { 
    label: 'Texto', 
    icon: <svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="2" y="6" width="20" height="12" fill="none" stroke="#FFF" strokeDasharray="2 2"/><text x="12" y="13" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8" fontWeight="bold" stroke="none">TXT</text></svg>
  },

  [CameraType.ARROW]: { 
    label: 'Seta', 
    icon: <svg viewBox="0 0 24 24" {...s}><line x1="4" y1="12" x2="20" y2="12" strokeDasharray="4 4"/><path d="M16 8l4 4l-4 4"/></svg>
  },

  [CameraType.LINE]: { 
    label: 'Linha', 
    icon: <svg viewBox="0 0 24 24" {...s}><line x1="4" y1="12" x2="20" y2="12"/></svg>
  }
};
