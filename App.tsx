import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable'; // Garante que tens: npm install jspdf-autotable
import { CameraType, PlacedCamera, Sport } from './types';
import { CAMERA_ASSETS } from './constants';
import { SPORTS_DATABASE } from './sportsData';

const App: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<Sport>(SPORTS_DATABASE[0]);
  const [cameras, setCameras] = useState<PlacedCamera[]>([]);
  const [projectTitle, setProjectTitle] = useState('EVENTO_BROADCAST_LIVE');
  
  // Estados de Interação
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<CameraType | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);
  
  // Drag & Drop
  const [activeHandle, setActiveHandle] = useState<{id:string, idx:number} | null>(null);
  const [isDraggingItem, setIsDraggingItem] = useState(false);
  const dragIdRef = useRef<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<SVGSVGElement>(null);
  const captureTargetRef = useRef<HTMLDivElement>(null);

  // --- HELPERS ---
  const getPos = (e: any) => {
    const t = e.touches ? e.touches[0] : e;
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };

  const detectZone = (x: number, y: number, sport: Sport) => {
    if (x < 0 || x > sport.dimensions.width || y < 0 || y > sport.dimensions.height) return 'PLAT';
    return 'FOP';
  };

  // --- INPUT HANDLERS ---
  const handleStart = (e: any) => {
    // Se estiver a editar texto, não iniciar drag
    if (isEditingText && e.target.closest('.text-editable')) return;
    if (e.target.closest('button') || e.target.closest('input')) return;

    const t = e.target as HTMLElement;
    const h = t.closest('.handle') as HTMLElement;
    const item = t.closest('.draggable-item') as HTMLElement;
    
    const pos = getPos(e);

    if (h) {
      if(e.cancelable) e.preventDefault();
      setActiveHandle({ id: h.dataset.id!, idx: parseInt(h.dataset.idx!) });
    } else if (item) {
      if(e.cancelable) e.preventDefault();
      const id = item.dataset.id!;
      const cam = cameras.find(c => c.id === id);
      
      if (cam) {
        setSelectedId(id);
        dragIdRef.current = id;
        setIsDraggingItem(true);
        
        // Calcular offset para evitar "saltos"
        if (cam.type === CameraType.ARROW || cam.type === CameraType.LINE) {
           setDragOffset({ x: pos.x, y: pos.y });
        } else {
           setDragOffset({ x: pos.x - cam.x, y: pos.y - cam.y });
        }
      }
    } else {
      // Clicou no fundo
      if (t.closest('.canvas-container')) {
        setSelectedId(null);
        setIsEditingText(false);
      }
    }
  };

  const handleMove = useCallback((e: any) => {
    if (isEditingText) return;
    if (!dragIdRef.current && !activeHandle) return;
    if (e.cancelable) e.preventDefault();
    
    const p = getPos(e);

    // 1. Mover Handles (Vetores)
    if (activeHandle) {
      setCameras(prev => prev.map(c => {
        if (c.id === activeHandle.id) {
          if (activeHandle.idx === 1) return { ...c, x1:p.x, y1:p.y, x:(p.x+c.x2!)/2, y:(p.y+c.y2!)/2 };
          return { ...c, x2:p.x, y2:p.y, x:(c.x1!+p.x)/2, y:(c.y1!+p.y)/2 };
        }
        return c;
      }));
      return;
    }

    // 2. Mover Itens
    if (dragIdRef.current) {
      setCameras(prev => prev.map(c => {
        if (c.id === dragIdRef.current) {
          
          // Lógica Vetores (Move inteiro)
          if (c.type === CameraType.ARROW || c.type === CameraType.LINE) {
             const dx = p.x - dragOffset.x;
             const dy = p.y - dragOffset.y;
             setDragOffset({ x: p.x, y: p.y });
             return { 
               ...c, x: p.x, y: p.y, 
               x1: c.x1!+dx, y1: c.y1!+dy, x2: c.x2!+dx, y2: c.y2!+dy 
             };
          }

          // Lógica Normal (Câmaras e Texto)
          const nx = p.x - dragOffset.x;
          const ny = p.y - dragOffset.y;
          return { ...c, x: nx, y: ny, position: detectZone(nx, ny, selectedSport) };
        }
        return c;
      }));
    }
  }, [activeHandle, selectedSport, isEditingText, dragOffset]);

  const handleEnd = () => { 
    dragIdRef.current = null; 
    setActiveHandle(null); 
    setIsDraggingItem(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [handleMove]);

  const onDrop = (e: any) => {
    e.preventDefault();
    if (!draggedType) return;
    const p = getPos(e);
    const isV = [CameraType.ARROW, CameraType.LINE].includes(draggedType);
    const isT = draggedType === CameraType.TEXT;
    
    // Contagem apenas para câmaras reais
    const count = cameras.filter(c => ![CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(c.type)).length;
    
    const cam: any = {
      id: Math.random().toString(36).substr(2, 9), 
      nr: (isV || isT) ? null : count + 1,
      type: draggedType, 
      x: p.x, y: p.y, 
      x1: p.x-40, y1: p.y-20, x2: p.x+40, y2: p.y+20,
      rotation: 0, scale: 1, flipped: false,
      position: detectZone(p.x, p.y, selectedSport), 
      lens: (isV || isT) ? '' : '86x',
      text: isT ? 'EDITAR TEXTO' : undefined
    };
    setCameras([...cameras, cam]);
    setSelectedId(cam.id);
    setDraggedType(null);
  };

  const updateCam = (id: string, prop: any) => {
    setCameras(prev => prev.map(c => c.id === id ? { ...c, ...prop } : c));
  };

  // --- PDF EXPORT (CORRIGIDO) ---
  const exportPDF = async () => {
    if (!captureTargetRef.current) return;
    
    // 1. Configurar HTML2Canvas com windowWidth para evitar cortes
    const canvas = await html2canvas(captureTargetRef.current, { 
      scale: 2, 
      useCORS: true,
      windowWidth: captureTargetRef.current.scrollWidth + 500, // IMPORTANTE: Força render total
      windowHeight: captureTargetRef.current.scrollHeight + 500
    });

    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Header
    doc.setFillColor(30); doc.rect(0,0,297,20,'F');
    doc.setTextColor(255); doc.setFontSize(14); doc.text(projectTitle, 10, 12);
    
    // Image
    const imgRatio = canvas.width / canvas.height;
    const w = 180; 
    const h = w / imgRatio;
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 25, w, h);
    
    // Table
    const data = cameras
      .filter(c => c.nr)
      .sort((a,b)=>a.nr!-b.nr!)
      .map(c => [c.nr, c.position, CAMERA_ASSETS[c.type].label, c.lens]);
      
    autoTable(doc, { 
      head:[['NR','POS','EQ','LENS']], 
      body:data, 
      startY:25, 
      margin:{left:200}, 
      theme:'grid', 
      styles:{fontSize:7} 
    });
    
    doc.save('PLAN.pdf');
  };

  const activeCam = cameras.find(c => c.id === selectedId);

  // --- RENDERIZADORES ---
  const renderItem = (c: PlacedCamera) => {
    const isSel = selectedId === c.id;
    
    // 1. TEXTO (Editável)
    if (c.type === CameraType.TEXT) {
      return (
        <div key={c.id} data-id={c.id} 
             className={`draggable-item absolute flex justify-center items-center ${isSel ? 'border border-blue-500' : ''}`}
             style={{ left: c.x, top: c.y, width: 200, height: 40, transform: 'translate(-50%, -50%)', zIndex: 50 }}
        >
          <div 
            className="text-editable w-full text-center text-white font-bold outline-none"
            style={{ 
              fontSize: `${16 * c.scale}px`, 
              transform: `rotate(${c.rotation}deg)`,
              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}
            contentEditable={isSel && isEditingText}
            suppressContentEditableWarning
            onDoubleClick={() => setIsEditingText(true)}
            onBlur={(e) => { setIsEditingText(false); updateCam(c.id, { text: e.currentTarget.innerText }) }}
          >
            {c.text}
          </div>
        </div>
      );
    }

    // 2. VETORES (Setas e Linhas)
    if (c.type === CameraType.ARROW || c.type === CameraType.LINE) {
      const mx = Math.min(c.x1!, c.x2!);
      const my = Math.min(c.y1!, c.y2!);
      const w = Math.max(Math.abs(c.x2! - c.x1!), 1);
      const h = Math.max(Math.abs(c.y2! - c.y1!), 1);
      const lx1 = c.x1! === mx ? 0 : w;
      const ly1 = c.y1! === my ? 0 : h;
      const lx2 = c.x2! === mx ? 0 : w;
      const ly2 = c.y2! === my ? 0 : h;
      const ang = Math.atan2(ly2 - ly1, lx2 - lx1) * 180 / Math.PI;

      return (
        <div key={c.id} data-id={c.id} className="draggable-item absolute pointer-events-auto" style={{left:mx, top:my, width:w, height:h, zIndex:10}}>
          <svg width="100%" height="100%" style={{overflow:'visible'}}>
            {/* Hit Area Grossa */}
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="transparent" strokeWidth="20" style={{cursor:'pointer'}}/>
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#FFF" strokeWidth="2" strokeDasharray={c.type===CameraType.ARROW?"5,5":"0"}/>
            {c.type===CameraType.ARROW && <path d="M0,0L-10,5L-10,-5z" fill="#FFF" transform={`translate(${lx2},${ly2}) rotate(${ang})`}/>}
          </svg>
          {isSel && (
            <>
              <div className="handle absolute w-3 h-3 bg-white border border-blue-500 rounded-full cursor-crosshair" data-id={c.id} data-idx="1" style={{left:lx1, top:ly1, transform:'translate(-50%,-50%)'}}/>
              <div className="handle absolute w-3 h-3 bg-white border border-blue-500 rounded-full cursor-crosshair" data-id={c.id} data-idx="2" style={{left:lx2, top:ly2, transform:'translate(-50%,-50%)'}}/>
            </>
          )}
        </div>
      );
    }

    // 3. CÂMARAS / ASSETS (Ícone + Número)
    return (
      <div key={c.id} data-id={c.id} 
           className={`draggable-item absolute flex justify-center items-center pointer-events-auto ${isSel?'ring-1 ring-blue-500 rounded':''}`} 
           style={{
             left: c.x, top: c.y, 
             width: 40, height: 40, 
             transform: 'translate(-50%,-50%)', 
             zIndex: 20
           }}
      >
        <div style={{
          width: '100%', height: '100%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform:`rotate(${c.rotation}deg) scaleX(${c.flipped?-1:1}) scale(${c.scale})` 
        }}>
          {/* O Ícone vem do constants.tsx e agora tem tamanho 100% */}
          {CAMERA_ASSETS[c.type].icon}
        </div>
        
        {c.nr && (
          <div className="absolute -top-1 -right-1 bg-black border border-white text-[9px] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold z-30">
            {c.nr}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#1E1E1E] text-white select-none" onMouseDown={handleStart} onTouchStart={handleStart}>
      <header className="h-14 bg-[#121212] flex items-center justify-between px-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-6">
          <div className="font-black text-[#ff5722] tracking-wider">ML PLANS V24</div>
          <input className="bg-white/5 border border-white/10 rounded px-2 h-7 text-xs text-white outline-none focus:border-[#ff5722]" value={projectTitle} onChange={e => setProjectTitle(e.target.value)}/>
        </div>
        <button onClick={exportPDF} className="bg-[#ff5722] hover:bg-[#ff7043] text-white px-5 py-1.5 rounded font-bold text-xs transition-colors">EXPORTAR PDF</button>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Esquerda */}
        <aside className="w-60 bg-[#1E1E1E] border-r border-white/10 overflow-y-auto">
          {SPORTS_DATABASE.map(s => (
            <button key={s.id} onClick={() => {setSelectedSport(s); setCameras([]);}} className={`w-full text-left p-3 text-[10px] font-bold border-b border-white/5 hover:bg-white/5 transition-colors ${selectedSport.id===s.id?'text-[#ff5722] bg-white/5':'text-gray-500'}`}>
              {s.name}
            </button>
          ))}
        </aside>

        {/* Canvas Central */}
        <main className="flex-1 bg-[#252526] overflow-auto p-20 canvas-container relative">
          <div ref={captureTargetRef} className="relative inline-block shadow-2xl" onDragOver={e=>e.preventDefault()} onDrop={onDrop}>
            <svg ref={canvasRef} width={selectedSport.dimensions.width} height={selectedSport.dimensions.height} className="bg-[#121212] block">
              {selectedSport.render()}
            </svg>
            <div className="absolute inset-0 pointer-events-none">
              {cameras.map(c => renderItem(c))}
            </div>
          </div>
        </main>

        {/* Sidebar Direita */}
        <aside className="w-64 bg-[#1E1E1E] border-l border-white/10 p-4 overflow-y-auto">
          <h3 className="text-[10px] font-bold text-gray-500 mb-4 uppercase">Biblioteca</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {Object.keys(CAMERA_ASSETS).map(t => (
              <div key={t} draggable onDragStart={()=>setDraggedType(t as any)} className="aspect-square bg-[#2D2D2D] rounded flex flex-col items-center justify-center border border-white/5 hover:border-[#ff5722] cursor-grab active:cursor-grabbing transition-colors">
                <div className="w-6 h-6 mb-1 text-white pointer-events-none">
                  {CAMERA_ASSETS[t].icon}
                </div>
                <div className="text-[8px] font-bold text-gray-400">{CAMERA_ASSETS[t].label}</div>
              </div>
            ))}
          </div>

          {activeCam && (
            <div className="space-y-4 border-t border-white/10 pt-4">
              <h3 className="text-[10px] font-bold text-[#ff5722] uppercase">Propriedades</h3>
              <div className="flex gap-2">
                <button onClick={() => setCameras(prev=>prev.filter(c=>c.id!==selectedId))} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 py-1.5 text-[10px] font-bold rounded transition-colors">ELIMINAR</button>
                <button onClick={() => updateCam(selectedId!, {flipped: !activeCam.flipped})} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-1.5 text-[10px] font-bold rounded transition-colors">INVERTER</button>
              </div>
              
              {activeCam.type !== CameraType.ARROW && activeCam.type !== CameraType.LINE && (
                <div>
                  <label className="text-[9px] text-gray-500 block mb-1">Rotação</label>
                  <input type="range" min="0" max="360" value={activeCam.rotation} onChange={e=>updateCam(selectedId!, {rotation: parseInt(e.target.value)})} className="w-full accent-[#ff5722]"/>
                </div>
              )}
              
              <div>
                <label className="text-[9px] text-gray-500 block mb-1">Posição / Local</label>
                <input className="w-full bg-black/30 border border-white/10 rounded p-2 text-xs text-white outline-none focus:border-[#ff5722]" value={activeCam.position} onChange={e=>updateCam(selectedId!, {position: e.target.value})}/>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default App;
