
import React from 'react';
import { CameraType } from './types';

export const CAMERA_ASSETS: Record<string, { icon: React.ReactElement; label: string; config: string; mount: string; lens: string }> = {
  [CameraType.STANDARD]: { label: 'Standard', config: 'Camera Pesada', mount: 'Tripod', lens: '86x', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="1.5"><rect x="4" y="7" width="12" height="6" /><path d="M16 8 L20 7 V13 L16 12" /><path d="M6 13 L4 21 M14 13 L16 21 M10 13 L10 21" /></svg>
  )},
  [CameraType.HANDHELD]: { label: 'Handheld', config: 'ENG Wireless', mount: 'Shoulder', lens: 'Wide', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="1.5"><circle cx="12" cy="5" r="3" /><path d="M7 10 L17 10 L15 22 L9 22 Z" /><rect x="14" y="9" width="5" height="4" /></svg>
  )},
  [CameraType.STEADICAM]: { label: 'Steadi', config: 'Steadicam RF', mount: 'Vest Rig', lens: '11x', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="1.5"><circle cx="8" cy="6" r="2" /><path d="M8 8 V16 M6 22 L8 16 L10 22" /><path d="M8 10 H14 L16 12 H20 V15" /><circle cx="20" cy="15" r="1.5" /></svg>
  )},
  [CameraType.TRACKCAM]: { label: 'Trackcam', config: 'Rail Cam', mount: 'Dolly', lens: '40x', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="1.5"><line x1="2" y1="20" x2="22" y2="20" /><line x1="2" y1="23" x2="22" y2="23" /><rect x="7" y="8" width="10" height="7" /><circle cx="12" cy="11.5" r="1.5" /></svg>
  )},
  [CameraType.SKYCAM]: { label: 'Skycam', config: '4-Wire System', mount: 'Aerial', lens: 'Wide', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="1.2"><path d="M2 2 L8 8 M22 2 L16 8 M2 22 L8 16 M22 22 L16 16" strokeDasharray="2,1" /><rect x="8" y="8" width="8" height="8" rx="1" /><circle cx="12" cy="12" r="2" /></svg>
  )},
  [CameraType.CRANE]: { label: 'Crane', config: 'Jib/Crane', mount: 'Crane', lens: 'Wide', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="1.5"><path d="M4 22 L18 6" /><rect x="18" y="3" width="5" height="4" /><path d="M2 22 L6 22 L4 18 Z" /></svg>
  )},
  [CameraType.DRONE]: { label: 'Drone', config: 'FPV/Aerial', mount: 'Air', lens: 'Wide', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="1.5"><path d="M6 6 L18 18 M18 6 L6 18" /><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>
  )},
  [CameraType.MINICAM]: { label: 'Minicam', config: 'Remote Box', mount: 'Clamp', lens: 'Fisheye', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="2"><rect x="7" y="7" width="10" height="10" rx="1" /><circle cx="12" cy="12" r="2" /></svg>
  )},
  [CameraType.SSM]: { label: 'SSM', config: 'Ultra Slow', mount: 'Tripod', lens: '100x', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="1.5"><rect x="4" y="7" width="14" height="6" /><circle cx="11" cy="10" r="2.5" /><path d="M10 10 H12 M11 9 V11" strokeWidth="1" /><circle cx="11" cy="10" r="1.5" strokeDasharray="1,1" /><path d="M6 13 L4 21 M16 13 L18 21" /></svg>
  )},
  [CameraType.POLECAM]: { label: 'Polecam', config: 'Light Jib', mount: 'Pole', lens: 'Wide', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="1"><line x1="4" y1="20" x2="20" y2="4" strokeWidth="2" /><rect x="19" y="2" width="4" height="4" rx="1" /></svg>
  )},
  [CameraType.TEXT]: { label: 'Texto', config: '', mount: '', lens: '', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><text x="6" y="18" fill="#FFF" fontSize="16" fontWeight="900" fontFamily="Roboto">T</text></svg>
  )},
  [CameraType.ARROW]: { label: 'Seta', config: '', mount: '', lens: '', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="2"><path d="M4 12 H20 M14 6 L20 12 L14 18" /></svg>
  )},
  [CameraType.LINE]: { label: 'Linha', config: '', mount: '', lens: '', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#FFF" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12" /></svg>
  )}
};
