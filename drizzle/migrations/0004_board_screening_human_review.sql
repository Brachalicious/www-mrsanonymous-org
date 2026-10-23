CREATE TABLE public.board_text_approvals (
 notebook_id uuid NOT NULL REFERENCES public.notebooks(id) ON DELETE CASCADE,
 text_hash text NOT NULL,
 reviewed_by uuid NOT NULL,
 reviewed_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (notebook_id, text_hash)
);
GRANT ALL ON public.board_text_approvals TO service_role;
ALTER TABLE public.board_text_approvals ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.screen_board_notebook() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE reason text; e record;
BEGIN
 IF NEW.shared THEN
  IF EXISTS (SELECT 1 FROM public.account_restrictions WHERE user_id = NEW.owner_id AND blocked) THEN RAISE EXCEPTION 'This account cannot post to the board'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.board_text_approvals WHERE notebook_id=NEW.id AND text_hash=md5(NEW.title)) THEN reason := public.board_safety_reason(NEW.title); END IF;
  IF reason IS NULL THEN
   FOR e IN SELECT content FROM public.entries WHERE notebook_id=NEW.id AND shared LOOP
    IF NOT EXISTS (SELECT 1 FROM public.board_text_approvals WHERE notebook_id=NEW.id AND text_hash=md5(e.content)) THEN reason := public.board_safety_reason(e.content); END IF;
    EXIT WHEN reason IS NOT NULL;
   END LOOP;
  END IF;
  IF reason IS NOT NULL THEN
   NEW.hidden := true;
   INSERT INTO public.story_reports(notebook_id, session_id, reason, details)
   SELECT NEW.id, 'automated-text-screen', reason, 'Text pattern flagged for human review; this is not a determination about the writer.'
   WHERE NOT EXISTS (SELECT 1 FROM public.story_reports WHERE notebook_id=NEW.id AND session_id='automated-text-screen' AND status='pending');
  END IF;
 END IF;
 RETURN NEW;
END; $$;
CREATE OR REPLACE FUNCTION public.screen_board_entry() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner uuid; reason text;
BEGIN
 IF NEW.shared THEN
  SELECT owner_id INTO owner FROM public.notebooks WHERE id=NEW.notebook_id;
  IF EXISTS (SELECT 1 FROM public.account_restrictions WHERE user_id=owner AND blocked) THEN RAISE EXCEPTION 'This account cannot post to the board'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.board_text_approvals WHERE notebook_id=NEW.notebook_id AND text_hash=md5(NEW.content)) THEN reason := public.board_safety_reason(NEW.content); END IF;
  IF reason IS NOT NULL THEN
   UPDATE public.notebooks SET hidden=true WHERE id=NEW.notebook_id;
   INSERT INTO public.story_reports(notebook_id, session_id, reason, details)
   SELECT NEW.notebook_id, 'automated-text-screen', reason, 'Text pattern flagged for human review; this is not a determination about the writer.'
   WHERE NOT EXISTS (SELECT 1 FROM public.story_reports WHERE notebook_id=NEW.notebook_id AND session_id='automated-text-screen' AND status='pending');
  END IF;
 END IF;
 RETURN NEW;
END; $$;
CREATE OR REPLACE FUNCTION public.resolve_board_report(p_report_id uuid, p_action text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE target uuid; actor uuid := auth.uid();
BEGIN
 IF actor IS NULL OR NOT public.has_role(actor,'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
 IF p_action NOT IN ('remove','keep') THEN RAISE EXCEPTION 'Invalid action'; END IF;
 SELECT notebook_id INTO target FROM public.story_reports WHERE id=p_report_id FOR UPDATE;
 IF target IS NULL THEN RAISE EXCEPTION 'Report not found'; END IF;
 PERFORM 1 FROM public.notebooks WHERE id=target FOR UPDATE;
 IF p_action='keep' THEN
  IF EXISTS (SELECT 1 FROM public.notebooks n JOIN public.account_restrictions r ON r.user_id=n.owner_id WHERE n.id=target AND r.blocked) THEN RAISE EXCEPTION 'Unblock the account before approving its post'; END IF;
  INSERT INTO public.board_text_approvals(notebook_id,text_hash,reviewed_by)
  SELECT target,md5(title),actor FROM public.notebooks WHERE id=target
  UNION SELECT target,md5(content),actor FROM public.entries WHERE notebook_id=target AND shared
  ON CONFLICT (notebook_id,text_hash) DO UPDATE SET reviewed_by=actor,reviewed_at=now();
  UPDATE public.story_reports SET status='dismissed' WHERE notebook_id=target AND status='pending';
  UPDATE public.notebooks SET hidden=false WHERE id=target;
 ELSE
  UPDATE public.notebooks SET hidden=true,shared=false WHERE id=target;
  UPDATE public.story_reports SET status='removed' WHERE notebook_id=target AND status='pending';
 END IF;
END; $$;
REVOKE ALL ON FUNCTION public.resolve_board_report(uuid,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.resolve_board_report(uuid,text) TO authenticated,service_role;