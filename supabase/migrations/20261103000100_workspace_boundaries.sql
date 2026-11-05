BEGIN;

-- Billing identities are server-managed; onboarding uses ensure_my_workspace.
REVOKE ALL ON public.organizations FROM anon;
REVOKE INSERT, UPDATE ON public.organizations FROM authenticated;
GRANT UPDATE (name, type) ON public.organizations TO authenticated;
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.organizations;

-- A customer template must never make itself globally visible as a system template.
DROP POLICY "Users can insert templates in their organizations" ON public.templates;
CREATE POLICY "Users can insert templates in their organizations"
ON public.templates FOR INSERT TO authenticated WITH CHECK (
  is_system = false AND organization_id IN (SELECT public.current_organization_ids())
);
DROP POLICY "Users can update templates in their organizations" ON public.templates;
CREATE POLICY "Users can update templates in their organizations"
ON public.templates FOR UPDATE TO authenticated
USING (is_system = false AND organization_id IN (SELECT public.current_organization_ids()))
WITH CHECK (is_system = false AND organization_id IN (SELECT public.current_organization_ids()));

-- Row-level access alone does not enforce that foreign keys stay in one workspace.
CREATE FUNCTION public.enforce_workspace_links()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.organization_id IS DISTINCT FROM OLD.organization_id THEN
    RAISE EXCEPTION 'Workspace cannot be changed' USING ERRCODE = '42501';
  END IF;
  IF TG_TABLE_NAME IN ('tenants', 'cases') THEN
    IF NEW.property_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.properties p WHERE p.id = NEW.property_id AND p.organization_id = NEW.organization_id
    ) THEN
      RAISE EXCEPTION 'Property unavailable in this workspace' USING ERRCODE = '42501';
    END IF;
  END IF;
  IF TG_TABLE_NAME = 'cases' THEN
    IF NEW.tenant_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.tenants t WHERE t.id = NEW.tenant_id AND t.organization_id = NEW.organization_id
    ) THEN
      RAISE EXCEPTION 'Party unavailable in this workspace' USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.enforce_workspace_links() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER properties_workspace_links BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.enforce_workspace_links();
CREATE TRIGGER tenants_workspace_links BEFORE INSERT OR UPDATE ON public.tenants
FOR EACH ROW EXECUTE FUNCTION public.enforce_workspace_links();
CREATE TRIGGER cases_workspace_links BEFORE INSERT OR UPDATE ON public.cases
FOR EACH ROW EXECUTE FUNCTION public.enforce_workspace_links();
COMMIT;
