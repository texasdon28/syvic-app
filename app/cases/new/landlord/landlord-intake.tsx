'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { intakeDefaults, landlordIntakeSchema, IntakeField } from '@/lib/cases/landlord-intake';
import { createLandlordCase } from './actions';

type Field = { key: IntakeField; label: string; required?: boolean; type?: string; options?: readonly (readonly [string, string])[] };
const yesNo = [['unknown', 'Not known'], ['yes', 'Yes'], ['no', 'No']] as const;
const steps: { title: string; fields: Field[] }[] = [
  { title: 'Property', fields: [
    { key: 'county', label: 'County', options: [['harris', 'Harris County'], ['other', 'Another county'], ['unknown', 'Not sure']] },
    { key: 'property_use', label: 'Property use', options: [['residential', 'Residential'], ['commercial', 'Commercial'], ['unknown', 'Not sure']] },
    { key: 'property_type', label: 'Property type', options: [['single_family', 'Single-family home'], ['multi_family', 'Apartment or multifamily']] },
    { key: 'address_line1', label: 'Street address', required: true }, { key: 'address_line2', label: 'Unit or apartment' },
    { key: 'city', label: 'City', required: true }, { key: 'zip_code', label: 'ZIP code', required: true },
  ] },
  { title: 'Parties and lease', fields: [
    { key: 'title', label: 'Case title', required: true }, { key: 'landlord_name', label: 'Landlord legal name', required: true },
    { key: 'tenant_first_name', label: 'Primary tenant first name', required: true }, { key: 'tenant_last_name', label: 'Primary tenant last name', required: true },
    { key: 'additional_parties', label: 'Other tenant or party names' },
    { key: 'lease_kind', label: 'Lease', options: [['unknown', 'Not known'], ['written', 'Written'], ['oral', 'Oral']] },
    { key: 'monthly_rent', label: 'Monthly rent (optional)', type: 'number' },
    { key: 'reason', label: 'Recorded reason', options: [['nonpayment', 'Nonpayment of rent'], ['holdover', 'Holdover'], ['lease_violation', 'Lease violation'], ['other', 'Other']] },
  ] },
  { title: 'Notice and context', fields: [
    { key: 'notice_status', label: 'Has a pre-suit notice been sent?', options: [['unknown', 'Not known'], ['not_sent', 'Not sent'], ['sent', 'Sent']] },
    { key: 'notice_date', label: 'Recorded delivery date (if known)', type: 'date' }, { key: 'notice_method', label: 'Recorded delivery method (if known)' },
    { key: 'subsidized', label: 'Government-subsidized rent?', options: yesNo },
    { key: 'federal_coverage', label: 'Federal housing protections apply?', options: yesNo },
    { key: 'bankruptcy', label: 'Known bankruptcy proceeding?', options: yesNo },
    { key: 'military', label: 'Known military-service considerations?', options: yesNo },
    { key: 'notes', label: 'Additional records or questions for legal review' },
  ] },
  { title: 'Review', fields: [] },
];

export function LandlordIntake({ sourceDocument }: { sourceDocument: string }) {
  const [values, setValues] = useState({ ...intakeDefaults, source_document: sourceDocument });
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const requestId = useRef('');
  const heading = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const outOfScope = values.county !== 'harris' || values.property_use !== 'residential';
  function change(key: IntakeField, value: string) {
    setValues(previous => ({ ...previous, [key]: value,
      ...(key === 'notice_status' && value !== 'sent' ? { notice_date: '', notice_method: '' } : {}) }));
    setError('');
  }
  function go(next: number) { setStep(next); setError(''); requestAnimationFrame(() => heading.current?.focus()); }
  function next() {
    if (!form.current?.reportValidity()) return;
    const parsed = landlordIntakeSchema.safeParse({ ...values, acknowledgment: 'yes' });
    const issue = !parsed.success && parsed.error.issues.find(item => steps[step].fields.some(field => field.key === item.path[0]));
    if (issue) { setError(issue.message); return; }
    go(step + 1);
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (step < 3) { next(); return; }
    if (busy) return;
    const parsed = landlordIntakeSchema.safeParse(values);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setBusy(true); setError('');
    try {
      const data = new FormData();
      if (!requestId.current) requestId.current = crypto.randomUUID();
      data.set('request_id', requestId.current);
      Object.entries(parsed.data).forEach(([key, value]) => data.set(key, value));
      const result = await createLandlordCase(data);
      if (result.error) { setError(result.error); setBusy(false); }
      else router.push(`/cases/${result.caseId}`);
    } catch { setError('Could not save. Your entries are still here; please try again.'); setBusy(false); }
  }
  return <div className="mt-6 max-w-3xl">
    <ol aria-label="Intake progress" className="grid grid-cols-2 gap-3 border-y py-4 text-sm sm:grid-cols-4">{steps.map((item, index) => <li key={item.title} aria-current={index === step ? 'step' : undefined} className={index === step ? 'font-semibold' : 'text-gray-500'}>{index + 1}. {item.title}</li>)}</ol>
    <form ref={form} onSubmit={submit} className="mt-6">
      <h2 ref={heading} tabIndex={-1} className="text-xl font-semibold outline-none">{steps[step].title}</h2>
      {error && <p role="alert" className="mt-4 border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {outOfScope && <p role="status" className="mt-4 border-l-4 border-amber-500 bg-amber-50 p-3 text-sm">This intake covers Harris County residential records only. <Link className="underline" href="/cases/new">Open a general case workspace</Link>.</p>}
      {step < 3 ? <fieldset disabled={busy} className="mt-5 grid gap-5 sm:grid-cols-2">{steps[step].fields.map(field => <div key={field.key} className={field.key === 'notes' || field.key === 'additional_parties' ? 'sm:col-span-2' : ''}>
        <Label htmlFor={field.key}>{field.label}{field.required ? ' *' : ''}</Label>
        {field.options ? <select id={field.key} value={values[field.key]} onChange={event => change(field.key, event.target.value)} className="mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm">{field.options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
          : field.key === 'notes' || field.key === 'additional_parties' ? <textarea id={field.key} value={values[field.key]} onChange={event => change(field.key, event.target.value)} maxLength={2000} rows={3} className="mt-1 w-full rounded-md border p-3 text-sm" />
          : <Input id={field.key} value={values[field.key]} onChange={event => change(field.key, event.target.value)} required={field.required} type={field.type || 'text'} min={field.type === 'number' ? '0' : undefined} step={field.type === 'number' ? '0.01' : undefined} maxLength={300} className="mt-1" />}
      </div>)}</fieldset> : <div className="mt-5 space-y-6">
        {steps.slice(0, 3).map((item, index) => <section key={item.title} className="border-t pt-4"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{item.title}</h3><button disabled={busy} type="button" onClick={() => go(index)} className="text-sm underline">Edit {item.title.toLowerCase()}</button></div>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">{item.fields.map(field => <div key={field.key} className="min-w-0"><dt className="text-gray-500">{field.label}</dt><dd className="break-words">{field.options?.find(([key]) => key === values[field.key])?.[1] || values[field.key] || 'Not entered'}</dd></div>)}</dl>
        </section>)}
        <p className="border-l-4 border-amber-500 bg-amber-50 p-3 text-sm">Notice selection, delivery, timing, and special protections need case-specific legal review. These answers are unverified records, not a filing recommendation.</p>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={values.acknowledgment === 'yes'} disabled={busy} onChange={event => change('acknowledgment', event.target.checked ? 'yes' : '')} className="mt-1 h-4 w-4 shrink-0" required /><span>This creates a factual records workspace, not an eviction notice, court petition, or filed case.</span></label>
        <p className="text-sm text-gray-600">Saving intake does not use a document credit. A new saved packet version uses one credit when prepared for download or print.</p>
      </div>}
      {step === 2 && <p className="mt-5 text-sm text-gray-600">These answers do not determine legal eligibility or notice requirements. Unknown answers remain unknown.</p>}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
        {step > 0 ? <Button variant="outline" type="button" disabled={busy} onClick={() => go(step - 1)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button> : <Link className="text-sm underline" href="/templates">Cancel</Link>}
        <Button type="submit" disabled={busy || outOfScope}>{step === 3 ? <><Save className="mr-2 h-4 w-4" />{busy ? 'Saving...' : 'Save case'}</> : <>Continue<ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
      </div>
    </form>
  </div>;
}
