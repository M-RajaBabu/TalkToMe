
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DifficultySelector from "@/components/ui/difficulty-selector";
import LanguageCard from "@/components/ui/language-card";
import { DifficultyLevel, Language, LanguagePreference } from "@/types";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import { useTranslation } from 'react-i18next';

const languages: Language[] = [
  "Hindi",
  "Telugu",
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

const LanguageSelectionPage = () => {
  const [sourceLanguage, setSourceLanguage] = useState<Language | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>("Beginner");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const interfaceLanguages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'te', label: 'తెలుగు' },
  ];
  
  const isSelectionComplete = sourceLanguage && targetLanguage && sourceLanguage !== targetLanguage;
  
  const handleSourceLanguageSelect = (language: Language) => {
    setSourceLanguage(language);
    
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
    <div className="min-h-screen flex flex-col p-4 max-w-md mx-auto">
      <FadeIn>
        <h1 className="text-2xl font-bold mt-8 mb-6">Choose your languages</h1>
      </FadeIn>
      
      <FadeIn delay={100}>
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3">I speak:</h2>
          <div className="grid grid-cols-3 gap-4">
            {languages.map((language) => (
              <LanguageCard
                key={`source-${language}`}
                language={language}
                selected={sourceLanguage === language}
                onClick={() => handleSourceLanguageSelect(language)}
                className={
                  (sourceLanguage === language
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white') +
                  ' transition-colors duration-150'
                }
              />
            ))}
          </div>
        </div>
      </FadeIn>
      
      <FadeIn delay={200}>
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3">I want to learn:</h2>
          <div className="grid grid-cols-3 gap-4">
            {languages.map((language) => (
              <LanguageCard
                key={`target-${language}`}
                language={language}
                selected={targetLanguage === language}
                onClick={() => handleTargetLanguageSelect(language)}
                // Disable selecting same language for source and target
                className={
                  (targetLanguage === language
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white') +
                  ' transition-colors duration-150' +
                  (sourceLanguage === language ? ' opacity-50 pointer-events-none' : '')
                }
              />
            ))}
          </div>
        </div>
      </FadeIn>
      
      <SlideUp delay={300}>
        <Card className="p-4 mb-8">
          <DifficultySelector
            value={difficultyLevel}
            onChange={setDifficultyLevel}
          />
        </Card>
      </SlideUp>
      
      <div className="mt-auto">
        <Button
          disabled={!isSelectionComplete}
          className="w-full"
          size="lg"
          onClick={handleContinue}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        {isSelectionComplete && (
          <Button className="w-full mt-4" onClick={() => navigate('/chapters', { state: { language: targetLanguage, sourceLanguage } })}>
            Explore Chapters for {targetLanguage}
          </Button>
        )}
        
        {!isSelectionComplete && sourceLanguage === targetLanguage && (
          <p className="text-sm text-destructive mt-2 text-center">
            Source and target languages must be different
          </p>
        )}
      </div>
    </div>
  );
};

export default LanguageSelectionPage;
