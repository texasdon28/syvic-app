import { z } from 'zod';

const text = z.string().trim().max(2000);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, 'Enter a valid calendar date');
const amount = z.number().finite().nonnegative().max(10000000).multipleOf(0.01);
export const packetSchema = z.object({
  ledger: z.array(z.object({ date, description: text.min(1), charge: amount, payment: amount })).max(200),
  chronology: z.array(z.object({ date, description: text.min(1) })).max(200),
  evidence: z.array(z.object({ label: text.min(1), description: text.min(1) })).max(200),
});
export type Packet = z.infer<typeof packetSchema>;
export const emptyPacket: Packet = { ledger: [], chronology: [], evidence: [] };
