import React from 'react';
import { CameraType } from './types';

// Estilo comum: Tamanho 100% para se adaptar ao container do App.tsx
const s = { 
  fill: "none", 
  stroke: "#FFF", 
  strokeWidth: "1.5", // Traço um pouco mais fino para desenhos mais técnicos
  width: "100%",
  height: "100%",
  style: { display: 'block' }
};

export const CAMERA_ASSETS: Record<string, { label: string, icon: React.ReactNode, config?: string, mount?: string, lens?: string }> = {
  // --- REDESENHADOS (TOP VIEW / ESQUEMÁTICO) ---
  
  [CameraType.STANDARD]: { 
    label: 'Standard', 
    // Corpo quadrado + Lente trapezoidal (Vista de Cima)
    icon: <svg viewBox="0 0 24 24" {...s}><path d="M2 7h12v10H2z" fill="#FFF" fillOpacity="0.1"/><path d="M14 9l8-3v12l-8-3V9z"/><rect x="5" y="10" width="6" height="4" rx="1"/></svg>,
    config: 'System', mount: 'Tripod', lens: '86x'
  },
  
  [CameraType.TRACKCAM]: { 
    label: 'Track', 
    // Carril Vertical + Câmara em cima (Vista de Cima)
    icon: <svg viewBox="0 0 24 24" {...s}><path d="M6 2v20M10 2v20" strokeOpacity="0.5" strokeDasharray="2,2"/><rect x="4" y="8" width="8" height="8" fill="#FFF" fillOpacity="0.1"/><path d="M12 10l10-3v10l-10-3V10z"/></svg>,
    config: 'Remote', mount: 'Rail', lens: 'Wide'
  },
  
  [CameraType.SSM]: { 
    label: 'SuperSlow', 
    // Corpo maior com bobines (símbolo de slow motion) + Lente grande
    icon: <svg viewBox="0 0 24 24" {...s}><rect x="2" y="6" width="14" height="12" rx="1" fill="#FFF" fillOpacity="0.1"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><path d="M16 8h6v8h-6z"/></svg>,
    config: 'SSM', mount: 'Tripod', lens: '86x'
  },

  [CameraType.HANDHELD]: { 
    label: 'Handheld', 
    // Câmara com pegas laterais (Vista de Cima)
    icon: <svg viewBox="0 0 24 24" {...s}><rect x="7" y="8" width="10" height="8" rx="1"/><path d="M17 10l5-2v8l-5-2"/><path d="M7 9l-4-2M7 15l-4 2"/></svg>,
    config: 'System', mount: 'Shoulder', lens: '22x'
  },

  [CameraType.STEADICAM]: { 
    label: 'Steadi', 
    // Operador (Círculo) + Braço articulado + Câmara
    icon: <svg viewBox="0 0 24 24" {...s}><circle cx="5" cy="12" r="3"/><path d="M8 12h4l3-4h4"/><rect x="17" y="6" width="5" height="8" transform="rotate(15 19.5 10)"/></svg>,
    config: 'RF', mount: 'Steadicam', lens: 'Wide'
  },

  [CameraType.CRANE]: { 
    label: 'Crane', 
    // Base quadrada + Braço longo + Cabeça (Vista de Cima)
    icon: <svg viewBox="0 0 24 24" {...s}><rect x="2" y="9" width="6" height="6"/><line x1="8" y1="12" x2="18" y2="12"/><rect x="18" y="10" width="4" height="4" fill="#FFF"/></svg>,
    config: 'System', mount: 'Jib', lens: 'Wide'
  },

  [CameraType.SKYCAM]: { 
    label: 'Skycam', 
    // Cabos em X + Unidade central
    icon: <svg viewBox="0 0 24 24" {...s}><line x1="3" y1="3" x2="21" y2="21" strokeOpacity="0.5"/><line x1="3" y1="21" x2="21" y2="3" strokeOpacity="0.5"/><circle cx="12" cy="12" r="4" fill="#FFF" fillOpacity="0.1"/><circle cx="12" cy="12" r="1.5" fill="#FFF"/></svg>,
    config: 'Remote', mount: 'Cable', lens: 'Wide'
  },

  [CameraType.POLECAM]: { 
    label: 'Polecam', 
    // Pivô simples + Vareta fina + Minicam
    icon: <svg viewBox="0 0 24 24" {...s}><circle cx="4" cy="12" r="2"/><line x1="6" y1="12" x2="20" y2="12"/><rect x="20" y="10" width="2" height="4" fill="#FFF"/></svg>,
    config: 'Special', mount: 'Pole', lens: 'Wide'
  },

  [CameraType.MINICAM]: { 
    label: 'Minicam', 
    // Bloco compacto simples
    icon: <svg viewBox="0 0 24 24" {...s}><rect x="6" y="8" width="8" height="8" rx="1"/><rect x="14" y="10" width="4" height="4" fill="#FFF"/></svg>,
    config: 'Special', mount: 'Fixed', lens: 'Wide'
  },

  // --- MANTIDOS (DESIGN ORIGINAL) ---

  [CameraType.DRONE]: { 
    label: 'Drone', 
    icon: <svg viewBox="0 0 24 24" {...s}><path d="M6 6l12 12M18 6L6 18"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>,
    config: 'RF', mount: 'Drone', lens: 'Wide'
  },

  [CameraType.TEXT]: { 
    label: 'Texto', 
    // Mantido original (adaptado para viewbox 24 24 para consistência)
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
