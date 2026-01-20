import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { ASSETS, SPORTS_LIST } from './constants';
import { getSportSVG } from './sportsData';
import { CameraItem, VectorItem, Point } from './types'; // Assumindo que crias os types depois ou usas any por agora

// Estilos básicos inline para garantir que funciona sem CSS externo complexo
const styles = {
  app: { display: 'flex', height: '100vh', background: '#1E1E1E', color: 'white', fontFamily: 'Roboto, sans-serif', overflow: 'hidden' },
  sidebar: { width: '260px', background: '#1E1E1E', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' as const, zIndex: 10, overflowY: 'auto' as const },
  canvas: { flex: 1, background: '#2D2D2D', position: 'relative' as const, overflow: 'auto', touchAction: 'none' },
  captureTarget: { width: '3000px', height: '2000px', position: 'relative' as const, background: '#2D2D2D', overflow: 'hidden' },
  item: { position: 'absolute' as const, cursor: 'grab', zIndex: 10 },
  btn: { width: '100%', padding: '10px', background: '#333', color: 'white', border: 'none', marginBottom: '5px', cursor: 'pointer', textAlign: 'left' as const },
  input: { width: '100%', background: '#333', border: '1px solid #444', color: 'white', padding: '8px', marginBottom: '10px' }
};

function App() {
  const [activeSport, setActiveSport] = useState('FUTEBOL');
  const [items, setItems] = useState<any[]>([]);
  const [nextId, setNextId] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [eventInfo, setEventInfo] = useState({ name: '', local: '' });
  
  // Dragging State
  const [dragging, setDragging] = useState<{id: number, type: 'item'|'handle', handleIdx?: number, startX: number, startY: number, initialData: any} | null>(null);

  const addItem = (type: string) => {
    const newItem = {
      id: Date.now(),
      displayId: type === 'text' || type === 'arrow' || type === 'line' ? null : nextId,
      type,
      x: 1500, y: 1000,
      scale: 1, rotate: 0, flipped: false,
      text: 'TEXTO',
      // Vector props
      x1: 0, y1: 50, x2: 200, y2: 50 
    };
    if (newItem.displayId) setNextId(n => n + 1);
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
  };

  // --- Logic for Dragging ---
  const handlePointerDown = (e: React.PointerEvent, item: any, handleIdx?: number) => {
    e.stopPropagation();
    e.preventDefault(); // Stop iPad scroll
    setSelectedId(item.id);
    
    setDragging({
      id: item.id,
      type: handleIdx ? 'handle' : 'item',
      handleIdx,
      startX: e.clientX,
      startY: e.clientY,
      initialData: { ...item }
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();
    
    const dx = e.clientX - dragging.startX;
    const dy = e.clientY - dragging.startY;
    
    setItems(prev => prev.map(it => {
      if (it.id !== dragging.id) return it;

      if (dragging.type === 'item') {
        return { ...it, x: dragging.initialData.x + dx, y: dragging.initialData.y + dy };
      } else {
        // Vector Handle Logic
        const newIt = { ...it };
        if (dragging.handleIdx === 1) { newIt.x1 += dx; newIt.y1 += dy; }
        else { newIt.x2 += dx; newIt.y2 += dy; }
        return newIt;
      }
    }));
    
    // Reset delta start for smoother vector updates (optional simplification)
    // In React strictly, we rely on state diff, but for high perf dragging we might need refs. 
    // Keeping simple state for now.
  };

  const handlePointerUp = () => setDragging(null);

  // --- PDF Export Logic (Smart Crop) ---
  const exportPDF = async () => {
    const target = document.getElementById('capture-target');
    if (!target) return;

    // Calculate Bounds
    let minX = 3000, minY = 2000, maxX = 0, maxY = 0;
    items.forEach(it => {
       if (it.x < minX) minX = it.x;
       if (it.y < minY) minY = it.y;
       // Simplificando largura para items normais
       const w = it.type === 'arrow' || it.type === 'line' ? Math.abs(it.x2-it.x1)+50 : 50; 
       const h = it.type === 'arrow' || it.type === 'line' ? Math.abs(it.y2-it.y1)+50 : 50;
       if (it.x + w > maxX) maxX = it.x + w;
       if (it.y + h > maxY) maxY = it.y + h;
    });
    
    // Padding e Safety
    minX = Math.max(0, minX - 100); minY = Math.max(0, minY - 100);
    maxX = Math.min(3000, maxX + 100); maxY = Math.min(2000, maxY + 100);

    const canvas = await html2canvas(target, {
      x: minX, y: minY, width: maxX - minX, height: maxY - minY,
      scale: 2, scrollX: 0, scrollY: 0, useCORS: true, backgroundColor: '#2D2D2D'
    });

    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFillColor(30,30,30); doc.rect(0,0,297,25,'F'); // Header
    doc.setTextColor(255,255,255); doc.setFontSize(16); doc.text(eventInfo.name || "EVENTO", 10, 10);
    doc.setFontSize(10); doc.text((eventInfo.local || "Local") + " | " + new Date().toLocaleDateString(), 10, 18);
    
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 30, 180, 0); // Left Side

    // Table
    const tableData = items
      .filter(i => i.displayId)
      .map(i => [i.displayId, (i.y < 700 || i.y > 1300) ? "Tribuna" : "FOP", i.type.toUpperCase()]);

    (doc as any).autoTable({
      head: [['NR', 'POS', 'TIPO']], body: tableData,
      startY: 30, margin: { left: 200 }, theme: 'grid'
    });
    
    doc.save('ML_Plan.pdf');
  };

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div style={styles.app} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove}>
      {/* Left Sidebar */}
      <div style={styles.sidebar}>
        <div style={{padding: 15, fontWeight: 'bold'}}>ML PLANS V24</div>
        {SPORTS_LIST.map(s => (
          <button key={s} style={{...styles.btn, background: activeSport===s ? '#FF5722':'#333'}} onClick={() => setActiveSport(s)}>
            {s}
          </button>
        ))}
        <div style={{padding: 15, marginTop: 'auto'}}>
          <input style={styles.input} placeholder="Evento" onChange={e => setEventInfo({...eventInfo, name: e.target.value})} />
          <input style={styles.input} placeholder="Local" onChange={e => setEventInfo({...eventInfo, local: e.target.value})} />
          <button style={{...styles.btn, background: '#2196F3', textAlign:'center'}} onClick={exportPDF}>EXPORTAR PDF</button>
        </div>
      </div>

      {/* Canvas */}
      <div style={styles.canvas as any}>
        <div id="capture-target" style={styles.captureTarget}>
          {/* FOP SVG */}
          <div style={{position:'absolute', width:'100%', height:'100%', pointerEvents:'none'}} 
               dangerouslySetInnerHTML={{__html: `<svg width="100%" height="100%">${getSportSVG(activeSport)}</svg>`}} />
          
          {/* Items */}
          {items.map(item => {
             const isVector = item.type === 'arrow' || item.type === 'line';
             // Logic for Vector rendering vs Icon rendering
             if (isVector) {
                 const w = Math.abs(item.x2 - item.x1);
                 const h = Math.abs(item.y2 - item.y1);
                 const left = Math.min(item.x1 + item.x, item.x2 + item.x); // Simplificando coords globais
                 // Nota: Para React puro, a lógica de vetores precisa de ser "item.x1 é relativo ao item.x" ou absoluto.
                 // Aqui vamos assumir que x/y é o topo/esquerda do wrapper.
                 return (
                     <div key={item.id} style={{
                         ...styles.item, left: item.x, top: item.y, width: 200, height: 100, // Simplificação visual para o MVP
                         border: selectedId === item.id ? '1px dashed #2196F3' : 'none'
                     }} onPointerDown={(e) => handlePointerDown(e, item)}>
                        {/* SVG Vector render logic here based on item.type */}
                        <div style={{color:'white'}}>Vetor (WIP)</div>
                     </div>
                 )
             }
             
             return (
               <div key={item.id} style={{
                 ...styles.item, left: item.x, top: item.y,
                 transform: `scale(${item.scale}) rotate(${item.rotate}deg) scaleX(${item.flipped?-1:1})`,
                 border: selectedId === item.id ? '1px dashed #2196F3' : 'none'
               }} onPointerDown={(e) => handlePointerDown(e, item)}>
                 <div style={{width:40, height:40}} dangerouslySetInnerHTML={{__html: ASSETS[item.type as keyof typeof ASSETS]}} />
                 {item.displayId && <div style={{position:'absolute', top:-5, right:-5, background:'black', borderRadius:'50%', width:15, height:15, fontSize:10, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid white', transform:'scale(1)'}}>{item.displayId}</div>}
               </div>
             );
          })}
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={styles.sidebar}>
        <div style={{padding: 10, background:'#252526'}}>BIBLIOTECA</div>
        <div style={{padding: 10, display:'flex', flexWrap:'wrap', gap: 5}}>
          {Object.keys(ASSETS).map(key => (
            <div key={key} style={{width:'45%', cursor:'pointer', marginBottom:10}} onClick={() => addItem(key)}>
              <div style={{width:30, height:30}} dangerouslySetInnerHTML={{__html: ASSETS[key as keyof typeof ASSETS]}} />
              <div style={{fontSize:10}}>{key.toUpperCase()}</div>
            </div>
          ))}
        </div>
        
        {selectedItem && !['arrow','line','text'].includes(selectedItem.type) && (
            <div style={{padding:15, borderTop:'1px solid #333'}}>
                <label>Tamanho</label>
                <input type="range" min="0.5" max="3" step="0.1" 
                       value={selectedItem.scale} 
                       onChange={e => setItems(items.map(i => i.id === selectedId ? {...i, scale: Number(e.target.value)} : i))} />
                <label>Rotação</label>
                <input type="range" min="0" max="360" value={selectedItem.rotate}
                       onChange={e => setItems(items.map(i => i.id === selectedId ? {...i, rotate: Number(e.target.value)} : i))} />
                <button style={styles.btn} onClick={() => setItems(items.map(i => i.id === selectedId ? {...i, flipped: !i.flipped} : i))}>Espelhar ↔</button>
                <button style={{...styles.btn, background:'red'}} onClick={() => { setItems(items.filter(i => i.id !== selectedId)); setSelectedId(null); }}>Eliminar</button>
            </div>
        )}
      </div>
    </div>
  );
}

export default App;
