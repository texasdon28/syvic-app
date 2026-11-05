export const sourceCheckedOn = '2026-11-01';
export const officialSources = {
  county: { title: 'Harris County eviction information', url: 'https://www.jp.hctx.net/evictions/default.htm' },
  petition: { title: 'Harris County eviction petition (updated 2026)', url: 'https://www.jp.hctx.net/info/Petition%20for%20Eviction.pdf' },
  rules: { title: 'Texas Judicial Branch current rules', url: 'https://www.txcourts.gov/rules-forms/rules-standards/' },
  forms: { title: 'Harris County court forms', url: 'https://www.jp.hctx.net/forms/default.htm' },
  training: { title: 'Texas Justice Court Training Center landlord resources', url: 'https://www.tjctc.org/srl/eviction-plaintiff.html' },
} as const;
export const documentCatalog = [
  { id: 'rent-ledger', name: 'Rent ledger', status: 'available', description: 'Charges, payments, and a running balance from your records.' },
  { id: 'case-chronology', name: 'Case chronology', status: 'available', description: 'A dated record of events and communications you enter.' },
  { id: 'evidence-index', name: 'Evidence index', status: 'available', description: 'An exhibit list. Supporting files are not attached or submitted.' },
  { id: 'pay-rent-or-vacate', name: 'Notice to pay rent or vacate', status: 'legal-review', description: 'Notice selection, language, delivery, and timing require legal review.' },
  { id: 'notice-to-vacate', name: 'Notice to vacate', status: 'legal-review', description: 'No generated notice is available until the template and rules are reviewed.' },
  { id: 'eviction-petition', name: 'Eviction petition', status: 'legal-review', description: 'SYVIC petition preparation is not available. The county form is linked separately.' },
] as const;
export function availableDocument(id: string) {
  return documentCatalog.find(item => item.id === id && item.status === 'available');
}
