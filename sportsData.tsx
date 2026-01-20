
import React from 'react';
import { Sport } from './types';

export const SPORTS_DATABASE: Sport[] = [
  {
    id: 'futebol', name: 'FUTEBOL', category: 'Team Sports', dimensions: { width: 800, height: 500 },
    render: () => (
      <g className="fop-svg">
        <rect width="800" height="500" fill="#1B3022" stroke="#FFF" strokeWidth="2" />
        <line x1="400" y1="0" x2="400" y2="500" stroke="#FFF" strokeWidth="1.5" />
        <circle cx="400" cy="250" r="73" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <circle cx="400" cy="250" r="2" fill="#FFF" />
        <rect x="0" y="100" width="132" height="300" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <rect x="668" y="100" width="132" height="300" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <rect x="0" y="174" width="44" height="152" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <rect x="756" y="174" width="44" height="152" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <circle cx="88" cy="250" r="2" fill="#FFF" /><circle cx="712" cy="250" r="2" fill="#FFF" />
      </g>
    )
  },
  {
    id: 'futsal', name: 'FUTSAL', category: 'Team Sports', dimensions: { width: 600, height: 350 },
    render: () => (
      <g className="fop-svg">
        <rect width="600" height="350" fill="#0D47A1" stroke="#FFF" strokeWidth="2" />
        <line x1="300" y1="0" x2="300" y2="350" stroke="#FFF" strokeWidth="1.5" />
        <circle cx="300" cy="175" r="30" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <path d="M 0 115 A 60 60 0 0 1 0 235" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <path d="M 600 115 A 60 60 0 0 0 600 235" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <line x1="100" y1="172" x2="100" y2="178" stroke="#FFF" strokeWidth="1" />
        <line x1="500" y1="172" x2="500" y2="178" stroke="#FFF" strokeWidth="1" />
      </g>
    )
  },
  {
    id: 'andebol', name: 'ANDEBOL', category: 'Team Sports', dimensions: { width: 600, height: 300 },
    render: () => (
      <g className="fop-svg">
        <rect width="600" height="300" fill="#1565C0" stroke="#FFF" strokeWidth="2" />
        <line x1="300" y1="0" x2="300" y2="300" stroke="#FFF" strokeWidth="1.5" />
        <path d="M 0 60 A 90 90 0 0 1 0 240" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <path d="M 600 60 A 90 90 0 0 0 600 240" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <path d="M 0 30 A 120 120 0 0 1 0 270" fill="none" stroke="#FFF" strokeWidth="1" strokeDasharray="5,5" />
        <path d="M 600 30 A 120 120 0 0 0 600 270" fill="none" stroke="#FFF" strokeWidth="1" strokeDasharray="5,5" />
        <rect x="-10" y="130" width="10" height="40" fill="none" stroke="#FFF" strokeWidth="2" />
        <rect x="600" y="130" width="10" height="40" fill="none" stroke="#FFF" strokeWidth="2" />
      </g>
    )
  },
  {
    id: 'rugby', name: 'RUGBY', category: 'Team Sports', dimensions: { width: 800, height: 450 },
    render: () => (
      <g className="fop-svg">
        <rect width="800" height="450" fill="#2E4E2E" stroke="#FFF" strokeWidth="2" />
        <line x1="400" y1="0" x2="400" y2="450" stroke="#FFF" strokeWidth="1.5" />
        <line x1="100" y1="0" x2="100" y2="450" stroke="#FFF" strokeWidth="1.5" />
        <line x1="700" y1="0" x2="700" y2="450" stroke="#FFF" strokeWidth="1.5" />
        <line x1="300" y1="0" x2="300" y2="450" stroke="#FFF" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="500" y1="0" x2="500" y2="450" stroke="#FFF" strokeWidth="1" strokeDasharray="5,5" />
        {/* H-Posts */}
        <path d="M 2 200 L 2 250 M 2 225 L 20 225" stroke="#FFF" strokeWidth="3" />
        <path d="M 798 200 L 798 250 M 798 225 L 778 225" stroke="#FFF" strokeWidth="3" />
      </g>
    )
  },
  {
    id: 'tenis', name: 'TÊNIS', category: 'Team Sports', dimensions: { width: 600, height: 300 },
    render: () => (
      <g className="fop-svg">
        <rect width="600" height="300" fill="#388E3C" stroke="#FFF" strokeWidth="2" />
        <rect x="50" y="30" width="500" height="240" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <line x1="300" y1="30" x2="300" y2="270" stroke="#FFF" strokeWidth="2.5" />
        <line x1="175" y1="30" x2="175" y2="270" stroke="#FFF" strokeWidth="1.2" />
        <line x1="425" y1="30" x2="425" y2="270" stroke="#FFF" strokeWidth="1.2" />
        <line x1="175" y1="150" x2="425" y2="150" stroke="#FFF" strokeWidth="1.2" />
      </g>
    )
  },
  {
    id: 'tenis_mesa', name: 'TÊNIS DE MESA', category: 'Team Sports', dimensions: { width: 300, height: 160 },
    render: () => (
      <g className="fop-svg">
        <rect width="300" height="160" fill="#1565C0" stroke="#FFF" strokeWidth="2" />
        <line x1="150" y1="0" x2="150" y2="160" stroke="#FFF" strokeWidth="3" />
        <line x1="0" y1="80" x2="300" y2="80" stroke="#FFF" strokeWidth="0.5" strokeDasharray="5,5" />
      </g>
    )
  },
  {
    id: 'voleibol', name: 'VOLEIBOL', category: 'Team Sports', dimensions: { width: 500, height: 300 },
    render: () => (
      <g className="fop-svg">
        <rect width="500" height="300" fill="#1E88E5" stroke="#FFF" strokeWidth="2" />
        <line x1="250" y1="0" x2="250" y2="300" stroke="#FFF" strokeWidth="3" />
        <line x1="166" y1="0" x2="166" y2="300" stroke="#FFF" strokeWidth="1" />
        <line x1="334" y1="0" x2="334" y2="300" stroke="#FFF" strokeWidth="1" />
      </g>
    )
  },
  {
    id: 'basquetebol', name: 'BASQUETEBOL', category: 'Team Sports', dimensions: { width: 600, height: 350 },
    render: () => (
      <g className="fop-svg">
        <rect width="600" height="350" fill="#4E342E" stroke="#FFF" strokeWidth="2" />
        <line x1="300" y1="0" x2="300" y2="350" stroke="#FFF" strokeWidth="1.5" />
        <circle cx="300" cy="175" r="40" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <rect x="0" y="125" width="120" height="100" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <rect x="480" y="125" width="120" height="100" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <path d="M 0 40 L 40 40 A 140 140 0 0 1 40 310 L 0 310" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <path d="M 600 40 L 560 40 A 140 140 0 0 0 560 310 L 600 310" fill="none" stroke="#FFF" strokeWidth="1.5" />
      </g>
    )
  },
  {
    id: 'basket_3x3', name: 'BASQUETEBOL 3×3', category: 'Team Sports', dimensions: { width: 450, height: 350 },
    render: () => (
      <g className="fop-svg">
        <rect width="450" height="350" fill="#BF360C" stroke="#FFF" strokeWidth="2" />
        <path d="M 0 40 L 40 40 A 140 140 0 0 1 40 310 L 0 310" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <rect x="0" y="125" width="100" height="100" fill="none" stroke="#FFF" strokeWidth="1.5" />
        <circle cx="20" cy="175" r="5" fill="none" stroke="#FFF" />
      </g>
    )
  }
];
