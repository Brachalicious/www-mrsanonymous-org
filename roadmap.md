# Roadmap — pre-production full test

## Translation meaning review
- [x] Follow-up flow sweep: fixed mascot creation/load errors being hidden behind disabled-query pending state; bounded all guide list/load/create/save/delete waits without automatic write retries; stopped identical DOM writes from causing translation request loops and restore source when switching to an unsupported translation. Read shared DOM/attribute translator, language context, auth, home/footer mascot entry points, workspace/thread/chat, all five guidance storage functions, disabled API, emergency custom/story translation and plan exports. Browser verified home/footer failure states, unsaved questions, language changes and AI-off response on phone/desktop in both system appearances; saved conversation create/ask/reload/delete rechecked. Emergency sending not exercised; exports remain English and full machine/native-language review remains unavailable. No existing user records or permission changes.
- [x] Repair translation failure handling: bounded requests, failure cooldown, successful-only caching, stale-text guards, and offline navigation/headings in all 24 languages. Show service-unavailable status rather than silently presenting English as translated. Guide no longer waits for optional profile reads; unsaved guide works during authentication. Phone/desktop verified with blocked profile reads and a real account: ask, save, reload/read back, delete, Hebrew fallback and return to English; no page errors. External Google translation still returns 429, so full automatic translation remains blocked outside our control.
- [x] Add contextual personal-safety terminology for all 24 language choices and a complete Hebrew homepage headline; check tools/plan headings in 96 phone/desktop page visits, no overflow, Hebrew regression tests pass.
- [x] Read safety-bearing UI/source paths: navigation/footer, home/about/audience, dashboard, journal/editor/bodycam, Board, resources/external-opening, agreement/privacy/signup/deletion/download, safety-plan fields/print/export, emergency SMS, guidance and server references. Add safe-state/code-word Hebrew terms and reject כספת mistranslations of personal-safety text in dynamic translation. Existing records, emergency numbers, permissions and financial/organization names unchanged; 184 tests pass. Browse 16 routes at phone/desktop in light/dark system preferences; some captures precede hydration and guidance remained loading, so these are not full translated-flow verification.
- [ ] Complete full-text meaning review across every language/page: automatic translation service is rejecting requests in this environment, leaving uncatalogued English text visible; full native-speaker validation is not available.

## Homepage purpose and pathways
- [x] Rewrite women, girls and storytelling paths; describe resources, phonebook, incident recordings and safety tools without inviting personal outreach. Phone/desktop presentation and Resources navigation checked; no page errors, build OK.

## Android installation and device reset
- [ ] Match the published Android link-verification file to package org.mrsanonymous.app with the upload and Google Play signing fingerprints.
- [x] Distinguish Chrome shortcuts from app installation without promising removal of browser badges.
- [x] Add confirmed device reset that removes local private data and locks without deleting online accounts.
- [x] Verify fresh direct-site opening after reset, calculator launch protection, phone layout and signed-in local sign-out; nine regression tests pass, no page errors.
- [ ] Badge-free Android package and automatic uninstall cleanup: requires native Android project changes; unavailable in this website checkout.

## Videos & Articles
- [x] Add trusted video and reading links under Resources with existing sharing, phonebook saving and safe external opening.
- [x] Verify the section and external-opening confirmation on desktop and phone sizes.

## Hebrew display
- [x] Honor selected Hebrew regardless of country or location; verified selection, reload persistence, switching back to English, and unchanged US 911 numbers; 11 regression tests passed.

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
- [x] Sweep emergency surfaces: corrected Women/Girls emergency links, installation wording, safety-plan/export prompt and new guide responses; synchronized all Resources country choices with emergency profiles and fixed country-loading mismatch. Nine public pages checked in browser; journal, export and support handling read in source; 129 tests passed. Not an official-service verification or live call/text test.
- [x] Make the current country visible beside the safety controls; 58 tests passed, all 43 named countries checked in Hebrew and English through both call controls, Israel and Hebrew persist after reload, phone layout fits, and no page errors.
- [x] Remove leftover US-only 911 wording outside the US; 13 tests passed, seven country call destinations checked, Israel persists after reload, phone panel fits, and no page errors.
- [x] Country picker in the emergency panel (explicit device choice > profile country > locale guess), with persistence across reload.
- [x] Verify per country in the preview: US, GB, CA, AU, NZ, FR, IL, ES, DE — correct call numbers, text button only where genuinely available, accurate note otherwise, no page errors, panel fits at 390x844.
- [x] Keep the US-only National Domestic Violence Hotline box to the US.
