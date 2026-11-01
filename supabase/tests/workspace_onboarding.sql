BEGIN;
DO $$
DECLARE first_user uuid := gen_random_uuid(); second_user uuid := gen_random_uuid(); first_workspace uuid; second_workspace uuid;
BEGIN
  INSERT INTO auth.users(id, raw_user_meta_data) VALUES (first_user, '{"name":"SYNTHETIC onboarding"}'::jsonb), (second_user, '{}'::jsonb);
  PERFORM set_config('request.jwt.claim.sub', '', true);
  BEGIN
    PERFORM public.ensure_my_workspace();
    RAISE EXCEPTION 'Unauthenticated provisioning succeeded';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> 'Authentication required' THEN RAISE; END IF;
  END;
  PERFORM set_config('request.jwt.claim.sub', first_user::text, true);
  first_workspace := public.ensure_my_workspace();
  IF first_workspace IS NULL OR public.ensure_my_workspace() <> first_workspace THEN RAISE EXCEPTION 'Provisioning not idempotent'; END IF;
  IF (SELECT count(*) FROM public.organization_members WHERE user_id = first_user) <> 1 THEN RAISE EXCEPTION 'Duplicate memberships'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.organization_members WHERE user_id = first_user AND organization_id = first_workspace AND role = 'owner') THEN RAISE EXCEPTION 'Owner missing'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.subscription_status WHERE organization_id = first_workspace AND plan = 'free' AND stripe_subscription_id IS NULL) THEN RAISE EXCEPTION 'Free subscription missing'; END IF;
  PERFORM set_config('request.jwt.claim.sub', second_user::text, true);
  second_workspace := public.ensure_my_workspace();
  IF second_workspace = first_workspace THEN RAISE EXCEPTION 'Users share a workspace'; END IF;
  IF has_function_privilege('anon', 'public.ensure_my_workspace()', 'execute') THEN RAISE EXCEPTION 'Anonymous execution allowed'; END IF;
  IF NOT has_function_privilege('authenticated', 'public.ensure_my_workspace()', 'execute') THEN RAISE EXCEPTION 'Authenticated execution missing'; END IF;
END $$;
SELECT 'Workspace onboarding tests passed; synthetic users and workspaces rolled back.' AS result;
ROLLBACK;
