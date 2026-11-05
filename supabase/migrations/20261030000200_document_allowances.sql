BEGIN;
ALTER TABLE public.subscription_status ADD COLUMN IF NOT EXISTS current_period_start timestamptz;

CREATE TABLE IF NOT EXISTS public.document_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL,
  content_hash text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, case_id, content_hash)
);
CREATE INDEX IF NOT EXISTS document_generations_usage_idx
  ON public.document_generations (organization_id, generated_at);
ALTER TABLE public.document_generations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.document_generations FROM anon, authenticated;
GRANT SELECT ON public.document_generations TO authenticated;
CREATE POLICY "Members can see document usage" ON public.document_generations
  FOR SELECT TO authenticated USING (organization_id IN (SELECT public.current_organization_ids()));

-- Always calculate from the original anchor, avoiding drift after short months.
CREATE OR REPLACE FUNCTION public.document_month_window(p_anchor timestamptz, p_end timestamptz, p_now timestamptz)
RETURNS TABLE(window_start timestamptz, window_end timestamptz)
LANGUAGE plpgsql IMMUTABLE SET search_path = '' AS $$
DECLARE
  anchor_utc timestamp := p_anchor AT TIME ZONE 'UTC';
  now_utc timestamp := p_now AT TIME ZONE 'UTC';
  month_offset integer;
  candidate timestamp;
BEGIN
  IF p_anchor IS NULL OR p_end IS NULL OR p_now < p_anchor OR p_now >= p_end THEN RETURN; END IF;
  month_offset := (extract(year FROM now_utc)::integer - extract(year FROM anchor_utc)::integer) * 12
    + extract(month FROM now_utc)::integer - extract(month FROM anchor_utc)::integer;
  candidate := anchor_utc + make_interval(months => month_offset);
  IF candidate > now_utc THEN month_offset := month_offset - 1; END IF;
  window_start := (anchor_utc + make_interval(months => month_offset)) AT TIME ZONE 'UTC';
  window_end := least((anchor_utc + make_interval(months => month_offset + 1)) AT TIME ZONE 'UTC', p_end);
  RETURN NEXT;
END;
$$;
REVOKE ALL ON FUNCTION public.document_month_window(timestamptz,timestamptz,timestamptz) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.document_allowance(
  p_organization_id uuid, p_case_id uuid DEFAULT NULL,
  p_expected_title text DEFAULT NULL, p_expected_packet jsonb DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  subscription public.subscription_status%ROWTYPE;
  case_record public.cases%ROWTYPE;
  starts_at timestamptz;
  ends_at timestamptz;
  document_limit integer := 0;
  used_count integer := 0;
  fingerprint text;
  reused boolean := false;
  allowed boolean := false;
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.organization_members WHERE organization_id = p_organization_id AND user_id = auth.uid()
  ) THEN RAISE EXCEPTION 'Workspace unavailable' USING ERRCODE = '42501'; END IF;

  -- Serialize all credit decisions for a workspace, including simultaneous exports.
  SELECT * INTO subscription FROM public.subscription_status
    WHERE organization_id = p_organization_id FOR UPDATE;
  IF subscription.status IN ('active', 'trialing') AND subscription.stripe_subscription_id IS NOT NULL THEN
    SELECT window_start, window_end INTO starts_at, ends_at FROM public.document_month_window(
      subscription.current_period_start, subscription.current_period_end, now());
    IF starts_at IS NOT NULL THEN
      document_limit := CASE subscription.plan WHEN 'essential' THEN 5 WHEN 'pro' THEN 20 WHEN 'portfolio' THEN 75 ELSE 0 END;
      SELECT count(*) INTO used_count FROM public.document_generations
        WHERE organization_id = p_organization_id AND generated_at >= starts_at AND generated_at < ends_at;
    END IF;
  END IF;

  IF p_case_id IS NOT NULL THEN
    SELECT * INTO case_record FROM public.cases WHERE id = p_case_id AND organization_id = p_organization_id FOR SHARE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Case unavailable' USING ERRCODE = '42501'; END IF;
    IF case_record.title IS DISTINCT FROM p_expected_title
      OR case_record.metadata->'packet' IS DISTINCT FROM p_expected_packet THEN
      RETURN jsonb_build_object('allowed', false, 'reason', 'changed');
    END IF;
    fingerprint := encode(sha256(convert_to(jsonb_build_object(
      'title', case_record.title, 'packet', case_record.metadata->'packet')::text, 'UTF8')), 'hex');
    SELECT EXISTS (SELECT 1 FROM public.document_generations WHERE organization_id = p_organization_id
      AND case_id = p_case_id AND content_hash = fingerprint) INTO reused;
    allowed := reused OR (document_limit > 0 AND used_count < document_limit);
    IF allowed AND NOT reused THEN
      INSERT INTO public.document_generations (organization_id, case_id, content_hash)
        VALUES (p_organization_id, p_case_id, fingerprint);
      used_count := used_count + 1;
    END IF;
  END IF;
  RETURN jsonb_build_object('allowed', allowed, 'reused', reused, 'limit', document_limit,
    'used', used_count, 'remaining', greatest(0, document_limit - used_count),
    'resetsAt', ends_at, 'reason', CASE WHEN document_limit = 0 THEN 'inactive' ELSE 'limit' END);
END;
$$;
REVOKE ALL ON FUNCTION public.document_allowance(uuid,uuid,text,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.document_allowance(uuid,uuid,text,jsonb) TO authenticated;
COMMIT;
