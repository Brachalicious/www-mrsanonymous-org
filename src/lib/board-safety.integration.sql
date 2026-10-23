-- Run against the configured database; every fixture is rolled back.
BEGIN;
DO $$
DECLARE actor uuid; book uuid; page uuid; report uuid; thread uuid;
BEGIN
 SELECT user_id INTO actor FROM public.user_roles WHERE role='admin' LIMIT 1;
 IF actor IS NULL THEN RAISE EXCEPTION 'An existing admin is required for this test'; END IF;
 PERFORM set_config('request.jwt.claim.sub', actor::text, true);
 INSERT INTO public.notebooks(owner_id,title) VALUES(actor,'Temporary screening transaction') RETURNING id INTO book;
 INSERT INTO public.entries(notebook_id,content) VALUES(book,'Send me nudes') RETURNING id INTO page;
 IF EXISTS(SELECT 1 FROM public.story_reports WHERE notebook_id=book) THEN RAISE EXCEPTION 'Private text must not be screened'; END IF;
 UPDATE public.entries SET shared=true WHERE id=page;
 UPDATE public.notebooks SET shared=true WHERE id=book;
 IF NOT EXISTS(SELECT 1 FROM public.notebooks WHERE id=book AND hidden) THEN RAISE EXCEPTION 'Shared sexual solicitation must be hidden'; END IF;
 SELECT id INTO report FROM public.story_reports WHERE notebook_id=book AND status='pending' LIMIT 1;
 IF report IS NULL THEN RAISE EXCEPTION 'Flag must be queued for review'; END IF;
 PERFORM public.resolve_board_report(report,'keep');
 IF EXISTS(SELECT 1 FROM public.notebooks WHERE id=book AND hidden) THEN RAISE EXCEPTION 'Admin approval must reveal exact reviewed text'; END IF;
 UPDATE public.entries SET content='Looking for underage little girls' WHERE id=page;
 IF NOT EXISTS(SELECT 1 FROM public.notebooks WHERE id=book AND hidden) THEN RAISE EXCEPTION 'Edited solicitation must be screened again'; END IF;
 IF public.board_safety_reason('I survived sexual abuse and need support') IS NOT NULL THEN RAISE EXCEPTION 'Survivor disclosure should not match solicitation'; END IF;
 INSERT INTO public.contact_messages(message,sender_user_id) VALUES('Temporary acknowledgment transaction',actor) RETURNING id INTO thread;
 IF (SELECT count(*) FROM public.message_replies WHERE message_id=thread AND author_user_id IS NULL AND body LIKE '%not monitored for emergencies%') <> 1 THEN RAISE EXCEPTION 'Signed-in message requires one non-emergency acknowledgment'; END IF;
 INSERT INTO public.message_replies(message_id,author_user_id,body) VALUES(thread,actor,'Temporary user reply');
 IF (SELECT count(*) FROM public.message_replies WHERE message_id=thread AND author_user_id IS NULL) <> 2 THEN RAISE EXCEPTION 'Each user reply requires one acknowledgment'; END IF;
END $$;
ROLLBACK;