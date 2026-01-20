
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CameraType, PlacedCamera, Sport } from './types';
import { CAMERA_ASSETS } from './constants';
import { SPORTS_DATABASE } from './sportsData';

const App: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<Sport>(SPORTS_DATABASE[0]);
  const [cameras, setCameras] = useState<PlacedCamera[]>([]);
  const [projectTitle, setProjectTitle] = useState('EVENTO_BROADCAST_V23');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<CameraType | null>(null);
  const [activeHandle, setActiveHandle] = useState<{id:string, idx:number} | null>(null);

  const canvasRef = useRef<SVGSVGElement>(null);
  const captureTargetRef = useRef<HTMLDivElement>(null);
  const dragIdRef = useRef<string | null>(null);

  const getPos = (e: any) => {
    const t = e.touches ? e.touches[0] : e;
    const r = canvasRef.current?.getBoundingClientRect();
    return { x: t.clientX - (r?.left || 0), y: t.clientY - (r?.top || 0) };
  };

  const handleStart = (e: any) => {
    const t = e.target as HTMLElement;
    const h = t.closest('.handle') as HTMLElement;
    const i = t.closest('.camera-item') as HTMLElement;
    if (h) {
      if(e.cancelable) e.preventDefault();
      setActiveHandle({ id: h.dataset.id!, idx: parseInt(h.dataset.idx!) });
    } else if (i) {
      if(e.cancelable) e.preventDefault();
      setSelectedId(i.dataset.id!);
      dragIdRef.current = i.dataset.id!;
    } else {
      setSelectedId(null);
    }
  };

  const handleMove = useCallback((e: any) => {
    if (!dragIdRef.current && !activeHandle) return;
    if (e.cancelable) e.preventDefault();
    const p = getPos(e);
    setCameras(prev => prev.map(c => {
      if (activeHandle && c.id === activeHandle.id) {
        if (activeHandle.idx === 1) return { ...c, x1:p.x, y1:p.y, x:(p.x+c.x2!)/2, y:(p.y+c.y2!)/2 };
        return { ...c, x2:p.x, y2:p.y, x:(c.x1!+p.x)/2, y:(c.y1!+p.y)/2 };
      }
      if (dragIdRef.current === c.id) {
        const dx = p.x - c.x, dy = p.y - c.y;
        const pos = (p.x < 0 || p.x > selectedSport.dimensions.width) ? 'PLAT' : 'FOP';
        return { ...c, x:p.x, y:p.y, position:pos, x1:c.x1!+dx, y1:c.y1!+dy, x2:c.x2!+dx, y2:c.y2!+dy };
      }
      return c;
    }));
  }, [activeHandle, selectedSport]);

  const handleEnd = () => { dragIdRef.current = null; setActiveHandle(null); };

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
    if (!dragType) return;
    const p = getPos(e);
    const isV = [CameraType.ARROW, CameraType.LINE].includes(dragType);
    const count = cameras.filter(c => ![CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(c.type)).length;
    const cam: any = {
      id: Math.random().toString(36).substr(2, 9), nr: isV ? null : count + 1,
      type: dragType, x: p.x, y: p.y, x1: p.x-40, y1: p.y-20, x2: p.x+40, y2: p.y+20,
      rotation: 0, scale: 1, position: 'FOP', lens: '86x'
    };
    setCameras([...cameras, cam]);
    setSelectedId(cam.id);
  };

  const exportPDF = async () => {
    const { jsPDF } = (window as any).jspdf;
    const canv = await (window as any).html2canvas(captureTargetRef.current, { scale: 2, useCORS: true });
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFillColor(30); doc.rect(0,0,297,20,'F');
    doc.setTextColor(255); doc.setFontSize(14); doc.text(projectTitle, 10, 12);
    doc.addImage(canv.toDataURL('image/png'), 'PNG', 10, 25, 180, 180/(canv.width/canv.height));
    const data = cameras.filter(c => c.nr).sort((a,b)=>a.nr!-b.nr!).map(c => [c.nr, c.position, CAMERA_ASSETS[c.type].label, c.lens]);
    (doc as any).autoTable({ head:[['NR','POS','EQ','LENS']], body:data, startY:25, margin:{left:200}, theme:'grid', styles:{fontSize:7} });
    doc.save('PLAN.pdf');
  };

  const activeCam = cameras.find(c => c.id === selectedId);

  return (
    <div className="flex flex-col h-screen overflow-hidden" onMouseDown={handleStart} onTouchStart={handleStart}>
      <header className="h-14 bg-[#121212] flex items-center justify-between px-6 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-6">
          <div className="font-black text-[#ff5722]">ML PLANS V23</div>
          <input className="bg-white/5 border border-white/10 rounded px-2 h-7 text-xs text-white" value={projectTitle} onChange={e => setProjectTitle(e.target.value)}/>
        </div>
        <button onClick={exportPDF} className="bg-[#ff5722] text-white px-5 py-1.5 rounded font-bold text-[10px]">PDF EXPORT</button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 sidebar border-r overflow-y-auto">
          {SPORTS_DATABASE.map(s => <button key={s.id} onClick={() => {setSelectedSport(s); setCameras([]);}} className={`w-full text-left p-3 text-[10px] font-bold border-b border-white/5 ${selectedSport.id===s.id?'text-[#ff5722] bg-white/5':'text-gray-500'}`}>{s.name}</button>)}
        </aside>
        <main className="flex-1 canvas-area overflow-auto p-20" ref={captureTargetRef}>
          <div className="relative inline-block" onDragOver={e=>e.preventDefault()} onDrop={onDrop}>
            <svg ref={canvasRef} width={selectedSport.dimensions.width} height={selectedSport.dimensions.height} className="bg-[#111] shadow-2xl">{selectedSport.render()}</svg>
            <div className="absolute inset-0 pointer-events-none">
              {cameras.map(c => {
                const isV = [CameraType.ARROW, CameraType.LINE].includes(c.type);
                if (isV) {
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
                    <div key={c.id} data-id={c.id} className="camera-item pointer-events-auto" style={{left:mx, top:my, width:w, height:h}}>
                      <svg width="100%" height="100%" style={{overflow:'visible'}}>
                        <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#FFF" strokeWidth="2" strokeDasharray={c.type===CameraType.ARROW?"5,5":"0"}/>
                        {c.type===CameraType.ARROW && <path d="M0,0L-10,5L-10,-5z" fill="#FFF" transform={`translate(${lx2},${ly2}) rotate(${ang})`}/>}
                      </svg>
                      {selectedId===c.id && (
                        <>
                          <div className="handle" data-id={c.id} data-idx="1" style={{left:lx1, top:ly1, transform:'translate(-50%,-50%)'}}/>
                          <div className="handle" data-id={c.id} data-idx="2" style={{left:lx2, top:ly2, transform:'translate(-50%,-50%)'}}/>
                        </>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={c.id} data-id={c.id} className={`camera-item pointer-events-auto ${selectedId===c.id?'selected':''}`} style={{left:c.x, top:c.y, transform:'translate(-50%,-50%)'}}>
                    <div style={{transform:`rotate(${c.rotation}deg) scaleX(${c.flipped?-1:1}) scale(${c.scale})` }}>{CAMERA_ASSETS[c.type].icon}</div>
                    {c.nr && <div className="absolute -top-1 -right-1 bg-black border border-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">{c.nr}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
        <aside className="w-60 sidebar border-l p-4 overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {Object.keys(CAMERA_ASSETS).map(t => <div key={t} draggable onDragStart={()=>setDragType(t as any)} className="p-1 bg-[#252526] rounded flex flex-col items-center border border-white/5 cursor-grab">
              <div className="scale-75">{CAMERA_ASSETS[t].icon}</div>
              <div className="text-[6px] font-bold text-gray-400">{CAMERA_ASSETS[t].label}</div>
            </div>)}
          </div>
          {activeCam && <div className="space-y-4">
            <button onClick={() => setCameras(prev=>prev.filter(c=>c.id!==selectedId))} className="w-full bg-red-500/20 text-red-500 py-1 text-[10px] font-bold rounded">DELETE</button>
            <button onClick={() => setCameras(prev=>prev.map(c=>c.id===selectedId?{...c,flipped:!c.flipped}:c))} className="w-full bg-white/5 text-gray-300 py-1 text-[10px] font-bold rounded">FLIP</button>
            <input type="range" min="0" max="360" value={activeCam.rotation} onChange={e=>setCameras(prev=>prev.map(c=>c.id===selectedId?{...c,rotation:parseInt(e.target.value)}:c))} className="w-full accent-[#ff5722]"/>
            <input className="w-full bg-black/30 border border-white/10 rounded p-2 text-xs" value={activeCam.position} onChange={e=>setCameras(prev=>prev.map(c=>c.id===selectedId?{...c,position:e.target.value}:c))}/>
          </div>}
        </aside>
      </div>
    </div>
  );
};
export default App;
