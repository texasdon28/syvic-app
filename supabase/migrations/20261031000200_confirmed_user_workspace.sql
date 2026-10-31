BEGIN;
CREATE OR REPLACE FUNCTION public.ensure_my_workspace()
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_user_id uuid := auth.uid(); workspace_id uuid; display_name text;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  -- Serializing on the user makes callback retries create exactly one workspace.
  SELECT left(coalesce(nullif(btrim(raw_user_meta_data->>'name'), ''), 'My'), 100)
    INTO display_name FROM auth.users WHERE id = v_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Authenticated user not found'; END IF;
  SELECT m.organization_id INTO workspace_id FROM public.organization_members m
    WHERE m.user_id = v_user_id ORDER BY m.created_at, m.id LIMIT 1;
  IF workspace_id IS NOT NULL THEN RETURN workspace_id; END IF;
  INSERT INTO public.organizations(name, type)
    VALUES (display_name || ' workspace', 'individual_landlord') RETURNING id INTO workspace_id;
  INSERT INTO public.organization_members(organization_id, user_id, role)
    VALUES (workspace_id, v_user_id, 'owner');
  INSERT INTO public.subscription_status(organization_id, plan, status)
    VALUES (workspace_id, 'free', 'active');
  RETURN workspace_id;
END;
$$;
REVOKE ALL ON FUNCTION public.ensure_my_workspace() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_my_workspace() TO authenticated;
COMMIT;
