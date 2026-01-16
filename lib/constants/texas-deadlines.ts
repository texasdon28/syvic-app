export interface DeadlineRule {
  id: string;
  workflow: 'eviction' | 'repair_remedy' | 'small_claims';
  title: string;
  description: string;
  timeframe: string;
  citation_placeholder: string;
}

export const TEXAS_DEADLINES: DeadlineRule[] = [
  {
    id: 'eviction-notice-to-vacate',
    workflow: 'eviction',
    title: 'Notice to Vacate',
    description: 'Minimum notice period required before filing eviction',
    timeframe: 'Minimum 3 days unless lease specifies otherwise',
    citation_placeholder: 'Texas Property Code § 24.005',
  },
  {
    id: 'eviction-hearing-scheduling',
    workflow: 'eviction',
    title: 'Hearing Scheduling',
    description: 'Court sets hearing date within this window after filing',
    timeframe: '10–21 days after filing (court sets within this window)',
    citation_placeholder: 'Texas Rules of Civil Procedure Rule 510.3',
  },
  {
    id: 'eviction-post-judgment-waiting',
    workflow: 'eviction',
    title: 'Post-Judgment Waiting Period',
    description: 'Required waiting period before writ of possession can be issued',
    timeframe: '5 days after judgment',
    citation_placeholder: 'Texas Property Code § 24.005',
  },
  {
    id: 'eviction-writ-execution-notice',
    workflow: 'eviction',
    title: 'Writ Execution Notice',
    description: 'Notice period before constable executes writ',
    timeframe: '24-hour notice posting prior to execution',
    citation_placeholder: 'Texas Property Code § 24.005',
  },
  {
    id: 'repair-appearance-date',
    workflow: 'repair_remedy',
    title: 'Appearance Date Set',
    description: 'Court sets appearance date within this window',
    timeframe: '10–21 days after filing',
    citation_placeholder: 'Texas Property Code § 92.0563',
  },
  {
    id: 'repair-citation-served',
    workflow: 'repair_remedy',
    title: 'Citation Service Deadline',
    description: 'Citation must be served at least this many days before appearance',
    timeframe: 'At least 6 days before appearance',
    citation_placeholder: 'Texas Rules of Civil Procedure Rule 510.3',
  },
  {
    id: 'repair-return-of-service',
    workflow: 'repair_remedy',
    title: 'Return of Service',
    description: 'Return of service must be filed before appearance',
    timeframe: 'At least 1 day before appearance',
    citation_placeholder: 'Texas Rules of Civil Procedure Rule 107',
  },
  {
    id: 'repair-appeal-window',
    workflow: 'repair_remedy',
    title: 'Appeal Window',
    description: 'Time period to file appeal after judgment',
    timeframe: 'Generally 21 days after judgment',
    citation_placeholder: 'Texas Rules of Civil Procedure Rule 506.1',
  },
  {
    id: 'small-claims-defendant-answer',
    workflow: 'small_claims',
    title: 'Defendant Answer Deadline',
    description: 'Defendant must file answer by end of this day (weekend/holiday roll forward)',
    timeframe: 'End of 14th day after service',
    citation_placeholder: 'Texas Rules of Civil Procedure Rule 500.5',
  },
  {
    id: 'small-claims-service-publication',
    workflow: 'small_claims',
    title: 'Service by Publication Deadline',
    description: 'Deadline for service by publication',
    timeframe: 'End of 42nd day after citation issued',
    citation_placeholder: 'Texas Rules of Civil Procedure Rule 510.3',
  },
  {
    id: 'small-claims-motion-set-aside',
    workflow: 'small_claims',
    title: 'Motion to Set Aside Default',
    description: 'Time to file motion to set aside default judgment',
    timeframe: '14 days after judgment signed',
    citation_placeholder: 'Texas Rules of Civil Procedure Rule 500.5',
  },
  {
    id: 'small-claims-motion-new-trial',
    workflow: 'small_claims',
    title: 'Motion for New Trial',
    description: 'Time to file motion for new trial',
    timeframe: '14 days after judgment signed',
    citation_placeholder: 'Texas Rules of Civil Procedure Rule 500.5',
  },
  {
    id: 'small-claims-motions-denied-operation',
    workflow: 'small_claims',
    title: 'Motions Denied by Operation of Law',
    description: 'Deadline for court to rule before motion deemed denied',
    timeframe: '5:00 pm on 21st day after judgment signed',
    citation_placeholder: 'Texas Rules of Civil Procedure Rule 500.5',
  },
  {
    id: 'small-claims-appeal-perfected',
    workflow: 'small_claims',
    title: 'Appeal Perfection Deadline',
    description: 'Time to perfect appeal',
    timeframe: '21 days after judgment or after timely post-judgment motion denied',
    citation_placeholder: 'Texas Rules of Civil Procedure Rule 506.1',
  },
];

export function getDeadlinesByWorkflow(workflow: 'eviction' | 'repair_remedy' | 'small_claims') {
  return TEXAS_DEADLINES.filter(d => d.workflow === workflow);
}

export const DISCLAIMER_TEXT = {
  short: 'SYVIC provides procedural information only and does not constitute legal advice.',
  long: 'SYVIC provides procedural information and document organization tools only. This information does not constitute legal advice and should not be relied upon as a substitute for consultation with a licensed attorney. Deadlines may vary based on specific circumstances, court rules, and judicial discretion. Always verify current requirements with the relevant Justice Court and consult with legal counsel before taking action.',
};
