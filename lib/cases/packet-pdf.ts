import { PDFDocument, StandardFonts } from 'pdf-lib';
import type { Packet } from './packet';

export async function buildPacketPdf(title: string, packet: Packet) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const clean = (s: string) => Array.from(s).map(c => {
    try { font.encodeText(c); return c; } catch { return '?'; }
  }).join('').replace(/[\r\n\t]/g, ' ');
  let page = doc.addPage([612,792]);
  let y = 738;
  function line(text: string, strong = false, size = 11) {
    const face = strong ? bold : font;
    let current = '';
    const draw = () => {
      if (y < 60) { page = doc.addPage([612,792]); y = 738; }
      page.drawText(current, { x:48, y, size, font:face });
      y -= size + 6; current = '';
    };
    for (const char of clean(text)) {
      if (face.widthOfTextAtSize(current + char, size) > 516) draw();
      current += char;
    }
    if (current) draw();
  }
  const money = (n: number) => `$${n.toFixed(2)}`;
  ['Rent ledger','Case chronology','Evidence index'].forEach((section,index)=> {
    if (index) { page=doc.addPage([612,792]); y=738; }
    line('SYVIC | Case preparation packet',true,12);
    line(title,true,18); line(section,true,15);
    line('User-entered records; facts and amounts have not been independently verified.',false,9);
    y-=12;
    if (index===0) {
      let cents=0;
      if (!packet.ledger.length) line('No ledger entries supplied.');
      [...packet.ledger].sort((a,b)=>a.date.localeCompare(b.date)).forEach(r=> {
        cents+=Math.round(r.charge*100)-Math.round(r.payment*100);
        line(`${r.date} | ${r.description}`,true);
        line(`Charge ${money(r.charge)}   Payment ${money(r.payment)}   Balance ${money(cents/100)}`); y-=8;
      });
      line(`Closing balance: ${money(cents/100)}`,true);
    } else if (index===1) {
      if (!packet.chronology.length) line('No chronology entries supplied.');
      [...packet.chronology].sort((a,b)=>a.date.localeCompare(b.date)).forEach(r=> { line(r.date,true); line(r.description); y-=8; });
    } else {
      line('Index only. Supporting files are not attached to this packet.',false,10);
      if (!packet.evidence.length) line('No evidence entries supplied.');
      packet.evidence.forEach(r=> { line(r.label,true); line(r.description); y-=8; });
    }
  });
  doc.getPages().forEach((p,i)=>p.drawText(`SYVIC | Page ${i+1} of ${doc.getPageCount()}`,{x:48,y:30,size:9,font}));
  doc.setTitle(clean(title));
  return doc.save();
}
