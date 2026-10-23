import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { nicknameKey as nicknameToEmail } from "./account-safety";

const registerSchema = z.object({
  nickname: z.string().min(2).max(40),
  password: z.string().min(1).max(128),
  audience: z.enum(["women", "girls"]).default("women"),
  country: z.string().min(2).max(3).optional(),
  state_region: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
});

export const registerAnonymousUser = createServerFn({ method: "POST" })
  .inputValidator((data) => registerSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const email = nicknameToEmail(data.nickname);
    const normalizedNickname = data.nickname.toLowerCase().trim();
    let deviceKey = getCookie("mrsanon_registration_device");
    if (!deviceKey || !z.string().uuid().safeParse(deviceKey).success) {
      deviceKey = crypto.randomUUID();
      setCookie("mrsanon_registration_device", deviceKey, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 31536000 });
    }
    const restriction = await supabaseAdmin.from("account_restrictions").select("user_id").eq("nickname_key", email).eq("blocked", true);
    if (restriction.error) throw new Error("Registration unavailable. Please try again later.");
    const devices = await supabaseAdmin.from("registration_devices").select("user_id").eq("device_key", deviceKey);
    if (devices.error) throw new Error("Registration unavailable. Please try again later.");
    let deviceBlocked = false;
    if (devices.data?.length) {
      const bans = await supabaseAdmin.from("account_restrictions").select("user_id").in("user_id", devices.data.map((row) => row.user_id)).eq("blocked", true);
      if (bans.error) throw new Error("Registration unavailable. Please try again later.");
      deviceBlocked = Boolean(bans.data?.length);
    }
    if (restriction.data?.length || deviceBlocked) throw new Error("Account registration unavailable. Contact app support if you believe this is an error.");

    // Check if a profile already exists for this nickname.
    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("nickname", normalizedNickname)
      .maybeSingle();

    if (existing) {
      throw new Error("That nickname is already taken. Please choose another.");
    }

    // Create the auth user with auto-confirmed email.
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
      user_metadata: { nickname: normalizedNickname },
    });

    if (createError || !userData.user) {
      throw new Error(createError?.message ?? "Could not create account.");
    }

    // Create profile row.
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: userData.user.id,
      nickname: normalizedNickname,
      audience: data.audience,
      country: data.country ?? null,
      state_region: data.state_region?.trim() || null,
      city: data.city?.trim() || null,
    });


    if (profileError) {
      // Best-effort cleanup on conflict so the user can retry.
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      throw new Error(profileError.message);
    }

    const deviceSaved = await supabaseAdmin.from("registration_devices").insert({ user_id: userData.user.id, device_key: deviceKey });
    if (deviceSaved.error) {
      await supabaseAdmin.from("profiles").delete().eq("id", userData.user.id);
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      throw new Error("Could not finish registration. Please try again.");
    }
    return { email };
  });

export const loginWithNickname = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      nickname: z.string(),
      password: z.string(),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const email = nicknameToEmail(data.nickname);
    return { email };
  });

export const checkNicknameAvailable = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({
      nickname: z.string().min(2).max(40),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("nickname", data.nickname.toLowerCase().trim())
      .maybeSingle();
    return { available: !existing };
  });


