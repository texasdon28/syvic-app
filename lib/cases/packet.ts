import { z } from 'zod';

const text = z.string().trim().max(2000);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const packetSchema = z.object({
  ledger: z.array(z.object({ date, description: text.min(1), charge: z.number().nonnegative().max(10000000), payment: z.number().nonnegative().max(10000000) })).max(200),
  chronology: z.array(z.object({ date, description: text.min(1) })).max(200),
  evidence: z.array(z.object({ label: text.min(1), description: text.min(1) })).max(200),
});
export type Packet = z.infer<typeof packetSchema>;
export const emptyPacket: Packet = { ledger: [], chronology: [], evidence: [] };
