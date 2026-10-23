# Roadmap
- [x] Restore persistent Calculator install name/icon without replacing the enlarged red artwork; tests and browser checks verified install metadata, passcode setup, and covered relaunch.
- [x] Add selectable trigger warnings before board reveals, individual admin account deletion, and owner-only pinned page stacks; verified warning selection, reveal, persistent pin order, page/post removal, and temporary account deletion through signed-in UI.
- [x] Clarify contact is app support, not therapy; add Psychology Today resource, enlarge admin reply box, and show role beside account name.
- [x] Add admin board removal and private policy notices; signed-in admin UI verified removal, preserved private notebook, and read back the notice in the support inbox.
- [ ] Activate admin for rki — blocked because no app account with this nickname exists; owner must create it and confirm before granting access.
- [x] Inspect account separation: sign-in nicknames are unique, authentication identifies each account independently, and ownership is user-ID scoped; identical passwords do not merge accounts.

- [x] Make the footer guidance mascot open its page directly; verified image tap at 695×906 and guidance replies in preview and on the live site.
- [x] Add clickable footer mascot and private account-saved guidance conversations.
- [x] Verify mascot phone layout, guidance sign-in screen, message validation, and live AI replies.
- [x] Switch the AI guidance assistant off for the public app: mascot removed from the footer, guidance pages show a closed notice, and the guidance API returns 410 without reaching the AI gateway (verified no credits spent).
- [ ] Re-enable guidance only if the owner asks — restore the footer mascot, the chat popup, and the streaming handler.
- [ ] Publish the pending frontend batch (guidance off, footer branding, safety-plan export, board and phone fixes) once the owner says publish.

- [x] Clickable label box at bottom of notebook cover to rename (NotebookCover)
- [x] Wire rename in NotebookList via updateNotebook
- [x] Make NotebookCover match the CoverDesigner preview (label box, marble, spine)
- [x] Clean marble styling (natural wavy veins + soft clouds, colors stay true — verified pink/red/mixed)
- [x] Typecheck passed; verified via browser screenshots
- [x] Footer branding: black/white/red MysticMinded33 credit, large and bold, clickable to mysticminded33.com (verified phone + desktop clearance).
- [x] Enlarged footer logo circle (viewport-scaled) and verified clearance on 7 screen sizes.
