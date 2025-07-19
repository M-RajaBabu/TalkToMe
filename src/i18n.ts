import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'TalkToMe': 'TalkToMe',
      'Log in': 'Log in',
      'Create account': 'Create account',
      'Choose Language': 'Choose Language',
      'Go to Chat': 'Go to Chat',
      'Explore Chapters': 'Explore Chapters',
      'Settings': 'Settings',
      'Chat': 'Chat',
      'Chapters': 'Chapters',
      'Change Language': 'Change Language',
      'Your AI language learning companion. Practice, learn, and chat in your favorite language!': 'Your AI language learning companion. Practice, learn, and chat in your favorite language!',
      'Reset Progress': 'Reset Progress',
      'Export Practice History': 'Export Practice History',
      'Delete Account': 'Delete Account',
      'Back': 'Back',
      'Progress & Data': 'Progress & Data',
      'App Preference': 'App Preference',
      'Account': 'Account',
      'Theme': 'Theme',
      'Choose between light and dark': 'Choose between light and dark',
      'Are you sure you want to delete your account and all your data? This action cannot be undone.': 'Are you sure you want to delete your account and all your data? This action cannot be undone.'
    }
  },
  hi: {
    translation: {
      'TalkToMe': 'टॉक टू मी',
      'Log in': 'लॉग इन करें',
      'Create account': 'खाता बनाएं',
      'Choose Language': 'भाषा चुनें',
      'Go to Chat': 'चैट पर जाएं',
      'Explore Chapters': 'अध्याय देखें',
      'Settings': 'सेटिंग्स',
      'Chat': 'चैट',
      'Chapters': 'अध्याय',
      'Change Language': 'भाषा बदलें',
      'Your AI language learning companion. Practice, learn, and chat in your favorite language!': 'आपका एआई भाषा साथी। अपनी पसंदीदा भाषा में अभ्यास करें, सीखें और चैट करें!',
      'Reset Progress': 'प्रगति रीसेट करें',
      'Export Practice History': 'अभ्यास इतिहास निर्यात करें',
      'Delete Account': 'खाता हटाएं',
      'Back': 'वापस',
      'Progress & Data': 'प्रगति और डेटा',
      'App Preference': 'ऐप वरीयता',
      'Account': 'खाता',
      'Theme': 'थीम',
      'Choose between light and dark': 'लाइट और डार्क में से चुनें',
      'Are you sure you want to delete your account and all your data? This action cannot be undone.': 'क्या आप वाकई अपना खाता और सभी डेटा हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।'
    }
  },
  te: {
    translation: {
      'TalkToMe': 'టాక్ టు మీ',
      'Log in': 'లాగిన్ చేయండి',
      'Create account': 'ఖాతా సృష్టించండి',
      'Choose Language': 'భాషను ఎంచుకోండి',
      'Go to Chat': 'చాట్‌కు వెళ్లండి',
      'Explore Chapters': 'అధ్యాయాలను అన్వేషించండి',
      'Settings': 'సెట్టింగ్స్',
      'Chat': 'చాట్',
      'Chapters': 'అధ్యాయాలు',
      'Change Language': 'భాషను మార్చండి',
      'Your AI language learning companion. Practice, learn, and chat in your favorite language!': 'మీ AI భాషా సహచరుడు. మీ ఇష్టమైన భాషలో అభ్యాసం చేయండి, నేర్చుకోండి మరియు చాట్ చేయండి!',
      'Reset Progress': 'ప్రగతిని రీసెట్ చేయండి',
      'Export Practice History': 'అభ్యాస చరిత్రను ఎగుమతి చేయండి',
      'Delete Account': 'ఖాతాను తొలగించండి',
      'Back': 'వెనక్కి',
      'Progress & Data': 'ప్రగతి & డేటా',
      'App Preference': 'యాప్ ప్రాధాన్యత',
      'Account': 'ఖాతా',
      'Theme': 'థీమ్',
      'Choose between light and dark': 'లైట్ మరియు డార్క్ మధ్య ఎంచుకోండి',
      'Are you sure you want to delete your account and all your data? This action cannot be undone.': 'మీరు ఖచ్చితంగా మీ ఖాతా మరియు అన్ని డేటాను తొలగించాలనుకుంటున్నారా? ఈ చర్యను రద్దు చేయలేరు.'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n; 