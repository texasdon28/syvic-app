BEGIN;
ALTER TABLE public.subscription_status DROP CONSTRAINT IF EXISTS subscription_plan_check;
ALTER TABLE public.subscription_status ADD CONSTRAINT subscription_plan_check
  CHECK (plan IN ('free', 'essential', 'pro', 'portfolio', 'team'));
ALTER TABLE public.subscription_status ADD COLUMN IF NOT EXISTS billing_interval text
  CHECK (billing_interval IN ('monthly', 'annual'));
ALTER TABLE public.subscription_status ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean NOT NULL DEFAULT false;
-- Only server-side billing may change payment identifiers.
REVOKE UPDATE ON public.organizations FROM authenticated;
GRANT UPDATE (name, type) ON public.organizations TO authenticated;
COMMIT;
