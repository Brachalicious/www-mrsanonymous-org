CREATE TABLE public.phonebooks (
  owner_id uuid PRIMARY KEY,
  contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
  money jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.phonebooks TO authenticated;
GRANT ALL ON public.phonebooks TO service_role;
ALTER TABLE public.phonebooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their phonebook" ON public.phonebooks FOR ALL TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE TRIGGER phonebooks_updated_at BEFORE UPDATE ON public.phonebooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();