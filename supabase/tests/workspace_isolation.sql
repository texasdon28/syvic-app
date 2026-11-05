BEGIN;
DO $$
DECLARE a uuid := gen_random_uuid(); b uuid := gen_random_uuid(); oa uuid := gen_random_uuid(); ob uuid := gen_random_uuid();
  pa uuid := gen_random_uuid(); pb uuid := gen_random_uuid(); ta uuid := gen_random_uuid(); tb uuid := gen_random_uuid();
  ca uuid := gen_random_uuid(); cb uuid := gen_random_uuid(); affected bigint;
BEGIN
  INSERT INTO auth.users(id) VALUES (a), (b);
  INSERT INTO public.organizations(id,name) VALUES (oa,'SYNTHETIC isolation A'),(ob,'SYNTHETIC isolation B');
  INSERT INTO public.organization_members(organization_id,user_id,role) VALUES (oa,a,'owner'),(ob,b,'owner');
  INSERT INTO public.subscription_status(organization_id) VALUES (oa),(ob);
  INSERT INTO public.properties(id,organization_id,address_line1,city,zip_code)
    VALUES (pa,oa,'SAMPLE A','Houston','77002'),(pb,ob,'SAMPLE B','Houston','77002');
  INSERT INTO public.tenants(id,organization_id,property_id,first_name,last_name)
    VALUES (ta,oa,pa,'SAMPLE','A'),(tb,ob,pb,'SAMPLE','B');
  INSERT INTO public.cases(id,organization_id,property_id,tenant_id,workflow_type,title,created_by)
    VALUES (ca,oa,pa,ta,'eviction','SYNTHETIC A',a),(cb,ob,pb,tb,'eviction','SYNTHETIC B',b);
  INSERT INTO public.case_files(case_id,file_name,file_path,file_type,file_size,uploaded_by)
    VALUES (cb,'SYNTHETIC','fixture-only','text/plain',0,b);
  INSERT INTO public.case_timeline_events(case_id,event_date,title,created_by) VALUES (cb,current_date,'SYNTHETIC B',b);
  INSERT INTO public.templates(organization_id,name,workflow_type,is_system) VALUES(ob,'SYNTHETIC private B','general',false);
  PERFORM set_config('request.jwt.claim.sub', a::text, true);
  PERFORM set_config('role','authenticated',true);
  IF EXISTS (SELECT 1 FROM public.cases WHERE id=cb)
    OR EXISTS (SELECT 1 FROM public.properties WHERE id=pb)
    OR EXISTS (SELECT 1 FROM public.tenants WHERE id=tb)
    OR EXISTS (SELECT 1 FROM public.organization_members WHERE user_id=b)
    OR EXISTS (SELECT 1 FROM public.subscription_status WHERE organization_id=ob)
    OR EXISTS (SELECT 1 FROM public.case_files WHERE case_id=cb)
    OR EXISTS (SELECT 1 FROM public.case_timeline_events WHERE case_id=cb)
    OR EXISTS (SELECT 1 FROM public.templates WHERE organization_id=ob)
    THEN RAISE EXCEPTION 'Cross-workspace read succeeded'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.cases WHERE id=ca) THEN RAISE EXCEPTION 'Own case hidden'; END IF;
  UPDATE public.cases SET title='SYNTHETIC denied' WHERE id=cb;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Foreign case updated'; END IF;
  DELETE FROM public.cases WHERE id=cb;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Foreign case deleted'; END IF;
  BEGIN
    INSERT INTO public.cases(organization_id,workflow_type,title,created_by) VALUES(ob,'eviction','DENIED',a);
    RAISE EXCEPTION 'Foreign workspace insert succeeded';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    UPDATE public.organizations SET stripe_customer_id='cus_SYNTHETIC_denied' WHERE id=oa;
    RAISE EXCEPTION 'Client changed billing identity';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    UPDATE public.subscription_status SET plan='portfolio' WHERE organization_id=oa;
    GET DIAGNOSTICS affected = ROW_COUNT;
    IF affected <> 0 THEN RAISE EXCEPTION 'Client changed subscription'; END IF;
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    INSERT INTO public.organization_members(organization_id,user_id,role) VALUES(ob,a,'owner');
    RAISE EXCEPTION 'Membership escalation succeeded';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    UPDATE public.cases SET property_id=pb WHERE id=ca;
    RAISE EXCEPTION 'Cross-workspace property linked';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    UPDATE public.cases SET tenant_id=tb WHERE id=ca;
    RAISE EXCEPTION 'Cross-workspace party linked';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    UPDATE public.tenants SET property_id=pb WHERE id=ta;
    RAISE EXCEPTION 'Cross-workspace tenant property linked';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    INSERT INTO public.templates(organization_id,name,workflow_type,is_system) VALUES(oa,'DENIED','general',true);
    RAISE EXCEPTION 'Customer published system template';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    PERFORM public.document_allowance(ob,cb,'SYNTHETIC B','{}'::jsonb);
    RAISE EXCEPTION 'Foreign document allowance allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  UPDATE public.organizations SET name='SYNTHETIC renamed' WHERE id=oa;
  UPDATE public.cases SET title='SYNTHETIC own update' WHERE id=ca;
  IF NOT EXISTS (SELECT 1 FROM public.cases WHERE id=ca AND title='SYNTHETIC own update') THEN RAISE EXCEPTION 'Own update blocked'; END IF;
  PERFORM set_config('role','anon',true);
  PERFORM set_config('request.jwt.claim.sub','',true);
  BEGIN
    IF EXISTS (SELECT 1 FROM public.cases WHERE id IN (ca,cb)) THEN RAISE EXCEPTION 'Anonymous case read succeeded'; END IF;
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT 'Workspace isolation, billing identity, membership, links, and template publication checks passed. Fixtures rolled back.' AS result;
ROLLBACK;
