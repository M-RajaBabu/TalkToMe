import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { ChevronLeft } from 'lucide-react';

// Example chapter data structure
const chaptersData: Record<string, Array<{ title: string; level: string; description: string }>> = {
  English: [
    { title: "Greetings", level: "Basic", description: "Learn how to greet people and introduce yourself." },
    { title: "Numbers", level: "Basic", description: "Learn numbers and counting." },
    { title: "Daily Life", level: "Basic", description: "Common phrases for everyday situations." },
    { title: "Travel", level: "Intermediate", description: "Essential language for travel and directions." },
    { title: "Food & Dining", level: "Intermediate", description: "Ordering food and talking about meals." },
    { title: "Culture & Customs", level: "Advanced", description: "Understanding cultural norms and idioms." },
  ],
  Spanish: [
    { title: "Saludos", level: "Basic", description: "Aprende a saludar y presentarte." },
    { title: "Números", level: "Basic", description: "Aprende los números y a contar." },
    { title: "Vida Diaria", level: "Basic", description: "Frases comunes para situaciones cotidianas." },
    { title: "Viajes", level: "Intermediate", description: "Lenguaje esencial para viajar y pedir direcciones." },
    { title: "Comida y Restaurantes", level: "Intermediate", description: "Pedir comida y hablar de comidas." },
    { title: "Cultura y Costumbres", level: "Advanced", description: "Comprender normas culturales y modismos." },
  ],
  French: [
    { title: "Salutations", level: "Basic", description: "Apprenez à saluer et à vous présenter." },
    { title: "Nombres", level: "Basic", description: "Apprenez les nombres et à compter." },
    { title: "Vie Quotidienne", level: "Basic", description: "Phrases courantes pour la vie de tous les jours." },
    { title: "Voyages", level: "Intermediate", description: "Langage essentiel pour voyager et demander son chemin." },
    { title: "Nourriture et Restaurants", level: "Intermediate", description: "Commander à manger et parler des repas." },
    { title: "Culture et Coutumes", level: "Advanced", description: "Comprendre les normes culturelles et les idiomes." },
  ],
  German: [
    { title: "Begrüßungen", level: "Basic", description: "Lernen Sie, wie man grüßt und sich vorstellt." },
    { title: "Zahlen", level: "Basic", description: "Lernen Sie Zahlen und das Zählen." },
    { title: "Alltag", level: "Basic", description: "Häufige Sätze für den Alltag." },
    { title: "Reisen", level: "Intermediate", description: "Wichtige Sprache für Reisen und Wegbeschreibungen." },
    { title: "Essen & Trinken", level: "Intermediate", description: "Essen bestellen und über Mahlzeiten sprechen." },
    { title: "Kultur & Bräuche", level: "Advanced", description: "Kulturelle Normen und Redewendungen verstehen." },
  ],
  Chinese: [
    { title: "问候", level: "Basic", description: "学习如何打招呼和自我介绍。" },
    { title: "数字", level: "Basic", description: "学习数字和计数。" },
    { title: "日常生活", level: "Basic", description: "日常情景常用语。" },
    { title: "旅行", level: "Intermediate", description: "旅行和问路的必备语言。" },
    { title: "饮食", level: "Intermediate", description: "点餐和谈论饮食。" },
    { title: "文化与习俗", level: "Advanced", description: "了解文化规范和成语。" },
  ],
  Japanese: [
    { title: "挨拶", level: "Basic", description: "挨拶や自己紹介を学びましょう。" },
    { title: "数字", level: "Basic", description: "数字と数え方を学びましょう。" },
    { title: "日常生活", level: "Basic", description: "日常の場面で使う表現。" },
    { title: "旅行", level: "Intermediate", description: "旅行や道案内のための表現。" },
    { title: "食事", level: "Intermediate", description: "食事の注文や食べ物について話す。" },
    { title: "文化と習慣", level: "Advanced", description: "文化的な規範や慣用句を理解する。" },
  ],
  Russian: [
    { title: "Приветствия", level: "Basic", description: "Научитесь приветствовать и представляться." },
    { title: "Числа", level: "Basic", description: "Учитесь числам и счету." },
    { title: "Повседневная жизнь", level: "Basic", description: "Фразы для повседневных ситуаций." },
    { title: "Путешествия", level: "Intermediate", description: "Язык для путешествий и указания пути." },
    { title: "Еда и рестораны", level: "Intermediate", description: "Заказ еды и разговоры о еде." },
    { title: "Культура и обычаи", level: "Advanced", description: "Понимание культурных норм и идиом." },
  ],
  Arabic: [
    { title: "التحيات", level: "Basic", description: "تعلم كيفية التحية والتعريف بالنفس." },
    { title: "الأرقام", level: "Basic", description: "تعلم الأرقام والعد." },
    { title: "الحياة اليومية", level: "Basic", description: "عبارات شائعة لمواقف الحياة اليومية." },
    { title: "السفر", level: "Intermediate", description: "اللغة الأساسية للسفر وطلب الاتجاهات." },
    { title: "الطعام والمطاعم", level: "Intermediate", description: "طلب الطعام والتحدث عن الوجبات." },
    { title: "الثقافة والعادات", level: "Advanced", description: "فهم الأعراف الثقافية والتعابير الاصطلاحية." },
  ],
  Portuguese: [
    { title: "Saudações", level: "Basic", description: "Aprenda a cumprimentar e se apresentar." },
    { title: "Números", level: "Basic", description: "Aprenda números e a contar." },
    { title: "Vida Diária", level: "Basic", description: "Frases comuns para o dia a dia." },
    { title: "Viagem", level: "Intermediate", description: "Linguagem essencial para viagens e direções." },
    { title: "Comida e Restaurantes", level: "Intermediate", description: "Pedir comida e falar sobre refeições." },
    { title: "Cultura e Costumes", level: "Advanced", description: "Compreender normas culturais e expressões idiomáticas." },
  ],
  Italian: [
    { title: "Saluti", level: "Basic", description: "Impara a salutare e a presentarti." },
    { title: "Numeri", level: "Basic", description: "Impara i numeri e a contare." },
    { title: "Vita Quotidiana", level: "Basic", description: "Frasi comuni per la vita di tutti i giorni." },
    { title: "Viaggi", level: "Intermediate", description: "Linguaggio essenziale per viaggiare e chiedere indicazioni." },
    { title: "Cibo e Ristoranti", level: "Intermediate", description: "Ordinare cibo e parlare dei pasti." },
    { title: "Cultura e Costumi", level: "Advanced", description: "Comprendere le norme culturali e le espressioni idiomatiche." },
  ],
  Korean: [
    { title: "인사", level: "Basic", description: "인사하는 방법과 자기소개를 배워보세요." },
    { title: "숫자", level: "Basic", description: "숫자와 세는 법을 배워보세요." },
    { title: "일상 생활", level: "Basic", description: "일상에서 자주 쓰는 표현." },
    { title: "여행", level: "Intermediate", description: "여행과 길 찾기에 필요한 언어." },
    { title: "음식과 식사", level: "Intermediate", description: "음식 주문과 식사에 대해 말하기." },
    { title: "문화와 관습", level: "Advanced", description: "문화적 규범과 관용구 이해하기." },
  ],
  Hindi: [
    { title: "अभिवादन", level: "Basic", description: "नमस्ते कहना और अपना परिचय देना सीखें।" },
    { title: "संख्या", level: "Basic", description: "संख्याएँ और गिनती सीखें।" },
    { title: "दैनिक जीवन", level: "Basic", description: "रोजमर्रा की स्थितियों के लिए सामान्य वाक्यांश।" },
    { title: "यात्रा", level: "Intermediate", description: "यात्रा और दिशा-निर्देशों के लिए आवश्यक भाषा।" },
    { title: "खाना और भोजन", level: "Intermediate", description: "खाना ऑर्डर करना और भोजन के बारे में बात करना।" },
    { title: "संस्कृति और रीति-रिवाज", level: "Advanced", description: "संस्कृतिक मानदंडों और मुहावरों को समझना।" },
  ],
  Telugu: [
    { title: "అభివాదనలు", level: "Basic", description: "అభివాదాలు చెప్పడం మరియు పరిచయం చేయడం నేర్చుకోండి." },
    { title: "సంఖ్యలు", level: "Basic", description: "సంఖ్యలు మరియు లెక్కింపు నేర్చుకోండి." },
    { title: "దైనందిన జీవితం", level: "Basic", description: "ప్రతిరోజూ ఉపయోగించే పదబంధాలు." },
    { title: "ప్రయాణం", level: "Intermediate", description: "ప్రయాణం మరియు దారి చెప్పడంలో అవసరమైన భాష." },
    { title: "ఆహారం మరియు భోజనం", level: "Intermediate", description: "ఆహారం ఆర్డర్ చేయడం మరియు భోజనంపై మాట్లాడడం." },
    { title: "సంస్కృతి మరియు ఆచారాలు", level: "Advanced", description: "సాంస్కృతిక ప్రమాణాలు మరియు నుడిపదాలు అర్థం చేసుకోండి." },
  ],
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

function speakText(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}
function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function cleanMarkdown(text: string) {
  // Remove **, __, *, _, and extra markdown
  return text.replace(/\*\*|__|\*|_/g, "").replace(/^#+\s?/gm, "");
}

const parseTheory = (theory: string) => {
  // Try to split by sections (e.g., ## Heading or numbered parts)
  const parts = theory.split(/(?:^|\n)(#+\s|\d+\.\s)/).filter(Boolean);
  // Group into [heading, content] pairs
  const sections = [];
  for (let i = 0; i < parts.length; i += 2) {
    const heading = parts[i].replace(/^#+\s|\d+\.\s/, "").trim();
    const content = parts[i + 1] ? parts[i + 1].trim() : "";
    sections.push({ heading, content });
  }
  return sections.length ? sections : [{ heading: "Theory", content: theory }];
};

const ChaptersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = (location.state && location.state.language) || "English";
  const chapters = chaptersData[language] || [];
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [theory, setTheory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [translations, setTranslations] = useState<Record<number, string>>({});
  const [translating, setTranslating] = useState<Record<number, boolean>>({});
  const sourceLanguage = (location.state && location.state.sourceLanguage) || "English";

  useEffect(() => {
    if (selectedChapter !== null) {
      setTheory("");
      setError("");
      setLoading(true);
      const chapter = chapters[selectedChapter];
      // Improved prompt for bilingual headings
      const prompt = `You are an expert language teacher and textbook author. Write a clean, well-structured, and natural-sounding lesson for the chapter '${chapter.title}' (${chapter.level}) in ${language}. For each section, provide the heading in both ${sourceLanguage} and ${language}, separated by a slash (e.g., 'Greetings / Saludos'). The lesson should be divided into clear sections: Introduction, Key Phrases (with bullet points), Grammar (with explanations), and Examples (with sentences). Use markdown headings (##) for each section, but do NOT use any markdown bold/italic or asterisks in the content. Make it look like a real textbook chapter, not an AI answer.`;
      fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      })
        .then(res => res.json())
        .then(data => {
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          setTheory(text);
        })
        .catch(() => setError("Failed to load chapter theory. Please try again."))
        .finally(() => setLoading(false));
    }
  }, [selectedChapter, language, chapters, sourceLanguage]);

  const hasChapters = chapters.length > 0;

  const fetchTranslation = async (text: string, idx: number) => {
    setTranslating(t => ({ ...t, [idx]: true }));
    setTranslations(t => ({ ...t, [idx]: "" }));
    const prompt = `Translate the following text from ${language} to ${sourceLanguage} in a clear, natural way.\nText: ${text}`;
    try {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const translation = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setTranslations(t => ({ ...t, [idx]: cleanMarkdown(translation) }));
    } catch {
      setTranslations(t => ({ ...t, [idx]: "Translation failed." }));
    } finally {
      setTranslating(t => ({ ...t, [idx]: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-primary font-bold hover:underline focus:outline-none"
        aria-label="Go back"
      >
        <ChevronLeft className="h-5 w-5" /> Back
      </button>
      <div className="w-full flex justify-end mb-2">
        <Link to="/quiz">
          <Button variant="outline">Take Quiz</Button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">{language} Chapters</h1>
      {!hasChapters && (
        <div className="w-full max-w-md text-center text-muted-foreground mb-8">
          <p>No chapters available for {language} yet. Stay tuned for updates!</p>
        </div>
      )}
      {hasChapters && selectedChapter === null ? (
        <div className="w-full max-w-md space-y-4">
          {chapters.map((chapter, idx) => (
            <Button
              key={chapter.title}
              className="w-full flex flex-col items-start p-6 mb-2 rounded-2xl shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-left text-white border-0 transition-all"
              variant="default"
              onClick={() => setSelectedChapter(idx)}
              style={{ minHeight: '80px', alignItems: 'flex-start' }}
            >
              <span className="font-bold text-lg leading-tight mb-1 w-full">{chapter.title} <span className="text-xs font-normal ml-2 opacity-80">({chapter.level})</span></span>
              <span className="text-sm opacity-90 w-full">{chapter.description}</span>
            </Button>
          ))}
        </div>
      ) : hasChapters && selectedChapter !== null ? (
        <div className="w-full max-w-md">
          <Button variant="ghost" onClick={() => setSelectedChapter(null)} className="mb-4">Back to Chapters</Button>
          <div className="p-6 border rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">{chapters[selectedChapter].title}</h2>
            <p className="mb-2">Level: {chapters[selectedChapter].level}</p>
            <p className="mb-4">{chapters[selectedChapter].description}</p>
            {loading && <div className="text-center text-muted-foreground">Loading theory...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            {!loading && !error && theory && (
              <div className="space-y-6">
                {parseTheory(theory).map((section, idx) => {
                  const [heading1, heading2] = cleanMarkdown(section.heading).split("/").map(h => h.trim());
                  return (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 shadow-inner">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                        <h3 className="text-lg font-semibold text-primary flex-1">
                          {heading1}
                          {heading2 && (
                            <span className="ml-2 text-base text-muted-foreground font-normal">/ {heading2}</span>
                          )}
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => speakText(cleanMarkdown(section.content))}
                            onDoubleClick={stopSpeaking}
                            title="Click to listen, double-click to mute"
                          >
                            Listen
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={translating[idx]}
                            onClick={() => fetchTranslation(section.content, idx)}
                          >
                            {translating[idx] ? `Translating...` : `Show in ${sourceLanguage}`}
                          </Button>
                        </div>
                      </div>
                      <div className="whitespace-pre-line text-base text-gray-800 mb-2">{cleanMarkdown(section.content)}</div>
                      {translations[idx] && (
                        <div className="bg-white border rounded p-2 text-sm text-gray-700">
                          <strong>Translation:</strong> {translations[idx]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChaptersPage; 