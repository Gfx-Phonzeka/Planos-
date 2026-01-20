import React from 'react';

export enum CameraType {
  STANDARD = 'STANDARD',
  LIGHT = 'LIGHT',
  HANDHELD = 'HANDHELD',
  SSM = 'SSM',
  ULTRASLOW = 'ULTRASLOW', // Novo
  STEADICAM = 'STEADICAM',
  CRANE = 'CRANE',
  POLECAM = 'POLECAM',
  PERICAM = 'PERICAM',     // Novo
  MINICAM = 'MINICAM',
  SKYCAM = 'SKYCAM',
  DRONE = 'DRONE',
  UNDERWATER = 'UNDERWATER',
  BODYCAM = 'BODYCAM',
  TRACKCAM = 'TRACKCAM',
  PTZ = 'PTZ',             // Novo
  TEXT = 'TEXT',
  ARROW = 'ARROW',
  LINE = 'LINE'
}

export interface PlacedCamera {
  id: string;
  nr?: number;
  displayId?: string | number | null;
  type: CameraType;
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
  config?: string;
  mount?: string;
  text?: string;
}

export interface Sport {
  id: string;
  name: string;
  category: string;
  render: () => React.ReactElement;
  dimensions: { width: number; height: number };
}
