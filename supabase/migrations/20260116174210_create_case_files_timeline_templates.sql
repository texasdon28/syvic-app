/*
  # Case Files, Timeline, Templates, and Leads
  
  ## Overview
  Supporting tables for document management, case chronology, and templates.
  
  ## Tables Created
  
  ### case_files
  - Document uploads linked to cases
  - Supports exhibit numbering and tagging
  - Stores Supabase Storage paths
  
  ### case_timeline_events
  - Chronological events for cases
  - Builds case timeline/chronology
  
  ### templates
  - System and user-created document templates
  - JSON-based structure with merge fields
  
  ### leads
  - Contact form submissions
  - Marketing lead capture
  
  ## Security
  - Case-related tables use organization membership checks
  - Templates support both system (public) and org-specific
  - Leads table requires service role access
*/

-- Case files
CREATE TABLE IF NOT EXISTS case_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  tag text NOT NULL DEFAULT 'other',
  exhibit_number text,
  description text,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT case_files_tag_check CHECK (tag IN ('notice', 'lease', 'ledger', 'photos', 'communications', 'other'))
);

ALTER TABLE case_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files for cases in their organizations"
  ON case_files FOR SELECT
  TO authenticated
  USING (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert files for cases in their organizations"
  ON case_files FOR INSERT
  TO authenticated
  WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update files for cases in their organizations"
  ON case_files FOR UPDATE
  TO authenticated
  USING (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete files for cases in their organizations"
  ON case_files FOR DELETE
  TO authenticated
  USING (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

-- Case timeline events
CREATE TABLE IF NOT EXISTS case_timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  event_type text NOT NULL DEFAULT 'other',
  title text NOT NULL,
  description text,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT case_timeline_events_type_check CHECK (event_type IN ('notice_served', 'payment_missed', 'communication', 'filing', 'hearing', 'other'))
);

ALTER TABLE case_timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view timeline events for cases in their organizations"
  ON case_timeline_events FOR SELECT
  TO authenticated
  USING (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert timeline events for cases in their organizations"
  ON case_timeline_events FOR INSERT
  TO authenticated
  WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update timeline events for cases in their organizations"
  ON case_timeline_events FOR UPDATE
  TO authenticated
  USING (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete timeline events for cases in their organizations"
  ON case_timeline_events FOR DELETE
  TO authenticated
  USING (
    case_id IN (
      SELECT id FROM cases WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );

-- Templates
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  workflow_type text NOT NULL,
  is_system boolean DEFAULT false,
  template_data jsonb NOT NULL DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT templates_workflow_type_check CHECK (workflow_type IN ('eviction', 'repair_remedy', 'small_claims', 'general'))
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view system templates"
  ON templates FOR SELECT
  TO authenticated
  USING (is_system = true);

CREATE POLICY "Users can view templates in their organizations"
  ON templates FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert templates in their organizations"
  ON templates FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update templates in their organizations"
  ON templates FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete templates in their organizations"
  ON templates FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text,
  source text NOT NULL DEFAULT 'contact_form',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT leads_source_check CHECK (source IN ('contact_form', 'pricing_page', 'other'))
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_case_files_case_id ON case_files(case_id);
CREATE INDEX IF NOT EXISTS idx_case_files_uploaded_by ON case_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_case_timeline_events_case_id ON case_timeline_events(case_id);
CREATE INDEX IF NOT EXISTS idx_case_timeline_events_date ON case_timeline_events(event_date);
CREATE INDEX IF NOT EXISTS idx_templates_org_id ON templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_templates_is_system ON templates(is_system);
CREATE INDEX IF NOT EXISTS idx_templates_workflow_type ON templates(workflow_type);

-- Triggers
DROP TRIGGER IF EXISTS update_case_timeline_events_updated_at ON case_timeline_events;
CREATE TRIGGER update_case_timeline_events_updated_at 
  BEFORE UPDATE ON case_timeline_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at 
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
