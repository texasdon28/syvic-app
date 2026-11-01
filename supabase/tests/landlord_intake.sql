BEGIN;
DO $$
DECLARE v_user uuid; request_id uuid := gen_random_uuid(); foreign_id uuid := gen_random_uuid(); foreign_org uuid;
  created_case uuid; before_properties bigint; before_tenants bigint; payload jsonb := '{
    "county":"harris","property_use":"residential","property_type":"multi_family",
    "address_line1":"SYNTHETIC 100 Test Street","address_line2":"SAMPLE 2","city":"Houston","zip_code":"77002",
    "title":"SYNTHETIC intake verification","landlord_name":"Sample Landlord","tenant_first_name":"Sample","tenant_last_name":"Tenant",
    "additional_parties":"","lease_kind":"unknown","monthly_rent":"1200.00","reason":"nonpayment","notice_status":"unknown","notice_date":"","notice_method":"",
    "subsidized":"unknown","federal_coverage":"unknown","bankruptcy":"unknown","military":"unknown","notes":"SYNTHETIC records only","source_document":"rent-ledger","acknowledgment":"yes"}';
BEGIN
  SELECT user_id INTO v_user FROM public.organization_members WHERE role='owner' LIMIT 1;
  IF v_user IS NULL THEN RAISE EXCEPTION 'Requires an existing workspace owner'; END IF;
  INSERT INTO public.organizations(name) VALUES ('SYNTHETIC isolated collision fixture') RETURNING id INTO foreign_org;
  INSERT INTO public.cases(id,organization_id,workflow_type,title,created_by) VALUES(foreign_id,foreign_org,'eviction','SYNTHETIC inaccessible case',v_user);
  PERFORM set_config('request.jwt.claim.sub', '', true);
  BEGIN
    PERFORM public.create_landlord_records_case(payload,request_id);
    RAISE EXCEPTION 'Unauthenticated intake allowed';
  EXCEPTION WHEN OTHERS THEN IF SQLERRM <> 'Authentication required' THEN RAISE; END IF; END;
  PERFORM set_config('request.jwt.claim.sub',v_user::text,true);
  PERFORM set_config('role','authenticated',true);
  created_case := public.create_landlord_records_case(payload,request_id);
  IF created_case <> request_id OR public.create_landlord_records_case(payload,request_id) <> request_id THEN RAISE EXCEPTION 'Retry not idempotent'; END IF;
  IF (SELECT count(*) FROM public.cases WHERE id=request_id) <> 1 THEN RAISE EXCEPTION 'Case not saved'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.cases c JOIN public.properties p ON p.id=c.property_id JOIN public.tenants t ON t.id=c.tenant_id
    WHERE c.id=request_id AND c.created_by=v_user AND c.status='draft' AND p.property_type='multi_family' AND p.address_line2='SAMPLE 2'
    AND t.monthly_rent=1200 AND c.metadata->'landlord_intake'->>'military'='unknown') THEN RAISE EXCEPTION 'Linked records incorrect'; END IF;
  IF EXISTS (SELECT 1 FROM public.document_generations WHERE case_id=request_id) THEN RAISE EXCEPTION 'Saving intake consumed a credit'; END IF;
  BEGIN
    PERFORM public.create_landlord_records_case(payload || '{"county":"other"}',gen_random_uuid());
    RAISE EXCEPTION 'Out-of-scope intake allowed';
  EXCEPTION WHEN OTHERS THEN IF SQLERRM <> 'Invalid intake scope' THEN RAISE; END IF; END;
  BEGIN
    PERFORM public.create_landlord_records_case(payload || '{"source_document":"eviction-petition"}',gen_random_uuid());
    RAISE EXCEPTION 'Legal-review selection allowed';
  EXCEPTION WHEN OTHERS THEN IF SQLERRM <> 'Invalid intake selection' THEN RAISE; END IF; END;
  SELECT count(*) INTO before_properties FROM public.properties;
  SELECT count(*) INTO before_tenants FROM public.tenants;
  BEGIN
    PERFORM public.create_landlord_records_case(payload,foreign_id);
    RAISE EXCEPTION 'Inaccessible case collision accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;
  IF (SELECT count(*) FROM public.properties) <> before_properties OR (SELECT count(*) FROM public.tenants) <> before_tenants THEN RAISE EXCEPTION 'Failed save left partial records'; END IF;
  IF has_function_privilege('anon','public.create_landlord_records_case(jsonb,uuid)','execute') THEN RAISE EXCEPTION 'Anonymous execution allowed'; END IF;
END $$;
SELECT 'Landlord intake scope, ownership, retry, credit and atomic-save tests passed; fixtures rolled back.' AS result;
ROLLBACK;
