BEGIN;
DO $$
DECLARE
  starts_at timestamptz;
  ends_at timestamptz;
  owner_id uuid;
  org_id uuid := gen_random_uuid();
  other_org_id uuid := gen_random_uuid();
  case_id uuid := gen_random_uuid();
  result jsonb;
  version jsonb;
  plan_name text;
  cap integer;
  i integer;
BEGIN
  SELECT window_start, window_end INTO starts_at, ends_at FROM public.document_month_window(
    '2024-01-31 10:00Z', '2025-01-31 10:00Z', '2024-03-30 10:00Z');
  ASSERT starts_at = '2024-02-29 10:00Z' AND ends_at = '2024-03-31 10:00Z', 'Leap-year monthly reset drifted';
  SELECT window_start, window_end INTO starts_at, ends_at FROM public.document_month_window(
    '2025-01-31 10:00Z', '2026-01-31 10:00Z', '2025-03-31 10:00Z');
  ASSERT starts_at = '2025-03-31 10:00Z' AND ends_at = '2025-04-30 10:00Z', 'Exact boundary did not reset';
  SELECT window_start INTO starts_at FROM public.document_month_window(
    '2025-01-31 10:00Z', '2026-01-31 10:00Z', '2026-01-31 10:00Z');
  ASSERT starts_at IS NULL, 'Expired subscriptions must not renew allowance';

  SELECT user_id INTO owner_id FROM public.organization_members ORDER BY created_at LIMIT 1;
  ASSERT owner_id IS NOT NULL, 'An existing signed-up user is required for these rollback-only tests';
  PERFORM set_config('request.jwt.claim.sub', owner_id::text, true);
  INSERT INTO public.organizations (id,name) VALUES (org_id,'Allowance test - rolled back'), (other_org_id,'Other workspace - rolled back');
  INSERT INTO public.organization_members (organization_id,user_id,role) VALUES (org_id,owner_id,'owner');
  INSERT INTO public.subscription_status (organization_id,plan,status,stripe_subscription_id,current_period_start,current_period_end,billing_interval)
    VALUES (org_id,'essential','active','sub_test_fixture',now() - interval '1 day',now() + interval '364 days','annual');
  INSERT INTO public.cases (id,organization_id,workflow_type,title,created_by,metadata)
    VALUES (case_id,org_id,'small_claims','Allowance test',owner_id,'{"packet": {"ledger": [], "chronology": [], "evidence": []}}');

  FOREACH plan_name IN ARRAY ARRAY['essential','pro','portfolio'] LOOP
    cap := CASE plan_name WHEN 'essential' THEN 5 WHEN 'pro' THEN 20 ELSE 75 END;
    UPDATE public.subscription_status SET plan = plan_name WHERE organization_id = org_id;
    FOR i IN 1..cap LOOP
      version := jsonb_build_object('test_version',plan_name || i);
      UPDATE public.cases SET metadata = jsonb_build_object('packet',version) WHERE id = case_id;
      result := public.document_allowance(org_id,case_id,'Allowance test',version);
      ASSERT (result->>'allowed')::boolean, 'Expected available credit';
      result := public.document_allowance(org_id,case_id,'Allowance test',version);
      ASSERT (result->>'reused')::boolean AND (result->>'used')::integer = i, 'Repeat export consumed credit';
    END LOOP;
    version := jsonb_build_object('test_version',plan_name || 'over-limit');
    UPDATE public.cases SET metadata = jsonb_build_object('packet',version) WHERE id = case_id;
    result := public.document_allowance(org_id,case_id,'Allowance test',version);
    ASSERT NOT (result->>'allowed')::boolean, 'Quota was exceeded';
    -- Move fixture generations to the prior month; annual allowance must reset monthly.
    UPDATE public.document_generations SET generated_at = now() - interval '2 months' WHERE organization_id = org_id;
    result := public.document_allowance(org_id,case_id,'Allowance test',version);
    ASSERT (result->>'allowed')::boolean AND (result->>'used')::integer = 1, 'Monthly reset failed on annual plan';
    UPDATE public.document_generations SET generated_at = now() - interval '2 months' WHERE organization_id = org_id;
  END LOOP;
  UPDATE public.subscription_status SET status = 'past_due' WHERE organization_id = org_id;
  result := public.document_allowance(org_id,case_id,'Allowance test',version);
  ASSERT (result->>'allowed')::boolean AND (result->>'reused')::boolean, 'Previously generated document blocked';
  version := '{"new_unpaid_version":true}';
  UPDATE public.cases SET metadata = jsonb_build_object('packet',version) WHERE id = case_id;
  result := public.document_allowance(org_id,case_id,'Allowance test',version);
  ASSERT NOT (result->>'allowed')::boolean, 'Past-due account generated new content';
  result := public.document_allowance(org_id,case_id,'Stale title',version);
  ASSERT result->>'reason' = 'changed', 'Stale snapshot was accepted';
  UPDATE public.subscription_status SET status = 'active' WHERE organization_id = org_id;
  result := public.document_allowance(org_id,case_id,'Allowance test',version);
  DELETE FROM public.cases WHERE id = case_id;
  result := public.document_allowance(org_id);
  ASSERT (result->>'used')::integer = 1, 'Deleting a case refunded document credits';
  BEGIN
    PERFORM public.document_allowance(other_org_id);
    RAISE EXCEPTION 'Cross-workspace access was permitted';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  PERFORM set_config('request.jwt.claim.sub','',true);
  BEGIN
    PERFORM public.document_allowance(org_id);
    RAISE EXCEPTION 'Unauthenticated access was permitted';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
ROLLBACK;
SELECT 'Document allowance tests passed; all fixtures rolled back.' AS result;
