ALTER TABLE public.notebooks ADD COLUMN trigger_warnings text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.entries ADD COLUMN trigger_warnings text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.entries ADD COLUMN pinned_at timestamptz;
COMMENT ON COLUMN public.notebooks.trigger_warnings IS 'Writer-selected warnings displayed before revealing a notebook on the board';
COMMENT ON COLUMN public.entries.trigger_warnings IS 'Writer-selected warnings displayed before revealing a shared page';
COMMENT ON COLUMN public.entries.pinned_at IS 'Owner pin order within this notebook only; newest pin first';