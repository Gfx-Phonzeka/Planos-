import React from 'react';
import { CameraType } from './types';

const s = { fill:"none", stroke:"#FFF", strokeWidth:"1.8" };

export const CAMERA_ASSETS: Record<string, any> = {
  [CameraType.STANDARD]: { label:'Std', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><rect x="4" y="7" width="12" height="6"/><path d="M16 8l4-1v6l-4-1M6 13l-2 8M14 13l2 8"/></svg> },
  [CameraType.HANDHELD]: { label:'Hand', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><circle cx="12" cy="5" r="3"/><path d="M7 10h10l-2 12H9z"/><rect x="14" y="9" width="5" height="4"/></svg> },
  [CameraType.STEADICAM]: { label:'Steadi', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><circle cx="8" cy="6" r="2"/><path d="M8 8v8l-2 6M8 10h6l2 2h4v3"/><circle cx="20" cy="15" r="1.5"/></svg> },
  [CameraType.TRACKCAM]: { label:'Track', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><path d="M2 20h20M2 23h20"/><rect x="7" y="8" width="10" height="7"/></svg> },
  [CameraType.SKYCAM]: { label:'Sky', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><path d="M2 2l6 6M22 2l-6 6M2 22l6-6M22 22l-6-6"/><rect x="8" y="8" width="8" height="8"/></svg> },
  [CameraType.CRANE]: { label:'Crane', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><path d="M4 22L18 6"/><rect x="18" y="3" width="5" height="4"/></svg> },
  [CameraType.DRONE]: { label:'Drone', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><path d="M6 6l12 12M18 6L6 18"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg> },
  [CameraType.MINICAM]: { label:'Mini', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><rect x="7" y="7" width="10" height="10"/><circle cx="12" cy="12" r="2"/></svg> },
  [CameraType.SSM]: { label:'SSM', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><rect x="4" y="7" width="14" height="6"/><path d="M6 13l-2 8M16 13l2 8"/></svg> },
  [CameraType.POLECAM]: { label:'Pole', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><path d="M4 20L20 4"/><rect x="19" y="2" width="4" height="4"/></svg> },
  [CameraType.TEXT]: { label:'Text', icon:<svg viewBox="0 0 24 24" className="w-6 h-6"><text x="6" y="18" fill="#FFF" fontSize="16" fontWeight="900">T</text></svg> },
  [CameraType.ARROW]: { label:'Arrow', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><path d="M4 12h16m-6-6l6 6-6 6"/></svg> },
  [CameraType.LINE]: { label:'Line', icon:<svg viewBox="0 0 24 24" className="w-6 h-6" {...s}><path d="M4 12h16"/></svg> }
};