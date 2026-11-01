BEGIN;
CREATE FUNCTION public.create_landlord_records_case(p_intake jsonb, p_request_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE v_user uuid := auth.uid(); v_org uuid; v_property uuid; v_tenant uuid; existing_case uuid; field text; notice_date date;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_request_id IS NULL OR jsonb_typeof(p_intake) IS DISTINCT FROM 'object' OR length(p_intake::text) > 20000
    OR p_intake->>'county' IS DISTINCT FROM 'harris' OR p_intake->>'property_use' IS DISTINCT FROM 'residential'
    OR p_intake->>'acknowledgment' IS DISTINCT FROM 'yes' THEN RAISE EXCEPTION 'Invalid intake scope'; END IF;
  FOREACH field IN ARRAY ARRAY['address_line1','city','title','landlord_name','tenant_first_name','tenant_last_name'] LOOP
    IF jsonb_typeof(p_intake->field) IS DISTINCT FROM 'string' OR length(btrim(p_intake->>field)) NOT BETWEEN 1 AND 300 THEN
      RAISE EXCEPTION 'Required intake field missing'; END IF;
  END LOOP;
  FOREACH field IN ARRAY ARRAY['address_line2','additional_parties','monthly_rent','notice_date','notice_method','notes','source_document','zip_code'] LOOP
    IF jsonb_typeof(p_intake->field) IS DISTINCT FROM 'string' OR length(p_intake->>field) > 2000 THEN RAISE EXCEPTION 'Invalid intake field'; END IF;
  END LOOP;
  IF p_intake->>'zip_code' !~ '^[0-9]{5}(-[0-9]{4})?$'
    OR p_intake->>'property_type' IS NULL OR p_intake->>'property_type' NOT IN ('single_family','multi_family')
    OR p_intake->>'lease_kind' IS NULL OR p_intake->>'lease_kind' NOT IN ('written','oral','unknown')
    OR p_intake->>'reason' IS NULL OR p_intake->>'reason' NOT IN ('nonpayment','holdover','lease_violation','other')
    OR p_intake->>'notice_status' IS NULL OR p_intake->>'notice_status' NOT IN ('not_sent','sent','unknown')
    OR p_intake->>'source_document' NOT IN ('','rent-ledger','case-chronology','evidence-index') THEN RAISE EXCEPTION 'Invalid intake selection'; END IF;
  FOREACH field IN ARRAY ARRAY['subsidized','federal_coverage','bankruptcy','military'] LOOP
    IF p_intake->>field IS NULL OR p_intake->>field NOT IN ('yes','no','unknown') THEN RAISE EXCEPTION 'Invalid review answer'; END IF;
  END LOOP;
  IF p_intake->>'monthly_rent' <> '' AND p_intake->>'monthly_rent' !~ '^[0-9]{1,7}(\.[0-9]{1,2})?$' THEN RAISE EXCEPTION 'Invalid rent'; END IF;
  IF p_intake->>'notice_date' <> '' THEN
    IF p_intake->>'notice_date' !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN RAISE EXCEPTION 'Invalid notice date'; END IF;
    notice_date := (p_intake->>'notice_date')::date;
  END IF;
  IF p_intake->>'notice_status' <> 'sent' AND (p_intake->>'notice_date' <> '' OR p_intake->>'notice_method' <> '') THEN RAISE EXCEPTION 'Inconsistent notice record'; END IF;
  v_org := public.ensure_my_workspace();
  SELECT id INTO existing_case FROM public.cases WHERE id = p_request_id AND organization_id = v_org AND created_by = v_user;
  IF existing_case IS NOT NULL THEN RETURN existing_case; END IF;
  INSERT INTO public.properties(organization_id,address_line1,address_line2,city,state,zip_code,property_type)
    VALUES (v_org,p_intake->>'address_line1',nullif(p_intake->>'address_line2',''),p_intake->>'city','TX',p_intake->>'zip_code',p_intake->>'property_type') RETURNING id INTO v_property;
  INSERT INTO public.tenants(organization_id,property_id,first_name,last_name,monthly_rent)
    VALUES(v_org,v_property,p_intake->>'tenant_first_name',p_intake->>'tenant_last_name',nullif(p_intake->>'monthly_rent','')::numeric) RETURNING id INTO v_tenant;
  INSERT INTO public.cases(id,organization_id,workflow_type,status,property_id,tenant_id,title,description,created_by,metadata)
    VALUES (p_request_id,v_org,'eviction','draft',v_property,v_tenant,p_intake->>'title',nullif(p_intake->>'notes',''),v_user,
      jsonb_build_object('landlord_intake_version',1,'landlord_intake',p_intake,'packet',jsonb_build_object('ledger','[]'::jsonb,'chronology','[]'::jsonb,'evidence','[]'::jsonb)));
  RETURN p_request_id;
END;
$$;
REVOKE ALL ON FUNCTION public.create_landlord_records_case(jsonb,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_landlord_records_case(jsonb,uuid) TO authenticated;
COMMIT;
