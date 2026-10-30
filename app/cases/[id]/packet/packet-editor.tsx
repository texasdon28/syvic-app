'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Printer, Save } from 'lucide-react';
import { Packet } from '@/lib/cases/packet';
import { savePacket } from './actions';

export function PacketEditor({ id, title, caseNumber, initial }: { id: string; title: string; caseNumber: string | null; initial: Packet }) {
  const [packet, setPacket] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');
  const [review, setReview] = useState(false);
  function change(next: Packet) { setPacket(next); setDirty(true); setMessage('Unsaved changes'); }
  async function save() {
    setBusy(true);
    try { const result = await savePacket(id, packet); setMessage(result.error || 'Saved'); if (!result.error) setDirty(false); }
    catch { setMessage('Could not save. Please try again.'); }
    finally { setBusy(false); }
  }
  const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  let balance = 0;
  const sections = ['ledger', 'chronology', 'evidence'] as const;
  const labels = { ledger: 'Rent ledger', chronology: 'Case chronology', evidence: 'Evidence index' };
  return <main className="packet-root mx-auto w-full max-w-5xl px-4 py-8">
    <style>{`@media print { body * { visibility:hidden; } .packet-root,.packet-root * { visibility:visible; } .packet-root { position:absolute;left:0;top:0;max-width:none;padding:0; } .packet-controls {display:none!important;} .packet-section {break-before:page;} .packet-section:first-of-type {break-before:auto;} tr {break-inside:avoid;} thead{display:table-header-group;} } @page {size:letter;margin:18mm;} .packet-root td,.packet-root th{padding:8px;border-bottom:1px solid #ddd;text-align:left;overflow-wrap:anywhere;}`}</style>
    <div className="packet-controls mb-6 flex flex-wrap items-center gap-3">
      <Link href={`/cases/${id}`} className="underline">Back to case</Link>
      <button disabled={busy || review} onClick={save} className="inline-flex items-center gap-2 border px-3 py-2 disabled:opacity-50"><Save size={16}/>Save draft</button>
      <button disabled={busy || dirty} onClick={()=>setReview(!review)} className="border px-3 py-2 disabled:opacity-50">{review ? 'Edit packet' : 'Review packet'}</button>
      {review && <button onClick={()=>window.print()} className="inline-flex items-center gap-2 border px-3 py-2"><Printer size={16}/>Print / Save PDF</button>}
      <span role="status">{message}</span>
    </div>
    <h1 className="break-words text-2xl font-bold">{title}</h1>
    {caseNumber && <p>Case number: {caseNumber}</p>}
    <p className="my-3 text-sm text-gray-600">Prepared from user-entered records. Amounts and events have not been independently verified.</p>
    {sections.map(section=><section key={section} className="packet-section mt-8">
      <h2 className="mb-3 text-xl">{labels[section]}</h2>
      {!review ? <fieldset disabled={busy} className="space-y-3">
        {packet[section].map((row,index)=><div key={index} className="flex flex-wrap gap-2 border-b pb-3">
          {Object.entries(row).map(([field,value])=><label key={field} className="min-w-0 flex-1 text-sm">{field.charAt(0).toUpperCase()+field.slice(1)}
            <input aria-label={`${labels[section]} row ${index+1} ${field}`} className="mt-1 w-full min-w-32 rounded border p-2" type={field==='date'?'date':typeof value==='number'?'number':'text'} min={typeof value==='number'?0:undefined} step={typeof value==='number'?'0.01':undefined} maxLength={2000} value={value} onChange={e=>change({ ...packet, [section]: packet[section].map((r,i)=>i===index?{...r,[field]:typeof value==='number'?Number(e.target.value):e.target.value}:r) })}/>
          </label>)}
          <button title="Remove row" aria-label={`Remove ${labels[section]} row ${index+1}`} onClick={()=>change({...packet,[section]:packet[section].filter((_,i)=>i!==index)})}><Trash2 size={18}/></button>
        </div>)}
        <button disabled={packet[section].length>=200} className="inline-flex items-center gap-2 border px-3 py-2" onClick={()=>change({...packet,[section]:[...packet[section],section==='ledger'?{date:'',description:'',charge:0,payment:0}:section==='chronology'?{date:'',description:''}:{label:'',description:''}]})}><Plus size={16}/>Add entry</button>
      </fieldset> : <>
        {packet[section].length===0 ? <p>No entries supplied.</p> : <table className="w-full table-fixed text-sm"><thead><tr>{(section==='ledger'?['Date','Description','Charge','Payment','Balance']:section==='chronology'?['Date','Event']:['Exhibit','Description']).map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>{section==='ledger'?packet.ledger.map((r,i)=>{balance+=Math.round(r.charge*100)-Math.round(r.payment*100);return <tr key={i}><td>{r.date}</td><td>{r.description}</td><td>{money(r.charge)}</td><td>{money(r.payment)}</td><td>{money(balance/100)}</td></tr>}):section==='chronology'?[...packet.chronology].sort((a,b)=>a.date.localeCompare(b.date)).map((r,i)=><tr key={i}><td>{r.date}</td><td>{r.description}</td></tr>):packet.evidence.map((r,i)=><tr key={i}><td>{r.label}</td><td>{r.description}</td></tr>)}</tbody></table>}
        {section==='evidence' && <p className="mt-3 text-sm">Index only. Supporting files are not attached to this packet.</p>}
      </>}
    </section>)}
  </main>;
}
