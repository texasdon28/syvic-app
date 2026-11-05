BEGIN;

CREATE TABLE public.billing_checkout_locks (
  organization_id uuid PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  token uuid NOT NULL DEFAULT gen_random_uuid(),
  acquired_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.billing_checkout_locks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.billing_checkout_locks FROM PUBLIC, anon, authenticated;

CREATE FUNCTION public.acquire_billing_checkout_lock(p_organization_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE result uuid;
BEGIN
  INSERT INTO public.billing_checkout_locks (organization_id)
  VALUES (p_organization_id) ON CONFLICT DO NOTHING RETURNING token INTO result;
  RETURN result;
END;
$$;

CREATE FUNCTION public.release_billing_checkout_lock(p_organization_id uuid, p_token uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  DELETE FROM public.billing_checkout_locks
  WHERE organization_id = p_organization_id AND token = p_token;
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.acquire_billing_checkout_lock(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_billing_checkout_lock(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.acquire_billing_checkout_lock(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_billing_checkout_lock(uuid, uuid) TO service_role;

COMMENT ON TABLE public.billing_checkout_locks IS
  'Server-only checkout mutex. No automatic expiry: after an interrupted request, reconcile Stripe sessions and subscriptions before an operator clears the matching token.';
COMMIT;
