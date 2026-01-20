export const getSportSVG = (sport: string): string => {
  const W = 3000, H = 2000, CX = W/2, CY = H/2;
  const stroke = 'stroke="white" stroke-width="4" fill="none"';
  let content = '';

  // Background
  if(sport === 'FUTEBOL' || sport === 'RUGBY') {
      content += `<rect x="0" y="0" width="${W}" height="${H}" fill="#2E4E2E"/>`;
  } else {
      content += `<rect x="0" y="0" width="${W}" height="${H}" fill="#1A237E" fill-opacity="0.3"/>`;
  }

  if (sport === 'FUTEBOL') {
      const fw = 1600, fh = 1050;
      content += `<rect x="${CX-fw/2}" y="${CY-fh/2}" width="${fw}" height="${fh}" ${stroke}/>`;
      content += `<line x1="${CX}" y1="${CY-fh/2}" x2="${CX}" y2="${CY+fh/2}" ${stroke}/>`;
      content += `<circle cx="${CX}" cy="${CY}" r="150" ${stroke}/>`;
      content += `<rect x="${CX-fw/2}" y="${CY-250}" width="200" height="500" ${stroke}/>`;
      content += `<rect x="${CX+fw/2-200}" y="${CY-250}" width="200" height="500" ${stroke}/>`;
  }
  else if (sport === 'BASQUETEBOL') {
      const bw = 1200, bh = 700;
      content += `<rect x="${CX-bw/2}" y="${CY-bh/2}" width="${bw}" height="${bh}" ${stroke} fill="#D4A373" fill-opacity="0.2"/>`;
      content += `<line x1="${CX}" y1="${CY-bh/2}" x2="${CX}" y2="${CY+bh/2}" ${stroke}/>`;
      content += `<circle cx="${CX}" cy="${CY}" r="100" ${stroke}/>`;
      content += `<rect x="${CX-bw/2}" y="${CY-150}" width="250" height="300" ${stroke}/>`;
      content += `<rect x="${CX+bw/2-250}" y="${CY-150}" width="250" height="300" ${stroke}/>`;
      content += `<path d="M ${CX-bw/2} ${CY-300} Q ${CX-bw/2+400} ${CY} ${CX-bw/2} ${CY+300}" ${stroke}/>`;
      content += `<path d="M ${CX+bw/2} ${CY-300} Q ${CX+bw/2-400} ${CY} ${CX+bw/2} ${CY+300}" ${stroke}/>`;
  }
  else if (sport === 'RUGBY') {
       const rw = 1600, rh = 900;
       content += `<rect x="${CX-rw/2}" y="${CY-rh/2}" width="${rw}" height="${rh}" ${stroke}/>`;
       content += `<line x1="${CX}" y1="${CY-rh/2}" x2="${CX}" y2="${CY+rh/2}" ${stroke}/>`;
       content += `<path d="M ${CX-rw/2} ${CY-50} v100 M ${CX-rw/2} ${CY-50} h-20 M ${CX-rw/2} ${CY+50} h-20" ${stroke}/>`;
       content += `<path d="M ${CX+rw/2} ${CY-50} v100 M ${CX+rw/2} ${CY-50} h20 M ${CX+rw/2} ${CY+50} h20" ${stroke}/>`;
  }
  else if (sport === 'TÊNIS') {
      const tw = 800, th = 1400;
      content += `<rect x="${CX-tw/2}" y="${CY-th/2}" width="${tw}" height="${th}" ${stroke} fill="#4E6E5D"/>`;
      content += `<line x1="${CX-tw/2-100}" y1="${CY}" x2="${CX+tw/2+100}" y2="${CY}" ${stroke}/>`;
      content += `<line x1="${CX}" y1="${CY-th/2}" x2="${CX}" y2="${CY-th/2+300}" ${stroke}/>`;
      content += `<line x1="${CX}" y1="${CY+th/2}" x2="${CX}" y2="${CY+th/2-300}" ${stroke}/>`;
  }
  else {
       // Campo genérico
       content += `<rect x="${CX-700}" y="${CY-400}" width="1400" height="800" ${stroke}/>`;
       content += `<line x1="${CX}" y1="${CY-400}" x2="${CX}" y2="${CY+400}" ${stroke}/>`;
       content += `<circle cx="${CX}" cy="${CY}" r="80" ${stroke}/>`;
  }
  return content;
};
