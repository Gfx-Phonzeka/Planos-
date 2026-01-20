import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
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
  const [isDraggingItem, setIsDraggingItem] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const draggingIdRef = useRef<string | null>(null);

  const canvasRef = useRef<SVGSVGElement>(null);
  const captureTargetRef = useRef<HTMLDivElement>(null);

  const activeCamera = cameras.find(c => c.id === selectedId);

  // --- HELPERS ---
  const getPointerPos = (e: any) => {
    const event = e.touches && e.touches.length > 0 ? e.touches[0] : e;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const detectZone = (x: number, y: number, sport: Sport) => {
    if (x < 0 || x > sport.dimensions.width || y < 0 || y > sport.dimensions.height) return 'Tribuna / Plataforma';
    return 'Field of Play';
  };

  // --- HANDLERS ---
  const handleStart = (e: any) => {
    if (isEditingText) {
      if (!e.target.closest('.text-editable')) {
        setIsEditingText(false);
      } else {
        return; 
      }
    }

    if (e.target.closest('button') || e.target.closest('input')) return;
    
    const pos = getPointerPos(e);
    const target = e.target as HTMLElement;

    const handle = target.closest('.handle') as HTMLElement;
    if (handle) {
      if (e.cancelable && e.type !== 'touchstart') e.preventDefault();
      setActiveHandle({ id: handle.dataset.id!, index: parseInt(handle.dataset.index!) });
      return;
    }

    const item = target.closest('.draggable-item') as HTMLElement;
    if (item) {
      const id = item.dataset.id!;
      const currentCam = cameras.find(c => c.id === id);
      
      if (currentCam?.type !== CameraType.TEXT) {
         if (e.cancelable && e.type !== 'touchstart') e.preventDefault();
      }

      if (currentCam) {
        setSelectedId(id);
        draggingIdRef.current = id;
        setIsDraggingItem(true);
        
        if (currentCam.type === CameraType.ARROW || currentCam.type === CameraType.LINE) {
           setDragOffset({ x: pos.x, y: pos.y }); 
        } else {
           setDragOffset({ x: pos.x - currentCam.x, y: pos.y - currentCam.y });
        }
      }
    } else {
      if (target.closest('.canvas-container')) {
        setSelectedId(null);
        setIsEditingText(false);
      }
    }
  };

  const handleMove = useCallback((e: any) => {
    if (isEditingText) return; 
    if (!activeHandle && !draggingIdRef.current) return;
    if (e.cancelable && e.type !== 'mousemove') e.preventDefault();

    const pos = getPointerPos(e);

    if (activeHandle) {
      setCameras(prev => prev.map(c => {
        if (c.id === activeHandle.id) {
          const updates: any = {};
          if (activeHandle.index === 1) {
            updates.x1 = pos.x; updates.y1 = pos.y;
            updates.x = (pos.x + (c.x2 || 0)) / 2;
            updates.y = (pos.y + (c.y2 || 0)) / 2;
          } else {
            updates.x2 = pos.x; updates.y2 = pos.y;
            updates.x = ((c.x1 || 0) + pos.x) / 2;
            updates.y = ((c.y1 || 0) + pos.y) / 2;
          }
          return { ...c, ...updates };
        }
        return c;
      }));
      return;
    }

    if (draggingIdRef.current) {
      setCameras(prev => prev.map(c => {
        if (c.id === draggingIdRef.current) {
          if (c.type === CameraType.ARROW || c.type === CameraType.LINE) {
             const dx = pos.x - dragOffset.x;
             const dy = pos.y - dragOffset.y;
             setDragOffset({ x: pos.x, y: pos.y }); 
             return { 
               ...c, x: pos.x, y: pos.y, 
               x1: (c.x1 || 0) + dx, y1: (c.y1 || 0) + dy,
               x2: (c.x2 || 0) + dx, y2: (c.y2 || 0) + dy,
               position: detectZone(pos.x, pos.y, selectedSport)
             };
          }
          const newX = pos.x - dragOffset.x;
          const newY = pos.y - dragOffset.y;
          return { ...c, x: newX, y: newY, position: detectZone(newX, newY, selectedSport) };
        }
        return c;
      }));
    }
  }, [selectedSport, isEditingText, activeHandle, dragOffset]);

  const handleEnd = useCallback(() => { 
    draggingIdRef.current = null; 
    setActiveHandle(null);
    setIsDraggingItem(false);
  }, []);

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

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedType || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const asset = CAMERA_ASSETS[draggedType];
    const isVector = [CameraType.ARROW, CameraType.LINE].includes(draggedType);
    const isText = draggedType === CameraType.TEXT;
    const count = cameras.filter(c => !([CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(c.type))).length;

    const newCam: PlacedCamera = {
      id: Math.random().toString(36).substring(2, 11),
      nr: (isVector || isText) ? undefined : count + 1,
      type: draggedType,
      x, y,
      x1: isVector ? x - 60 : undefined, y1: isVector ? y - 30 : undefined,
      x2: isVector ? x + 60 : undefined, y2: isVector ? y + 30 : undefined,
      rotation: 0, scale: 1.0, flipped: false,
      position: detectZone(x, y, selectedSport),
      config: asset.config || 'HD', mount: asset.mount || 'Fixed',
      lens: (isVector || isText) ? '' : (asset.lens || '86x'),
      text: isText ? 'EDITAR TEXTO' : undefined
    };

    setCameras([...cameras, newCam]);
    setSelectedId(newCam.id);
    setDraggedType(null);
  };

  const removeCamera = (id: string) => {
    setCameras(prev => {
      const filtered = prev.filter(c => c.id !== id);
      let camCount = 0;
      return filtered.map(c => {
        if ([CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(c.type)) return c;
        camCount++;
        return { ...c, nr: camCount };
      });
    });
    setSelectedId(null);
  };

  const updateCameraProp = (id: string, updates: Partial<PlacedCamera>) => {
    setCameras(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const exportPDF = async () => {
    try {
      const target = captureTargetRef.current;
      if (!target) return;
      
      let minX = 0, minY = 0, maxX = selectedSport.dimensions.width, maxY = selectedSport.dimensions.height;

      if(cameras.length > 0) {
          cameras.forEach(cam => {
          if (cam.x1 !== undefined) {
              minX = Math.min(minX, cam.x1, cam.x2!); minY = Math.min(minY, cam.y1!, cam.y2!);
              maxX = Math.max(maxX, cam.x1, cam.x2!); maxY = Math.max(maxY, cam.y1!, cam.y2!);
          } else {
              minX = Math.min(minX, cam.x - 50); minY = Math.min(minY, cam.y - 50);
              maxX = Math.max(maxX, cam.x + 50); maxY = Math.max(maxY, cam.y + 50);
          }
          });
      }

      const padding = 100;
      minX -= padding; minY -= padding; maxX += padding; maxY += padding;
      
      const w = maxX - minX;
      const h = maxY - minY;
      
      const wrapperOffset = 128;
      const captureX = minX + wrapperOffset;
      const captureY = minY + wrapperOffset;

      const canvas = await html2canvas(target, { 
        scale: 2, 
        x: captureX, y: captureY, width: w, height: h,
        backgroundColor: '#2D2D2D', 
        useCORS: true,
        windowWidth: target.scrollWidth + 1000,
        windowHeight: target.scrollHeight + 1000,
        logging: false
      });
      
      const doc = new jsPDF('l', 'mm', 'a4');
      doc.setFillColor(30, 30, 30); doc.rect(0, 0, 297, 25, 'F');
      doc.setTextColor(255); doc.setFontSize(18); doc.text(projectTitle.toUpperCase(), 10, 11);
      doc.setFontSize(10); doc.text(`${location} | ${time}`, 10, 19);
      doc.setFontSize(8); doc.text("ML PLANS", 287, 21, { align: 'right' });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      
      const imgRatio = w / h;
      let finalW = 180; let finalH = finalW / imgRatio;
      
      if (finalH > 160) { finalH = 160; finalW = finalH * imgRatio; }
      
      doc.addImage(imgData, 'JPEG', 10, 32, finalW, finalH);
      
      const tableData = cameras
        .filter(c => !([CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(c.type)))
        .sort((a,b) => (a.nr || 0) - (b.nr || 0))
        .map(c => [c.nr, c.position, CAMERA_ASSETS[c.type].label, c.lens || '86x']);
        
      autoTable(doc, {
        head: [['NR', 'POSIÇÃO', 'EQUIPAMENTO', 'ÓTICA']], body: tableData, startY: 32, margin: { left: 200 },
        styles: { fontSize: 6.5, cellPadding: 1.5 }, headStyles: { fillColor: [255, 87, 34], textColor: 255 }, theme: 'grid'
      });

      doc.save(`${projectTitle}.pdf`);
      
    } catch (err) {
      console.error(err);
      alert("Erro ao exportar PDF.");
    }
  };

  const renderItem = (cam: PlacedCamera) => {
    const isSelected = selectedId === cam.id;
    const isText = cam.type === CameraType.TEXT;
    const isVector = [CameraType.ARROW, CameraType.LINE].includes(cam.type);

    if (isText) {
      return (
        <div 
          className={`draggable-item absolute flex items-center justify-center pointer-events-none`}
          data-id={cam.id}
          style={{ 
             left: cam.x, top: cam.y, 
             width: 200, height: 40,
             transform: 'translate(-50%, -50%)',
             zIndex: isSelected ? 100 : 20
          }}
        >
          <div 
            className={`text-editable w-full text-center outline-none select-text pointer-events-auto cursor-text ${isSelected ? 'border border-blue-500 rounded' : ''}`}
            contentEditable={isSelected && isEditingText}
            suppressContentEditableWarning
            onDoubleClick={(e) => {
              e.preventDefault(); 
              e.stopPropagation();
              setIsEditingText(true);
            }}
            onBlur={(e) => { 
              setIsEditingText(false); 
              updateCameraProp(cam.id, { text: e.currentTarget.innerText }); 
            }}
            style={{ 
                fontSize: `${16 * cam.scale}px`, 
                transform: `rotate(${cam.rotation}deg)`,
                color: '#FFF', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                // FIX: Subir o texto editável ainda mais (-12px)
                marginTop: '-12px' 
            }}
          >
            {cam.text}
          </div>
        </div>
      );
    }

    if (isVector) {
      const vMinX = Math.min(cam.x1!, cam.x2!);
      const vMinY = Math.min(cam.y1!, cam.y2!);
      const vW = Math.max(Math.abs(cam.x2! - cam.x1!), 1);
      const vH = Math.max(Math.abs(cam.y2! - cam.y1!), 1);
      const lx1 = cam.x1! === vMinX ? 0 : vW;
      const ly1 = cam.y1! === vMinY ? 0 : vH;
      const lx2 = cam.x2! === vMinX ? 0 : vW;
      const ly2 = cam.y2! === vMinY ? 0 : vH;
      const angle = Math.atan2(ly2 - ly1, lx2 - lx1) * 180 / Math.PI;

      return (
        <div className="draggable-item absolute pointer-events-none" data-id={cam.id} style={{ left: vMinX, top: vMinY, width: vW, height: vH, zIndex: isSelected ? 90 : 15 }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${vW} ${vH}`} style={{ overflow: 'visible' }}>
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="transparent" strokeWidth="25" style={{ cursor: 'pointer', pointerEvents: 'auto' }} />
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={isSelected ? "#2196F3" : "#FFF"} strokeWidth="3" strokeDasharray={cam.type === CameraType.ARROW ? "6,4" : "0"} style={{ pointerEvents: 'none' }} />
            {cam.type === CameraType.ARROW && <path d="M0,0 L-14,7 L-14,-7 Z" fill={isSelected ? "#2196F3" : "#FFF"} transform={`translate(${lx2}, ${ly2}) rotate(${angle})`} style={{ pointerEvents: 'none' }} />}
          </svg>
          {isSelected && (
            <>
              <div className="handle absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-crosshair" data-id={cam.id} data-index="1" style={{ left: lx1, top: ly1, transform: 'translate(-50%, -50%)', pointerEvents: 'auto' }} />
              <div className="handle absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-crosshair" data-id={cam.id} data-index="2" style={{ left: lx2, top: ly2, transform: 'translate(-50%, -50%)', pointerEvents: 'auto' }} />
            </>
          )}
        </div>
      );
    }

    return (
      <div 
         className={`draggable-item absolute flex items-center justify-center pointer-events-auto ${isSelected ? 'ring-1 ring-blue-400 rounded' : ''}`}
         data-id={cam.id}
         style={{ 
            left: cam.x, top: cam.y, 
            width: 40, height: 40, 
            transform: 'translate(-50%, -50%)',
            zIndex: isSelected ? 100 : 20,
            cursor: 'move'
         }}
      >
        <div style={{ 
            width: '100%', height: '100%', 
            transform: `rotate(${cam.rotation}deg) scaleX(${cam.flipped ? -1 : 1}) scale(${cam.scale})`, 
            display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          {CAMERA_ASSETS[cam.type].icon}
        </div>
        {cam.nr && (
          <div 
            className="absolute -top-1 -right-1 bg-black border border-white text-white rounded-full z-30"
            style={{ 
              width: '16px', height: '16px', 
              fontSize: '9px', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxSizing: 'border-box'
            }}
          >
            {/* FIX: Margem negativa agressiva (-9px) para centrar o número no PDF */}
            <span style={{ marginTop: '-9px', display: 'block' }}>{cam.nr}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#1E1E1E] text-white" onMouseDown={handleStart} onTouchStart={handleStart}>
      <header className="h-16 bg-[#121212] border-b border-white/5 flex items-center justify-between px-6 z-30 shrink-0 shadow-lg">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-sm font-black text-[#FF5722] tracking-tighter leading-none uppercase">ML PLANS</span>
            <span className="text-[8px] text-gray-600 font-bold uppercase">Broadcast Production</span>
          </div>
          <div className="flex gap-4">
            <input className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-[11px] w-48 outline-none focus:border-[#FF5722] text-white uppercase" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} />
            <div className="flex gap-2">
              <input className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-[11px] w-36 outline-none focus:border-[#FF5722] text-gray-300" value={location} onChange={e => setLocation(e.target.value)} />
              <input className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-[11px] w-16 outline-none focus:border-[#FF5722] text-gray-300" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={() => { if(confirm("Apagar todos os elementos?")) setCameras([]) }} className="text-[9px] font-bold uppercase text-gray-500 hover:text-white transition">Reset</button>
           <button onClick={exportPDF} className="bg-[#FF5722] text-white px-8 py-2.5 rounded font-black text-[10px] hover:brightness-110 shadow-xl transition-all uppercase tracking-widest">Gerar PDF</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden w-full">
        <aside className="w-[280px] bg-[#1E1E1E] border-r border-white/5 overflow-y-auto shrink-0 z-10 select-none">
          <div className="p-4 text-[8px] font-bold text-gray-600 uppercase tracking-widest border-b border-white/5">Disciplinas</div>
          {SPORTS_DATABASE.map(sport => (
            <button key={sport.id} onClick={() => { setSelectedSport(sport); setCameras([]); setSelectedId(null); }} className={`w-full text-left px-5 py-3.5 text-[10px] font-medium transition-all border-b border-white/5 ${selectedSport.id === sport.id ? 'border-l-4 border-[#FF5722] text-white bg-white/5' : 'text-gray-500 hover:text-gray-200'}`}>{sport.name}</button>
          ))}
        </aside>

        <main className="flex-1 relative bg-[#252526] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto bg-[#2D2D2D] canvas-container">
            <div ref={captureTargetRef} id="capture-target" className="relative p-32 inline-block" style={{ width: Math.max(selectedSport.dimensions.width + 600, 2000), height: Math.max(selectedSport.dimensions.height + 600, 1600) }} onDragOver={e => e.preventDefault()} onDrop={onDrop} onDoubleClick={() => { const item = cameras.find(c => c.id === selectedId); if (item?.type === CameraType.TEXT) setIsEditingText(true); }}>
              <svg ref={canvasRef} width={selectedSport.dimensions.width} height={selectedSport.dimensions.height} className="bg-[#121212] shadow-2xl rounded-sm pointer-events-none ring-1 ring-white/10 fop-svg">
                {selectedSport.render()}
              </svg>
              <div className="absolute inset-0 pointer-events-none p-32">
                <div className="relative w-full h-full">
                  {cameras.map(cam => renderItem(cam))}
                </div>
              </div>
            </div>
          </div>
          <footer className="h-40 bg-[#121212] border-t border-white/5 overflow-y-auto shrink-0 z-10 select-none">
            <table className="w-full text-left text-[9px]">
              <thead className="sticky top-0 bg-[#121212] text-gray-600 uppercase font-black border-b border-white/5">
                <tr><th className="px-6 py-3 w-16">ID</th><th className="px-4 py-3">Posição</th><th className="px-4 py-3">Equipamento</th><th className="px-4 py-3">Ótica</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cameras.filter(c => !([CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(c.type))).sort((a,b) => (a.nr || 0) - (b.nr || 0)).map(cam => (
                  <tr key={cam.id} className={`transition-colors cursor-pointer ${selectedId === cam.id ? 'bg-[#FF5722]/10' : 'hover:bg-white/5'}`} onClick={(e) => { e.stopPropagation(); setSelectedId(cam.id); }}>
                    <td className="px-6 py-3 font-black text-[#FF5722]">{cam.nr}</td><td className="px-4 py-3 uppercase text-gray-300 font-bold">{cam.position}</td><td className="px-4 py-3 text-gray-500 italic">{CAMERA_ASSETS[cam.type].label}</td><td className="px-4 py-3 text-gray-400 font-mono">{cam.lens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </footer>
        </main>

        <aside className="w-[280px] bg-[#1E1E1E] border-l border-white/10 flex flex-col shrink-0 z-10 overflow-y-auto select-none">
          <div className="p-5 border-b border-white/10">
            <h3 className="text-[9px] font-black text-gray-600 uppercase mb-4 tracking-tighter">Toolkit de Assets</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(CAMERA_ASSETS).map(type => (
                <div key={type} draggable onDragStart={() => setDraggedType(type as CameraType)} className="bg-[#222] p-2 rounded flex flex-col items-center hover:bg-[#333] transition cursor-grab border border-transparent shadow-sm group">
                  <div className="w-8 h-8 mb-1 group-hover:scale-90 transition-transform">{CAMERA_ASSETS[type as CameraType].icon}</div>
                  <span className="text-[8px] font-bold uppercase text-gray-500 text-center leading-none group-hover:text-gray-300 transition-colors">{CAMERA_ASSETS[type as CameraType].label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 flex-1 bg-black/20">
            <h3 className="text-[9px] font-black text-gray-600 uppercase mb-5 tracking-tighter">Propriedades</h3>
            {activeCamera ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    const newId = Math.random().toString(36).substring(2, 11);
                    const isAnnot = [CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(activeCamera.type);
                    const cameraCount = cameras.filter(c => !([CameraType.TEXT, CameraType.ARROW, CameraType.LINE].includes(c.type))).length;
                    setCameras([...cameras, { ...activeCamera, id: newId, x: activeCamera.x + 20, y: activeCamera.y + 20, nr: isAnnot ? undefined : cameraCount + 1 }]);
                    setSelectedId(newId);
                  }} className="py-2 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase rounded border border-blue-500/20 hover:bg-blue-500/20 transition">Clonar</button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    removeCamera(activeCamera.id);
                  }} className="py-2 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded border border-red-500/20 hover:bg-red-500/20 transition">Eliminar</button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    updateCameraProp(activeCamera.id, { flipped: !activeCamera.flipped });
                  }} className={`col-span-2 py-2 text-[10px] font-black uppercase rounded border transition-colors ${activeCamera.flipped ? 'bg-[#FF5722] text-white border-[#FF5722]' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}>Inverter ↔</button>
                </div>
                {![CameraType.ARROW, CameraType.LINE].includes(activeCamera.type) && (
                  <div>
                    <label className="text-[8px] font-black text-gray-500 block uppercase mb-2">Rotação ({activeCamera.rotation}°)</label>
                    <input type="range" min="0" max="360" className="w-full accent-[#FF5722]" value={activeCamera.rotation} onChange={e => updateCameraProp(activeCamera.id, { rotation: parseInt(e.target.value) })} />
                  </div>
                )}
                <div>
                  <label className="text-[8px] font-black text-gray-500 block uppercase mb-2">Escala (x{activeCamera.scale.toFixed(2)})</label>
                  <input type="range" min="0.5" max="3.0" step="0.1" className="w-full accent-[#FF5722]" value={activeCamera.scale} onChange={e => updateCameraProp(activeCamera.id, { scale: parseFloat(e.target.value) })} />
                </div>
                <div className="pt-2 border-t border-white/10 space-y-4">
                  <div>
                    <label className="text-[8px] font-black text-gray-500 block uppercase mb-1">ID Posição</label>
                    <input className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-[11px] outline-none text-gray-300 focus:border-[#FF5722] transition" placeholder="ID Posição" value={activeCamera.position} onChange={e => updateCameraProp(activeCamera.id, { position: e.target.value })} />
                  </div>
                  {activeCamera.nr && (
                    <div>
                      <label className="text-[8px] font-black text-gray-500 block uppercase mb-1">Ótica</label>
                      <input className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-[11px] outline-none text-gray-300 focus:border-[#FF5722] transition" placeholder="Ótica" value={activeCamera.lens} onChange={e => updateCameraProp(activeCamera.id, { lens: e.target.value })} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-white/5 rounded flex items-center justify-center text-[9px] text-gray-600 font-bold uppercase text-center px-10">Selecione um item</div>
            )}
          </div>
          <div className="p-4 bg-black/40 text-[8px] text-gray-700 text-center font-black uppercase tracking-[0.2em] shrink-0">ML PLANS</div>
        </aside>
      </div>
    </div>
  );
};

export default App;
