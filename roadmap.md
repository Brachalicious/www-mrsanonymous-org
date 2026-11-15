# Roadmap — pre-production full test

- [x] Run all automated tests (65 pass, 0 fail)
- [x] Confirm build is clean
- [x] Verify signed-out flows: terms gate, legal pages readable, mascot guide (unsaved), Quick Exit, emergency panel, resources, board, download page, footer warning
- [x] Verify signed-in flows: dashboard, journal save/persist, safety plan autosave/persist, notebook create/open, guidance workspace, board, tell-your-story, inbox, settings, delete-account, admin denial for non-admin
- [x] Check publish state / unpublished changes
- [x] Report pass/fail per feature

## Additional international and financial resources
- [x] Add supplied links to the relevant country lists and resource sections without duplicate entries in the same section.
- [x] Extend built-in guide answers and verify resource navigation and country matching (38 tests; all 20 links and signed-out UK guidance checked).

## Emergency panel country support
- [x] Country picker in the emergency panel (explicit device choice > profile country > locale guess), with persistence across reload.
- [x] Verify per country in the preview: US, GB, CA, AU, NZ, FR, IL, ES, DE — correct call numbers, text button only where genuinely available, accurate note otherwise, no page errors, panel fits at 390x844.
- [x] Keep the US-only National Domestic Violence Hotline box to the US.
