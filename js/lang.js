/* ===== Language engine + dictionaries =====
   To add a language later: 1) add it to `languages`
   2) add a dictionary block below. Nothing else changes. */

export const languages = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिंदी' },
  { code: 'mr', native: 'मराठी' },
];

let currentLang = localStorage.getItem('mw-lang') || 'en';

const translations = {
  en: {
    'splash.tagline': 'Your Mind, Our Priority', 'splash.getStarted': 'Get Started', 'splash.guest': 'Continue as Guest',
    'auth.title': 'Create Account', 'auth.subtitle': "Let's get you started", 'auth.name': 'Full Name', 'auth.contact': 'Email / Phone Number', 'auth.password': 'Password', 'auth.signup': 'Sign Up', 'auth.or': 'or', 'auth.google': 'Continue with Google', 'auth.phone': 'Continue with Phone', 'auth.haveAccount': 'Already have an account?', 'auth.login': 'Login',
    'otp.title': 'Verify Your Phone', 'otp.subtitle': 'Enter the OTP sent to', 'otp.verify': 'Verify', 'otp.resend': 'Resend OTP in', 'otp.change': 'Change Number',
    'welcome.title': 'Welcome', 'welcome.subtitle': 'You are all set', 'welcome.text': "Let's take a moment to understand how you feel.", 'welcome.next': 'Get Started',
    'qa.back': 'Back', 'qa.next': 'Next', 'qa.submit': 'Submit', 'qa.placeholder': 'Type here....', 'qa.error': 'Please choose an option to continue.',
    'q.mood.title': 'How are you feeling today?', 'q.mood.veryBad': 'Very Bad', 'q.mood.bad': 'Bad', 'q.mood.okay': 'Okay', 'q.mood.good': 'Good', 'q.mood.great': 'Great',
    'q.concerns.title': "What's been on your mind lately?", 'q.concerns.stress': 'Stress / Anxiety', 'q.concerns.sadness': 'Sadness / Low Mood', 'q.concerns.overthinking': 'Overthinking', 'q.concerns.relationship': 'Relationship Issues', 'q.concerns.work': 'Work / Study Pressure', 'q.concerns.other': 'Other',
    'q.stress.title': 'How often do you feel stressed?', 'q.stress.always': 'Always', 'q.stress.often': 'Often', 'q.stress.sometimes': 'Sometimes', 'q.stress.rarely': 'Rarely', 'q.stress.never': 'Never',
    'q.note.title': 'Anything else you want to share?',
    'results.title': "Here's what we understand", 'results.score': 'Your Mood Score', 'results.viewSuggestions': 'View Suggestions',
    'cat.high': 'High Stress', 'cat.moderate': 'Moderate Stress', 'cat.balanced': 'Balanced',
    'cat.high.msg': "You seem to be feeling stressed and overwhelmed. But don't worry, we're here for you 💚", 'cat.moderate.msg': 'You seem to be dealing with some pressure lately. Small steps every day will help 💚', 'cat.balanced.msg': "You seem to be in a good place right now. Let's keep it that way 💚",
    'sug.title': 'Recommended for you',
    'svc.counsellor': 'Talk to a Counsellor', 'svc.counsellor.desc': 'Book a 1:1 session with certified experts.', 'svc.meditate': 'Relax & Meditate', 'svc.meditate.desc': 'Guided sessions to calm your mind.', 'svc.mood': 'Mood Tracker', 'svc.mood.desc': 'Track your mood and see your progress.', 'svc.articles': 'Self Help Articles', 'svc.articles.desc': 'Read helpful articles on mental wellness.',
    'cou.text': 'Connect with a professional anytime you need support.', 'cou.secure': 'Confidential & Secure', 'cou.verified': 'Verified Counsellors', 'cou.avc': 'Audio / Video / Chat', 'cou.book': 'Book a Session', 'cou.view': 'View Counsellors',
    'med.text': 'Take a deep breath and relax your mind.', 'med.calm': '5 Min Calm', 'med.sleep': 'Sleep Better', 'med.anxiety': 'Anxiety Relief', 'med.start': 'Start Session', 'med.explore': 'Explore More',
    'cl.title': 'Verified Counsellors', 'cl.subtitle': 'Book a 1:1 session with a certified expert.', 'cl.sessions': 'Your upcoming sessions', 'cl.none': 'No sessions booked yet.', 'cl.login': 'Login to book & view sessions.',
    'home.how': 'How are you feeling today?', 'home.checkin': 'Daily Check-in', 'home.checkin.desc': 'Track your mood', 'home.journal': 'Journal', 'home.journal.desc': 'Write your thoughts', 'home.meditate': 'Meditate', 'home.meditate.desc': 'Relax your mind', 'home.expert': 'Talk to Expert', 'home.expert.desc': 'Get professional help', 'home.tip': 'Daily Tip',
    'greet.morning': 'Good Morning', 'greet.afternoon': 'Good Afternoon', 'greet.evening': 'Good Evening',
    'mt.week': 'This Week', 'mt.insights': 'Mood Insights', 'mt.viewHistory': 'View History', 'mt.insightOne': 'You had 1 good day this week. Keep going! 💚', 'mt.insightMany': 'You had {x} good days this week. Keep going! 💚',
    'j.title': 'Journal', 'j.entries': 'My Entries', 'j.new': 'New Entry', 'j.save': 'Save Entry', 'j.titlePh': 'Title', 'j.contentPh': 'Write your thoughts....', 'j.none': 'No entries yet. Write your first one! ✍️', 'j.delete': 'Delete', 'j.saved': 'Journal entry saved 💚', 'j.deleted': 'Entry deleted',
    'day.today': 'Today', 'day.yesterday': 'Yesterday',
    'c.title': 'Community', 'c.subtitle': 'You are not alone 💜 Connect, share and support.', 'c.ph': 'Share something supportive....', 'c.newPost': '+ New Post', 'c.posted': 'Post shared 💜', 'c.writeFirst': 'Write something supportive first 💜',
    'p.moods': 'Moods', 'p.entries': 'Entries', 'p.posts': 'Posts', 'p.guest': 'Guest User', 'p.guestMode': 'Guest mode — data stays on this device', 'p.language': 'Language', 'p.premium': 'Go Premium', 'p.logout': 'Logout',
    'nav.home': 'Home', 'nav.journal': 'Journal', 'nav.community': 'Community', 'nav.profile': 'Profile',
    'lang.title': 'Choose Language',
    'install.text': 'Install the app on your device', 'install.later': 'Later', 'install.install': 'Install',
    'toast.loggedOut': 'Logged out 👋', 'toast.installed': 'App installed 🎉', 'toast.moodSaved': 'Mood saved', 'toast.booked': 'Session booked with', 'toast.bookingFailed': 'Booking failed. Try again.', 'toast.demoBooking': 'Demo booking', 'toast.cloudFailed': 'Saved locally, cloud sync failed', 'toast.comingSoon': 'Coming in a later feature 🙂', 'toast.demoMeditate': 'Demo: meditation session starts here 🧘',
    'tip.1': "It's okay to not be okay. Small steps every day.", 'tip.2': 'Take 5 deep breaths before starting your day.', 'tip.3': 'Write down 3 things you are grateful for today.', 'tip.4': 'A short walk outside can reset your mind.', 'tip.5': 'Talk to someone you trust about your feelings.',

  },

  hi: {
    'splash.tagline': 'आपका मन, हमारी प्राथमिकता', 'splash.getStarted': 'शुरू करें', 'splash.guest': 'अतिथि के रूप में जारी रखें',
    'auth.title': 'खाता बनाएँ', 'auth.subtitle': 'चलिए शुरू करते हैं', 'auth.name': 'पूरा नाम', 'auth.contact': 'ईमेल / फ़ोन नंबर', 'auth.password': 'पासवर्ड', 'auth.signup': 'साइन अप', 'auth.or': 'या', 'auth.google': 'Google से जारी रखें', 'auth.phone': 'फ़ोन से जारी रखें', 'auth.haveAccount': 'पहले से खाता है?', 'auth.login': 'लॉगिन',
    'otp.title': 'अपने फ़ोन की पुष्टि करें', 'otp.subtitle': 'पर भेजा गया OTP दर्ज करें', 'otp.verify': 'सत्यापित करें', 'otp.resend': 'OTP फिर से भेजें', 'otp.change': 'नंबर बदलें',
    'welcome.title': 'स्वागत है', 'welcome.subtitle': 'आप तैयार हैं', 'welcome.text': 'आइए एक पल समझें कि आप कैसा महसूस कर रहे हैं।', 'welcome.next': 'शुरू करें',
    'qa.back': 'पीछे', 'qa.next': 'आगे', 'qa.submit': 'जमा करें', 'qa.placeholder': 'यहाँ लिखें....', 'qa.error': 'जारी रखने के लिए एक विकल्प चुनें।',
    'q.mood.title': 'आज आप कैसा महसूस कर रहे हैं?', 'q.mood.veryBad': 'बहुत खराब', 'q.mood.bad': 'खराब', 'q.mood.okay': 'ठीक', 'q.mood.good': 'अच्छा', 'q.mood.great': 'बहुत अच्छा',
    'q.concerns.title': 'हाल ही में आपके मन में क्या चल रहा है?', 'q.concerns.stress': 'तनाव / चिंता', 'q.concerns.sadness': 'उदासी / मन उदास', 'q.concerns.overthinking': 'ज़्यादा सोचना', 'q.concerns.relationship': 'रिश्तों की समस्याएँ', 'q.concerns.work': 'काम / पढ़ाई का दबाव', 'q.concerns.other': 'अन्य',
    'q.stress.title': 'आप कितनी बार तनाव महसूस करते हैं?', 'q.stress.always': 'हमेशा', 'q.stress.often': 'अक्सर', 'q.stress.sometimes': 'कभी-कभी', 'q.stress.rarely': 'शायद ही कभी', 'q.stress.never': 'कभी नहीं',
    'q.note.title': 'क्या आप कुछ और साझा करना चाहते हैं?',
    'results.title': 'हमें यह समझ आया है', 'results.score': 'आपका मूड स्कोर', 'results.viewSuggestions': 'सुझाव देखें',
    'cat.high': 'उच्च तनाव', 'cat.moderate': 'मध्यम तनाव', 'cat.balanced': 'संतुलित',
    'cat.high.msg': 'ऐसा लगता है कि आप तनाव और दबाव में हैं। लेकिन चिंता न करें, हम आपके साथ हैं 💚', 'cat.moderate.msg': 'लगता है आप हाल ही में कुछ दबाव से जूझ रहे हैं। हर दिन छोटे कदम मदद करेंगे 💚', 'cat.balanced.msg': 'आप अभी अच्छी स्थिति में हैं। आइए इसे ऐसे ही रखें 💚',
    'sug.title': 'आपके लिए सुझाव',
    'svc.counsellor': 'काउंसलर से बात करें', 'svc.counsellor.desc': 'प्रमाणित विशेषज्ञों के साथ 1:1 सत्र बुक करें।', 'svc.meditate': 'आराम और ध्यान', 'svc.meditate.desc': 'मन को शांत करने के लिए निर्देशित सत्र।', 'svc.mood': 'मूड ट्रैकर', 'svc.mood.desc': 'अपना मूड ट्रैक करें और प्रगति देखें।', 'svc.articles': 'स्व-सहायता लेख', 'svc.articles.desc': 'मानसिक स्वास्थ्य पर उपयोगी लेख पढ़ें।',
    'cou.text': 'जब भी सहारे की ज़रूरत हो, पेशेवर से जुड़ें।', 'cou.secure': 'गोपनीय और सुरक्षित', 'cou.verified': 'सत्यापित काउंसलर', 'cou.avc': 'ऑडियो / वीडियो / चैट', 'cou.book': 'सत्र बुक करें', 'cou.view': 'काउंसलर देखें',
    'med.text': 'गहरी साँस लें और मन को शांत करें।', 'med.calm': '5 मिनट की शांति', 'med.sleep': 'बेहतर नींद', 'med.anxiety': 'चिंता से राहत', 'med.start': 'सत्र शुरू करें', 'med.explore': 'और देखें',
    'cl.title': 'प्रमाणित काउंसलर', 'cl.subtitle': 'प्रमाणित विशेषज्ञ के साथ 1:1 सत्र बुक करें।', 'cl.sessions': 'आपके आगामी सत्र', 'cl.none': 'अभी कोई सत्र बुक नहीं हुआ।', 'cl.login': 'सत्र बुक करने और देखने के लिए लॉगिन करें।',
    'home.how': 'आज आप कैसा महसूस कर रहे हैं?', 'home.checkin': 'दैनिक चेक-इन', 'home.checkin.desc': 'अपना मूड ट्रैक करें', 'home.journal': 'डायरी', 'home.journal.desc': 'अपने विचार लिखें', 'home.meditate': 'ध्यान करें', 'home.meditate.desc': 'मन को शांत करें', 'home.expert': 'विशेषज्ञ से बात करें', 'home.expert.desc': 'पेशेवर सहायता लें', 'home.tip': 'आज का सुझाव',
    'greet.morning': 'सुप्रभात', 'greet.afternoon': 'नमस्कार', 'greet.evening': 'शुभ संध्या',
    'mt.week': 'इस सप्ताह', 'mt.insights': 'मूड की जानकारी', 'mt.viewHistory': 'इतिहास देखें', 'mt.insightOne': 'इस सप्ताह आपका 1 अच्छा दिन था। जारी रखें! 💚', 'mt.insightMany': 'इस सप्ताह आपके {x} अच्छे दिन थे। जारी रखें! 💚',
    'j.title': 'डायरी', 'j.entries': 'मेरी प्रविष्टियाँ', 'j.new': 'नई प्रविष्टि', 'j.save': 'प्रविष्टि सहेजें', 'j.titlePh': 'शीर्षक', 'j.contentPh': 'अपने विचार लिखें....', 'j.none': 'अभी कोई प्रविष्टि नहीं। पहली लिखें! ✍️', 'j.delete': 'हटाएँ', 'j.saved': 'डायरी प्रविष्टि सहेजी गई 💚', 'j.deleted': 'प्रविष्टि हटाई गई',
    'day.today': 'आज', 'day.yesterday': 'कल',
    'c.title': 'समुदाय', 'c.subtitle': 'आप अकेले नहीं हैं 💜 जुड़ें, साझा करें, समर्थन करें।', 'c.ph': 'कुछ सहारा देने वाला साझा करें....', 'c.newPost': '+ नई पोस्ट', 'c.posted': 'पोस्ट साझा की गई 💜', 'c.writeFirst': 'पहले कुछ सहारा देने वाला लिखें 💜',
    'p.moods': 'मूड', 'p.entries': 'प्रविष्टियाँ', 'p.posts': 'पोस्ट', 'p.guest': 'अतिथि उपयोगकर्ता', 'p.guestMode': 'अतिथि मोड — डेटा इसी डिवाइस पर रहेगा', 'p.language': 'भाषा', 'p.premium': 'प्रीमियम लें', 'p.logout': 'लॉग आउट',
    'nav.home': 'होम', 'nav.journal': 'डायरी', 'nav.community': 'समुदाय', 'nav.profile': 'प्रोफ़ाइल',
    'lang.title': 'भाषा चुनें',
    'install.text': 'ऐप को अपने डिवाइस पर इंस्टॉल करें', 'install.later': 'बाद में', 'install.install': 'इंस्टॉल',
    'toast.loggedOut': 'लॉग आउट हो गए 👋', 'toast.installed': 'ऐप इंस्टॉल हुआ 🎉', 'toast.moodSaved': 'मूड सहेजा गया', 'toast.booked': 'सत्र बुक हुआ', 'toast.bookingFailed': 'बुकिंग विफल। फिर प्रयास करें।', 'toast.demoBooking': 'डेमो बुकिंग', 'toast.cloudFailed': 'स्थानीय रूप से सहेजा, क्लाउड विफल', 'toast.comingSoon': 'आगामी फ़ीचर में आएगा 🙂', 'toast.demoMeditate': 'डेमो: ध्यान सत्र यहाँ शुरू होगा 🧘','tip.1': 'कभी-कभी ठीक न महसूस करना सामान्य है। हर दिन छोटे कदम।', 'tip.2': 'दिन शुरू करने से पहले 5 गहरी साँसें लें।', 'tip.3': 'आज आप जिन 3 चीज़ों के आभारी हैं, उन्हें लिखें।', 'tip.4': 'बाहर थोड़ी सैर मन को तरोताज़ा कर सकती है।', 'tip.5': 'अपनी भावनाओं के बारे में किसी भरोसेमंद व्यक्ति से बात करें।',

  },

  mr: {
    'splash.tagline': 'तुमचं मन, आमची प्राथमिकता', 'splash.getStarted': 'सुरू करा', 'splash.guest': 'पाहुणे म्हणून सुरू ठेवा',
    'auth.title': 'खाते तयार करा', 'auth.subtitle': 'चला सुरुवात करूया', 'auth.name': 'पूर्ण नाव', 'auth.contact': 'ईमेल / फोन नंबर', 'auth.password': 'पासवर्ड', 'auth.signup': 'साइन अप', 'auth.or': 'किंवा', 'auth.google': 'Google सह सुरू ठेवा', 'auth.phone': 'फोनने सुरू ठेवा', 'auth.haveAccount': 'आधीच खाते आहे का?', 'auth.login': 'लॉगिन',
    'otp.title': 'तुमचा फोन पडताळा', 'otp.subtitle': 'वर पाठवलेला OTP टाका', 'otp.verify': 'पडताळा', 'otp.resend': 'OTP पुन्हा पाठवा', 'otp.change': 'नंबर बदला',
    'welcome.title': 'स्वागत आहे', 'welcome.subtitle': 'तुम्ही तयार आहात', 'welcome.text': 'चला एक क्षण घेऊन समजून घेऊया की तुम्हाला कसे वाटते आहे.', 'welcome.next': 'सुरू करा',
    'qa.back': 'मागे', 'qa.next': 'पुढे', 'qa.submit': 'सबमिट करा', 'qa.placeholder': 'इथे लिहा....', 'qa.error': 'पुढे जाण्यासाठी एक पर्याय निवडा.',
    'q.mood.title': 'आज तुम्हाला कसे वाटते आहे?', 'q.mood.veryBad': 'खूप वाईट', 'q.mood.bad': 'वाईट', 'q.mood.okay': 'ठीक', 'q.mood.good': 'चांगले', 'q.mood.great': 'उत्तम',
    'q.concerns.title': 'अलीकडे तुमच्या मनात काय सुरू आहे?', 'q.concerns.stress': 'ताण / चिंता', 'q.concerns.sadness': 'नैराश्य / मन उदास', 'q.concerns.overthinking': 'जास्त विचार करणे', 'q.concerns.relationship': 'नात्यातील समस्या', 'q.concerns.work': 'काम / अभ्यासाचा ताण', 'q.concerns.other': 'इतर',
    'q.stress.title': 'तुम्हाला किती वेळा ताण जाणवतो?', 'q.stress.always': 'नेहमी', 'q.stress.often': 'बरेचदा', 'q.stress.sometimes': 'कधीकधी', 'q.stress.rarely': 'क्वचित', 'q.stress.never': 'कधी नाही',
    'q.note.title': 'तुम्हाला आणखी काही सांगायचे आहे का?',
    'results.title': 'आम्हाला हे समजले आहे', 'results.score': 'तुमचा मूड स्कोर', 'results.viewSuggestions': 'सूचना पहा',
    'cat.high': 'जास्त ताण', 'cat.moderate': 'मध्यम ताण', 'cat.balanced': 'संतुलित',
    'cat.high.msg': 'तुम्हाला ताण आणि दडपण जाणवते आहे असे वाटते. पण चिंता नको, आम्ही तुमच्यासोबत आहोत 💚', 'cat.moderate.msg': 'अलीकडे तुम्ही काही दडपणाशी सामना करत आहात असे वाटते. दररोज लहान पावले मदत करतील 💚', 'cat.balanced.msg': 'तुम्ही सध्या चांगल्या स्थितीत आहात. चला हे असेच टिकवूया 💚',
    'sug.title': 'तुमच्यासाठी सूचना',
    'svc.counsellor': 'समुपदेशकाशी बोला', 'svc.counsellor.desc': 'प्रमाणित तज्ज्ञांसोबत 1:1 सत्र बुक करा.', 'svc.meditate': 'शांत व्हा व ध्यान करा', 'svc.meditate.desc': 'मन शांत करण्यासाठी मार्गदर्शित सत्रे.', 'svc.mood': 'मूड ट्रॅकर', 'svc.mood.desc': 'तुमचा मूड ट्रॅक करा व प्रगती पहा.', 'svc.articles': 'स्वयं-मदत लेख', 'svc.articles.desc': 'मानसिक स्वास्थ्यावरील उपयुक्त लेख वाचा.',
    'cou.text': 'जेव्हा आधार हवा असेल तेव्हा तज्ज्ञाशी जोडले जा.', 'cou.secure': 'गोपनीय व सुरक्षित', 'cou.verified': 'पडताळलेले समुपदेशक', 'cou.avc': 'ऑडिओ / व्हिडिओ / चॅट', 'cou.book': 'सत्र बुक करा', 'cou.view': 'समुपदेशक पहा',
    'med.text': 'श्वास घ्या आणि मन शांत करा.', 'med.calm': '५ मिनिटे शांतता', 'med.sleep': 'चांगली झोप', 'med.anxiety': 'चिंतेपासून आराम', 'med.start': 'सत्र सुरू करा', 'med.explore': 'आणखी पहा',
    'cl.title': 'पडताळलेले समुपदेशक', 'cl.subtitle': 'प्रमाणित तज्ज्ञांसोबत 1:1 सत्र बुक करा.', 'cl.sessions': 'तुमची आगामी सत्रे', 'cl.none': 'अजून कोणतेही सत्र बुक केलेले नाही.', 'cl.login': 'सत्रे बुक करण्यासाठी व पाहण्यासाठी लॉगिन करा.',
    'home.how': 'आज तुम्हाला कसे वाटते आहे?', 'home.checkin': 'दैनिक चेक-इन', 'home.checkin.desc': 'तुमचा मूड ट्रॅक करा', 'home.journal': 'डायरी', 'home.journal.desc': 'तुमचे विचार लिहा', 'home.meditate': 'ध्यान करा', 'home.meditate.desc': 'मन शांत करा', 'home.expert': 'तज्ज्ञाशी बोला', 'home.expert.desc': 'व्यावसायिक मदत घ्या', 'home.tip': 'आजची टीप',
    'greet.morning': 'शुभ सकाळ', 'greet.afternoon': 'शुभ दुपार', 'greet.evening': 'शुभ संध्याकाळ',
    'mt.week': 'या आठवड्यात', 'mt.insights': 'मूड माहिती', 'mt.viewHistory': 'इतिहास पहा', 'mt.insightOne': 'या आठवड्यात तुमचा 1 चांगला दिवस होता. सुरू ठेवा! 💚', 'mt.insightMany': 'या आठवड्यात तुमचे {x} चांगले दिवस होते. सुरू ठेवा! 💚',
    'j.title': 'डायरी', 'j.entries': 'माझ्या नोंदी', 'j.new': 'नवीन नोंद', 'j.save': 'नोंद जतन करा', 'j.titlePh': 'शीर्षक', 'j.contentPh': 'तुमचे विचार लिहा....', 'j.none': 'अजून नोंदी नाहीत. पहिली लिहा! ✍️', 'j.delete': 'काडा', 'j.saved': 'डायरी नोंद जतन झाली 💚', 'j.deleted': 'नोंद काडली',
    'day.today': 'आज', 'day.yesterday': 'काल',
    'c.title': 'समुदाय', 'c.subtitle': 'तुम्ही एकटे नाही 💜 जोडले जा, शेअर करा, साथ द्या.', 'c.ph': 'काही आधार देणारे शेअर करा....', 'c.newPost': '+ नवीन पोस्ट', 'c.posted': 'पोस्ट शेअर झाली 💜', 'c.writeFirst': 'आधी काही आधार देणारे लिहा 💜',
    'p.moods': 'मूड', 'p.entries': 'नोंदी', 'p.posts': 'पोस्ट', 'p.guest': 'पाहुणे वापरकर्ता', 'p.guestMode': 'पाहुणे मोड — डेटा याच डिव्हाइसवर राहतो', 'p.language': 'भाषा', 'p.premium': 'प्रीमियम घ्या', 'p.logout': 'लॉग आउट',
    'nav.home': 'होम', 'nav.journal': 'डायरी', 'nav.community': 'समुदाय', 'nav.profile': 'प्रोफाइल',
    'lang.title': 'भाषा निवडा',
    'install.text': 'अ‍ॅप तुमच्या डिव्हाइसवर इंस्टॉल करा', 'install.later': 'नंतर', 'install.install': 'इंस्टॉल',
    'toast.loggedOut': 'लॉग आउट झाले 👋', 'toast.installed': 'अ‍ॅप इंस्टॉल झाले 🎉', 'toast.moodSaved': 'मूड जतन झाला', 'toast.booked': 'सत्र बुक झाले', 'toast.bookingFailed': 'बुकिंग अयशस्वी. पुन्हा प्रयत्न करा.', 'toast.demoBooking': 'डेमो बुकिंग', 'toast.cloudFailed': 'स्थानिक जतन, क्लाउड अयशस्वी', 'toast.comingSoon': 'पुढील फीचरमध्ये येईल 🙂', 'toast.demoMeditate': 'डेमो: ध्यान सत्र इथे सुरू होईल 🧘','tip.1': 'नेहमी बरे वाटलेच पाहिजे असे नाही; ते सामान्य आहे. दररोज लहान पावले.', 'tip.2': 'दिवस सुरू करण्यापूर्वी ५ खोल श्वास घ्या.', 'tip.3': 'आज तुम्ही ज्या ३ गोष्टींबद्दल कृतज्ञ आहात त्या लिहा.', 'tip.4': 'बाहेर थोडा फेरफटका मन ताजेतवाने करतो.', 'tip.5': 'तुमच्या भावनांबद्दल विश्वासू व्यक्तीशी बोला.',
  },
};

// ----- Engine -----
export function getLanguage() { return currentLang; }

export function t(key, vars) {
  let str = (translations[currentLang] || {})[key] || translations.en[key] || key;
  if (vars) for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, v);
  return str;
}

export function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  const cur = document.getElementById('lang-current');
  if (cur) cur.textContent = (languages.find((l) => l.code === currentLang) || {}).native || currentLang;
}

export function setLanguage(code) {
  currentLang = code;
  localStorage.setItem('mw-lang', code);
  applyLanguage();
  renderLangList();
  window.dispatchEvent(new CustomEvent('mw-language-change', { detail: code })); // app.js listens for this
}

function renderLangList() {
  const box = document.getElementById('lang-list');
  if (!box) return;
  box.innerHTML = '';
  languages.forEach((lang) => {
    const btn = document.createElement('button');
    btn.className = 'option' + (lang.code === currentLang ? ' selected' : '');
    btn.style.textAlign = 'center';
    btn.textContent = lang.native;
    btn.addEventListener('click', () => setLanguage(lang.code));
    box.appendChild(btn);
  });
}

// Auto-run when the module loads (static HTML gets translated immediately)
applyLanguage();
renderLangList();