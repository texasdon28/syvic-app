import { z } from 'zod';
const requiredText = z.string().trim().min(1, 'This field is required.').max(300);
const optionalText = z.string().trim().max(2000);
const calendarDate = z.string().refine(value => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Enter a valid calendar date.');
const answer = z.enum(['yes', 'no', 'unknown']);
export const landlordIntakeSchema = z.object({
  county: z.literal('harris'), property_use: z.literal('residential'),
  property_type: z.enum(['single_family', 'multi_family']),
  address_line1: requiredText, address_line2: z.string().trim().max(100), city: requiredText,
  zip_code: z.string().regex(/^\d{5}(?:-\d{4})?$/, 'Enter a five-digit ZIP or ZIP+4.'),
  title: requiredText, landlord_name: requiredText, tenant_first_name: requiredText, tenant_last_name: requiredText,
  additional_parties: optionalText, lease_kind: z.enum(['written', 'oral', 'unknown']),
  monthly_rent: z.string().refine(value => value === '' || /^\d{1,7}(?:\.\d{1,2})?$/.test(value), 'Enter a nonnegative amount with up to two decimal places.'),
  reason: z.enum(['nonpayment', 'holdover', 'lease_violation', 'other']),
  notice_status: z.enum(['not_sent', 'sent', 'unknown']), notice_date: calendarDate, notice_method: z.string().trim().max(300),
  subsidized: answer, federal_coverage: answer, bankruptcy: answer, military: answer,
  notes: optionalText, source_document: z.enum(['', 'rent-ledger', 'case-chronology', 'evidence-index']),
  acknowledgment: z.literal('yes'),
}).superRefine((value, context) => {
  if (value.notice_status !== 'sent' && (value.notice_date || value.notice_method)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['notice_status'], message: 'Remove delivery details or mark the notice as sent.' });
  }
});
export const intakeDefaults = {
  county: 'harris', property_use: 'residential', property_type: 'single_family', address_line1: '', address_line2: '', city: '', zip_code: '',
  title: '', landlord_name: '', tenant_first_name: '', tenant_last_name: '', additional_parties: '', lease_kind: 'unknown', monthly_rent: '',
  reason: 'nonpayment', notice_status: 'unknown', notice_date: '', notice_method: '',
  subsidized: 'unknown', federal_coverage: 'unknown', bankruptcy: 'unknown', military: 'unknown', notes: '', source_document: '', acknowledgment: '',
};
export type IntakeField = keyof typeof intakeDefaults;
