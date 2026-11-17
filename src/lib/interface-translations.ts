// Offline labels for every offered language; never depend on network access
// for navigating the app. Columns have the same meaning across languages.
const labels = ["About us", "Women", "Girls", "Resources", "Tools", "Private Journal", "Your dashboard", "Tell Your Story", "Privacy Policy", "App guidance", "Hello, how can I help?", "Sign in", "New conversation"];
const rows: Record<string, string[]> = {
  es: ["Sobre nosotras", "Mujeres", "Chicas", "Recursos", "Herramientas", "Diario privado", "Tu panel", "Cuenta tu historia", "Política de privacidad", "Guía de la aplicación", "Hola, ¿cómo puedo ayudarte?", "Iniciar sesión", "Nueva conversación"],
  fr: ["À propos", "Femmes", "Filles", "Ressources", "Outils", "Journal privé", "Votre tableau de bord", "Racontez votre histoire", "Politique de confidentialité", "Guide de l’application", "Bonjour, comment puis-je vous aider ?", "Connexion", "Nouvelle conversation"],
  pt: ["Sobre nós", "Mulheres", "Meninas", "Recursos", "Ferramentas", "Diário privado", "Seu painel", "Conte sua história", "Política de privacidade", "Guia do aplicativo", "Olá, como posso ajudar?", "Entrar", "Nova conversa"],
  de: ["Über uns", "Frauen", "Mädchen", "Hilfsangebote", "Werkzeuge", "Privates Tagebuch", "Deine Übersicht", "Erzähle deine Geschichte", "Datenschutzerklärung", "App-Hilfe", "Hallo, wie kann ich helfen?", "Anmelden", "Neues Gespräch"],
  it: ["Chi siamo", "Donne", "Ragazze", "Risorse", "Strumenti", "Diario privato", "La tua bacheca", "Racconta la tua storia", "Informativa sulla privacy", "Guida all’app", "Ciao, come posso aiutarti?", "Accedi", "Nuova conversazione"],
  nl: ["Over ons", "Vrouwen", "Meisjes", "Hulpbronnen", "Hulpmiddelen", "Privédagboek", "Jouw overzicht", "Vertel je verhaal", "Privacybeleid", "App-hulp", "Hallo, hoe kan ik je helpen?", "Inloggen", "Nieuw gesprek"],
  pl: ["O nas", "Kobiety", "Dziewczęta", "Źródła pomocy", "Narzędzia", "Prywatny dziennik", "Twój panel", "Opowiedz swoją historię", "Polityka prywatności", "Pomoc w aplikacji", "Cześć, jak mogę pomóc?", "Zaloguj się", "Nowa rozmowa"],
  ru: ["О нас", "Женщины", "Девочки", "Ресурсы", "Инструменты", "Личный дневник", "Ваша панель", "Расскажите свою историю", "Политика конфиденциальности", "Помощь по приложению", "Здравствуйте, чем я могу помочь?", "Войти", "Новый разговор"],
  uk: ["Про нас", "Жінки", "Дівчата", "Ресурси", "Інструменти", "Особистий щоденник", "Ваша панель", "Розкажіть свою історію", "Політика конфіденційності", "Допомога з додатком", "Вітаю, чим я можу допомогти?", "Увійти", "Нова розмова"],
  tr: ["Hakkımızda", "Kadınlar", "Kızlar", "Kaynaklar", "Araçlar", "Özel günlük", "Kontrol paneliniz", "Hikâyeni anlat", "Gizlilik politikası", "Uygulama rehberi", "Merhaba, nasıl yardımcı olabilirim?", "Giriş yap", "Yeni konuşma"],
  he: ["עלינו", "נשים", "נערות", "מקורות סיוע", "כלים", "יומן פרטי", "האזור האישי שלך", "ספרי את הסיפור שלך", "מדיניות פרטיות", "מדריך לאפליקציה", "שלום, איך אוכל לעזור?", "כניסה", "שיחה חדשה"],
  ar: ["من نحن", "النساء", "الفتيات", "مصادر المساعدة", "الأدوات", "يوميات خاصة", "لوحة التحكم الخاصة بك", "احكي قصتك", "سياسة الخصوصية", "دليل التطبيق", "مرحباً، كيف يمكنني مساعدتك؟", "تسجيل الدخول", "محادثة جديدة"],
  fa: ["درباره ما", "زنان", "دختران", "منابع کمک", "ابزارها", "دفتر خاطرات خصوصی", "داشبورد شما", "داستانت را بگو", "سیاست حریم خصوصی", "راهنمای برنامه", "سلام، چطور می‌توانم کمک کنم؟", "ورود", "گفتگوی جدید"],
  ur: ["ہمارے بارے میں", "خواتین", "لڑکیاں", "مدد کے وسائل", "اوزار", "نجی ڈائری", "آپ کا ڈیش بورڈ", "اپنی کہانی سنائیں", "رازداری کی پالیسی", "ایپ کی رہنمائی", "سلام، میں کیسے مدد کر سکتی ہوں؟", "لاگ ان", "نئی گفتگو"],
  hi: ["हमारे बारे में", "महिलाएँ", "लड़कियाँ", "सहायता के संसाधन", "उपकरण", "निजी डायरी", "आपका डैशबोर्ड", "अपनी कहानी बताएँ", "गोपनीयता नीति", "ऐप मार्गदर्शन", "नमस्ते, मैं कैसे मदद कर सकती हूँ?", "लॉग इन", "नई बातचीत"],
  bn: ["আমাদের সম্পর্কে", "নারী", "মেয়েরা", "সহায়তার উৎস", "সরঞ্জাম", "ব্যক্তিগত ডায়েরি", "আপনার ড্যাশবোর্ড", "আপনার গল্প বলুন", "গোপনীয়তা নীতি", "অ্যাপ নির্দেশিকা", "হ্যালো, কীভাবে সাহায্য করতে পারি?", "লগ ইন", "নতুন কথোপকথন"],
  zh: ["关于我们", "女性", "女孩", "援助资源", "工具", "私人日记", "你的控制面板", "讲述你的故事", "隐私政策", "应用指南", "你好，我能如何帮助你？", "登录", "新对话"],
  ja: ["私たちについて", "女性", "女の子", "支援情報", "ツール", "非公開の日記", "あなたのダッシュボード", "あなたの体験を語る", "プライバシーポリシー", "アプリガイド", "こんにちは、何かお手伝いできますか？", "ログイン", "新しい会話"],
  ko: ["소개", "여성", "소녀", "지원 정보", "도구", "비공개 일기", "내 대시보드", "당신의 이야기를 들려주세요", "개인정보 처리방침", "앱 안내", "안녕하세요, 무엇을 도와드릴까요?", "로그인", "새 대화"],
  vi: ["Về chúng tôi", "Phụ nữ", "Trẻ em gái", "Nguồn hỗ trợ", "Công cụ", "Nhật ký riêng tư", "Bảng điều khiển của bạn", "Kể câu chuyện của bạn", "Chính sách quyền riêng tư", "Hướng dẫn ứng dụng", "Xin chào, tôi có thể giúp gì?", "Đăng nhập", "Cuộc trò chuyện mới"],
  tl: ["Tungkol sa amin", "Kababaihan", "Mga batang babae", "Mga mapagkukunan ng tulong", "Mga kasangkapan", "Pribadong talaarawan", "Iyong dashboard", "Ibahagi ang iyong kuwento", "Patakaran sa privacy", "Gabay sa app", "Kumusta, paano ako makakatulong?", "Mag-sign in", "Bagong pag-uusap"],
  id: ["Tentang kami", "Perempuan", "Anak perempuan", "Sumber bantuan", "Alat", "Jurnal pribadi", "Dasbor Anda", "Ceritakan kisah Anda", "Kebijakan privasi", "Panduan aplikasi", "Halo, bagaimana saya bisa membantu?", "Masuk", "Percakapan baru"],
  sw: ["Kuhusu sisi", "Wanawake", "Wasichana", "Rasilimali za msaada", "Zana", "Shajara binafsi", "Dashibodi yako", "Simulia hadithi yako", "Sera ya faragha", "Mwongozo wa programu", "Habari, ninaweza kusaidiaje?", "Ingia", "Mazungumzo mapya"],
};

export function interfaceTranslation(text: string, lang: string): string | undefined {
  const index = labels.findIndex((label) => label.toLowerCase() === text.trim().toLowerCase());
  return index < 0 ? undefined : rows[lang]?.[index];
}