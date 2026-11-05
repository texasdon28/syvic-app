BEGIN;
DO $$
DECLARE org_id uuid; first_token uuid; next_token uuid;
BEGIN
  SELECT id INTO org_id FROM public.organizations LIMIT 1;
  IF org_id IS NULL THEN RAISE EXCEPTION 'Requires an existing workspace'; END IF;
  IF EXISTS (SELECT 1 FROM public.billing_checkout_locks WHERE organization_id = org_id) THEN
    RAISE EXCEPTION 'Workspace already has a checkout lock; do not clear it blindly';
  END IF;
  first_token := public.acquire_billing_checkout_lock(org_id);
  IF first_token IS NULL THEN RAISE EXCEPTION 'First acquisition failed'; END IF;
  IF public.acquire_billing_checkout_lock(org_id) IS NOT NULL THEN RAISE EXCEPTION 'Duplicate acquisition succeeded'; END IF;
  IF public.release_billing_checkout_lock(org_id, gen_random_uuid()) THEN RAISE EXCEPTION 'Wrong token released lock'; END IF;
  IF NOT public.release_billing_checkout_lock(org_id, first_token) THEN RAISE EXCEPTION 'Owner release failed'; END IF;
  next_token := public.acquire_billing_checkout_lock(org_id);
  IF next_token IS NULL OR next_token = first_token THEN RAISE EXCEPTION 'Fresh acquisition failed'; END IF;
  IF public.release_billing_checkout_lock(org_id, first_token) THEN RAISE EXCEPTION 'Stale token released fresh lock'; END IF;
  IF has_function_privilege('authenticated', 'public.acquire_billing_checkout_lock(uuid)', 'execute')
    OR has_function_privilege('anon', 'public.release_billing_checkout_lock(uuid,uuid)', 'execute') THEN
    RAISE EXCEPTION 'Checkout mutex exposed to browser clients';
  END IF;
  IF NOT has_function_privilege('service_role', 'public.acquire_billing_checkout_lock(uuid)', 'execute') THEN
    RAISE EXCEPTION 'Server cannot acquire lock';
  END IF;
END $$;
SELECT 'Checkout serialization tests passed; changes rolled back.' AS result;
ROLLBACK;
