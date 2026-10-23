CREATE TABLE public.account_restrictions (
 user_id uuid PRIMARY KEY,
 nickname_key text NOT NULL,
 blocked boolean NOT NULL DEFAULT true,
 blocked_by uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.account_restrictions TO authenticated;
GRANT ALL ON public.account_restrictions TO service_role;
ALTER TABLE public.account_restrictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read restrictions" ON public.account_restrictions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.registration_devices (
 user_id uuid PRIMARY KEY,
 device_key text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.registration_devices TO service_role;
ALTER TABLE public.registration_devices ENABLE ROW LEVEL SECURITY;
CREATE INDEX registration_devices_key_idx ON public.registration_devices(device_key);
CREATE INDEX account_restrictions_nickname_idx ON public.account_restrictions(nickname_key) WHERE blocked;
CREATE OR REPLACE FUNCTION public.board_safety_reason(p_text text) RETURNS text
LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE t text := lower(p_text);
BEGIN
 IF t ~ '(send|show|share|trade|exchange).{0,35}(nudes|naked (pics|photos)|sexual (pics|photos))' THEN RETURN 'Possible sexual solicitation'; END IF;
 IF t ~ '(dm|message|contact|meet).{0,35}(me|us).{0,70}(keep.{0,12}secret|don''t tell|do not tell)' THEN RETURN 'Possible coercive private solicitation'; END IF;
 IF t ~ '(looking for|seeking|want to meet).{0,35}(underage|under.?18|little girls|little boys)' THEN RETURN 'Possible solicitation involving minors'; END IF;
 RETURN NULL;
END; $$;
CREATE OR REPLACE FUNCTION public.screen_board_notebook() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE reason text; e record;
BEGIN
 IF NEW.shared THEN
  IF EXISTS (SELECT 1 FROM public.account_restrictions WHERE user_id = NEW.owner_id AND blocked) THEN
   RAISE EXCEPTION 'This account cannot post to the board';
  END IF;
  reason := public.board_safety_reason(NEW.title);
  IF reason IS NULL THEN
   FOR e IN SELECT content FROM public.entries WHERE notebook_id = NEW.id AND shared LOOP
    reason := public.board_safety_reason(e.content); EXIT WHEN reason IS NOT NULL;
   END LOOP;
  END IF;
  IF reason IS NOT NULL THEN
   NEW.hidden := true;
   INSERT INTO public.story_reports(notebook_id, session_id, reason, details)
    SELECT NEW.id, 'automated-text-screen', reason, 'Text pattern flagged for human review; this is not a determination about the writer.'
    WHERE NOT EXISTS (SELECT 1 FROM public.story_reports WHERE notebook_id = NEW.id AND session_id = 'automated-text-screen' AND status = 'pending');
  END IF;
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER screen_notebook_before_update BEFORE UPDATE ON public.notebooks FOR EACH ROW EXECUTE FUNCTION public.screen_board_notebook();
CREATE OR REPLACE FUNCTION public.screen_board_entry() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner uuid; reason text;
BEGIN
 IF NEW.shared THEN
  SELECT owner_id INTO owner FROM public.notebooks WHERE id = NEW.notebook_id;
  IF EXISTS (SELECT 1 FROM public.account_restrictions WHERE user_id = owner AND blocked) THEN RAISE EXCEPTION 'This account cannot post to the board'; END IF;
  reason := public.board_safety_reason(NEW.content);
  IF reason IS NOT NULL THEN
   UPDATE public.notebooks SET hidden = true WHERE id = NEW.notebook_id;
   INSERT INTO public.story_reports(notebook_id, session_id, reason, details)
    SELECT NEW.notebook_id, 'automated-text-screen', reason, 'Text pattern flagged for human review; this is not a determination about the writer.'
    WHERE NOT EXISTS (SELECT 1 FROM public.story_reports WHERE notebook_id = NEW.notebook_id AND session_id = 'automated-text-screen' AND status = 'pending');
  END IF;
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER screen_entry_before_write BEFORE INSERT OR UPDATE ON public.entries FOR EACH ROW EXECUTE FUNCTION public.screen_board_entry();
CREATE OR REPLACE FUNCTION public.support_auto_acknowledge() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF TG_TABLE_NAME = 'contact_messages' THEN
  IF NEW.status = 'open' AND NEW.sender_user_id IS NOT NULL THEN
   INSERT INTO public.message_replies(message_id, author_user_id, body) VALUES (NEW.id, NULL, 'Automatic reply: Message received. MrsANONymous is not an emergency service. This inbox is not continuously monitored and is not monitored for emergencies. We do not provide therapy, counseling, medical advice, or crisis response. If you are in danger or need urgent help, contact your local emergency number or a crisis hotline directly. We can help with technical issues, site guidance, account support, and feedback.');
  END IF;
 ELSIF NEW.author_user_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.contact_messages WHERE id = NEW.message_id AND sender_user_id = NEW.author_user_id) THEN
  INSERT INTO public.message_replies(message_id, author_user_id, body) VALUES (NEW.message_id, NULL, 'Automatic reply: Message received. MrsANONymous is not an emergency service. This inbox is not continuously monitored and is not monitored for emergencies. We do not provide therapy, counseling, medical advice, or crisis response. If you are in danger or need urgent help, contact your local emergency number or a crisis hotline directly. We can help with technical issues, site guidance, account support, and feedback.');
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER support_ack_after_message AFTER INSERT ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.support_auto_acknowledge();
CREATE TRIGGER support_ack_after_reply AFTER INSERT ON public.message_replies FOR EACH ROW EXECUTE FUNCTION public.support_auto_acknowledge();
CREATE OR REPLACE FUNCTION public.reject_blocked_nickname_signup() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF NEW.email LIKE '%@mrsanonymous.local' AND EXISTS (SELECT 1 FROM public.account_restrictions WHERE nickname_key = lower(NEW.email) AND blocked) THEN RAISE EXCEPTION 'Account registration unavailable'; END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER reject_blocked_nickname_signup BEFORE INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.reject_blocked_nickname_signup();
REVOKE ALL ON FUNCTION public.screen_board_notebook(), public.screen_board_entry(), public.support_auto_acknowledge(), public.reject_blocked_nickname_signup() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.screen_board_notebook(), public.screen_board_entry(), public.support_auto_acknowledge(), public.reject_blocked_nickname_signup() TO service_role;