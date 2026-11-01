// Browser-safe guidance knowledge base.
// No AI, no network, no credits: every answer is written here and matched by keyword.

export interface GuidanceTopic {
  id: string;
  keywords: string[];
  answer: string;
}

export const GUIDANCE_TOPICS: GuidanceTopic[] = [
  {
    id: "navigation",
    keywords: ["navigate", "navigation", "find my way", "dashboard", "menu", "where do i start", "getting started", "site guide"],
    answer: "Start at Dashboard in the menu. Your notebooks and pages are there. Choose Go to THE BOARD! for shared stories.\n\nThe menu also opens Tools, Resources, My Safety Plan, Private Journal, your support Inbox, Contact, and Settings. Tell me what you want to do and I can give you the steps.",
  },
  {
    id: "incident_reports",
    keywords: ["incident report", "incident reports", "document an incident", "evidence", "incident", "attach recording"],
    answer: "Open Private Journal from Tools or the menu. Use the incident-report section to record what happened and add the details and evidence you want to keep. Save, then check the saved report before leaving.\n\nOnly share details when it is safe. Opening a report or preparing a message does not send it to police or anyone else.",
  },
  {
    id: "body_cam",
    keywords: ["body cam", "bodycam", "start recording", "record video", "camera", "microphone", "camera permission"],
    answer: "Open Private Journal and find Body Cam. Read the warning before starting, then allow camera and microphone access if you choose to record. Stop when finished and check that the recording appears in your saved items.\n\nYou can attach saved recordings to an incident report. Device permissions, storage, internet access, and closing the app can affect recording or saving; do not assume a recording was kept until you check it. Consider whether recording is safe and lawful where you are.",
  },
  {
    id: "save_confirmation",
    keywords: ["save button", "saved successfully", "did it save", "save my work", "save what", "unsaved", "save data", "save writing"],
    answer: "For notebook pages and journal writing, press Save and wait for the saved confirmation. Reopen the saved item to check it. If an error appears, keep the page open and try again when you have a connection.\n\nMy Safety Plan has its own Save button and saved-answer summary. Safety plans and saved emergency addresses stay on that device; account-saved writing can be read after signing in.",
  },
  {
    id: "saved_addresses",
    keywords: ["saved addresses", "save address", "save my address", "save an address", "manage addresses"],
    answer: "Open the emergency options at the bottom of the page, then Saved addresses. Enter an address and press Save address. Check the saved list and select the address you want to use.\n\nSaved addresses stay on this device. Before sending an emergency text, check the written address and add any apartment, room, or floor details. A saved address may not be where you are now.",
  },
  {
    id: "location_permission",
    keywords: ["location permission", "location not working", "gps not working", "wrong address", "inaccurate location", "address not found"],
    answer: "Allow location access for this site in your browser or phone settings, then reopen the emergency options. If GPS is weak indoors, try the high-accuracy retry if available.\n\nAlways check the displayed address yourself. If it is wrong or unavailable, type the correct address or choose a saved one and add apartment, room, or floor details. Do not wait for GPS if you need urgent help.",
  },
  {
    id: "sofy",
    keywords: ["sofy", "sofy mode", "mask stories", "mask board"],
    answer: "Open Tools and choose Turn SOFY mode ON to mask sensitive Board cards. You can choose whether to reveal a card.\n\nSOFY masking is separate from trigger warnings and your support inbox verification lock; it does not make a shared post private.",
  },
  {
    id: "guidance_threads",
    keywords: ["new conversation", "delete conversation", "chat history", "saved conversations", "guidance history", "mascot", "guide chat"],
    answer: "Tap the girl at the bottom of a page to open the guide, or open App guidance. Choose New conversation to keep another question separate.\n\nYour guidance conversations save in your account. On App guidance, use the trash icon beside a conversation and confirm to delete it. This is separate from Contact App Support; an admin does not receive your guide questions as support requests.",
  },
  {
    id: "technical_problem",
    keywords: ["not working", "blank page", "wont open", "doesnt open", "cut off", "cant scroll", "cannot scroll", "bug", "error", "loading forever"],
    answer: "If you have unsaved writing, keep a safe copy before refreshing. Check your internet connection, then close and reopen the menu or page. If the problem continues, use Contact App Support.\n\nTell support which page or button failed, what you expected, what happened, and your phone/browser type. Do not include passwords, calculator passcodes, security answers, or identifying details in screenshots.",
  },
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
    answer:
      "Hello, how can I help?\n\nI can show you where things are in MrsANONymous: your saved notes, your safety plan, how to text 911, THE BOARD, and more. Ask me in your own words.",
  },
  {
    id: "what_can_you_do",
    keywords: ["what can you do", "what do you do", "options", "help menu", "who are you"],
    answer:
      "I am the built-in MrsANONymous guide. I answer questions about using this app only.\n\nTry asking about: my saved notes, my safety plan, texting 911, THE BOARD, quick exit, the calculator disguise, or deleting my account.",
  },
  {
    id: "calculator",
    keywords: [
      "calculator",
      "passcode",
      "disguise",
      "unlock",
      "lock",
      "secret",
      "hidden app",
      "fake",
      "hide the app",
    ],
    answer:
      "The calculator disguise uses the calculation you entered during setup as its passcode. Enter the same calculation and press = to unlock; entering only its numeric answer is not the same.\n\nThe calculator passcode is stored on this device. Account security questions reset your account password, not this calculator passcode. The disguise is not a guarantee that your device or browsing history is hidden.",
  },
  {
    id: "quick_exit",
    keywords: [
      "quick exit",
      "escape",
      "esc",
      "exit",
      "leave fast",
      "leave this site",
      "leave quickly",
      "leave now",
      "get out",
      "get off",
      "hide site",
      "hide this page",
      "make this disappear",
      "close fast",
      "x button",
    ],
    answer:
      "To leave fast: press ESC or X on a keyboard, or tap the ✕ Quick Exit button.\n\nThat replaces the current page with Google and activates an exit lock. The back button should not uncover the app while that lock applies, but Quick Exit cannot erase earlier browser history, screenshots, device activity, or downloaded files. Normal Back browsing is separate from Quick Exit.",
  },
  {
    id: "emergency_text",
    keywords: [
      "911",
      "text police",
      "text 911",
      "call police",
      "emergency button",
      "safety button",
      "red button",
      "floating button",
      "emergency options",
    ],
    answer:
      "Tap the floating red button at the bottom of any page. There you can call 911, or Text 911.\n\nText 911 opens your phone's Messages app with the message already written for you, starting with your written street address. You choose whether to send it.\n\nWhere texting 911 is not supported, the app says so and shows you the number to call instead.",
  },
  {
    id: "location",
    keywords: [
      "location",
      "address",
      "gps",
      "map",
      "where i am",
      "coordinates",
      "apt",
      "apartment",
      "room",
      "floor",
      "saved address",
    ],
    answer:
      "When you open the emergency button, the app starts finding your location and shows an accuracy reading.\n\nYour written street address goes at the top of the 911 text, so it still reads on a dispatch screen with no links. You can add Apt, Room or Floor, and you can save addresses ahead of time to use when GPS is weak indoors.",
  },
  {
    id: "signal_help",
    keywords: [
      "signal",
      "heart",
      "hand signal",
      "silent",
      "no sound",
      "quiet",
      "without talking",
      "hand",
    ],
    answer:
      "The heart is Signal for Help. Tap it to see the hand signal illustration you can show on a video call or through a window when you cannot speak out loud.",
  },
  {
    id: "journal",
    keywords: [
      "journal",
      "notes",
      "saved notes",
      "abuse notes",
      "my notes",
      "voice",
      "recording",
      "recorder",
      "body cam",
      "bodycam",
      "video",
      "what did i save",
    ],
    answer:
      "Open Private Journal from the menu or Tools for your journal writing, photos, voice notes, and recordings. Notebook pages are separate: find your notebooks on Dashboard.\n\nUse the Save button and check the saved-items list or reopen the item to confirm. Private writing is not public unless you choose to share it.",
  },
  {
    id: "notebook",
    keywords: [
      "notebook",
      "notebooks",
      "marble",
      "cover",
      "label",
      "rename",
      "photo upload",
      "size slider",
      "color",
      "pages",
    ],
    answer:
      "Notebooks are your private pages. You choose the cover colour, the marble style, the label box, and you can upload your own cover image with a size slider.\n\nTap the label box on a cover to rename it.",
  },
  {
    id: "board",
    keywords: [
      "board",
      "the board",
      "share story",
      "public",
      "post",
      "story",
      "tell your story",
      "anonymous story",
    ],
    answer:
      "THE BOARD is where stories are shared publicly. Open it from the dashboard or the menu.\n\nBefore you post, you pick trigger warnings so readers see them first. You can also pin your own pages so they sit on top of the others in your notebook.",
  },
  {
    id: "report_post",
    keywords: [
      "report",
      "inappropriate",
      "offensive",
      "predator",
      "harass",
      "moderate",
      "inappropriate content",
      "bad post",
      "someone posted",
    ],
    answer:
      "Every post on THE BOARD has a Report button. Tap it, choose a reason, and it goes to the admin review page.\n\nIf two different readers report the same post, it is hidden from the public automatically until an admin reviews it. The writer keeps their private notebook either way.",
  },
  {
    id: "safety_plan",
    keywords: [
      "safety plan",
      "my plan",
      "plan",
      "download plan",
      "print plan",
      "share plan",
      "copy plan",
    ],
    answer:
      "Your safety plan is under My Safety Plan, in the menu and in Tools.\n\nIt is built in sections you fill in and save on your own device. You can download a copy as a PDF, share it through your phone's share sheet, or copy it as text. It never goes to our servers.",
  },
  {
    id: "support_inbox",
    keywords: [
      "inbox",
      "reply",
      "message from admin",
      "support",
      "app support",
      "someone replied",
      "admin",
    ],
    answer:
      "Your support inbox is where replies from the app team appear, in your account. Open it from the menu.\n\nThis is app support, not therapy. We can help with technical issues, site guidance, account support, and feedback.",
  },
  {
    id: "contact",
    keywords: [
      "contact",
      "email you",
      "reach you",
      "ask a person",
      "human",
      "talk to someone",
      "feedback",
      "report a problem",
    ],
    answer:
      "Use the Contact page to reach app support. You can write about technical issues, site guidance, account support, or feedback.\n\nIt is not a crisis line and it is not therapy. For danger, use the emergency button instead.",
  },
  {
    id: "account_recovery",
    keywords: [
      "forgot password",
      "password",
      "security question",
      "locked out",
      "recover",
      "codeword",
      "cant sign in",
      "cannot sign in",
      "reset",
      "code word",
    ],
    answer:
      "There is no email to recover. You set up security questions when you joined, and answering them is how you get back in.\n\nOpen the sign-in page and choose Forgot password, or go to the security questions page and answer them there.",
  },
  {
    id: "signup",
    keywords: [
      "sign up",
      "signup",
      "create account",
      "nickname",
      "email",
      "anonymous",
      "register",
      "join",
      "no email",
    ],
    answer:
      "You sign up with a nickname and a password. No email, no phone number, no real name.\n\nGetting back in uses the security questions you choose, so keep them somewhere only you can reach.",
  },
  {
    id: "delete_account",
    keywords: [
      "delete",
      "remove my account",
      "erase",
      "delete my data",
      "close account",
      "delete account",
    ],
    answer:
      "To delete your account yourself: open Settings, find Delete my account, type DELETE, and choose Permanently delete my account. This cannot be undone.\n\nThe Delete account page also accepts deletion requests, including Delete data — keep your account. Requests are processed by support. Safety plans, saved addresses, and downloaded copies on your device need separate removal from that device.",
  },
  {
    id: "privacy",
    keywords: [
      "private",
      "privacy",
      "who can see",
      "stored",
      "tracked",
      "data",
      "hidden",
      "secure",
      "encrypted",
      "safe from",
    ],
    answer:
      "Your safety plan and saved emergency addresses stay on your device. Your journals, notes, stories, support messages, recordings and uploaded files are stored in our backend so they can come back to your account.\n\nNothing is public unless you post it. Read the full details on the Privacy page.",
  },
  {
    id: "resources",
    keywords: [
      "hotline",
      "resource",
      "trevor",
      "988",
      "rainn",
      "domestic violence hotline",
      "crisis",
      "therapist",
      "counselor",
      "therapy",
      "professional help",
    ],
    answer:
      "The Resources page lists crisis lines with numbers and text options, including The Trevor Project, 988 Suicide and Crisis Lifeline, and the National Domestic Violence Hotline.\n\nIf you want a therapist or counselor, the app can point you to a directory, but the app itself is not therapy.",
  },
  {
    id: "language",
    keywords: [
      "language",
      "spanish",
      "translate",
      "translation",
      "french",
      "another language",
      "change language",
    ],
    answer:
      "Use the language switcher to change the app's language. Emergency texts can also be run through Google Translate so the message you send reads correctly.\n\nTell me which language you need and I will point you to the switcher.",
  },
  {
    id: "install",
    keywords: [
      "download",
      "install",
      "home screen",
      "iphone",
      "android",
      "add to home",
      "pwa",
      "no account",
    ],
    answer:
      "The Download page walks you through adding MrsANONymous to your home screen so it opens like an app. You do not need an account to install it.\n\nIt opens as a calculator, and your chosen calculation is what opens the real app.",
  },
  {
    id: "trigger_warning",
    keywords: ["trigger", "warning", "blur", "blurred", "hide content", "reveal"],
    answer:
      "Before a post or page is revealed, readers see the trigger warnings chosen for it. You choose your own warnings before you post.\n\nMessages in your inbox stay blurred until your account is verified.",
  },
  {
    id: "pin_page",
    keywords: ["pin", "pinned", "stack", "order pages", "move up"],
    answer:
      "You can pin your own pages so they sit on top of the others in your notebook. Pinning only changes your own pages, and it does not move anyone else's post on THE BOARD.",
  },
  {
    id: "block_user",
    keywords: ["block", "blocked", "block someone", "stop someone", "ban"],
    answer:
      "On THE BOARD, choose Block this person on a story card to hide that storyteller's stories from your view. To flag a policy violation for admins, also use Report. Blocking someone from your view does not suspend their account.\n\nAdmins can separately block an account from signing in or posting. Known nickname/browser registration checks discourage re-registration, but cannot prevent someone trying a different device or browser.",
  },
  {
    id: "cost",
    keywords: ["cost", "free", "pay", "credit", "subscription", "bill", "charged", "price"],
    answer:
      "MrsANONymous is free. There is no subscription, no card, and no charge for using the app or the built-in guide.",
  },
  {
    id: "who_made",
    keywords: ["who made", "mysticminded", "who owns", "about you", "who runs", "brand"],
    answer:
      "MrsANONymous is brought to you by MysticMinded³³. Tap the MysticMinded³³ logo at the bottom of any page to read what the brand is about.",
  },
  {
    id: "terms",
    keywords: ["terms", "rules", "agreement", "policy", "allowed", "not allowed"],
    answer:
      "The Terms page lists the rules: no identifying details about anyone, nickname only, no objectionable content, one-tap reporting, and accounts can be removed for breaking the rules.\n\nYou agreed to them when you passed the calculator gate.",
  },
];

const IMMEDIATE_DANGER_PHRASES = [
  "hes coming",
  "shes coming",
  "someone is coming",
  "coming for me",
  "being chased",
  "chasing me",
  "trapped",
  "cant breathe",
  "not breathing",
  "choking",
  "bleeding",
  "unconscious",
  "not responding",
  "theres a gun",
  "there is a gun",
  "with a knife",
  "holding me down",
  "he hit me",
  "he is hitting me",
  "attacking me",
  "being hurt",
  "im dying",
  "i am dying",
  "help me please",
  "he has a gun",
  "she has a gun",
  "he has a knife",
  "she has a knife",
];

const DANGER_ANSWER =
  "If you are in danger right now, put this chat down and get help:\n\n- Tap the red button at the bottom of the screen, then Text 911. Your written address goes at the top of that message.\n- Call 911.\n- The Trevor Project: call 866-488-7386, text 678678, or chat at chat.trvr.org\n- 988 Suicide and Crisis Lifeline: call or text 988.\n\nIf you need this screen gone fast, press ESC or tap ✕ Quick Exit.";

const FALLBACK_ANSWER =
  "I can only answer questions about using MrsANONymous, and I did not find one for that.\n\nTry asking about: my saved notes, my safety plan, texting 911, THE BOARD, quick exit, the calculator disguise, or deleting my account.\n\nIf you need a person, use the Contact page for app support. If you are in danger, tap the red button and Text 911.";

const GREETING_IDS = new Set(["greeting", "what_can_you_do"]);

export function normalizeGuidanceText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isImmediateDanger(text: string): boolean {
  return IMMEDIATE_DANGER_PHRASES.some((phrase) => text.includes(phrase));
}

function keywordMatches(normalized: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^| )${escaped}( |$)`).test(normalized);
}

export function matchGuidanceTopic(text: string): GuidanceTopic | null {
  const normalized = normalizeGuidanceText(text);
  if (!normalized) return null;
  let best: GuidanceTopic | null = null;
  let bestScore = 0;
  for (const topic of GUIDANCE_TOPICS) {
    const score = topic.keywords.reduce(
      (total, keyword) => {
        const phrase = normalizeGuidanceText(keyword);
        return keywordMatches(normalized, phrase)
          ? total + phrase.split(" ").length ** 2
          : total;
      },
      0,
    );
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : null;
}

export function answerGuidanceQuestion(text: string): string {
  const normalized = normalizeGuidanceText(text);
  if (!normalized) return FALLBACK_ANSWER;
  if (isImmediateDanger(normalized)) return DANGER_ANSWER;
  const topic = matchGuidanceTopic(text);
  if (!topic) return FALLBACK_ANSWER;
  // A bare greeting or "help" with no real question still gets the overview.
  if (GREETING_IDS.has(topic.id) && normalized.split(" ").length > 6) return FALLBACK_ANSWER;
  return topic.answer;
}
