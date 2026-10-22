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
- Anchor the emergency options panel independently to viewport top and bottom safe bounds, with internal scrolling, so trigger size and text wrapping cannot push its top off-screen.
- Guidance uses route-addressed threads, owner-scoped Cloud storage and recovery-lock checks; AI SDK/AI Elements stream replies through a server-only gateway boundary so secrets and private app data never enter the client or prompts.
- The AI guidance assistant stays switched off while the app is public: no UI entry point, and the guidance API route must answer without ever reaching the AI gateway so no credits can be spent.
- Resolve text parser dependencies per package without a global entities override or alias; email rendering and chat markdown require different compatible versions.
- Defer database queries outside auth-state callbacks so session-lock acquisition cannot deadlock sign-in.
