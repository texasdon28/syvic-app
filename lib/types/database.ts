export type OrganizationType = 'property_management' | 'individual_landlord';

export type MemberRole = 'owner' | 'admin' | 'member';

export type SubscriptionPlan = 'free' | 'pro' | 'team';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export type PropertyType = 'single_family' | 'multi_family' | 'commercial';

export type WorkflowType = 'eviction' | 'repair_remedy' | 'small_claims';

export type CaseStatus = 'draft' | 'filed' | 'hearing_scheduled' | 'judgment' | 'closed';

export type FileTag = 'notice' | 'lease' | 'ledger' | 'photos' | 'communications' | 'other';

export type EventType = 'notice_served' | 'payment_missed' | 'communication' | 'filing' | 'hearing' | 'other';

export type LeadSource = 'contact_form' | 'pricing_page' | 'other';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: MemberRole;
  created_at: string;
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan: SubscriptionPlan;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  organization_id: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip_code: string;
  property_type: PropertyType;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  organization_id: string;
  property_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  lease_start_date: string | null;
  lease_end_date: string | null;
  monthly_rent: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  organization_id: string;
  case_number: string | null;
  workflow_type: WorkflowType;
  status: CaseStatus;
  property_id: string | null;
  tenant_id: string | null;
  title: string;
  description: string | null;
  filing_date: string | null;
  hearing_date: string | null;
  judgment_date: string | null;
  amount_claimed: number | null;
  metadata: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CaseFile {
  id: string;
  case_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  tag: FileTag;
  exhibit_number: string | null;
  description: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface CaseTimelineEvent {
  id: string;
  case_id: string;
  event_date: string;
  event_type: EventType;
  title: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  organization_id: string | null;
  name: string;
  workflow_type: WorkflowType | 'general';
  is_system: boolean;
  template_data: TemplateData;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TemplateData {
  sections: TemplateSection[];
  merge_fields: string[];
  required_attachments?: string[];
  formatting?: Record<string, any>;
}

export interface TemplateSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  source: LeadSource;
  created_at: string;
}
