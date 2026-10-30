-- Membership policies must not query the same RLS-protected table recursively.
CREATE FUNCTION public.current_organization_ids()
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT organization_id FROM public.organization_members
  WHERE user_id = (SELECT auth.uid());
$$;

REVOKE ALL ON FUNCTION public.current_organization_ids() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_organization_ids() TO authenticated;

DROP POLICY "Users can view members of their organizations" ON public.organization_members;
CREATE POLICY "Users can view members of their organizations"
ON public.organization_members FOR SELECT TO authenticated
USING (organization_id IN (SELECT public.current_organization_ids()));

-- Membership changes stay server-managed until role administration is implemented.
DROP POLICY "Admins can manage organization members" ON public.organization_members;
DROP POLICY "Admins can update organization members" ON public.organization_members;
DROP POLICY "Admins can delete organization members" ON public.organization_members;
