import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { CameraType, PlacedCamera, Sport } from './types';
import { CAMERA_ASSETS } from './constants';
import { SPORTS_DATABASE } from './sportsData';

const App: React.FC = () => {
  // Estado Global
  const [selectedSport, setSelectedSport] = useState<Sport>(SPORTS_DATABASE[0]);
  const [cameras, setCameras] = useState<PlacedCamera[]>([]);
  const [projectTitle, setProjectTitle] = useState('EVENTO_BROADCAST_V24');
  const [localInfo, setLocalInfo] = useState('');
  
  // Estado de Interação
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<CameraType | null>(null); // Tipo a ser arrastado da biblioteca
  const [activeHandle, setActiveHandle] = useState<{id:string, idx:number} | null>(null); // Handle de vetor sendo arrastado
  const [isDraggingItem, setIsDraggingItem] = useState<string | null>(null); // ID do item no canvas sendo arrastado

  // Refs
  const canvasRef = useRef<SVGSVGElement>(null);
  const captureTargetRef = useRef<HTMLDivElement>(null);

  // --- Helpers de Posição ---
  const getPos = (e: any) => {
    // Unifica Touch e Mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { 
      x: clientX - r.left, 
      y: clientY - r.top 
    };
  };

  // --- Drag & Drop (Da Biblioteca para o Canvas) ---
  const handleLibDragStart = (e: React.DragEvent, type: CameraType) => {
    setDragType(type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragType) return;

    const p = getPos(e);
    const isVector = [CameraType.ARROW, CameraType.LINE].includes(dragType);
    
    // Contagem automática para câmaras (ignora texto e vetores)
    const count = cameras.filter(c => ![CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(c.type)).length;

    const newCam: PlacedCamera = {
      id: Math.random().toString(36).substr(2, 9),
      nr: isVector || dragType === CameraType.TEXT ? undefined : count + 1,
      type: dragType,
      x: p.x,
      y: p.y,
      // Props de Vetor
      x1: p.x - 50, y1: p.y, 
      x2: p.x + 50, y2: p.y,
      // Props de Item
      rotation: 0,
      scale: 1,
      flipped: false,
      position: (p.y < 100 || p.y > selectedSport.dimensions.height - 100) ? 'PLAT' : 'FOP',
      config: '', mount: '', lens: 'Std',
      text: 'TEXTO'
    };

    setCameras([...cameras, newCam]);
    setSelectedId(newCam.id);
    setDragType(null);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessário para permitir o Drop
  };

  // --- Movimentação de Itens no Canvas (Mouse & Touch) ---
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent, id: string, handleIdx?: number) => {
    e.stopPropagation();
    // Se for touch, prevenir scroll
    if ((e as any).cancelable && e.type === 'touchstart') e.preventDefault();
    
    setSelectedId(id);
    
    if (handleIdx) {
      setActiveHandle({ id, idx: handleIdx });
    } else {
      setIsDraggingItem(id);
    }
  };

  const handleGlobalMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingItem && !activeHandle) return;
    
    // Prevenir scroll durante drag
    if (e.cancelable) e.preventDefault();

    const p = getPos(e);

    setCameras(prev => prev.map(c => {
      // 1. Movendo Handle de Vetor
      if (activeHandle && c.id === activeHandle.id) {
        if (activeHandle.idx === 1) {
          // Atualiza Ponto 1 e recalcula centro X/Y
          return { ...c, x1: p.x, y1: p.y, x: (p.x + (c.x2||0))/2, y: (p.y + (c.y2||0))/2 };
        } else {
          // Atualiza Ponto 2 e recalcula centro X/Y
          return { ...c, x2: p.x, y2: p.y, x: ((c.x1||0) + p.x)/2, y: ((c.y1||0) + p.y)/2 };
        }
      }
      
      // 2. Movendo Item Inteiro
      if (isDraggingItem === c.id) {
        const dx = p.x - c.x;
        const dy = p.y - c.y;
        
        // Determina "Tribuna" vs "FOP" baseado na posição Y
        const pos = (p.y < 50 || p.y > selectedSport.dimensions.height - 50) ? 'PLAT' : 'FOP';

        if (c.type === CameraType.ARROW || c.type === CameraType.LINE) {
          return { 
            ...c, x: p.x, y: p.y, position: pos,
            x1: (c.x1||0) + dx, y1: (c.y1||0) + dy,
            x2: (c.x2||0) + dx, y2: (c.y2||0) + dy
          };
        }
        return { ...c, x: p.x, y: p.y, position: pos };
      }
      return c;
    }));
  }, [isDraggingItem, activeHandle, selectedSport]);

  const handleGlobalUp = useCallback(() => {
    setIsDraggingItem(null);
    setActiveHandle(null);
  }, []);

  // Listeners Globais para Dragging Suave
  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchmove', handleGlobalMove, { passive: false });
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [handleGlobalMove, handleGlobalUp]);


  // --- PDF Export ---
  const exportPDF = async () => {
    if (!captureTargetRef.current) return;
    
    // Captura apenas a área do Canvas
    const canvas = await html2canvas(captureTargetRef.current, { 
      scale: 2, 
      useCORS: true,
      backgroundColor: '#252526' 
    });

    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Cabeçalho PDF
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 297, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(projectTitle, 10, 10);
    doc.setFontSize(10);
    doc.text(`${localInfo} | ${new Date().toLocaleDateString()}`, 10, 18);

    // Imagem do Mapa
    const imgData = canvas.toDataURL('image/png');
    // Ajustar proporção para caber em 180mm de largura
    const imgRatio = canvas.width / canvas.height;
    const printW = 180;
    const printH = printW / imgRatio;
    doc.addImage(imgData, 'PNG', 10, 30, printW, printH);

    // Tabela Lateral
    const tableData = cameras
      .filter(c => c.nr) // Apenas câmaras numeradas
      .sort((a, b) => (a.nr || 0) - (b.nr || 0))
      .map(c => [
        c.nr, 
        c.position || 'FOP', 
        CAMERA_ASSETS[c.type].label, 
        c.lens || '-'
      ]);

    autoTable(doc, {
      head: [['NR', 'POS', 'EQ', 'LENS']],
      body: tableData,
      startY: 30,
      margin: { left: 200 },
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [255, 87, 34] }
    });
    
    doc.save(`${projectTitle}.pdf`);
  };

  const activeCam = cameras.find(c => c.id === selectedId);

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-white overflow-hidden">
      
      {/* --- HEADER SUPERIOR --- */}
      <header className="h-14 bg-[#1E1E1E] flex items-center justify-between px-4 border-b border-[#333] shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="text-[#FF5722] font-black text-lg tracking-wider">ML PLANS V24</div>
          <div className="flex gap-2">
            <input 
              className="bg-[#333] border border-[#444] rounded px-2 h-8 text-sm text-white focus:border-[#FF5722] outline-none" 
              value={projectTitle} 
              onChange={e => setProjectTitle(e.target.value)} 
              placeholder="Nome do Evento"
            />
            <input 
              className="bg-[#333] border border-[#444] rounded px-2 h-8 text-sm text-white focus:border-[#FF5722] outline-none w-32" 
              value={localInfo} 
              onChange={e => setLocalInfo(e.target.value)} 
              placeholder="Local / Hora"
            />
          </div>
        </div>
        <button 
          onClick={exportPDF} 
          className="bg-[#FF5722] hover:bg-[#F4511E] text-white px-4 py-1.5 rounded font-bold text-xs transition-colors"
        >
          EXPORTAR PDF
        </button>
      </header>

      {/* --- ÁREA PRINCIPAL --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR ESQUERDA (Desportos) */}
        <aside className="w-64 bg-[#1E1E1E] border-r border-[#333] flex flex-col overflow-hidden shrink-0 z-10">
          <div className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-[#252526]">Desportos</div>
          <div className="flex-1 overflow-y-auto">
            {SPORTS_DATABASE.map(s => (
              <button 
                key={s.id} 
                onClick={() => { setSelectedSport(s); setCameras([]); }} 
                className={`w-full text-left px-4 py-3 text-xs font-bold border-l-4 transition-colors ${selectedSport.id === s.id 
                  ? 'border-[#FF5722] bg-[#333] text-white' 
                  : 'border-transparent text-gray-400 hover:bg-[#2A2A2A]'}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </aside>

        {/* CANVAS CENTRAL */}
        <main className="flex-1 bg-[#252526] relative overflow-auto flex items-center justify-center p-10 canvas-area">
          {/* Wrapper para captura e drop */}
          <div 
            ref={captureTargetRef}
            className="relative shadow-2xl"
            style={{ width: selectedSport.dimensions.width, height: selectedSport.dimensions.height }}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
          >
            {/* SVG DO FOP */}
            <svg 
              ref={canvasRef}
              width="100%" 
              height="100%" 
              viewBox={`0 0 ${selectedSport.dimensions.width} ${selectedSport.dimensions.height}`}
              className="bg-[#111] w-full h-full block"
            >
              {selectedSport.render()}
            </svg>

            {/* CAMADA DE ITENS (Sobreposta ao SVG) */}
            <div className="absolute inset-0 pointer-events-none">
              {cameras.map(c => {
                const isSelected = selectedId === c.id;
                
                // RENDERIZAÇÃO DE VETORES (Setas e Linhas)
                if (c.type === CameraType.ARROW || c.type === CameraType.LINE) {
                  const x1 = c.x1 || 0, y1 = c.y1 || 0;
                  const x2 = c.x2 || 0, y2 = c.y2 || 0;
                  // Calcula caixa envolvente para o SVG local
                  const minX = Math.min(x1, x2) - 20;
                  const minY = Math.min(y1, y2) - 20;
                  const w = Math.abs(x2 - x1) + 40;
                  const h = Math.abs(y2 - y1) + 40;
                  
                  // Coordenadas locais dentro da caixa
                  const lx1 = x1 - minX, ly1 = y1 - minY;
                  const lx2 = x2 - minX, ly2 = y2 - minY;
                  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

                  return (
                    <div 
                      key={c.id}
                      className="absolute pointer-events-auto"
                      style={{ left: minX, top: minY, width: w, height: h }}
                      onMouseDown={(e) => handlePointerDown(e, c.id)}
                      onTouchStart={(e) => handlePointerDown(e, c.id)}
                    >
                      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                        {/* Hit Area Invisível (Grossa) */}
                        <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="transparent" strokeWidth="20" />
                        {/* Linha Visível */}
                        <line 
                          x1={lx1} y1={ly1} x2={lx2} y2={ly2} 
                          stroke={isSelected ? "#2196F3" : "#FFF"} 
                          strokeWidth="2" 
                          strokeDasharray={c.type === CameraType.ARROW ? "5,5" : "0"} 
                        />
                        {/* Cabeça da Seta */}
                        {c.type === CameraType.ARROW && (
                          <path 
                            d="M0,0 L-10,5 L-10,-5 Z" 
                            fill={isSelected ? "#2196F3" : "#FFF"} 
                            transform={`translate(${lx2},${ly2}) rotate(${angle})`} 
                          />
                        )}
                      </svg>
                      {/* Handles de Edição */}
                      {isSelected && (
                        <>
                          <div 
                            className="handle" 
                            style={{ left: lx1, top: ly1, transform: 'translate(-50%, -50%)' }}
                            onMouseDown={(e) => handlePointerDown(e, c.id, 1)}
                            onTouchStart={(e) => handlePointerDown(e, c.id, 1)}
                          />
                          <div 
                            className="handle" 
                            style={{ left: lx2, top: ly2, transform: 'translate(-50%, -50%)' }}
                            onMouseDown={(e) => handlePointerDown(e, c.id, 2)}
                            onTouchStart={(e) => handlePointerDown(e, c.id, 2)}
                          />
                        </>
                      )}
                    </div>
                  );
                }

                // RENDERIZAÇÃO DE ÍCONES (Câmaras)
                return (
                  <div 
                    key={c.id}
                    className={`camera-item pointer-events-auto absolute ${isSelected ? 'selected' : ''}`}
                    style={{ 
                      left: c.x, 
                      top: c.y, 
                      transform: 'translate(-50%, -50%)' // Centrar no ponto
                    }}
                    onMouseDown={(e) => handlePointerDown(e, c.id)}
                    onTouchStart={(e) => handlePointerDown(e, c.id)}
                  >
                    <div style={{ 
                      width: '40px', height: '40px',
                      transform: `rotate(${c.rotation}deg) scale(${c.scale}) scaleX(${c.flipped ? -1 : 1})`,
                      transition: 'transform 0.1s'
                    }}>
                      {/* Renderiza o ícone do constants.tsx */}
                      {CAMERA_ASSETS[c.type].icon}
                    </div>
                    
                    {/* Badge de Número */}
                    {c.nr && (
                      <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white z-10">
                        {c.nr}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* SIDEBAR DIREITA (Biblioteca & Propriedades) */}
        <aside className="w-64 bg-[#1E1E1E] border-l border-[#333] flex flex-col overflow-hidden shrink-0 z-10">
          
          {/* TAB: BIBLIOTECA */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-[#252526]">Biblioteca</div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(CAMERA_ASSETS).map(key => (
                  <div 
                    key={key}
                    draggable
                    onDragStart={(e) => handleLibDragStart(e, key as CameraType)}
                    className="aspect-square bg-[#252526] hover:bg-[#333] border border-[#333] rounded flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-colors"
                  >
                    <div className="w-8 h-8 text-white mb-2 pointer-events-none">
                      {CAMERA_ASSETS[key].icon}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{CAMERA_ASSETS[key].label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TAB: PROPRIEDADES (Só aparece se algo estiver selecionado) */}
          {activeCam && (
            <div className="border-t border-[#333] bg-[#252526] p-4 flex flex-col gap-4">
              <div className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                Editar: {activeCam.nr ? `CAM ${activeCam.nr}` : activeCam.type}
              </div>
              
              {/* Controles comuns (Scale, Rotate) - exceto para vetores */}
              {![CameraType.ARROW, CameraType.LINE].includes(activeCam.type) && (
                <>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Tamanho</label>
                    <input 
                      type="range" min="0.5" max="2" step="0.1" 
                      value={activeCam.scale}
                      onChange={e => setCameras(prev => prev.map(c => c.id === selectedId ? { ...c, scale: parseFloat(e.target.value) } : c))}
                      className="w-full accent-[#FF5722]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Rotação</label>
                    <input 
                      type="range" min="0" max="360" step="5" 
                      value={activeCam.rotation}
                      onChange={e => setCameras(prev => prev.map(c => c.id === selectedId ? { ...c, rotation: parseInt(e.target.value) } : c))}
                      className="w-full accent-[#FF5722]"
                    />
                  </div>
                  <button 
                    onClick={() => setCameras(prev => prev.map(c => c.id === selectedId ? { ...c, flipped: !c.flipped } : c))}
                    className="w-full bg-[#333] hover:bg-[#444] text-white py-1 rounded text-xs font-bold border border-[#444]"
                  >
                    Espelhar ↔
                  </button>
                </>
              )}

              {/* Botão de Eliminar (Comum a todos) */}
              <button 
                onClick={() => { setCameras(prev => prev.filter(c => c.id !== selectedId)); setSelectedId(null); }}
                className="w-full bg-red-900/50 hover:bg-red-900 text-red-200 py-1 rounded text-xs font-bold border border-red-900"
              >
                Eliminar
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default App;
