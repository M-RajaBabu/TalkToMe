
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import { ArrowRight, Languages, MessageSquare, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const features = [
  {
    icon: Languages,
    title: "Multiple Languages",
    description: "Practice Hindi, Telugu, and English at your own pace"
  },
  {
    icon: MessageSquare,
    title: "AI Conversations",
    description: "Chat with our AI language tutor for instant feedback"
  },
  {
    icon: VolumeX,
    title: "Voice Recognition",
    description: "Speak naturally and improve your pronunciation"
  }
];

interface WelcomePageProps {
  isLoggedIn: boolean;
}

const WelcomePage = ({ isLoggedIn }: WelcomePageProps) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-8 flex flex-col items-center">
        <FadeIn>
          <img
            src="/pic_of_talk_to_me.jpg"
            alt={t('TalkToMe Logo')}
            className="w-28 h-28 mb-4 rounded-full shadow-lg object-cover animate-fade-in-scale"
            style={{ animation: 'fadeInScale 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </FadeIn>
        <h1 className="text-4xl font-bold mb-2 text-primary">{t('TalkToMe')}</h1>
        <p className="text-lg text-muted-foreground mb-6 text-center">{t('Your AI language learning companion. Practice, learn, and chat in your favorite language!')}</p>
        <div className="flex flex-col gap-3 w-full mb-6">
          <Button asChild size="lg" className="w-full">
            <Link to="/login">{t('Log in')}</Link>
            </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/signup">{t('Create account')}</Link>
            </Button>
          </div>
      </div>
    </div>
  );
};

export default WelcomePage;
