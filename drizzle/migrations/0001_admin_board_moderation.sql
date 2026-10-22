CREATE OR REPLACE FUNCTION public.moderate_board_post(p_notebook_id uuid, p_remove boolean, p_notice text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE target public.notebooks%ROWTYPE; thread_id uuid; actor uuid := auth.uid();
BEGIN
  IF actor IS NULL OR NOT public.has_role(actor, 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT p_remove AND (p_notice IS NULL OR length(btrim(p_notice)) = 0) THEN RAISE EXCEPTION 'A message is required'; END IF;
  IF p_notice IS NOT NULL AND (length(btrim(p_notice)) < 1 OR length(btrim(p_notice)) > 4000) THEN RAISE EXCEPTION 'Invalid message'; END IF;
  SELECT * INTO target FROM public.notebooks WHERE id = p_notebook_id AND (shared = true OR hidden = true) FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Board post not found'; END IF;
  IF p_remove THEN
    UPDATE public.notebooks SET hidden = true, shared = false WHERE id = target.id;
    UPDATE public.story_reports SET status = 'removed' WHERE notebook_id = target.id AND status = 'pending';
  END IF;
  IF p_notice IS NOT NULL THEN
    INSERT INTO public.contact_messages(message, audience, sender_user_id, status)
    VALUES ('Board policy notice: ' || target.title, 'other', target.owner_id, 'replied') RETURNING id INTO thread_id;
    INSERT INTO public.message_replies(message_id, author_user_id, body) VALUES (thread_id, actor, btrim(p_notice));
  END IF;
  RETURN thread_id;
END;
$$;
REVOKE ALL ON FUNCTION public.moderate_board_post(uuid, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.moderate_board_post(uuid, boolean, text) TO authenticated;
