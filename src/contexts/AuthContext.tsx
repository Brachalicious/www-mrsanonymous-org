import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { registerAnonymousUser } from "@/lib/auth.functions";
import { clearNoteDrafts } from "@/lib/note-drafts";

export interface Profile {
  id: string;
  nickname: string | null;
  audience: string | null;
  country: string | null;
  state_region?: string | null;
  city?: string | null;
  created_at: string;
  updated_at: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  roleLoading: boolean;
  login: (creds: { nickname: string; password: string }) => Promise<void>;
  register: (creds: {
    nickname: string;
    password: string;
    audience: "women" | "girls";
    country?: string;
    state_region?: string;
    city?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  errMsg: (e: unknown) => string;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profile: null,
  isAdmin: false,
  loading: true,
  roleLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  errMsg: () => "Something went wrong.",
});

const sb = supabase as any;

function nicknameToEmail(nickname: string) {
  return `${nickname.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}@mrsanonymous.local`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    let revision = 0;
    let currentUserId: string | null = null;
    function receiveSession(nextSession: Session | null, event?: string) {
      if (!mounted) return;
      const version = ++revision;
      const nextUser = nextSession?.user ?? null;
      setSession(nextSession);
      setUser(nextUser);
      // Authentication is ready before optional profile/role reads finish.
      setLoading(false);
      const sameUser = !!nextUser && nextUser.id === currentUserId;
      currentUserId = nextUser?.id ?? null;
      if (!sameUser) {
        setProfile(null);
        setIsAdmin(false);
        setRoleLoading(!!nextUser);
      }
      if (event === "SIGNED_OUT") clearNoteDrafts();
      if (!nextUser) return;
      if (sameUser && event === "TOKEN_REFRESHED") return;
      setTimeout(() => {
        if (!mounted || version !== revision) return;
        void Promise.all([
          sb.from("profiles").select("*").eq("id", nextUser.id).single(),
          sb.from("user_roles").select("role").eq("user_id", nextUser.id),
        ]).then(([profileResult, roleResult]) => {
          if (!mounted || version !== revision) return;
          setProfile((profileResult.data as Profile | null) ?? null);
          setIsAdmin(Array.isArray(roleResult.data) && roleResult.data.some((r: { role: string }) => r.role === "admin"));
          setRoleLoading(false);
        }).catch(() => {
          if (mounted && version === revision) setRoleLoading(false);
          // Optional reads must not strand the whole app on Loading.
        });
      }, 0);
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      receiveSession(nextSession, event);
    });
    const initialRevision = revision;
    void supabase.auth.getSession().then(({ data }) => {
      if (revision === initialRevision) receiveSession(data.session);
    }).catch(() => {
      if (mounted && revision === initialRevision) { setLoading(false); setRoleLoading(false); }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function login({ nickname, password }: { nickname: string; password: string }) {
    const email = nicknameToEmail(nickname);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function register({
    nickname,
    password,
    audience,
    country,
    state_region,
    city,
  }: {
    nickname: string;
    password: string;
    audience: "women" | "girls";
    country?: string;
    state_region?: string;
    city?: string;
  }) {
    const { email } = await registerAnonymousUser({
      data: { nickname, password, audience, country, state_region, city },
    });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function logout() {
    clearNoteDrafts();
    await supabase.auth.signOut();
  }

  function errMsg(e: unknown) {
    if (e instanceof Error) return e.message;
    if (typeof e === "string") return e;
    return "Something went wrong. Please try again.";
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, isAdmin, loading, roleLoading, login, register, logout, errMsg }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
