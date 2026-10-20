CREATE TABLE public.guidance_threads (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 title text NOT NULL DEFAULT 'New conversation',
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guidance_threads TO authenticated;
GRANT ALL ON public.guidance_threads TO service_role;
ALTER TABLE public.guidance_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage guidance threads" ON public.guidance_threads FOR ALL TO authenticated USING (owner_id = auth.uid() AND NOT EXISTS (SELECT 1 FROM public.inbox_recovery_locks l WHERE l.user_id = auth.uid() AND l.status = 'pending')) WITH CHECK (owner_id = auth.uid() AND NOT EXISTS (SELECT 1 FROM public.inbox_recovery_locks l WHERE l.user_id = auth.uid() AND l.status = 'pending'));
CREATE TABLE public.guidance_messages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 thread_id uuid NOT NULL REFERENCES public.guidance_threads(id) ON DELETE CASCADE,
 sdk_id text NOT NULL,
 message jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(thread_id, sdk_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guidance_messages TO authenticated;
GRANT ALL ON public.guidance_messages TO service_role;
ALTER TABLE public.guidance_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage guidance messages" ON public.guidance_messages FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.guidance_threads t WHERE t.id = thread_id AND t.owner_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.guidance_threads t WHERE t.id = thread_id AND t.owner_id = auth.uid()));
CREATE INDEX guidance_threads_owner ON public.guidance_threads(owner_id, updated_at DESC);
CREATE INDEX guidance_messages_thread ON public.guidance_messages(thread_id, created_at);
CREATE TABLE public.guidance_ai_state (
 id text PRIMARY KEY,
 status integer NOT NULL,
 message text NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.guidance_ai_state TO service_role;
ALTER TABLE public.guidance_ai_state ENABLE ROW LEVEL SECURITY;