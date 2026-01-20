import React from 'react';
import { CameraType } from './types';

const strokeProps = { fill: "none", stroke: "#FFF", strokeWidth: "1.5" };

export const CAMERA_ASSETS: Record<string, { icon: React.ReactElement; label: string; config: string; mount: string; lens: string }> = {
  [CameraType.STANDARD]: { label: 'Std', config: 'HD', mount: 'Tripod', lens: '86x', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><rect x="4" y="7" width="12" height="6"/><path d="M16 8l4-1v6l-4-1M6 13l-2 8M14 13l2 8"/></svg>
  )},
  [CameraType.HANDHELD]: { label: 'Hand', config: 'RF', mount: 'Shoulder', lens: 'Wide', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><circle cx="12" cy="5" r="3"/><path d="M7 10h10l-2 12H9z"/><rect x="14" y="9" width="5" height="4"/></svg>
  )},
  [CameraType.STEADICAM]: { label: 'Steadi', config: 'RF', mount: 'Vest', lens: '11x', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><circle cx="8" cy="6" r="2"/><path d="M8 8v8l-2 6M8 10h6l2 2h4v3"/><circle cx="20" cy="15" r="1.5"/></svg>
  )},
  [CameraType.TRACKCAM]: { label: 'Track', config: 'Rail', mount: 'Dolly', lens: '40x', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><path d="M2 20h20M2 23h20"/><rect x="7" y="8" width="10" height="7"/><circle cx="12" cy="11.5" r="1.5"/></svg>
  )},
  [CameraType.SKYCAM]: { label: 'Sky', config: '4-Wire', mount: 'Aerial', lens: 'Wide', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><path d="M2 2l6 6M22 2l-6 6M2 22l6-6M22 22l-6-6" strokeDasharray="2"/><rect x="8" y="8" width="8" height="8"/><circle cx="12" cy="12" r="2"/></svg>
  )},
  [CameraType.CRANE]: { label: 'Crane', config: 'Jib', mount: 'Fixed', lens: 'Wide', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><path d="M4 22L18 6"/><rect x="18" y="3" width="5" height="4"/><path d="M2 22h4l-2-4z"/></svg>
  )},
  [CameraType.DRONE]: { label: 'Drone', config: '4K', mount: 'Air', lens: 'Fixed', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><path d="M6 6l12 12M18 6L6 18"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>
  )},
  [CameraType.MINICAM]: { label: 'Mini', config: 'Box', mount: 'Clamp', lens: 'Fish', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><rect x="7" y="7" width="10" height="10" rx="1"/><circle cx="12" cy="12" r="2"/></svg>
  )},
  [CameraType.SSM]: { label: 'SSM', config: 'Ultra', mount: 'Tripod', lens: '100x', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><rect x="4" y="7" width="14" height="6"/><circle cx="11" cy="10" r="2"/><path d="M6 13l-2 8M16 13l2 8"/></svg>
  )},
  [CameraType.POLECAM]: { label: 'Pole', config: 'Light', mount: 'Hand', lens: 'Wide', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><path d="M4 20L20 4" strokeWidth="2"/><rect x="19" y="2" width="4" height="4" rx="1"/></svg>
  )},
  [CameraType.TEXT]: { label: 'Text', config: '', mount: '', lens: '', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6"><text x="6" y="18" fill="#FFF" fontSize="16" fontWeight="900">T</text></svg>
  )},
  [CameraType.ARROW]: { label: 'Arrow', config: '', mount: '', lens: '', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><path d="M4 12h16m-6-6l6 6-6 6"/></svg>
  )},
  [CameraType.LINE]: { label: 'Line', config: '', mount: '', lens: '', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" {...strokeProps}><path d="M4 12h16"/></svg>
  )}
};
