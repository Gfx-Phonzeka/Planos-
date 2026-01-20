
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CameraType, PlacedCamera, Sport } from './types';
import { CAMERA_ASSETS } from './constants';
import { SPORTS_DATABASE } from './sportsData';

const App: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<Sport>(SPORTS_DATABASE[0]);
  const [cameras, setCameras] = useState<PlacedCamera[]>([]);
  const [projectTitle, setProjectTitle] = useState('EVENTO_BROADCAST_LIVE');
  const [location, setLocation] = useState('Estádio Nacional');
  const [time, setTime] = useState('21:00');
  
  const [draggedType, setDraggedType] = useState<CameraType | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [activeHandle, setActiveHandle] = useState<{ id: string, index: number } | null>(null);

  const canvasRef = useRef<SVGSVGElement>(null);
  const captureTargetRef = useRef<HTMLDivElement>(null);
  const draggingIdRef = useRef<string | null>(null);

  // Derive the active camera object from selectedId
  const activeCamera = cameras.find(c => c.id === selectedId);

  // Function to remove a camera from the state
  const removeCamera = (id: string) => {
    setCameras(prev => prev.filter(c => c.id !== id));
    setSelectedId(null);
  };

  // Function to update properties of a specific camera
  const updateCameraProp = (id: string, props: Partial<PlacedCamera>) => {
    setCameras(prev => prev.map(c => c.id === id ? { ...c, ...props } : c));
  };

  const getPointerPos = (e: any) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { clientX, clientY };
  };

  const handleStart = (e: any) => {
    if (isEditingText) return;
    const target = e.target as HTMLElement;
    const handle = target.closest('.handle') as HTMLElement;
    const item = target.closest('.camera-item') as HTMLElement;
    
    if (handle) {
      if (e.type === 'touchstart') e.preventDefault();
      setActiveHandle({ id: handle.dataset.id!, index: parseInt(handle.dataset.index!) });
      return;
    }
    if (item) {
      if (e.type === 'touchstart') e.preventDefault();
      const id = item.dataset.id!;
      setSelectedId(id);
      draggingIdRef.current = id;
    } else {
      setSelectedId(null);
    }
  };

  const handleMove = useCallback((e: any) => {
    if (!canvasRef.current || isEditingText) return;
    const { clientX, clientY } = getPointerPos(e);
    const rect = canvasRef.current.getBoundingClientRect();
    const curX = clientX - rect.left;
    const curY = clientY - rect.top;

    if (activeHandle || draggingIdRef.current) e.preventDefault();

    if (activeHandle) {
      setCameras(prev => prev.map(c => {
        if (c.id === activeHandle.id) {
          if (activeHandle.index === 1) return { ...c, x1: curX, y1: curY, x: (curX + (c.x2 || 0)) / 2, y: (curY + (c.y2 || 0)) / 2 };
          return { ...c, x2: curX, y2: curY, x: ((c.x1 || 0) + curX) / 2, y: ((c.y1 || 0) + curY) / 2 };
        }
        return c;
      }));
    } else if (draggingIdRef.current) {
      setCameras(prev => prev.map(c => {
        if (c.id === draggingIdRef.current) {
          const dx = curX - c.x, dy = curY - c.y;
          const pos = (curX < 0 || curX > selectedSport.dimensions.width || curY < 0 || curY > selectedSport.dimensions.height) ? 'Tribuna' : 'Field';
          return { ...c, x: curX, y: curY, position: pos, x1: c.x1 !== undefined ? c.x1 + dx : undefined, y1: c.y1 !== undefined ? c.y1 + dy : undefined, x2: c.x2 !== undefined ? c.x2 + dx : undefined, y2: c.y2 !== undefined ? c.y2 + dy : undefined };
        }
        return c;
      }));
    }
  }, [selectedSport, isEditingText, activeHandle]);

  const handleEnd = useCallback(() => { draggingIdRef.current = null; setActiveHandle(null); }, []);

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
  }, [handleMove, handleEnd]);

  const onDrop = (e: any) => {
    e.preventDefault();
    if (!draggedType || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const isV = [CameraType.ARROW, CameraType.LINE].includes(draggedType);
    const count = cameras.filter(c => ![CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(c.type)).length;
    const cam: PlacedCamera = {
      id: Math.random().toString(36).substr(2, 9), nr: isV || draggedType === CameraType.TEXT ? undefined : count + 1,
      type: draggedType, x, y, x1: isV ? x - 40 : undefined, y1: isV ? y - 20 : undefined, x2: isV ? x + 40 : undefined, y2: isV ? y + 20 : undefined,
      rotation: 0, scale: 1, position: 'Field', config: '', mount: '', lens: '86x', text: draggedType === CameraType.TEXT ? 'EDIT' : undefined
    };
    setCameras([...cameras, cam]);
    setSelectedId(cam.id);
  };

  const exportPDF = async () => {
    const { jsPDF } = (window as any).jspdf;
    let minX = 0, minY = 0, maxX = selectedSport.dimensions.width, maxY = selectedSport.dimensions.height;
    cameras.forEach(c => {
      if (c.x1 !== undefined) { minX = Math.min(minX, c.x1, c.x2!); maxX = Math.max(maxX, c.x1, c.x2!); minY = Math.min(minY, c.y1!, c.y2!); maxY = Math.max(maxY, c.y1!, c.y2!); }
      else { minX = Math.min(minX, c.x - 40); maxX = Math.max(maxX, c.x + 40); minY = Math.min(minY, c.y - 40); maxY = Math.max(maxY, c.y + 40); }
    });
    const canvas = await (window as any).html2canvas(captureTargetRef.current, { scale: 2, x: minX + 128 - 50, y: minY + 128 - 50, width: (maxX - minX) + 100, height: (maxY - minY) + 100, useCORS: true });
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFillColor(30,30,30); doc.rect(0,0,297,25,'F');
    doc.setTextColor(255); doc.setFontSize(16); doc.text(projectTitle, 10, 11);
    doc.setFontSize(10); doc.text(`${location} | ${time}`, 10, 19);
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 32, 180, 180 / (canvas.width / canvas.height));
    const data = cameras.filter(c => ![CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(c.type)).sort((a,b) => (a.nr||0) - (b.nr||0)).map(c => [c.nr, c.position, CAMERA_ASSETS[c.type].label, c.lens]);
    (doc as any).autoTable({ head: [['NR', 'POS', 'EQUIP', 'LENS']], body: data, startY: 32, margin: { left: 200 }, theme: 'grid', styles: { fontSize: 7 } });
    doc.save(`${projectTitle}.pdf`);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden" onMouseDown={handleStart} onTouchStart={handleStart}>
      <header className="h-16 bg-[#121212] flex items-center justify-between px-6 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="font-black text-[#FF5722] text-xl">ML PLANS</div>
          <input className="bg-white/5 border border-white/10 rounded px-2 text-xs h-8 w-48 text-white" value={projectTitle} onChange={e => setProjectTitle(e.target.value)}/>
        </div>
        <button onClick={exportPDF} className="bg-[#FF5722] text-white px-6 py-2 rounded font-bold text-xs">PDF EXPORT</button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-[#1E1E1E] border-r border-white/5 overflow-y-auto">
          {SPORTS_DATABASE.map(s => <button key={s.id} onClick={() => { setSelectedSport(s); setCameras([]); }} className={`w-full text-left p-4 text-xs font-bold border-b border-white/5 ${selectedSport.id === s.id ? 'bg-white/5 text-[#FF5722]' : 'text-gray-500'}`}>{s.name}</button>)}
        </aside>
        <main className="flex-1 canvas-container overflow-auto p-32" ref={captureTargetRef}>
          <div className="relative inline-block" onDragOver={e => e.preventDefault()} onDrop={onDrop}>
            <svg ref={canvasRef} width={selectedSport.dimensions.width} height={selectedSport.dimensions.height} className="fop-svg bg-[#121212]">{selectedSport.render()}</svg>
            <div className="absolute inset-0 pointer-events-none">
              {cameras.map(c => {
                const isV = [CameraType.ARROW, CameraType.LINE].includes(c.type);
                if (isV) {
                  const mx = Math.min(c.x1!, c.x2!), my = Math.min(c.y1!, c.y2!), w = Math.max(Math.abs(c.x2!-c.x1!), 1), h = Math.max(Math.abs(c.y2!-c.y1!), 1);
                  const lx1 = c.x1! === mx ? 0 : w, ly1 = c.y1! === my ? 0 : h, lx2 = c.x2! === mx ? 0 : w, ly2 = c.y2! === my ? 0 : h, ang = Math.atan2(ly2-ly1, lx2-lx1)*180/Math.PI;
                  return <div key={c.id} data-id={c.id} className="camera-item pointer-events-auto" style={{ left: mx, top: my, width: w, height: h }}>
                    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
                      <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#FFF" strokeWidth="2" strokeDasharray={c.type===CameraType.ARROW?"5,5":"0"}/>
                      {c.type===CameraType.ARROW && <path d="M0,0L-12,6L-12,-6z" fill="#FFF" transform={`translate(${lx2},${ly2}) rotate(${ang})`}/>}
                    </svg>
                    {selectedId === c.id && <><div className="handle absolute" data-id={c.id} data-index="1" style={{ left: lx1, top: ly1, transform: 'translate(-50%,-50%)' }}/><div className="handle absolute" data-id={c.id} data-index="2" style={{ left: lx2, top: ly2, transform: 'translate(-50%,-50%)' }}/></>}
                  </div>;
                }
                return <div key={c.id} data-id={c.id} className={`camera-item pointer-events-auto ${selectedId === c.id ? 'selected-cam' : ''}`} style={{ left: c.x, top: c.y, transform: 'translate(-50%,-50%)' }}>
                  <div style={{ transform: `rotate(${c.rotation}deg) scaleX(${c.flipped?-1:1}) scale(${c.scale})` }}>{CAMERA_ASSETS[c.type].icon}</div>
                  {c.nr && <div className="absolute -top-2 -right-2 bg-black border border-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{c.nr}</div>}
                </div>;
              })}
            </div>
          </div>
        </main>
        <aside className="w-64 bg-[#1E1E1E] border-l border-white/5 p-4 overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {Object.keys(CAMERA_ASSETS).map(t => <div key={t} draggable onDragStart={() => setDraggedType(t as CameraType)} className="p-1 bg-[#222] border border-white/10 rounded flex flex-col items-center cursor-grab hover:bg-[#333]">
              <div className="scale-75">{CAMERA_ASSETS[t as CameraType].icon}</div>
              <div className="text-[7px] font-bold uppercase text-gray-400 mt-1">{CAMERA_ASSETS[t as CameraType].label}</div>
            </div>)}
          </div>
          {activeCamera ? <div className="space-y-4">
            <button onClick={() => removeCamera(activeCamera.id)} className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-1 rounded text-[10px] font-bold">DELETE</button>
            <button onClick={() => updateCameraProp(activeCamera.id, { flipped: !activeCamera.flipped })} className="w-full bg-white/5 text-gray-300 border border-white/10 py-1 rounded text-[10px] font-bold">FLIP ICON</button>
            <input type="range" min="0" max="360" value={activeCamera.rotation} onChange={e => updateCameraProp(activeCamera.id, { rotation: parseInt(e.target.value) })} className="w-full accent-[#FF5722]"/>
            <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs" placeholder="Pos Label" value={activeCamera.position} onChange={e => updateCameraProp(activeCamera.id, { position: e.target.value })}/>
          </div> : <div className="text-[10px] text-gray-600 font-bold uppercase text-center mt-20">Select item</div>}
        </aside>
      </div>
    </div>
  );
};
export default App;
