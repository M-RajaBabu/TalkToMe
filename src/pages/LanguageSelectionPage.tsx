
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DifficultySelector from "@/components/ui/difficulty-selector";
import LanguageCard from "@/components/ui/language-card";
import { DifficultyLevel, Language, LanguagePreference } from "@/types";
import { ArrowRight, Globe, Languages, Sparkles, Target, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import { useTranslation } from 'react-i18next';

const languages: Language[] = [
  "Hindi",
  "Telugu",
  "Kannada",
  "Tamil",
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Russian",
  "Arabic",
  "Portuguese",
  "Italian",
  "Korean"
];

// Native language text for different sections
const nativeText = {
  hindi: {
    title: "अपनी भाषाएं चुनें",
    subtitle: "अपनी मातृभाषा और सीखने वाली भाषा चुनें। हम आपके लिए एक व्यक्तिगत सीखने का अनुभव बनाएंगे।",
    sourceTitle: "मैं बोलता हूं",
    sourceSubtitle: "अपनी मातृभाषा चुनें",
    targetTitle: "मैं सीखना चाहता हूं",
    targetSubtitle: "अपनी लक्ष्य भाषा चुनें",
    levelTitle: "सीखने का स्तर",
    levelSubtitle: "अपना अनुभव स्तर चुनें",
    startButton: "सीखने की यात्रा शुरू करें",
    exploreButton: "अध्याय देखें",
    errorMessage: "स्रोत और लक्ष्य भाषाएं अलग होनी चाहिए"
  },
  telugu: {
    title: "మీ భాషలను ఎంచుకోండి",
    subtitle: "మీ మాతృభాష మరియు నేర్చుకోవాలనుకునే భాషను ఎంచుకోండి. మేము మీ కోసం వ్యక్తిగతీకరించిన అభ్యాస అనుభవాన్ని సృష్టిస్తాము.",
    sourceTitle: "నేను మాట్లాడతాను",
    sourceSubtitle: "మీ మాతృభాషను ఎంచుకోండి",
    targetTitle: "నేను నేర్చుకోవాలనుకుంటున్నాను",
    targetSubtitle: "మీ లక్ష్య భాషను ఎంచుకోండి",
    levelTitle: "అభ్యాస స్థాయి",
    levelSubtitle: "మీ అనుభవ స్థాయిని ఎంచుకోండి",
    startButton: "అభ్యాస ప్రయాణాన్ని ప్రారంభించండి",
    exploreButton: "అధ్యాయాలను అన్వేషించండి",
    errorMessage: "మూల మరియు లక్ష్య భాషలు వేర్వేరుగా ఉండాలి"
  },
  kannada: {
    title: "ನಿಮ್ಮ ಭಾಷೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    subtitle: "ನಿಮ್ಮ ಮಾತೃಭಾಷೆ ಮತ್ತು ಕಲಿಯಲು ಬಯಸುವ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ನಾವು ನಿಮಗಾಗಿ ವೈಯಕ್ತಿಕ ಕಲಿಕೆಯ ಅನుಭವವನ್ನು ರಚಿಸುತ್ತೇವೆ.",
    sourceTitle: "ನಾನು ಮಾತನಾಡುತ್ತೇನೆ",
    sourceSubtitle: "ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    targetTitle: "ನಾನು ಕಲಿಯಲು ಬಯಸುತ್ತೇನೆ",
    targetSubtitle: "ನಿಮ್ಮ ಗುರಿ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    levelTitle: "ಕಲಿಕೆಯ ಮಟ್ಟ",
    levelSubtitle: "ನಿಮ್ಮ ಅನుಭವದ ಮಟ್ಟವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    startButton: "ಕಲಿಕೆಯ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ",
    exploreButton: "ಅಧ್ಯಾಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    errorMessage: "ಮೂಲ ಮತ್ತು ಗುರಿ ಭಾಷೆಗಳು ವಿಭಿನ್ನವಾಗಿರಬೇಕು"
  },
  tamil: {
    title: "உங்கள் மொழிகளைத் தேர்ந்தெடுக்கவும்",
    subtitle: "உங்கள் தாய்மொழி மற்றும் கற்க விரும்பும் மொழியைத் தேர்ந்தெடுக்கவும். நாங்கள் உங்களுக்காக தனிப்பட்ட கற்றல் அனுபவத்தை உருவாக்குவோம்.",
    sourceTitle: "நான் பேசுகிறேன்",
    sourceSubtitle: "உங்கள் தாய்மொழியைத் தேர்ந்தெடுக்கவும்",
    targetTitle: "நான் கற்க விரும்புகிறேன்",
    targetSubtitle: "உங்கள் இலக்கு மொழியைத் தேர்ந்தெடுக்கவும்",
    levelTitle: "கற்றல் நிலை",
    levelSubtitle: "உங்கள் அனுபவ நிலையைத் தேர்ந்தெடுக்கவும்",
    startButton: "கற்றல் பயணத்தைத் தொடங்கவும்",
    exploreButton: "அத்தியாயங்களை ஆராயவும்",
    errorMessage: "மூல மற்றும் இலக்கு மொழிகள் வேறுபட்டவையாக இருக்க வேண்டும்"
  },
  english: {
    title: "Choose Your Languages",
    subtitle: "Select your native language and the language you want to learn. We'll create a personalized learning experience just for you.",
    sourceTitle: "I speak",
    sourceSubtitle: "Select your native language",
    targetTitle: "I want to learn",
    targetSubtitle: "Choose your target language",
    levelTitle: "Learning Level",
    levelSubtitle: "Choose your experience level",
    startButton: "Start Learning Journey",
    exploreButton: "Explore Chapters",
    errorMessage: "Source and target languages must be different"
  }
};

const LanguageSelectionPage = () => {
  const [sourceLanguage, setSourceLanguage] = useState<Language | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>("Beginner");
  const [activeSection, setActiveSection] = useState<'source' | 'target'>('source');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Get native text based on current interface language
  const getNativeText = () => {
    switch (i18n.language) {
      case 'hi':
        return nativeText.hindi;
      case 'te':
        return nativeText.telugu;
      case 'kn':
        return nativeText.kannada;
      case 'ta':
        return nativeText.tamil;
      default:
        return nativeText.english;
    }
  };
  
  const nativeTextData = getNativeText();
  
  const isSelectionComplete = sourceLanguage && targetLanguage && sourceLanguage !== targetLanguage;
  
  const handleSourceLanguageSelect = (language: Language) => {
    setSourceLanguage(language);
    setActiveSection('target');
    
    // If same language is selected for both, reset target language
    if (language === targetLanguage) {
      setTargetLanguage(null);
    }
  };
  
  const handleTargetLanguageSelect = (language: Language) => {
    setTargetLanguage(language);
    
    // If same language is selected for both, reset source language
    if (language === sourceLanguage) {
      setSourceLanguage(null);
    }
  };
  
  const handleContinue = () => {
    if (!sourceLanguage || !targetLanguage) return;
    
    // Save language preference to local storage
    const languagePreference: LanguagePreference = {
      sourceLanguage,
      targetLanguage,
      difficultyLevel,
    };
    
    localStorage.setItem('languagePreference', JSON.stringify(languagePreference));
    console.log("Selected language preference:", languagePreference);
    
    // Navigate to chat page
    navigate('/chat');
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col p-6 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <FadeIn>
          <div className="text-center mb-8 mt-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-full border border-border/50 shadow-lg mb-6">
              <Globe className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold gradient-text">{nativeTextData.title}</h1>
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              {nativeTextData.subtitle}
            </p>
          </div>
        </FadeIn>

        {/* Language Selection Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Source Language Section */}
          <FadeIn delay={100}>
            <Card className="modern-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{nativeTextData.sourceTitle}</h2>
                  <p className="text-sm text-muted-foreground">{nativeTextData.sourceSubtitle}</p>
                </div>
                {sourceLanguage && (
                  <div className="ml-auto w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languages.map((language) => {
                  console.log(`Rendering language: ${language}`); // Debug log
                  return (
                    <LanguageCard
                      key={`source-${language}`}
                      language={language}
                      selected={sourceLanguage === language}
                      onClick={() => handleSourceLanguageSelect(language)}
                      type="source"
                      className="h-24"
                    />
                  );
                })}
              </div>
            </Card>
          </FadeIn>

          {/* Target Language Section */}
          <FadeIn delay={200}>
            <Card className="modern-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{nativeTextData.targetTitle}</h2>
                  <p className="text-sm text-muted-foreground">{nativeTextData.targetSubtitle}</p>
                </div>
                {targetLanguage && (
                  <div className="ml-auto w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languages.map((language) => {
                  console.log(`Rendering target language: ${language}`); // Debug log
                  return (
                    <LanguageCard
                      key={`target-${language}`}
                      language={language}
                      selected={targetLanguage === language}
                      onClick={() => handleTargetLanguageSelect(language)}
                      disabled={sourceLanguage === language}
                      type="target"
                      className="h-24"
                    />
                  );
                })}
              </div>
            </Card>
          </FadeIn>
        </div>

        {/* Difficulty Selection */}
        <SlideUp delay={300}>
          <Card className="modern-card p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{nativeTextData.levelTitle}</h3>
                <p className="text-sm text-muted-foreground">{nativeTextData.levelSubtitle}</p>
              </div>
            </div>
            <DifficultySelector
              value={difficultyLevel}
              onChange={setDifficultyLevel}
            />
          </Card>
        </SlideUp>

        {/* Selection Summary */}
        {isSelectionComplete && (
          <FadeIn delay={400}>
            <Card className="modern-card p-6 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {sourceLanguage?.charAt(0)}
                    </div>
                    <span className="font-medium">{sourceLanguage}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      {targetLanguage?.charAt(0)}
                    </div>
                    <span className="font-medium">{targetLanguage}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Level: {difficultyLevel}
                </div>
              </div>
            </Card>
          </FadeIn>
        )}

        {/* Action Buttons */}
        <div className="mt-auto space-y-4">
          <Button
            disabled={!isSelectionComplete}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleContinue}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {nativeTextData.startButton}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          {isSelectionComplete && (
            <Button 
              variant="outline"
              className="w-full h-12 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300" 
              onClick={() => navigate('/chapters', { state: { language: targetLanguage, sourceLanguage } })}
            >
              <Languages className="mr-2 h-5 w-5" />
              {nativeTextData.exploreButton} for {targetLanguage}
            </Button>
          )}
          
          {!isSelectionComplete && sourceLanguage === targetLanguage && (
            <div className="text-center p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-medium">
                ⚠️ {nativeTextData.errorMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionPage;
