<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Render the phone navigation overlay through a portal into document.body, with a viewport-height shell and independently scrolling links; the blurred sticky header otherwise confines fixed descendants to its own height.
- Keep both install manifests on the same URL-based identity and set calculator installation metadata globally, not through temporary page effects, so navigation cannot revert the launcher appearance.
- Anchor the emergency options panel independently to viewport top and bottom safe bounds, with internal scrolling, so trigger size and text wrapping cannot push its top off-screen.
- Guidance uses route-addressed threads, owner-scoped Cloud storage and recovery-lock checks; AI SDK/AI Elements stream replies through a server-only gateway boundary so secrets and private app data never enter the client or prompts.
- The AI guidance assistant stays switched off while the app is public: no UI entry point, and the guidance API route must answer without ever reaching the AI gateway so no credits can be spent.
- Resolve text parser dependencies per package without a global entities override or alias; email rendering and chat markdown require different compatible versions.
- Defer database queries outside auth-state callbacks so session-lock acquisition cannot deadlock sign-in.
- Board moderation requires authenticated server-side admin checks; remove public visibility without deleting private notebooks, and atomically deliver policy notices through existing owner-scoped support threads, deriving both writer and author inside the database function.
- Persist trigger warnings on notebooks and pages and display their union before reader reveal; pinned_at orders only owner-scoped notebook pages, preserving independent board ranking.
- Individual admin account deletion requires a server-verified admin, explicit confirmation, protected admin identities, and checked database/storage cleanup before deleting the auth identity.
- Account bans use server-verified admin actions, Auth bans, and minimal retained nickname/browser registration identifiers; do not fingerprint devices or claim anonymous people cannot evade bans.
- Board text screening runs in database write triggers, hides flags for human review, and never calls the AI gateway; private unshared content is not screened. Admin approval records exact-text hashes atomically with report resolution, so edited text is screened again without granting writers approval access.
- App support acknowledgments are generated atomically by database triggers with null authors; contact ownership is derived from a verified bearer token, never caller-supplied IDs.
- The public installation page bypasses the terms overlay but not the calculator lock; installation never requires an account.
