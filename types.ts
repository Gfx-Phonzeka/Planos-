
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
  id: string;
  nr?: number;
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
  position: string;
  config: string;
  mount: string;
  lens: string;
  text?: string;
}

export interface Sport {
  id: string;
  name: string;
  category: string;
  render: () => React.ReactElement;
  dimensions: { width: number; height: number };
}
