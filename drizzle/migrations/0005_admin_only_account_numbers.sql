CREATE TABLE public.account_numbers (
  user_id uuid PRIMARY KEY,
  account_number bigint GENERATED ALWAYS AS IDENTITY UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.account_numbers TO authenticated;
GRANT ALL ON public.account_numbers TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.account_numbers_account_number_seq TO service_role;
ALTER TABLE public.account_numbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins read account numbers" ON public.account_numbers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
COMMENT ON TABLE public.account_numbers IS 'Admin-only account references; not real-world identity. Sequence numbers are never reused after account deletion.';
CREATE FUNCTION public.assign_account_number() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.account_numbers(user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER assign_account_number_after_profile AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.assign_account_number();
CREATE FUNCTION public.remove_account_number() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.account_numbers WHERE user_id = OLD.id;
  RETURN OLD;
END;
$$;
CREATE TRIGGER remove_account_number_after_profile AFTER DELETE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.remove_account_number();
CREATE FUNCTION public.protect_account_number() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.account_number IS DISTINCT FROM OLD.account_number THEN
    RAISE EXCEPTION 'Account numbers cannot be changed';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER protect_account_number_before_update BEFORE UPDATE ON public.account_numbers FOR EACH ROW EXECUTE FUNCTION public.protect_account_number();
INSERT INTO public.account_numbers(user_id) SELECT id FROM public.profiles ORDER BY created_at, id ON CONFLICT (user_id) DO NOTHING;
REVOKE ALL ON FUNCTION public.assign_account_number() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.remove_account_number() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.protect_account_number() FROM PUBLIC;