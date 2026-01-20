import React from 'react';

export enum CameraType {
  STANDARD = 'STANDARD',
  LIGHT = 'LIGHT',
  HANDHELD = 'HANDHELD',
  SSM = 'SSM',
  STEADICAM = 'STEADICAM',
  CRANE = 'CRANE',
  POLECAM = 'POLECAM',
  MINICAM = 'MINICAM',
  SKYCAM = 'SKYCAM',
  DRONE = 'DRONE',
  UNDERWATER = 'UNDERWATER',
  BODYCAM = 'BODYCAM',
  TRACKCAM = 'TRACKCAM',
  // Annotations
  TEXT = 'TEXT',
  ARROW = 'ARROW',
  LINE = 'LINE'
}

export interface PlacedCamera {
  id: string | number;
  nr?: number;
  displayId?: string | number | null;
  type: string; 
  x: number;
  y: number;
  x1?: number; 
  y1?: number;
  x2?: number;
  y2?: number;
  rotation: number;
  scale: number;
  flipped?: boolean;
  position?: string;
  lens?: string;
  text?: string;
}

// Estes exports extra resolvem os erros do App.tsx
export type CameraItem = PlacedCamera;
export type VectorItem = PlacedCamera;
export interface Point { x: number; y: number; }

export interface Sport {
  id: string;
  name: string;
  category: string;
  render: () => React.ReactElement;
  dimensions: { width: number; height: number };
}
