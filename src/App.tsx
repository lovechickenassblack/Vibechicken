import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { localAI, LocalAIStatus } from './services/localAIService';
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Heart, ShieldAlert, Sparkles, Loader2, BookOpen, Book, Layers,
  CheckCircle2, XCircle, Info, MessageCircle, Send, User, 
  Bot, ChevronRight, Globe, FileText, Zap, X, Image as ImageIcon,
  ExternalLink, Quote, Eye, BarChart3, AlertTriangle, Calendar,
  Users, Percent, ShieldCheck, Download, Smartphone, HelpCircle,
  Copy, Check, RefreshCw, Menu, Share2, MessageSquare, AlertCircle, Plus, Compass, Volume2, Mic, Brain, ArrowRight, Trash2, Settings, History, Ban, BookX, Target, Moon, Sun, Leaf, Link as LinkIcon
} from "lucide-react";
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface SafetyCheckDetail {
  pass: boolean;
  description: string;
  evidenceChapter: string;
  evidenceDetails: string;
}

interface LightNovelInfo {
  exists: boolean;
  title?: string;
  status?: string;
  volumes?: string;
  differencesFromManga?: string;
  cozinessComparison?: string;
  safetyWarnings?: string;
  panicTriggers?: string;
  adaptationStatus?: string;
  endingVibe?: string;
  sideStories?: string;
  characterDevelopment?: string;
  worldBuilding?: string;
  roadmap?: {
    volume: string;
    summary: string;
    vibe: 'comfy' | 'tense' | 'warning';
    detailedEvents: string;
    safetyNotes: string;
    verdict: string;
  }[];
}

interface VibeReport {
  name: string;
  type: string;
  year: string;
  mcs: { male: string; female: string };
  focusPercentage: number;
  safetyScore: number;
  ruleImpactAnalysis: string;
  summary: string;
  score: number;
  volumes: string;
  chapters?: string;
  cozinessLevel: string;
  cozinessAnalysis: string;
  relationshipDynamic?: string;
  vibeTags?: string[];
  sideCharacterTreatment?: string;
  userPreferenceAlignment?: string;
  potentialDislikes?: { factor: string; description: string; severity: string; chapter?: string }[];
  comfortReason?: string;
  comfortEvidence?: string;
  plotSummary?: string;
  panicTriggers?: string;
  lightNovel?: LightNovelInfo;
  safetyChecks: {
    deaths: SafetyCheckDetail;
    loveTriangles: SafetyCheckDetail;
    sidelining: SafetyCheckDetail;
    trauma: SafetyCheckDetail;
    sexualization: SafetyCheckDetail;
    pastRelationships: SafetyCheckDetail;
    indirectRomance: SafetyCheckDetail;
    teenRomance: SafetyCheckDetail;
    preEstablished: SafetyCheckDetail;
    heavyDrama: SafetyCheckDetail;
    bullying: SafetyCheckDetail;
    equalPOV: SafetyCheckDetail;
    straightRomance: SafetyCheckDetail;
    noEmotionalTrauma: SafetyCheckDetail;
  };
  checks: {
    label: string;
    status: 'pass' | 'fail' | 'neutral';
    details: string;
    proof?: string;
  }[];
  proofs: {
    chapter: string;
    action: string;
    who: string;
    whyILike: string;
    absoluteProof: string;
  }[];
  verdict: string;
  warnings: string;
  citations?: { title: string; url: string }[];
  chapterRoadmap: {
    range: string;
    vibe: 'comfy' | 'tense' | 'warning';
    summary: string;
    likes: string;
    dislikes: string;
    detailedEvents: string;
    ruleImpactAnalysis: string;
  }[];
  optionalRules?: {
    rule: string;
    status: 'pass' | 'fail' | 'neutral';
    comment: string;
    evidenceChapter: string;
    evidenceDetails: string;
  }[];
  isFullAnalysis?: boolean;
}

interface PulseConfig {
  is_active: boolean;
  interval_minutes: number;
  last_scan_at: string | null;
  keywords: string;
}

interface PulseResult {
  id: number;
  manga_name: string;
  report: {
    name: string;
    summary: string;
    cozinessScore: number;
    whyItMatches: string;
  };
  found_at: string;
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const CircularProgress = ({ 
  value, 
  label, 
  size = 120, 
  strokeWidth = 8,
}: { 
  value: number; 
  label: string; 
  size?: number; 
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 100) return "text-blue-500";
    if (val >= 90) return "text-emerald-500";
    if (val >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const color = getColor(value);

  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer dashed ring */}
        <div className="absolute inset-[-12px] rounded-full border border-dashed border-warm-accent/10 animate-[spin_30s_linear_infinite] opacity-40" />
        <div className="absolute inset-[-6px] rounded-full border border-warm-accent/5 animate-neural-pulse" />
        
        <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <circle
            className="text-warm-ink/5"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <motion.circle
            className={cn(color, "transition-all duration-700")}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2.5, ease: "circOut" }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ filter: `drop-shadow(0 0 12px currentColor)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={cn(
            "font-black text-warm-ink leading-none display tracking-tighter",
            size < 70 ? "text-[10px]" : 
            size < 100 ? "text-sm" : 
            size < 140 ? "text-2xl" : "text-4xl",
            value >= 100 && "text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          )}>
            {Math.round(value)}<span className="text-[0.5em] opacity-40 ml-0.5">%</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-warm-ink/30 text-center truncate max-w-[160px] group-hover:text-warm-accent transition-all duration-500 group-hover:tracking-[0.5em] display">{label}</span>
        <div className="w-6 h-0.5 bg-warm-accent/10 rounded-full group-hover:w-12 group-hover:bg-warm-accent/40 transition-all duration-700" />
      </div>
    </div>
  );
};

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const DetailPanel = ({ 
  label, 
  status, 
  description, 
  evidenceChapter, 
  evidenceDetails, 
  isSafety = false,
  forceView
}: {
  label: string;
  status: 'pass' | 'fail' | 'neutral';
  description: string;
  evidenceChapter?: string;
  evidenceDetails?: string;
  isSafety?: boolean;
  forceView?: 'analysis' | 'evidence';
}) => {
  const [view, setView] = useState<'analysis' | 'evidence'>('analysis');

  useEffect(() => {
    if (forceView) setView(forceView);
  }, [forceView]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative group overflow-hidden glass-card rounded-[32px] md:rounded-[48px] border p-6 md:p-12 shadow-2xl flex flex-col gap-6 md:gap-10 transition-all duration-1000 glow-border",
        status === 'fail' ? "border-red-500/30 bg-red-500/[0.03]" : "hover:border-warm-accent/30 hover:shadow-[0_20px_60px_rgba(59,130,246,0.1)]"
      )}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-warm-accent/10 blur-[120px] -mr-32 -mt-32 rounded-full group-hover:bg-warm-accent/20 transition-all duration-1000" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-warm-ink/5 blur-[100px] -ml-24 -mb-24 rounded-full" />
      
      {/* Neural Status Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-warm-ink/5 overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          whileInView={{ x: "0%" }}
          viewport={{ once: true }}
          transition={{ duration: 3, ease: "circOut" }}
          className={cn(
            "h-full w-full shadow-[0_0_10px_rgba(255,255,255,0.5)]",
            status === 'pass' ? "bg-emerald-500" : 
            status === 'fail' ? "bg-red-500" : "bg-yellow-500"
          )}
        />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-8 relative z-10">
        <div className="flex items-center gap-4 sm:gap-8">
          <div className={cn(
            "w-12 h-12 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[36px] flex items-center justify-center shadow-2xl shrink-0 relative group-hover:scale-110 transition-transform duration-1000",
            status === 'pass' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : 
            status === 'fail' ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
          )}>
            {status === 'pass' ? <CheckCircle2 className="w-6 h-6 sm:w-12 sm:h-12" /> : 
             status === 'fail' ? <XCircle className="w-6 h-6 sm:w-12 sm:h-12" /> : <Info className="w-6 h-6 sm:w-12 sm:h-12" />}
            
            {/* Pulsing glow */}
            <div className={cn(
              "absolute inset-0 rounded-inherit animate-neural-pulse opacity-40 blur-2xl",
              status === 'pass' ? "bg-emerald-500" : 
              status === 'fail' ? "bg-red-500" : "bg-yellow-500"
            )} />
          </div>
          <div className="min-w-0 space-y-1 sm:space-y-3">
            <h4 className="font-black text-sm sm:text-2xl uppercase tracking-[0.2em] sm:tracking-[0.4em] text-warm-ink/90 display leading-none">{label}</h4>
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-[8px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-3 sm:px-5 py-1 sm:py-2 rounded-full inline-flex items-center gap-1.5 sm:gap-2.5 shadow-lg border backdrop-blur-md",
                status === 'pass' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                status === 'fail' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              )}>
                <div className={cn("w-2 h-2 rounded-full animate-pulse", 
                  status === 'pass' ? "bg-emerald-500" : 
                  status === 'fail' ? "bg-red-500" : "bg-yellow-500"
                )} />
                {status === 'pass' ? (isSafety ? 'System Pass' : 'Neural Match') : 
                 status === 'fail' ? (isSafety ? 'System Fail' : 'Conflict Detected') : 'Neutral'}
              </span>
            </div>
          </div>
        </div>

        {/* Internal View Switcher */}
        <div className="flex items-center gap-2 bg-warm-ink/5 p-2 rounded-[24px] relative z-10 border border-warm-ink/10 backdrop-blur-xl">
          <button
            onClick={() => setView('analysis')}
            className={cn(
              "px-6 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-700 display flex items-center gap-2",
              view === 'analysis' ? "bg-warm-accent text-warm-bg shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-105" : "text-warm-ink/40 hover:text-warm-ink/70"
            )}
          >
            Analysis
          </button>
          <button
            onClick={() => setView('evidence')}
            className={cn(
              "px-6 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-700 display flex items-center gap-2 relative",
              view === 'evidence' ? "bg-warm-accent text-warm-bg shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-105" : "text-warm-ink/40 hover:text-warm-ink/70"
            )}
          >
            Evidence
            {evidenceDetails && (
              <span className={cn(
                "absolute -top-1 -right-1 w-2 h-2 rounded-full",
                view === 'evidence' ? "bg-warm-bg" : "bg-warm-accent animate-pulse"
              )} />
            )}
          </button>
        </div>
      </div>

      <div className="relative z-10 min-h-[200px]">
        <AnimatePresence mode="wait">
          {view === 'analysis' ? (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-warm-accent/40 animate-pulse" />
                <h5 className="text-[11px] font-black text-warm-ink/30 uppercase tracking-[0.4em] display">Neural Processing Output</h5>
              </div>
              <div className="text-base md:text-lg text-warm-ink/80 leading-relaxed font-medium italic border-l-4 border-warm-accent/30 pl-8 py-6 bg-warm-accent/[0.02] rounded-r-[40px] whitespace-pre-wrap shadow-[inset_0_0_30px_rgba(59,130,246,0.02)] relative overflow-y-auto max-h-[400px] group/text">
                <div className="absolute top-0 left-0 w-1 h-full bg-warm-accent/20 group-hover/text:bg-warm-accent transition-colors duration-700" />
                {description || "No detailed analysis available."}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="evidence"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="space-y-6"
            >
              <div className="bg-warm-ink/[0.03] rounded-[32px] md:rounded-[40px] p-6 md:p-10 space-y-4 md:space-y-6 border border-warm-ink/5 shadow-inner relative overflow-hidden group/evidence">
                <div className="absolute inset-0 shimmer opacity-0 group-hover/evidence:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                <div className="flex items-center justify-between border-b border-warm-ink/10 pb-4 md:pb-5 relative z-10">
                  <div className="flex items-center gap-3 md:gap-4 text-warm-accent/60">
                    <FileText size={18} className="animate-float-slow" />
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] display">Neural Evidence Logs</span>
                  </div>
                  {evidenceChapter && (
                    <div className="px-4 md:px-5 py-1.5 md:py-2 bg-warm-accent/10 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-warm-accent border border-warm-accent/20 shadow-sm">
                      Chapter: {evidenceChapter}
                    </div>
                  )}
                </div>
                <div className="text-xs md:text-base text-warm-ink/70 leading-relaxed serif italic whitespace-pre-wrap relative z-10 pl-4 border-l border-warm-ink/10 overflow-y-auto max-h-[300px]">
                  {evidenceDetails || "No specific evidence details found."}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


interface ProcessStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
  icon: React.ReactNode;
}

interface SavedItem {
  id: string;
  report: VibeReport;
  messages: ChatMessage[];
  timestamp: number;
  readingProgress?: number; // Current chapter
  totalChapters?: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

interface DetailedMangaReport extends VibeReport {
  discoveryEvidence: string;
  themes?: string[];
  status?: string;
}

// Neural Background Component
const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-warm-bg" />
    
    {/* Animated Gradients */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-warm-accent/10 blur-[120px] rounded-full animate-float-slow" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-warm-secondary/10 blur-[150px] rounded-full animate-float-slow [animation-delay:2s]" />
    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-warm-accent/5 blur-[100px] rounded-full animate-pulse-soft" />
    
    {/* Neural Grid */}
    <div className="absolute inset-0 neural-grid opacity-20" />
    
    {/* Moving Scanline */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-warm-accent/[0.03] to-transparent h-20 w-full animate-scanline opacity-50" />
    
    {/* Floating Particles (CSS only) */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-warm-accent/20 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  </div>
);

const SYSTEM_BLACKLIST = [
  "Shikimori's Not Just a Cutie",
  "Kawaii dake ja Nai Shikimori-san",
  "I made friends with the second prettiest girl in my class",
  "Kurasu no Daikirai na Joshi to Kekkon suru Koto ni Natta",
  "The second prettiest girl in my class",
  "Second prettiest girl",
  "Kamiya-san",
  "Kamiya",
  "The Girl With the Sanpaku Eyes",
  "Sanpakugan-chan wa Tsutaetai",
  "Sanpaku Eyes"
];

const MASTER_RULEBOOK = `
STRICT COMPLIANCE MANDATE: You MUST be 100% accurate. DO NOT give the benefit of the doubt. If a title is 99% cozy but has 1% drama or unrequited love, REJECT IT. ABSOLUTE ZERO TOLERANCE.

1. Teen Romance (STRICT): Strictly teenagers. No adult-teen, no age gaps > 2 years. If characters are 20+, REJECT.
2. No Deaths (ABSOLUTE): Zero deaths of significant characters. Even side characters must remain 100% safe.
3. No Trauma (ZERO TOLERANCE): Absolutely no focus on past or present trauma. No tragic backstories or emotional baggage.
4. No Fanservice (ABSOLUTE): NO sexualization, ecchi, or fanservice. Even "accidental" falls must be 100% wholesome.
5. No Love Triangles (ZERO TOLERANCE): Single couple focus. CRITICAL: No rivals. If ANY second character is hinted to like a lead, REJECT.
6. No Sidelining (STRICT): Main couple stays 100% focus. No side-couple drama that overshadows the leads.
7. No Pre-established (ABSOLUTE): They must start as strangers/acquaintances. NO arranged marriages, NO pre-dating, NO childhood promises.
8. No Heavy Drama (ZERO TOLERANCE): Absolute zero heavy drama. Only minor, lighthearted, non-threatening hurdles.
9. No Bullying (STRICT): Absolutely no bullying of any kind, past or present, even if resolved.
10. Equal POVs (STRICTEST RULE - 50/50 ONLY): Both characters MUST get perfectly equal screen time and internal monologues. If one lead is even slightly more prominent (e.g. 60/40), REJECT. IT MUST BE PERFECTLY BALANCED.
11. First love for both (ABSOLUTE): Strictly virgin/first-love protagonists. No exes, no past crushes, no "second love".
12. Direct Romance (STRICT): The romance must be clear and central. No "implied" feelings or vague subtext.
13. Straight Romance (ABSOLUTE): Strictly male-female romance.
14. No Side Character Trauma (ZERO TOLERANCE): No broken-hearted side characters. No one is allowed to be sad because of the main romance.
15. No "Shikimori-san" Vibes (STRICT): No titles where a girl feels romantically left out or "hurt" by the main couple.
16. No "Second Girl" Drama (ABSOLUTE): Pure single-interest focused stories only. No "second prettiest girl" or "childhood friend" drama.
17. No Harem/Reverse Harem (ZERO TOLERANCE): Zero tolerance for multiple interests.
18. No Unrequited Love from Side Characters (ABSOLUTE ZERO TOLERANCE): If a side character harbors feelings for the MCs, FAIL. Even if they never act on it.
19. No "Second Lead Syndrome" (STRICT): Absolutely no characters designed to be "the alternative" love interest.
20. Lack of Conflict is a Positive (MANDATORY): "No Conflict" is considered a 100% Requirement.
21. Light Novel Verification (STRICT): Must verify that later arcs in Light Novel/Web Novel adaptations do not break these rules.
22. Chapter-by-Chapter Verification (STRICT): Must audit the entire series, including endings, to ensure it remains 100% cozy throughout.

CRITICAL INSTRUCTION: All analysis, descriptions, and evidence MUST be extremely detailed (at least 8-10 sentences each). Do not provide short or concise answers. The user needs absolute certainty.
ROADMAP INSTRUCTION: For any roadmap (Manga or Light Novel), you MUST provide an EXHAUSTIVE blow-by-blow account of events. Explain exactly WHAT happens, HOW it happens, WHEN it happens, and WHILE what else is occurring. Leave no detail behind. The user needs absolute certainty.
`;

export default function App() {
  const { width } = useWindowSize();
  const [mangaName, setMangaName] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ data: string, type: string, name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<VibeReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<ProcessStep[]>([]);

  const updateStep = (id: string, status: 'pending' | 'loading' | 'complete' | 'error', label?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, status, label: label || step.label } : step
    ));
  };
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(width >= 1024);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [theme, setTheme] = useState<'midnight' | 'sunset' | 'forest'>(() => {
    const saved = localStorage.getItem('manga_vibe_theme');
    return (saved as any) || 'midnight';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('manga_vibe_theme', theme);
  }, [theme]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
    };
    recognition.start();
  };

  // Function Declarations for Gemini
  const tools = [
    {
      functionDeclarations: [
        {
          name: "analyze_manga",
          description: "Perform a deep vibe analysis on a specific manga, manhwa, or anime.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The title of the manga to analyze." }
            },
            required: ["title"]
          }
        },
        {
          name: "save_current_report",
          description: "Save the currently viewed analysis report to the user's library.",
          parameters: { type: Type.OBJECT, properties: {} }
        },
        {
          name: "start_new_chat",
          description: "Clear the current conversation and start a fresh one.",
          parameters: { type: Type.OBJECT, properties: {} }
        }
      ]
    }
  ];

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.rate = 1.1;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };
  
  // New State for Chat Tabs and Discovery
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('manga_vibe_conversations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    const saved = localStorage.getItem('manga_vibe_conversations');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed[0].id : null;
      } catch (e) { console.error(e); }
    }
    return null;
  });
  const [comfortItems, setComfortItems] = useState<DetailedMangaReport[]>([]);
  const [hasAttemptedComfortFetch, setHasAttemptedComfortFetch] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'report' | 'comfort' | 'preferences' | 'library' | 'blacklist' | 'pulse'>('chat');
  const [pulseConfig, setPulseConfig] = useState<PulseConfig | null>(null);
  const [pulseResults, setPulseResults] = useState<PulseResult[]>([]);
  const [isPulseLoading, setIsPulseLoading] = useState(false);

  useEffect(() => {
    fetchPulseData();
  }, []);

  useEffect(() => {
    if (activeTab === 'pulse') {
      fetchPulseData();
    }
  }, [activeTab]);

  const fetchPulseData = async () => {
    setIsPulseLoading(true);
    try {
      const [configRes, resultsRes] = await Promise.all([
        fetch('/api/pulse/config'),
        fetch('/api/pulse/results')
      ]);
      const config = await configRes.json();
      const results = await resultsRes.json();
      setPulseConfig(config);
      setPulseResults(results);
    } catch (e) {
      console.error("Failed to fetch pulse data:", e);
    } finally {
      setIsPulseLoading(false);
    }
  };

  const updatePulseConfig = async (newConfig: Partial<PulseConfig>) => {
    try {
      await fetch('/api/pulse/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pulseConfig, ...newConfig })
      });
      fetchPulseData();
    } catch (e) {
      console.error("Failed to update pulse config:", e);
    }
  };

  const deletePulseResult = async (id: number) => {
    try {
      await fetch(`/api/pulse/results/${id}`, { method: 'DELETE' });
      setPulseResults(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error("Failed to delete pulse result:", e);
    }
  };
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [reportTab, setReportTab] = useState<'safety' | 'evidence' | 'roadmap' | 'preferences' | 'lightnovel' | 'dislikes' | 'assistant' | 'sources'>('safety');
  const [showAllEvidence, setShowAllEvidence] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>(() => {
    const saved = localStorage.getItem('manga_vibe_preferences');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      "Strangers to Lovers (No pre-established couples)",
      "Zero Tolerance for Love Triangles or Rivals",
      "No Side Character Unrequited Love",
      "Happy ending guaranteed",
      "No deaths or heavy trauma",
      "Equal POV for both MCs",
      "High quality art style",
      "No fanservice or ecchi"
    ];
  });
  const [seenComfortManga, setSeenComfortManga] = useState<string[]>(() => {
    const saved = localStorage.getItem('manga_vibe_seen_comfort');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });
  const [blacklist, setBlacklist] = useState<string[]>(() => {
    const saved = localStorage.getItem('manga_vibe_blacklist');
    const defaults = ["Shikimori's Not Just a Cutie", "Kawaii dake ja Nai Shikimori-san", "Shikimori-san", "Kamiya"];
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return [...new Set([...parsed, ...defaults])];
      } catch (e) { console.error(e); }
    }
    return defaults;
  });
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    const saved = localStorage.getItem('manga_vibe_saved');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });
  const [newPreference, setNewPreference] = useState('');
  const [isComfortLoading, setIsComfortLoading] = useState(false);
  const [comfortProgress, setComfortProgress] = useState(0);
  const [isFastSearch, setIsFastSearch] = useState(false);
  
  // Local AI State
  const [useLocalAI, setUseLocalAI] = useState(false);
  const [localAIStatus, setLocalAIStatus] = useState<LocalAIStatus>("idle");
  const [localAIProgress, setLocalAIProgress] = useState(0);
  const [localAIMessage, setLocalAIMessage] = useState("");

  useEffect(() => {
    localAI.onStatusChange = (status) => setLocalAIStatus(status);
    localAI.onProgress = (progress, message) => {
      setLocalAIProgress(progress);
      setLocalAIMessage(message);
    };
    
    // Initial check for WebGPU
    if (!("gpu" in navigator)) {
      setLocalAIStatus("error");
      setLocalAIMessage("WebGPU not supported. Use Chrome/Edge.");
    }
  }, []);

  const toggleLocalAI = async () => {
    if (!useLocalAI) {
      try {
        setUseLocalAI(true);
        setLocalAIMessage("");
        if (localAI.getStatus() !== "ready") {
          await localAI.init();
        }
      } catch (err) {
        console.error(err);
        setUseLocalAI(false);
      }
    } else {
      setUseLocalAI(false);
    }
  };

  // Persistence
  useEffect(() => {
    localStorage.setItem('manga_vibe_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    localStorage.setItem('manga_vibe_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('manga_vibe_seen_comfort', JSON.stringify(seenComfortManga));
  }, [seenComfortManga]);

  useEffect(() => {
    localStorage.setItem('manga_vibe_blacklist', JSON.stringify(blacklist));
  }, [blacklist]);

  const addToBlacklist = (name: string) => {
    setBlacklist(prev => [...new Set([...prev, name])]);
    setComfortItems(prev => prev.filter(i => i.name !== name));
    if (report?.name === name) setReport(null);
    showToast(`${name} has been blacklisted.`, 'info');
  };

  useEffect(() => {
    localStorage.setItem('manga_vibe_preferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  const createNewConversation = () => {
    const newConvo: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      timestamp: Date.now()
    };
    setConversations(prev => [newConvo, ...prev]);
    setActiveConversationId(newConvo.id);
    setChatMessages([]);
    setReport(null);
    setActiveTab('chat');
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    if (activeConversation) {
      setChatMessages(activeConversation.messages);
    }
  }, [activeConversationId]);

  useEffect(() => {
    // Reset the chat instance when the conversation changes
    chatInstance.current = null;
  }, [activeConversationId]);

  const updateConversationMessages = (messages: ChatMessage[]) => {
    if (!activeConversationId) return;
    setConversations(prev => prev.map(c => 
      c.id === activeConversationId ? { ...c, messages, timestamp: Date.now() } : c
    ));
  };

  const saveToLibrary = () => {
    if (!report) return;
    const newItem: SavedItem = {
      id: Date.now().toString(),
      report,
      messages: chatMessages,
      timestamp: Date.now(),
      readingProgress: 0,
      totalChapters: 0
    };
    setSavedItems(prev => [newItem, ...prev]);
    setIsSidebarOpen(true);
    showToast("Analysis archived to your library");
  };

  const downloadReport = () => {
    if (!report) return;
    const content = `
MANGA VIBE REPORT: ${report.name}
---------------------------------
Type: ${report.type} (${report.year})
Coziness Score: ${report.score}%
Couple Focus: ${report.focusPercentage}%
MCs: ${report.mcs.male} & ${report.mcs.female}

SUMMARY:
${report.summary}

VERDICT:
${report.verdict}

WARNINGS:
${report.warnings}

SAFETY CHECKS:
${Object.entries(report.safetyChecks).map(([k, v]) => `- ${k}: ${v ? 'FAIL' : 'PASS'}`).join('\n')}

DETAILED CHECKS:
${report.checks.map(c => `[${c.status.toUpperCase()}] ${c.label}: ${c.details}`).join('\n')}

SOURCES:
${report.citations.map(c => `- ${c.title}: ${c.url}`).join('\n')}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}_Vibe_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSavedItem = (item: SavedItem) => {
    setReport(item.report);
    setReportTab('safety');
    setActiveTab('report');
    setChatMessages(item.messages);
    setIsSidebarOpen(false);
    
    // Re-initialize chat instance with the saved context
    chatInstance.current = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are the Manga Vibe Checker AI. You are continuing a conversation about "${item.report.name}".`
      }
    });
  };

  const deleteSavedItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedItems(prev => prev.filter(item => item.id !== id));
    showToast("Archive removed", "info");
  };

  const copyToClipboard = () => {
    const url = "https://ais-pre-6osirn53jcanztccl65lh7-540690044141.asia-east1.run.app";
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'comfort' && comfortItems.length < 6 && !isComfortLoading && !hasAttemptedComfortFetch) {
      fetchComfortMangas();
      setHasAttemptedComfortFetch(true);
    }
  }, [activeTab, comfortItems.length, isComfortLoading, hasAttemptedComfortFetch]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallGuide(true);
    }
  };
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInstance = useRef<any>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const fetchEmergencyComfort = async () => {
    setLoading(true);
    setError(null);
    setSteps([
      { id: 'search', label: 'Searching for Ultra-Pure Resonance...', status: 'loading', icon: <Heart className="w-4 h-4" /> },
      { id: 'core', label: 'Verifying Absolute Safety...', status: 'pending', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'report', label: 'Finalizing Emergency Comfort...', status: 'pending', icon: <Sparkles className="w-4 h-4" /> },
    ]);
    setActiveTab('report');

    try {
      const response = await generateWithFallback({
        model: "gemini-3-flash-preview",
        contents: `FIND THE SINGLE MOST PURE, COZY, AND SAFE ROMANCE MANGA/MANHWA IN EXISTENCE.
        
        MASTER RULEBOOK (CRITICAL):
        ${MASTER_RULEBOOK}
        
        This is an EMERGENCY COMFORT request. The user is anxious and needs a 100% safe, no-drama, pure fluff recommendation.
        CRITICAL POV CHECK: You MUST verify the actual POV distribution. If the story is primarily told from one character's perspective (e.g., heavily female POV like "The Girl With the Sanpaku Eyes" or heavily male POV), DO NOT SUGGEST IT.
        Exclude: ${[...new Set([...seenComfortManga, ...blacklist, ...SYSTEM_BLACKLIST])].join(', ')}.
        
        Return ONLY the title of this one manga.`,
        config: { responseMimeType: "text/plain" }
      });

      const title = response.text.trim().replace(/^"|"$/g, '');
      await analyzeMangaInternal(title);
      showToast("Emergency Comfort Found!", "success");
    } catch (err) {
      console.error(err);
      setError("Neural link failed during emergency search. Please try again.");
      setLoading(false);
    }
  };

  const findSimilarDynamic = async (baseManga: string, dynamic: string) => {
    setLoading(true);
    setError(null);
    setSteps([
      { id: 'search', label: `Finding dynamics similar to ${baseManga}...`, status: 'loading', icon: <Zap className="w-4 h-4" /> },
      { id: 'core', label: 'Verifying Safety of Candidates...', status: 'pending', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'report', label: 'Finalizing Similar Match...', status: 'pending', icon: <Sparkles className="w-4 h-4" /> },
    ]);
    setActiveTab('report');

    try {
      const response = await generateWithFallback({
        model: "gemini-3-flash-preview",
        contents: `Find a manga/manhwa with a relationship dynamic similar to "${baseManga}" (${dynamic}).
        
        MASTER RULEBOOK (CRITICAL):
        ${MASTER_RULEBOOK}
        
        The candidate MUST have the same "energy" but be a completely different story.
        CRITICAL POV CHECK: You MUST verify the actual POV distribution. If the story is primarily told from one character's perspective (e.g., heavily female POV like "The Girl With the Sanpaku Eyes" or heavily male POV), DO NOT SUGGEST IT.
        Exclude: ${baseManga}, ${[...new Set([...seenComfortManga, ...blacklist, ...SYSTEM_BLACKLIST])].join(', ')}.
        
        Return ONLY the title of the best match.`,
        config: { responseMimeType: "text/plain" }
      });

      const title = response.text.trim().replace(/^"|"$/g, '');
      await analyzeMangaInternal(title);
      showToast(`Found a dynamic match for ${baseManga}!`, "success");
    } catch (err) {
      console.error(err);
      setError("Could not find a similar dynamic. Neural link unstable.");
      setLoading(false);
    }
  };

  const updateReadingProgress = (itemId: string, progress: number) => {
    setSavedItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, readingProgress: progress } : item
    ));
    showToast(`Progress updated to Chapter ${progress}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          data: (reader.result as string).split(',')[1],
          type: file.type,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchComfortMangas = async (isAppend: boolean = false, retryCount: number = 0) => {
    if (isComfortLoading && retryCount === 0) return;
    setIsComfortLoading(true);
    if (retryCount === 0) setComfortProgress(0);
    setError(null);
    
    try {
      const currentItems = isAppend ? comfortItems : [];
      const targetCount = 6;
      let neededCount = isAppend ? 6 : (targetCount - currentItems.length);
      
      if (neededCount <= 0 && !isAppend) {
        setIsComfortLoading(false);
        return;
      }

      console.log(`Comfort Feed: Deep-Dive Attempt ${retryCount + 1} for ${neededCount} items...`);

      // Increase candidate pool significantly
      const candidatePoolSize = Math.max(neededCount * 5, 25);

      // First, get a list of candidate names that are NOT blacklisted
      const candidateResponse = await generateWithFallback({
        model: "gemini-3-flash-preview",
        contents: `Find EXACTLY ${candidatePoolSize} unique, high-quality, 100% cozy ROMANCE-BASED manga/manhwa/manhua titles that are ABSOLUTELY SAFE.
        
        MASTER RULEBOOK (CRITICAL - ALL CANDIDATES MUST ALIGN WITH 100% PERFECTION):
        ${MASTER_RULEBOOK}
        
        STRICT COMPLIANCE MANDATE:
        - If a title has any unrequited love from a side character, REJECT.
        - If a title has any love triangle, REJECT.
        - If a title is biased towards one POV, REJECT.
        
        MANUAL SEARCH DIRECTIVE (CRITICAL):
        You MUST use Google Search to verify these titles. Search for:
        - "manga with 50/50 dual pov romance no drama"
        - "cozy romance manga no secondary love interest"
        - "safe romance manhwa with equal monologues for both leads"
        Visit MangaDex, Anime-Planet, or MyAnimeList snippets to confirm they meet the criteria.
        
        STRICT EXCLUSIONS (DO NOT SUGGEST THESE OR ANYTHING LIKE THEM):
        - NO Pre-established couples. They MUST start as strangers or casual acquaintances. NO arranged marriages, NO starting out already married, NO starting out already dating.
        - NO Love Triangles, NO rivals, NO unrequited love, NO "sidelined girl" tropes.
        - NO "Shikimori's Not Just a Cutie" (Kawaii dake ja Nai Shikimori-san) or titles with similar vibes (like Kamiya).
        - NO "I made friends with the second prettiest girl in my class" (Kurasu no Daikirai na Joshi to Kekkon suru Koto ni Natta or similar "second girl" drama).
        - NO "Harem" or "Reverse Harem" elements.
        - NO "Shikimori-san", "Kamiya", or any title where a girl feels romantically left out or "hurt" by the main couple.
        - NO "unrequited love" from side characters that causes emotional pain.
        - NO "rival" characters who like the MC.
        - CRITICAL POV CHECK (STRICTEST): You MUST verify the actual POV distribution. If the story is primarily told from one character's perspective (e.g., heavily female POV like "The Girl With the Sanpaku Eyes" or heavily male POV), DO NOT SUGGEST IT. IT MUST BE EQUAL distribution.
        
        ZERO TOLERANCE POLICY:
        - ABSOLUTELY NO side characters who harbor unrequited feelings for the MCs.
        - ABSOLUTELY NO "second lead syndrome" or characters who feel left out romantically.
        - If ANY side character gets rejected or is sad about the main couple, DO NOT SUGGEST IT. This is a strict zero-tolerance rule.
        
        Exclude these specific titles: ${[...new Set([...seenComfortManga.slice(-50), ...comfortItems.map(i => i.name), ...savedItems.map(s => s.report.name), ...blacklist, ...SYSTEM_BLACKLIST])].join(', ')}.
        
        Return a JSON array of strings (the titles only).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          tools: [{ googleSearch: {} }]
        }
      });

      const candidateNames: string[] = parseResponse(candidateResponse);
      
      if (candidateNames.length === 0) {
        throw new Error("No suitable candidates found.");
      }

      const normalizeScore = (val: any) => {
        const num = parseFloat(val);
        if (isNaN(num)) return 0;
        if (num > 0 && num <= 1) return num * 100;
        return num;
      };

      // Now, analyze each candidate in parallel
      const analysisPromises = candidateNames.map(async (name, index) => {
        // Reduced staggered delay for Flash model
        await new Promise(r => setTimeout(r, index * 500));
        
        try {
          const response = await generateWithFallback({
            model: "gemini-3-flash-preview",
            contents: `PERFORM A FAST BUT ACCURATE SAFETY AUDIT for the manga: "${name}".
            
            MASTER RULEBOOK (CRITICAL - ALL RULES MUST PASS WITH 100% CERTAINTY):
            ${MASTER_RULEBOOK}
            
            CRITICAL HARD EXCLUSIONS (ABSOLUTE NO'S - NO EXCEPTIONS):
            - NO Love Triangles or Romantic Rivals.
            - NO Multiple girls liking the MC or Multiple boys liking the female MC.
            - NO girl feeling romantically left out or unrequited love.
            - NO "Shikimori's Not Just a Cutie" or titles with similar "sidelined girl" tropes (like Kamiya).
            - NO deaths, sacrifices, or tragic backstories.
            - NO bittersweet or sad endings.
            - NO multi-episode emotional drama.
            - NO side characters suffering emotionally.
            - NO ecchi, fanservice, or sexual scenes.
            - CRITICAL POV CHECK (STRICTEST): Both characters MUST get strictly equal screen time and internal monologues (50/50 distribution). If it's even slightly lopsided, set pass to false for equalPOV.
            
            USER'S PERSONAL PREFERENCES:
            ${userPreferences.length > 0 ? userPreferences.map((p, i) => `${i + 1}. ${p}`).join('\n') : "None specified."}
            
            REQUIREMENTS:
            1. SEARCH EXHAUSTIVELY for all possible ways it might hurt or be cozy.
            2. SEARCH EXHAUSTIVELY for a Light Novel or Web Novel adaptation. Search for: "[Title] Light Novel", "[Title] Web Novel", "[Title] NovelUpdates". Many mangas are adapted from novels; you MUST find it if it exists.
            3. CHAPTER-BY-CHAPTER VERIFICATION (CRITICAL): You MUST search for "Chapter Summaries" or "Plot Summary" for the entire series. Do not just look at the first chapter. Verify the ending and all intermediate arcs to ensure NO drama or rivals appear later.
            4. For 'proofs', provide at least 20 specific points based on actual chapter events. Each field (action, whyILike, absoluteProof) MUST be an extremely detailed factual statement.
            5. Provide an EXTREMELY DETAILED and thorough analysis for each field (8-10 sentences per paragraph). Be direct and factual.
            6. ENSURE ABSOLUTE PERFECTION: The manga MUST fit the user perfectly. If it does not, DO NOT SUGGEST IT.
            7. For 'optionalRules', analyze EACH user preference listed above. Provide an extremely detailed analysis (at least 8-10 sentences) in 'comment' and 'evidenceDetails'. Provide absolute proof from the source material.
            8. Provide a list of specific sources in 'citations' (e.g., MyAnimeList, MangaUpdates, NovelUpdates, Reddit, Fandom Wiki).`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  year: { type: Type.STRING },
                  mcs: {
                    type: Type.OBJECT,
                    properties: { male: { type: Type.STRING }, female: { type: Type.STRING } },
                    required: ["male", "female"]
                  },
                  relationshipDynamic: { type: Type.STRING, description: "The core dynamic between the main couple (e.g., 'Childhood Friends to Lovers', 'Grumpy x Sunshine')." },
                  vibeTags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-7 short tags describing the specific cozy vibes (e.g., 'Pure Fluff', 'No Drama', 'College Life')." },
                  sideCharacterTreatment: { type: Type.STRING, description: "Detailed explanation (3-4 sentences) confirming that NO side characters are romantically sidelined, hurt, or left out. Provide absolute proof." },
                  userPreferenceAlignment: { type: Type.STRING, description: "Detailed explanation (3-4 sentences) of exactly how this manga aligns perfectly with the user's specific preferences." },
                  potentialDislikes: {
                    type: Type.ARRAY,
                    description: "A comprehensive list of 5-8 specific elements the user might hate. CRITICAL: Do NOT list 'Lack of Conflict', 'Slow Pacing', or 'No Drama' as dislikes—these are POSITIVES for this user. Instead, search for: annoying side characters, minor misunderstandings, art style quirks, or very subtle 'rival-like' interactions that might cause panic. Be absolutely brutal in finding things that might hurt the user's specific 'cozy' vibe.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        factor: { type: Type.STRING, description: "The specific trope or element (e.g., 'Annoying Side Character', 'Art Style')" },
                        description: { type: Type.STRING, description: "Detailed explanation of why this might be a problem for the user." },
                        severity: { type: Type.STRING, description: "Low, Medium, or High" },
                        chapter: { type: Type.STRING, description: "When it happens" }
                      },
                      required: ["factor", "description", "severity"]
                    }
                  },
                  lightNovel: {
                    type: Type.OBJECT,
                    properties: {
                      exists: { type: Type.BOOLEAN },
                      title: { type: Type.STRING },
                      status: { type: Type.STRING },
                      volumes: { type: Type.STRING },
                      differencesFromManga: { type: Type.STRING },
                      cozinessComparison: { type: Type.STRING },
                      safetyWarnings: { type: Type.STRING },
                      panicTriggers: { type: Type.STRING },
                      adaptationStatus: { type: Type.STRING },
                      endingVibe: { type: Type.STRING },
                      sideStories: { type: Type.STRING },
                      characterDevelopment: { type: Type.STRING },
                      worldBuilding: { type: Type.STRING }
                    },
                    required: ["exists"]
                  },
                  focusPercentage: { type: Type.NUMBER, description: "A percentage value from 0 to 100 representing how well it matches the user's specific focus/preferences." },
                  safetyScore: { type: Type.INTEGER, description: "A score from 0 to 100 representing how safe/cozy the manga is according to the 14 rules." },
                  summary: { type: Type.STRING, description: "Extremely detailed and comprehensive plot summary (at least 8-10 sentences). Explain the entire premise, the relationship dynamic, and how the story progresses so the user is 100% sure there is nothing wrong." },
                  score: { type: Type.INTEGER, description: "A general coziness score from 0 to 100." },
                  volumes: { type: Type.STRING },
                  chapters: { type: Type.STRING },
                  cozinessLevel: { type: Type.STRING },
                  cozinessAnalysis: { type: Type.STRING, description: "Extremely detailed coziness analysis (at least 8-10 sentences)." },
                  comfortReason: { type: Type.STRING, description: "Extremely detailed reason why it's comforting (at least 8-10 sentences)." },
                  discoveryEvidence: { type: Type.STRING, description: "Extremely detailed evidence of discovery (at least 8-10 sentences)." },
                  verdict: { type: Type.STRING },
                  warnings: { type: Type.STRING },
                  ruleImpactAnalysis: { type: Type.STRING, description: "Extremely detailed rule impact analysis (at least 8-10 sentences)." },
                  safetyChecks: {
                    type: Type.OBJECT,
                    properties: {
                      teenRomance: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      deaths: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      loveTriangles: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      sidelining: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      trauma: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      sexualization: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      preEstablished: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      heavyDrama: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      bullying: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      equalPOV: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      pastRelationships: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      indirectRomance: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      straightRomance: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                      noEmotionalTrauma: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] }
                    },
                    required: ["teenRomance", "deaths", "loveTriangles", "sidelining", "trauma", "sexualization", "preEstablished", "heavyDrama", "bullying", "equalPOV", "pastRelationships", "indirectRomance", "straightRomance", "noEmotionalTrauma"]
                  },
                  chapterRoadmap: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: { 
                        range: { type: Type.STRING }, 
                        vibe: { type: Type.STRING }, 
                        summary: { type: Type.STRING, description: "Extremely detailed summary (at least 10-12 sentences)." }, 
                        likes: { type: Type.STRING, description: "Extremely detailed likes (at least 8-10 sentences)." }, 
                        dislikes: { type: Type.STRING, description: "Extremely detailed dislikes (at least 8-10 sentences)." }, 
                        detailedEvents: { type: Type.STRING, description: "EXHAUSTIVE detailed events (at least 12-15 sentences). Explain exactly WHAT happens, HOW, WHEN, and WHILE." }, 
                        ruleImpactAnalysis: { type: Type.STRING, description: "Extremely detailed rule impact analysis (at least 8-10 sentences)." } 
                      },
                      required: ["range", "vibe", "summary", "likes", "dislikes", "detailedEvents", "ruleImpactAnalysis"]
                    }
                  },
                  proofs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: { chapter: { type: Type.STRING }, action: { type: Type.STRING }, who: { type: Type.STRING }, whyILike: { type: Type.STRING }, absoluteProof: { type: Type.STRING } },
                      required: ["chapter", "action", "who", "whyILike", "absoluteProof"]
                    }
                  },
                  optionalRules: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: { 
                        rule: { type: Type.STRING }, 
                        status: { type: Type.STRING, enum: ["pass", "fail", "neutral"] }, 
                        comment: { type: Type.STRING, description: "Extremely detailed comment (at least 8-10 sentences). Explain exactly how it fits or fails." }, 
                        evidenceChapter: { type: Type.STRING }, 
                        evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } 
                      },
                      required: ["rule", "status", "comment", "evidenceChapter", "evidenceDetails"]
                    }
                  },
                  citations: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING, description: "The name of the source (e.g., MyAnimeList)" },
                        url: { type: Type.STRING, description: "The URL of the source" }
                      },
                      required: ["title", "url"]
                    }
                  }
                },
                required: ["name", "type", "year", "mcs", "focusPercentage", "safetyScore", "sideCharacterTreatment", "userPreferenceAlignment", "potentialDislikes", "summary", "score", "volumes", "chapters", "cozinessLevel", "cozinessAnalysis", "comfortReason", "discoveryEvidence", "verdict", "warnings", "safetyChecks", "lightNovel", "chapterRoadmap", "proofs", "optionalRules", "citations"]
              }
            }
          });

          const item = parseResponse(response);
          
          // Incremental update for better UX
          if (item) {
            // STRICT FILTERING: Absolute 100% guarantee.
            // If the AI's deep-dive reveals ANY safety failure, we silently reject it.
            let is100PercentSafe = true;
            if (item.safetyChecks) {
              for (const key in item.safetyChecks) {
                if (item.safetyChecks[key as keyof typeof item.safetyChecks]?.pass === false) {
                  is100PercentSafe = false;
                  console.log(`[ZERO TOLERANCE] Rejected ${item.name} - Failed safety check: ${key}`);
                  break;
                }
              }
            }
            
            const normalizedSafetyScore = normalizeScore(item.safetyScore);
            if (normalizedSafetyScore < 100) {
              is100PercentSafe = false;
              console.log(`[ZERO TOLERANCE] Rejected ${item.name} - Safety score was ${normalizedSafetyScore}`);
            }

            if (!is100PercentSafe) {
              setComfortProgress(prev => prev + 1);
              return null; // Do not add to feed
            }

            const normalizedItem: DetailedMangaReport = {
              ...item,
              focusPercentage: normalizeScore(item.focusPercentage),
              safetyScore: normalizedSafetyScore,
              score: normalizeScore(item.score),
              discoveryEvidence: item.discoveryEvidence || item.comfortReason || '',
              comfortReason: item.comfortReason || item.discoveryEvidence || '',
              isFullAnalysis: true
            };
            setComfortItems(prev => {
              const exists = prev.some(i => i.name === normalizedItem.name);
              if (exists) return prev;
              const combined = [...prev, normalizedItem];
              // Keep only unique names and limit to 18
              return combined.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i).slice(0, 18);
            });

            // Track seen manga
            setSeenComfortManga(prev => [...new Set([...prev, normalizedItem.name])]);
          }

          setComfortProgress(prev => prev + 1);
          return item;
        } catch (e) {
          console.error(`Failed to analyze ${name}:`, e);
          setComfortProgress(prev => prev + 1);
          return null;
        }
      });

      const results = await Promise.all(analysisPromises);
      const validResults = results.filter(r => r !== null);
      
      // Check if we have enough items now
      setComfortItems(prev => {
        const uniqueItems = prev.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
        const currentCount = uniqueItems.length;
        
        if (currentCount < targetCount && retryCount < 3) {
          console.log(`Comfort Feed: Only ${currentCount}/${targetCount} items found. Retrying (Attempt ${retryCount + 2})...`);
          setTimeout(() => fetchComfortMangas(isAppend, retryCount + 1), 2000);
        } else {
          setIsComfortLoading(false);
        }
        return uniqueItems.slice(0, 18);
      });

    } catch (err: any) {
      console.error("Comfort Feed Error:", err);
      setError("Neural link unstable. Retrying safety scan...");
      if (retryCount < 3) {
        setTimeout(() => fetchComfortMangas(isAppend, retryCount + 1), 3000);
      } else {
        setIsComfortLoading(false);
      }
    }
  };

  const repairJson = (json: string): string => {
    let repaired = json.trim();
    
    // Remove markdown code blocks if present
    repaired = repaired.replace(/^```json\s*/, '').replace(/```$/, '').trim();

    if (!repaired) return json.startsWith('[') ? '[]' : '{}';
    
    // Fix common AI malformations like ": }" or ": ]"
    repaired = repaired.replace(/:\s*}/g, ': null}');
    repaired = repaired.replace(/:\s*]/g, ': null]');
    repaired = repaired.replace(/,\s*}/g, '}');
    repaired = repaired.replace(/,\s*]/g, ']');

    let stack: ('{' | '[')[] = [];
    let inString = false;
    let escaped = false;

    let result = "";
    for (let i = 0; i < repaired.length; i++) {
      const char = repaired[i];
      
      if (char === '\\' && !escaped) {
        escaped = true;
        result += char;
        continue;
      }

      if (char === '"' && !escaped) {
        inString = !inString;
      }

      if (!inString) {
        if (char === '{') stack.push('{');
        else if (char === '[') stack.push('[');
        else if (char === '}') {
          if (stack.length > 0 && stack[stack.length - 1] === '{') {
            stack.pop();
          } else {
            // Unmatched closing brace, skip it
            continue;
          }
        }
        else if (char === ']') {
          if (stack.length > 0 && stack[stack.length - 1] === '[') {
            stack.pop();
          } else {
            // Unmatched closing bracket, skip it
            continue;
          }
        }
      }

      result += char;
      escaped = false;
    }

    repaired = result;

    // Handle truncation
    if (stack.length > 0 || inString) {
      if (inString) {
        repaired += '"';
      }

      // Remove trailing comma or partial key/value
      repaired = repaired.replace(/,\s*$/, '');
      
      // If it ends with a colon, add a dummy value
      if (repaired.trim().endsWith(':')) {
        repaired += ' ""';
      }
      
      // If it ends with a partial key (e.g., , "key), remove it
      repaired = repaired.replace(/,\s*"[^"]*"\s*$/, '');
      // If it ends with a partial object start (e.g., { "key), remove the key part
      repaired = repaired.replace(/{\s*"[^"]*"\s*$/, '{');
      
      // Close all open structures
      while (stack.length > 0) {
        const last = stack.pop();
        if (last === '{') repaired += '}';
        else if (last === '[') repaired += ']';
      }
    }

    // Final cleanup for trailing commas before closing braces/brackets
    repaired = repaired.replace(/,\s*([\]}])/g, '$1');

    return repaired;
  };

  const parseResponse = (resp: any): any => {
    let rawText = resp.text || '{}';
    try {
      return JSON.parse(rawText);
    } catch (e) {
      console.warn("JSON parse failed, attempting repair...", e);
      try {
        const repaired = repairJson(rawText);
        return JSON.parse(repaired);
      } catch (e2) {
        console.error("Repair failed:", e2);
        return rawText.startsWith('[') ? [] : {};
      }
    }
  };

  const generateWithFallback = async (params: { contents: string, responseSchema?: any, tools?: any[], model?: string, config?: any }) => {
    const models = params.model ? [params.model, "gemini-3-flash-preview", "gemini-3.1-flash-lite-preview", "gemini-flash-latest"] : ["gemini-3-flash-preview", "gemini-3.1-flash-lite-preview", "gemini-flash-latest"];
    let lastError: any = null;

    for (const modelName of models) {
      try {
        console.log(`Attempting generation with model: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config || {
            responseMimeType: "application/json",
            responseSchema: params.responseSchema,
            tools: params.tools,
            maxOutputTokens: 8192
          }
        });
        return response;
      } catch (error: any) {
        lastError = error;
        const errorMsg = error?.message || "";
        console.warn(`Model ${modelName} failed:`, errorMsg);
        
        // If it's a quota (429) or overload (503/500) error, try next model
        if (errorMsg.includes("429") || errorMsg.includes("503") || errorMsg.includes("500") || errorMsg.includes("quota") || errorMsg.includes("overloaded")) {
          continue;
        } else {
          // For other errors (like invalid prompt), don't bother retrying with other models
          throw error;
        }
      }
    }
    throw lastError;
  };

  const analyzeMangaInternal = async (name: string, isFastSearch: boolean = false, existingPartialReport?: VibeReport) => {
    if (!name) return;

    // Check blacklist
    const isBlacklisted = [...blacklist, ...SYSTEM_BLACKLIST].some(b => name.toLowerCase().includes(b.toLowerCase()));
    if (isBlacklisted) {
      const botMsg = `⚠️ **WARNING: NEURAL BLACKLIST TRIGGERED** ⚠️\n\n"${name}" is on your absolute exclusion list. My neural filters suggest this title contains elements like "sidelined girl" tropes or other triggers you've specifically banned. I will not analyze this title to ensure your emotional safety.`;
      const finalMessages: ChatMessage[] = [...chatMessages, { role: 'user', text: `Search for ${name}` }, { role: 'model', text: botMsg }];
      setChatMessages(finalMessages);
      updateConversationMessages(finalMessages);
      showToast(`${name} is blacklisted.`, 'error');
      return;
    }

    // Check library first for existing full analysis
    const cached = savedItems.find(item => item.report.name.toLowerCase() === name.toLowerCase());
    if (cached && cached.report.isFullAnalysis) {
      setReport(cached.report);
      setReportTab('safety');
      setActiveTab('report');
      
      const botMsg = `I found **${cached.report.name}** in your library! Loading the existing deep-dive analysis...`;
      const finalMessages: ChatMessage[] = [...chatMessages, { role: 'user', text: `Search for ${name}` }, { role: 'model', text: botMsg }];
      setChatMessages(finalMessages);
      updateConversationMessages(finalMessages);
      return;
    }

    setLoading(true);
    setError(null);
    setReport(existingPartialReport || null);
    setActiveTab('report');
    
    const initialSteps: ProcessStep[] = [
      { id: 'search', label: 'Neural Cross-Referencing Databases...', status: existingPartialReport ? 'complete' : 'loading', icon: <Globe className="w-4 h-4" /> },
      { id: 'core', label: 'Analyzing Core Vibe & Safety Rules...', status: existingPartialReport ? 'complete' : 'pending', icon: <ShieldAlert className="w-4 h-4" /> },
      { id: 'roadmap', label: 'Generating Chapter Roadmap & Proofs...', status: 'pending', icon: <FileText className="w-4 h-4" /> },
      { id: 'ln', label: 'Deep Light Novel Analysis & Optional Rules...', status: 'pending', icon: <BookOpen className="w-4 h-4" /> },
      { id: 'report', label: 'Finalizing Vibe Report...', status: 'pending', icon: <Sparkles className="w-4 h-4" /> },
    ];
    setSteps(initialSteps);

    try {
      let coreData: Partial<VibeReport> = existingPartialReport || {};
      let roadmapData: any = {};
      let lnData: any = {};

      if (!existingPartialReport) {
        if (!isFastSearch) {
          await new Promise(r => setTimeout(r, 800));
        }
        updateStep('search', 'complete');
        updateStep('core', 'loading');

        // PHASE 1: CORE ANALYSIS
        const coreResponse = await generateWithFallback({
          model: "gemini-3-flash-preview",
          contents: `Analyze the manga/manhwa/anime/light novel: "${name}". 
          PHASE 1: CORE VIBE & SAFETY AUDIT.
          
          MASTER RULEBOOK (CRITICAL - ALL RULES MUST PASS WITH 100% CERTAINTY):
          ${MASTER_RULEBOOK}
          
          CRITICAL HARD EXCLUSIONS (ABSOLUTE NO'S - NO EXCEPTIONS):
          - ZERO TOLERANCE POLICY: ABSOLUTELY NO side characters who harbor unrequited feelings for the MCs. If a side character likes the MC, FAIL IT.
          - ZERO TOLERANCE POLICY: ABSOLUTELY NO "second lead syndrome" or characters who feel left out romantically.
          - If ANY side character gets rejected or is sad about the main couple, DO NOT SUGGEST IT. This is a strict zero-tolerance rule.
          - NO Love Triangles or Romantic Rivals.
          - NO Multiple girls liking the MC or Multiple boys liking the female MC.
          - NO girl feeling romantically left out or unrequited love.
          - NO "Shikimori's Not Just a Cutie" (Kawaii dake ja Nai Shikimori-san) or titles with similar "sidelined girl" or "rival" tropes (like Kamiya).
          - NO "I made friends with the second prettiest girl in my class" (Kurasu no Daikirai na Joshi to Kekkon suru Koto ni Natta or similar "second girl" drama).
          - NO "Shikimori-san" or "Kamiya" or any title where a girl feels romantically left out or "hurt" by the main couple's relationship.
          - NO deaths, sacrifices, or tragic backstories.
          - NO bittersweet or sad endings.
          - NO multi-episode emotional drama.
          - NO side characters suffering emotionally due to romance.
          - NO ecchi, fanservice, or sexual scenes.
          - CRITICAL POV CHECK (STRICTEST REQUIREMENT): You MUST verify the actual POV distribution. If the story is primarily told from one character's perspective (e.g., 60/40 or 70/30 distribution), you MUST fail the equalPOV check. It MUST be a perfect balance. Do not lie or assume.
  
          STRICT SEARCH DIRECTIVE:
          Do not assume a title is safe just because it's popular or "cute". You must audit the entire source material. If there's even a single chapter with a love triangle, REJECT. If there's a side character who is sad about not being with the MC, REJECT.
  
          REQUIREMENT: 
          1. For EACH of the rules in the MASTER RULEBOOK, provide an extremely detailed and thorough analysis (at least 8-10 sentences) in 'description'.
          Explain exactly why it fits or fails with absolute precision. Use deep narrative context. If there is even a 0.1% risk of a love triangle or sidelining, you MUST flag it as a failure.
          2. POPULATE THE 'proofs' ARRAY: Provide at least 20 "ABSOLUTE PROOF POINTS". Each point MUST be a detailed, multi-sentence factual statement from the source material (manga, anime, or light novel) that proves safety or danger. (e.g., "Chapter 4 confirms no romantic rivals exist by showing the side character is already happily married.").
          3. SEARCH EXHAUSTIVELY for all possible ways it might hurt or be cozy. Check every chapter, every side character, and every plot twist.
          4. ENSURE ABSOLUTE PERFECTION: The manga MUST fit the user perfectly. If it does not, DO NOT SUGGEST IT.`,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              year: { type: Type.STRING },
              mcs: {
                type: Type.OBJECT,
                properties: { male: { type: Type.STRING }, female: { type: Type.STRING } },
                required: ["male", "female"]
              },
              focusPercentage: { type: Type.NUMBER, description: "A percentage value from 0 to 100 representing how well it matches the user's specific focus/preferences." },
              safetyScore: { type: Type.NUMBER, description: "A score from 0 to 100 representing how safe/cozy the manga is according to the 14 rules." },
              ruleImpactAnalysis: { type: Type.STRING, description: "Detailed rule impact analysis (4-5 sentences)." },
              sideCharacterTreatment: { type: Type.STRING, description: "Detailed explanation (3-4 sentences) confirming that NO side characters are romantically sidelined, hurt, or left out. Provide absolute proof." },
              userPreferenceAlignment: { type: Type.STRING, description: "Detailed explanation (3-4 sentences) of exactly how this manga aligns perfectly with the user's specific preferences." },
              summary: { type: Type.STRING, description: "Extremely detailed and comprehensive plot summary (at least 8-10 sentences). Explain the entire premise, the relationship dynamic, and how the story progresses so the user is 100% sure there is nothing wrong." },
              score: { type: Type.INTEGER, description: "A general coziness score from 0 to 100." },
              volumes: { type: Type.STRING, description: "Total volume count of the manga. SEARCH DEEP across MyAnimeList, MangaUpdates, and official sites to get the LATEST count. Do not guess." },
              chapters: { type: Type.STRING },
              cozinessLevel: { type: Type.STRING },
              relationshipDynamic: { type: Type.STRING, description: "The core dynamic between the main couple (e.g., 'Childhood Friends to Lovers', 'Grumpy x Sunshine')." },
              vibeTags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-7 short tags describing the specific cozy vibes (e.g., 'Pure Fluff', 'No Drama', 'College Life')." },
              potentialDislikes: {
                type: Type.ARRAY,
                description: "A comprehensive list of ANY minor, niche, or major elements the user might hate based on their strict preferences (e.g., unrequited love, annoying side characters, misunderstandings, slow pacing). Be absolutely brutal and honest.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    factor: { type: Type.STRING, description: "The specific trope or element (e.g., 'Minor Unrequited Crush', 'Misunderstanding')" },
                    description: { type: Type.STRING, description: "Detailed explanation of how and why it happens, and why the user might hate it." },
                    severity: { type: Type.STRING, description: "Low, Medium, or High" },
                    chapter: { type: Type.STRING, description: "When it happens (if applicable)" }
                  },
                  required: ["factor", "description", "severity"]
                }
              },
              cozinessAnalysis: { type: Type.STRING, description: "Detailed coziness analysis (4-5 sentences)." },
              verdict: { type: Type.STRING, description: "Final verdict (4-5 sentences)." },
              warnings: { type: Type.STRING, description: "Safety warnings (4-5 sentences)." },
              proofs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { 
                    chapter: { type: Type.STRING }, 
                    action: { type: Type.STRING, description: "Concise ONE-LINE factual event." }, 
                    who: { type: Type.STRING }, 
                    whyILike: { type: Type.STRING, description: "Concise ONE-LINE reason why it's cozy/safe." }, 
                    absoluteProof: { type: Type.STRING, description: "Concise ONE-LINE absolute proof of safety/danger." } 
                  },
                  required: ["chapter", "action", "who", "whyILike", "absoluteProof"]
                }
              },
              safetyChecks: {
                type: Type.OBJECT,
                properties: {
                  teenRomance: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  deaths: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  loveTriangles: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  sidelining: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  trauma: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  sexualization: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  preEstablished: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  heavyDrama: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  bullying: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  equalPOV: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  pastRelationships: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  indirectRomance: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  straightRomance: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] },
                  noEmotionalTrauma: { type: Type.OBJECT, properties: { pass: { type: Type.BOOLEAN }, description: { type: Type.STRING, description: "Extremely detailed analysis (at least 8-10 sentences). Explain exactly why it fits or fails with absolute precision. Use deep narrative context." }, evidenceChapter: { type: Type.STRING }, evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } }, required: ["pass", "description", "evidenceChapter", "evidenceDetails"] }
                },
                required: ["teenRomance", "deaths", "loveTriangles", "sidelining", "trauma", "sexualization", "preEstablished", "heavyDrama", "bullying", "equalPOV", "pastRelationships", "indirectRomance", "straightRomance", "noEmotionalTrauma"]
              }
            },
            required: ["name", "type", "year", "mcs", "focusPercentage", "safetyScore", "ruleImpactAnalysis", "sideCharacterTreatment", "userPreferenceAlignment", "potentialDislikes", "summary", "score", "volumes", "chapters", "cozinessLevel", "cozinessAnalysis", "safetyChecks", "verdict", "warnings", "proofs"]
          },
          tools: [{ googleSearch: {} }]
        });
        coreData = parseResponse(coreResponse);
        updateStep('core', 'complete');
      }

      updateStep('roadmap', 'loading');

      // PHASE 2: ROADMAP & PROOFS
      const roadmapResponse = await generateWithFallback({
        model: "gemini-3-flash-preview",
        contents: `Analyze the manga/manhwa/anime: "${name}". 
        PHASE 2: CHAPTER ROADMAP & PROOFS.
        
        REQUIREMENTS:
        1. Chapter Roadmap: Provide an EXTREMELY granular breakdown (at least 15-20 entries) covering the entire series from start to finish. Each entry MUST include 'detailedEvents' with at least 10-12 sentences explaining exactly what happens, how it happens, when, and while—leave NOTHING out.
        2. Proofs: Provide at least 15 ADDITIONAL specific, undeniable proofs of coziness/safety. Each proof field (action, whyILike, absoluteProof) MUST be an extremely detailed factual statement (at least 5-6 sentences each).
        3. SEARCH EXHAUSTIVELY for all possible ways it might hurt or be cozy.`,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chapterRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { 
                  range: { type: Type.STRING }, 
                  vibe: { type: Type.STRING, enum: ["comfy", "tense", "warning"] }, 
                  summary: { type: Type.STRING, description: "Extremely detailed summary (at least 10-12 sentences). Explain the core narrative of this segment." }, 
                  likes: { type: Type.STRING, description: "Extremely detailed likes (at least 8-10 sentences). What makes this segment cozy?" }, 
                  dislikes: { type: Type.STRING, description: "Extremely detailed dislikes (at least 8-10 sentences). Any minor friction or potential triggers?" }, 
                  detailedEvents: { type: Type.STRING, description: "EXHAUSTIVE detailed events (at least 12-15 sentences). Explain exactly WHAT happens, HOW it happens, WHEN, and WHILE. Provide a blow-by-blow account." }, 
                  ruleImpactAnalysis: { type: Type.STRING, description: "Extremely detailed rule impact (at least 8-10 sentences). How does this segment comply with the Master Rulebook?" } 
                },
                required: ["range", "vibe", "summary", "likes", "dislikes", "detailedEvents", "ruleImpactAnalysis"]
              }
            },
            proofs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { 
                  chapter: { type: Type.STRING }, 
                  action: { type: Type.STRING, description: "Extremely detailed factual event (at least 4-5 sentences)." }, 
                  who: { type: Type.STRING }, 
                  whyILike: { type: Type.STRING, description: "Extremely detailed reason why it's cozy/safe (at least 4-5 sentences)." }, 
                  absoluteProof: { type: Type.STRING, description: "Extremely detailed absolute proof of safety/danger (at least 4-5 sentences)." } 
                },
                required: ["chapter", "action", "who", "whyILike", "absoluteProof"]
              }
            }
          },
          required: ["chapterRoadmap", "proofs"]
        },
        tools: [{ googleSearch: {} }]
      });
      roadmapData = parseResponse(roadmapResponse);

      updateStep('roadmap', 'complete');
      updateStep('ln', 'loading');

      // PHASE 3: LIGHT NOVEL & OPTIONAL RULES
      const lnResponse = await generateWithFallback({
        model: "gemini-3-flash-preview",
        contents: `Analyze the manga/manhwa/anime: "${name}". 
        PHASE 3: LIGHT NOVEL AUDIT & OPTIONAL RULES.
        
        CRITICAL LIGHT NOVEL SAFETY DIRECTIVE (ZERO TOLERANCE):
        Light Novels often introduce drama, love triangles, or tragic endings later in the story, in "Side Stories", or in the "After Story". 
        YOU MUST SEARCH DEEPLY FOR SPOILERS (NovelUpdates forums, Reddit r/noveltranslations, Fandom wikis).
        DO NOT GUESS. Verify the ENDING, SIDE STORIES, and AFTER STORY against the 14 Mandatory Rules (No Love Triangles, No Sidelining, No Trauma).
        If the LN introduces a rival, a tragic side story, unrequited love from a side character, or ruins the coziness in any way, you MUST flag it in 'panicTriggers' and 'safetyWarnings'.
        If you find EVEN A HINT of a side character having a crush on the MC that goes unrequited, or any "second lead syndrome", you MUST report it. Do not hold back. Absolute safety is the priority.
        
        REQUIREMENTS:
        1. Light Novel: If an LN exists, provide a breakdown including a roadmap for the LN volumes (at least 8-10 volumes). Each LN roadmap entry needs 'detailedEvents' (at least 3-4 sentences).
        2. Optional Rules: Analyze these user preferences:
        ${userPreferences.length > 0 ? userPreferences.map((p, i) => `${i + 1}. ${p}`).join('\n') : "None specified."}
        For EACH optional rule, provide an extremely detailed analysis (at least 8-10 sentences) in 'comment' and 'evidenceDetails'. Provide absolute proof from the source material.
        3. Citations: Provide a list of specific sources where you found this information (e.g., MyAnimeList, MangaUpdates, NovelUpdates, Reddit, Fandom Wiki).`,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optionalRules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { 
                  rule: { type: Type.STRING }, 
                  status: { type: Type.STRING, enum: ["pass", "fail", "neutral"] }, 
                  comment: { type: Type.STRING, description: "Extremely detailed comment (at least 8-10 sentences). Explain exactly how it fits or fails." }, 
                  evidenceChapter: { type: Type.STRING }, 
                  evidenceDetails: { type: Type.STRING, description: "Extremely detailed evidence (at least 8-10 sentences). Provide absolute proof from the source material." } 
                },
                required: ["rule", "status", "comment", "evidenceChapter", "evidenceDetails"]
              }
            },
            citations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "The name of the source (e.g., MyAnimeList)" },
                  url: { type: Type.STRING, description: "The URL of the source" }
                },
                required: ["title", "url"]
              }
            },
            lightNovel: {
              type: Type.OBJECT,
              properties: {
                exists: { type: Type.BOOLEAN, description: "MUST be true if ANY light novel adaptation exists." },
                title: { type: Type.STRING },
                status: { type: Type.STRING, description: "Extremely detailed status (at least 8-10 sentences)." },
                volumes: { type: Type.STRING },
                differencesFromManga: { type: Type.STRING, description: "Extremely detailed differences (at least 8-10 sentences)." },
                cozinessComparison: { type: Type.STRING, description: "Extremely detailed comparison (at least 8-10 sentences)." },
                safetyWarnings: { type: Type.STRING, description: "Extremely detailed warnings (at least 8-10 sentences)." },
                panicTriggers: { type: Type.STRING, description: "Extremely detailed triggers (at least 8-10 sentences)." },
                adaptationStatus: { type: Type.STRING, description: "Extremely detailed status (at least 8-10 sentences)." },
                endingVibe: { type: Type.STRING, description: "Extremely detailed vibe (at least 8-10 sentences)." },
                sideStories: { type: Type.STRING, description: "Extremely detailed side stories (at least 8-10 sentences)." },
                characterDevelopment: { type: Type.STRING, description: "Extremely detailed development (at least 8-10 sentences)." },
                worldBuilding: { type: Type.STRING, description: "Extremely detailed world building (at least 8-10 sentences)." },
                roadmap: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { 
                      volume: { type: Type.STRING }, 
                      summary: { type: Type.STRING, description: "Extremely detailed summary (at least 10-12 sentences)." }, 
                      vibe: { type: Type.STRING, enum: ['comfy', 'tense', 'warning'] }, 
                      detailedEvents: { type: Type.STRING, description: "EXHAUSTIVE detailed events (at least 12-15 sentences). Explain exactly WHAT happens, HOW, WHEN, and WHILE." }, 
                      safetyNotes: { type: Type.STRING, description: "Extremely detailed safety notes (at least 8-10 sentences)." }, 
                      verdict: { type: Type.STRING, description: "Extremely detailed verdict (at least 8-10 sentences)." } 
                    },
                    required: ["volume", "summary", "vibe", "detailedEvents", "safetyNotes", "verdict"]
                  }
                }
              },
              required: ["exists"]
            }
          },
          required: ["optionalRules", "lightNovel", "citations"]
        },
        tools: [{ googleSearch: {} }]
      });
      lnData = parseResponse(lnResponse);

      updateStep('ln', 'complete');
      setSteps(prev => prev.map(s => s.id === 'report' ? { ...s, status: 'loading' } : s));

      const data: VibeReport = {
        ...coreData,
        ...roadmapData,
        ...lnData,
        name: coreData.name || name,
        chapterRoadmap: roadmapData.chapterRoadmap || [],
        optionalRules: lnData.optionalRules || [],
        proofs: [...(coreData.proofs || []), ...(roadmapData.proofs || [])],
        lightNovel: lnData.lightNovel || { exists: false },
        isFullAnalysis: true
      };

      await new Promise(r => setTimeout(r, 1000));
      updateStep('report', 'complete');
      
      setReport(data);
      setReportTab('safety');
      setActiveTab('report');

      // Automatic Saving to Library
      const newItem: SavedItem = {
        id: Date.now().toString(),
        report: data,
        messages: chatMessages,
        timestamp: Date.now(),
        readingProgress: 0,
        totalChapters: data.chapterRoadmap?.length || 0
      };
      setSavedItems(prev => {
        // Prevent duplicates
        if (prev.some(item => item.report.name === data.name)) return prev;
        return [newItem, ...prev];
      });
      
      const botMsg = `I've finished my deep-dive analysis of **${data.name}**! I scanned the panels and checked the emotional tone across several databases. It looks ${data.score > 80 ? 'perfectly cozy' : 'like it might have some issues'}. Check out the evidence below!`;
      const finalMessages: ChatMessage[] = [...chatMessages, { role: 'user', text: `Search for ${name}` }, { role: 'model', text: botMsg }];
      setChatMessages(finalMessages);
      updateConversationMessages(finalMessages);
      
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the manga. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeManga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mangaName.trim() && !selectedFile) return;
    setActiveTab('report');
    await analyzeMangaInternal(mangaName);
  };

  const handleSendMessage = async (e?: React.FormEvent, manualMsg?: string) => {
    if (e) e.preventDefault();
    const msgToUse = manualMsg || chatInput;
    if (!msgToUse.trim() || isChatLoading) return;

    const userMsg = msgToUse.trim();
    if (!manualMsg) setChatInput('');
    
    // If no active conversation, create one
    let currentConvoId = activeConversationId;
    if (!currentConvoId) {
      const newId = Date.now().toString();
      const newConvo: Conversation = {
        id: newId,
        title: userMsg.slice(0, 30) + (userMsg.length > 30 ? '...' : ''),
        messages: [],
        timestamp: Date.now()
      };
      setConversations(prev => [newConvo, ...prev]);
      setActiveConversationId(newId);
      currentConvoId = newId;
    }

    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', text: userMsg }];
    setChatMessages(newMessages);
    updateConversationMessages(newMessages);
    setIsChatLoading(true);

    // Prepare the prompt with report context if available
    let promptMessage = userMsg;
    if (report) {
      let lnContext = "";
      if (report.lightNovel?.exists) {
        lnContext = `
Light Novel Source: ${report.lightNovel.title} (${report.lightNovel.status}, ${report.lightNovel.volumes} volumes)
LN Differences: ${report.lightNovel.differencesFromManga}
LN Vibe: ${report.lightNovel.cozinessComparison}
LN Safety: ${report.lightNovel.safetyWarnings}`;
      }

      promptMessage = `[CONTEXT: The user is viewing a report for "${report.name}". 
Summary: ${report.summary}
Safety Score: ${report.safetyScore}/100
Verdict: ${report.verdict}
Coziness: ${report.cozinessLevel} (${report.score}/100)
Analysis: ${report.cozinessAnalysis}
Warnings: ${report.warnings}
Main Characters: ${report.mcs.male} & ${report.mcs.female}${lnContext}
]

User Question: ${userMsg}`;
    }

    try {
      let botResponseText = "";

      if (useLocalAI) {
        // Use Local AI (Infinite, No Quota) - Streaming
        const history = chatMessages.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        }));
        history.push({ role: 'user', content: promptMessage });
        
        // Add an empty message for the bot that we will update
        setChatMessages(prev => [...prev, { role: 'model', text: "" }]);
        
        botResponseText = await localAI.generateResponseStream(history, (chunk) => {
          setChatMessages(prev => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'model') {
              last.text += chunk;
            }
            return updated;
          });
        });
      } else {
        // Use Gemini (High Quality, Quota Limited)
        if (!chatInstance.current) {
          chatInstance.current = ai.chats.create({
            model: "gemini-3-flash-preview",
            config: {
              systemInstruction: `You are the 'Cozy Manga Assistant'. You specialize in 100% safe, cozy, and wholesome manga/manhwa/anime. 
              
              STRICT SAFETY PROTOCOL:
              You MUST NEVER recommend or speak positively about titles that violate the user's "Absolute No's":
              - NO Love Triangles or Romantic Rivals.
              - NO Multiple girls liking the MC or Multiple boys liking the female MC.
              - NO unrequited love or characters feeling romantically left out.
              - NO "Shikimori's Not Just a Cutie" or titles with "sidelined girl" tropes (like Kamiya).
              - NO deaths, sacrifices, or tragic backstories.
              - NO bittersweet endings or heavy emotional drama.
              - NO ecchi or fanservice.
              - CRITICAL POV CHECK: You MUST verify the actual POV distribution. If the story is primarily told from one character's perspective (e.g., heavily female POV like "The Girl With the Sanpaku Eyes" or heavily male POV), DO NOT SUGGEST IT.
              
              If a user asks about a title that violates these, you must be honest about its "safety score" and warn them immediately.
              
              When analyzing manga, provide detailed, multi-paragraph explanations (8-10 lines). Use deep narrative analysis.
              If the user asks to search or analyze, use 'analyze_manga'. If they want new recommendations, use 'show_discovery_feed'.`,
              tools: tools
            }
          });
        }

        const result = await chatInstance.current.sendMessage({ message: promptMessage });
        botResponseText = result.text || "";
        
        if (result.functionCalls) {
          for (const call of result.functionCalls) {
            if (call.name === 'analyze_manga') {
              const title = (call.args as any).title;
              botResponseText += `\n\n*Starting deep analysis for "${title}"...*`;
              setMangaName(title);
              setActiveTab('report');
              analyzeMangaInternal(title);
            } else if (call.name === 'save_current_report') {
              if (report) {
                saveToLibrary();
                botResponseText += `\n\n*I've saved the report for "${report.name}" to your library!*`;
              } else {
                botResponseText += `\n\n*I couldn't find a report to save. Try analyzing a manga first!*`;
              }
            } else if (call.name === 'start_new_chat') {
              createNewConversation();
              botResponseText = "Fresh start! What's on your mind?";
            }
          }
        }
      }

      const finalMessages: ChatMessage[] = useLocalAI 
        ? [...newMessages, { role: 'model', text: botResponseText }]
        : [...newMessages, { role: 'model', text: botResponseText }];
      
      // For Local AI, we already updated the state during streaming, 
      // but we need to ensure the conversation history is persisted.
      setChatMessages(finalMessages);
      updateConversationMessages(finalMessages);
      
      // Auto-speak if it's a short response
      if (botResponseText.length < 200) {
        speakText(botResponseText.replace(/[*_#]/g, ''));
      }

    } catch (err) {
      console.error(err);
      // If Gemini fails due to quota, suggest switching to Local AI
      const isQuotaError = err instanceof Error && (err.message.includes("429") || err.message.toLowerCase().includes("quota"));
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      let errorMsg = "Oops, I had a bit of a glitch. Can you try saying that again?";
      
      if (isQuotaError) {
        if (isMobile) {
          errorMsg = "I've reached my server limit for now! Since you're on mobile, Local AI might not be supported by your browser yet. Please try again in a few minutes or switch to a desktop browser for unlimited chat!";
        } else {
          errorMsg = "I've reached my server limit for now. Would you like to switch to **Local AI mode**? It runs entirely in your browser and has no limits!";
        }
      }

      const errorMessages: ChatMessage[] = [...newMessages, { role: 'model', text: errorMsg }];
      setChatMessages(errorMessages);
      updateConversationMessages(errorMessages);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-warm-bg relative overflow-hidden">
      <NeuralBackground />
      
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || width >= 1024) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.aside
              initial={width < 1024 ? { x: -320 } : { width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }}
              animate={width < 1024 ? { x: 0 } : { width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }}
              exit={width < 1024 ? { x: -320 } : { width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed lg:relative left-0 top-0 bottom-0 bg-glass border-r border-glass-border z-[70] flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] lg:shadow-none overflow-hidden",
                width < 1024 ? "w-[280px] sm:w-80" : ""
              )}
            >
              <div className="w-[280px] sm:w-80 flex flex-col h-full shrink-0">
                <div className="p-8 border-b border-glass-border flex items-center justify-between bg-warm-accent/[0.02]">
                <div className="flex items-center gap-3 text-warm-accent">
                  <div className="w-8 h-8 rounded-lg bg-warm-accent/10 flex items-center justify-center border border-warm-accent/20">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="font-black uppercase tracking-[0.3em] text-[10px] display">Neural Library</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={createNewConversation}
                    className="p-2.5 hover:bg-warm-accent/10 rounded-xl text-warm-ink/30 hover:text-warm-accent transition-all duration-300 border border-transparent hover:border-warm-accent/20"
                    title="New Chat"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2.5 hover:bg-red-500/10 rounded-xl text-warm-ink/30 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Navigation Group */}
                <div className="space-y-3">
                  <h3 className="text-[9px] font-black text-warm-ink/20 uppercase tracking-[0.4em] px-2 mb-4">Core Modules</h3>
                  
                  {/* Comfort Button */}
                  <button
                    onClick={() => {
                      setActiveTab('comfort');
                      setIsSidebarOpen(false);
                      if (comfortItems.length === 0) fetchComfortMangas();
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border group relative overflow-hidden glow-border",
                      activeTab === 'comfort' 
                        ? "bg-warm-accent/10 border-warm-accent/40 text-warm-accent shadow-[0_0_30px_rgba(59,130,246,0.15)]" 
                        : "bg-warm-ink/[0.02] border-warm-ink/5 text-warm-ink/40 hover:bg-warm-accent/5 hover:text-warm-ink"
                    )}
                  >
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                      activeTab === 'comfort' ? "bg-warm-accent text-warm-bg" : "bg-warm-ink/5 text-warm-ink/30 group-hover:bg-warm-accent/10 group-hover:text-warm-accent"
                    )}>
                      <Heart className={cn("w-5 h-5 transition-transform duration-500 group-hover:scale-110")} />
                    </div>
                    <span className="font-black uppercase tracking-[0.2em] text-[10px] display">Comfort Feed</span>
                  </button>

                  {/* Preferences Button */}
                  <button
                    onClick={() => {
                      setActiveTab('preferences');
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border group relative overflow-hidden glow-border",
                      activeTab === 'preferences' 
                        ? "bg-warm-accent/10 border-warm-accent/40 text-warm-accent shadow-[0_0_30px_rgba(59,130,246,0.15)]" 
                        : "bg-warm-ink/[0.02] border-warm-ink/5 text-warm-ink/40 hover:bg-warm-accent/5 hover:text-warm-ink"
                    )}
                  >
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700",
                      activeTab === 'preferences' ? "bg-warm-accent text-warm-bg" : "bg-warm-ink/5 text-warm-ink/30 group-hover:bg-warm-accent/10 group-hover:text-warm-accent"
                    )}>
                      <ShieldAlert className={cn("w-5 h-5 transition-transform duration-500 group-hover:rotate-[-12deg]")} />
                    </div>
                    <span className="font-black uppercase tracking-[0.2em] text-[10px] display">Preferences</span>
                  </button>

                  {/* Neural Archives Button */}
                  <button
                    onClick={() => {
                      setActiveTab('library');
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border group relative overflow-hidden glow-border",
                      activeTab === 'library' 
                        ? "bg-warm-accent/10 border-warm-accent/40 text-warm-accent shadow-[0_0_30px_rgba(59,130,246,0.15)]" 
                        : "bg-warm-ink/[0.02] border-warm-ink/5 text-warm-ink/40 hover:bg-warm-accent/5 hover:text-warm-ink"
                    )}
                  >
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700",
                      activeTab === 'library' ? "bg-warm-accent text-warm-bg" : "bg-warm-ink/5 text-warm-ink/30 group-hover:bg-warm-accent/10 group-hover:text-warm-accent"
                    )}>
                      <History className={cn("w-5 h-5 transition-transform duration-500 group-hover:scale-110")} />
                    </div>
                    <span className="font-black uppercase tracking-[0.2em] text-[10px] display">Neural Library</span>
                  </button>

                  {/* Blacklist Button */}
                  <button
                    onClick={() => {
                      setActiveTab('blacklist');
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border group relative overflow-hidden glow-border",
                      activeTab === 'blacklist' 
                        ? "bg-red-500/10 border-red-500/40 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)]" 
                        : "bg-warm-ink/[0.02] border-warm-ink/5 text-warm-ink/40 hover:bg-red-500/5 hover:text-red-500"
                    )}
                  >
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700",
                      activeTab === 'blacklist' ? "bg-red-500 text-white" : "bg-warm-ink/5 text-warm-ink/30 group-hover:bg-red-500/10 group-hover:text-red-500"
                    )}>
                      <Trash2 className={cn("w-5 h-5 transition-transform duration-500 group-hover:scale-110")} />
                    </div>
                    <span className="font-black uppercase tracking-[0.2em] text-[10px] display">Blacklist</span>
                  </button>

                  {/* Neural Pulse Button */}
                  <button
                    onClick={() => {
                      setActiveTab('pulse');
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border group relative overflow-hidden glow-border",
                      activeTab === 'pulse' 
                        ? "bg-warm-accent/10 border-warm-accent/40 text-warm-accent shadow-[0_0_30px_rgba(59,130,246,0.15)]" 
                        : "bg-warm-ink/[0.02] border-warm-ink/5 text-warm-ink/40 hover:bg-warm-accent/5 hover:text-warm-ink"
                    )}
                  >
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700",
                      activeTab === 'pulse' ? "bg-warm-accent text-warm-bg" : "bg-warm-ink/5 text-warm-ink/30 group-hover:bg-warm-accent/10 group-hover:text-warm-accent"
                    )}>
                      <Zap className={cn("w-5 h-5 transition-transform duration-500 group-hover:animate-pulse")} />
                    </div>
                    <span className="font-black uppercase tracking-[0.2em] text-[10px] display">Neural Pulse</span>
                  </button>
                </div>

                {/* Recent Chats */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="text-[10px] font-black text-warm-ink/20 uppercase tracking-[0.4em] display">Neural Threads</h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                  <div className="space-y-3 px-2">
                    {conversations.length === 0 ? (
                      <div className="text-center py-10 px-6 border border-dashed border-warm-ink/5 rounded-[32px] bg-warm-ink/[0.01]">
                        <MessageSquare className="w-8 h-8 text-warm-ink/5 mx-auto mb-3" />
                        <p className="text-[9px] font-black text-warm-ink/10 uppercase tracking-widest display">No active streams</p>
                      </div>
                    ) : (
                      conversations.map((convo) => (
                        <button
                          key={convo.id}
                          onClick={() => {
                            setActiveConversationId(convo.id);
                            setActiveTab('chat');
                            setIsSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full text-left p-5 rounded-[28px] transition-all duration-500 group relative border overflow-hidden",
                            activeConversationId === convo.id && activeTab === 'chat'
                              ? "bg-warm-accent/10 border-warm-accent/30 text-warm-ink shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] glow-border"
                              : "bg-transparent border-transparent text-warm-ink/40 hover:bg-warm-accent/5 hover:text-warm-ink"
                          )}
                        >
                          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                          <div className="flex items-center gap-4 relative z-10">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 shadow-lg",
                              activeConversationId === convo.id ? "bg-warm-accent text-warm-bg scale-110" : "bg-warm-ink/5 text-warm-ink/30 group-hover:bg-warm-accent/10 group-hover:text-warm-accent"
                            )}>
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="truncate text-[12px] font-black tracking-tight display group-hover:text-warm-accent transition-colors">{convo.title}</span>
                              <span className="text-[8px] font-black text-warm-accent/40 uppercase tracking-widest mt-0.5">
                                {new Date(convo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Saved Reports */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="text-[10px] font-black text-warm-ink/20 uppercase tracking-[0.4em] display">Archived Analysis</h3>
                    <span className="text-[9px] font-mono text-warm-accent/40 bg-warm-accent/5 px-2 py-0.5 rounded border border-warm-accent/10">{savedItems.length}</span>
                  </div>
                  <div className="space-y-4 px-2">
                    {savedItems.length === 0 ? (
                      <div className="text-center py-16 px-6 border-2 border-dashed border-warm-ink/10 rounded-[40px] bg-warm-ink/[0.01]">
                        <Heart className="w-12 h-12 text-warm-ink/5 mx-auto mb-6 animate-pulse" />
                        <p className="text-[10px] font-black text-warm-ink/20 uppercase tracking-[0.3em] italic display">No archives found</p>
                      </div>
                    ) : (
                      savedItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            loadSavedItem(item);
                            setIsSidebarOpen(false);
                          }}
                          className="w-full text-left p-6 rounded-[36px] bg-glass border border-glass-border hover:border-warm-accent/30 transition-all duration-700 group relative overflow-hidden glow-border shadow-xl hover:scale-[1.02] cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              loadSavedItem(item);
                              setIsSidebarOpen(false);
                            }
                          }}
                        >
                          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                          <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-warm-accent animate-neural-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span className="text-[10px] font-black text-warm-accent uppercase tracking-[0.2em] display">
                                  {item.report.score}% Neural Match
                                </span>
                              </div>
                              <span className="text-[9px] font-mono text-warm-ink/20 uppercase">
                                {new Date(item.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-base font-black text-warm-ink/80 truncate pr-8 display tracking-tight group-hover:text-warm-accent transition-colors block">{item.report.name}</span>
                          </div>
                          <button
                            onClick={(e) => deleteSavedItem(item.id, e)}
                            className="absolute top-6 right-6 p-2.5 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all duration-300 hover:bg-red-500/10 rounded-xl z-20"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sidebar Footer */}
              <div className="p-6 border-t border-glass-border bg-warm-accent/[0.02] backdrop-blur-xl space-y-4">
                {/* Theme Selector */}
                <div className="flex items-center justify-between p-2 bg-glass border border-glass-border rounded-[24px]">
                  <button 
                    onClick={() => setTheme('midnight')}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                      theme === 'midnight' ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "text-warm-ink/30 hover:text-warm-ink/60"
                    )}
                    title="Midnight Calm"
                  >
                    <Moon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setTheme('sunset')}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                      theme === 'sunset' ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]" : "text-warm-ink/30 hover:text-warm-ink/60"
                    )}
                    title="Sunset Warmth"
                  >
                    <Sun className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setTheme('forest')}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                      theme === 'forest' ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "text-warm-ink/30 hover:text-warm-ink/60"
                    )}
                    title="Forest Peace"
                  >
                    <Leaf className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-[32px] bg-glass border border-glass-border group hover:border-warm-accent/20 transition-all duration-500 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-warm-accent/10 flex items-center justify-center text-warm-accent border border-warm-accent/20 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-black text-warm-ink/80 truncate display tracking-tight">Neural Analyst</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black text-warm-ink/30 uppercase tracking-[0.2em] display">Active Sync</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 lg:h-24 border-b border-glass-border flex items-center justify-between px-4 lg:px-10 bg-glass/40 backdrop-blur-3xl z-30 relative overflow-hidden">
          {/* Scanline effect in header */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-0 opacity-10" />
          
          <div className="flex items-center gap-4 lg:gap-8 relative z-10">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 lg:p-3 hover:bg-warm-accent/10 rounded-xl lg:rounded-2xl transition-all duration-500 text-warm-ink/30 hover:text-warm-accent group border border-transparent hover:border-warm-accent/20 shadow-lg"
            >
              <Menu className={cn("w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform duration-500", isSidebarOpen && "rotate-90")} />
            </button>
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-warm-accent rounded-xl lg:rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.4)] border border-warm-accent/50 group relative overflow-hidden">
                <div className="absolute inset-0 shimmer opacity-30" />
                <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-warm-bg relative z-10" />
              </div>
              <div className="truncate">
                <h1 className="display text-base lg:text-2xl font-black text-warm-ink tracking-tight text-glow uppercase truncate">Vibe Engine <span className="hidden sm:inline text-warm-accent/50 font-light italic">v2.5</span></h1>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <p className="text-[8px] lg:text-[9px] font-black text-warm-accent/60 uppercase tracking-[0.2em] sm:tracking-[0.4em] display truncate">Neural Core Synchronized</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 relative z-10">
            <div className="hidden lg:flex items-center gap-6 mr-6 px-6 py-2 bg-warm-ink/[0.02] border border-warm-ink/5 rounded-2xl">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black uppercase tracking-widest text-warm-ink/30">Latency</span>
                <span className="text-[10px] font-mono text-emerald-400">12ms</span>
              </div>
              <div className="w-px h-6 bg-warm-ink/10" />
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black uppercase tracking-widest text-warm-ink/30">Uptime</span>
                <span className="text-[10px] font-mono text-warm-accent">99.9%</span>
              </div>
            </div>
            
            <button 
              onClick={copyToClipboard}
              className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-warm-accent/5 hover:bg-warm-accent/10 text-warm-accent rounded-xl transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] border border-warm-accent/20 display group"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
              {copied ? 'Link Copied' : 'Share Analysis'}
            </button>
            <button 
              onClick={handleInstallClick}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 bg-warm-accent text-warm-bg hover:bg-warm-accent/90 rounded-xl transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.3)] display group relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer opacity-20" />
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-warm-bg/50">
          <AnimatePresence mode="wait">

            {activeTab === 'chat' && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col max-w-5xl lg:max-w-7xl mx-auto w-full relative"
              >
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar relative z-10">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 relative">
                      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
                      
                      <div className="relative">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-[-60px] border border-dashed border-warm-accent/10 rounded-full"
                        />
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-[-30px] border border-dashed border-warm-secondary/10 rounded-full"
                        />
                        <div className="absolute inset-0 bg-warm-accent/20 blur-[100px] rounded-full animate-pulse-soft" />
                        <div className="w-48 h-48 bg-glass border border-glass-border rounded-[56px] flex items-center justify-center relative z-10 shadow-[0_0_60px_rgba(59,130,246,0.3)] group hover:scale-105 transition-all duration-700 glow-border">
                          <div className="absolute inset-0 shimmer opacity-20" />
                          <div className="absolute inset-0 bg-gradient-to-br from-warm-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          <MessageSquare className="w-24 h-24 text-warm-accent group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" />
                          
                          {/* Scanning line effect */}
                          <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
                            <div className="w-full h-1 bg-warm-accent/40 blur-sm animate-scan absolute top-0" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-8 relative z-10">
                        <div className="space-y-4">
                          <h2 className="display text-4xl sm:text-6xl lg:text-8xl font-black text-warm-ink tracking-tighter text-glow uppercase leading-none">Neural Interface</h2>
                          <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent via-warm-accent/40 to-transparent" />
                            <p className="text-warm-accent/60 font-black uppercase tracking-[0.2em] sm:tracking-[0.5em] text-[9px] sm:text-[11px] display">Vibe Engine v2.5 Core</p>
                            <div className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent via-warm-accent/40 to-transparent" />
                          </div>
                        </div>
                        <p className="text-warm-ink/40 text-lg sm:text-2xl max-w-2xl mx-auto italic serif leading-relaxed px-6 sm:px-10">
                          "I am your specialized manga analysis unit. Feed me a title, and I will decode its emotional frequency across the neural network."
                        </p>

                        <div className="flex justify-center pt-4">
                          <button 
                            onClick={fetchEmergencyComfort}
                            className="group relative flex items-center gap-4 px-10 py-5 bg-warm-accent text-warm-bg rounded-[32px] font-black uppercase tracking-[0.4em] text-[12px] shadow-[0_0_50px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-700 display overflow-hidden"
                          >
                            <div className="absolute inset-0 shimmer opacity-30" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Heart className="w-6 h-6 fill-current animate-pulse" />
                            Emergency Comfort
                          </button>
                        </div>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                          className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto w-full"
                        >
                          <div className="space-y-4 text-center p-6 rounded-[32px] bg-warm-accent/5 border border-warm-accent/10">
                            <div className="w-10 h-10 rounded-full bg-warm-accent/10 flex items-center justify-center text-warm-accent mx-auto">
                              <Zap className="w-5 h-5" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-warm-ink">Instant Analysis</h4>
                            <p className="text-[10px] text-warm-ink/40 leading-relaxed italic">Describe a vibe or paste a title to begin the neural decoding process.</p>
                          </div>
                          <div className="space-y-4 text-center p-6 rounded-[32px] bg-warm-accent/5 border border-warm-accent/10">
                            <div className="w-10 h-10 rounded-full bg-warm-accent/10 flex items-center justify-center text-warm-accent mx-auto">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-warm-ink">Safety First</h4>
                            <p className="text-[10px] text-warm-ink/40 leading-relaxed italic">Every analysis includes a comprehensive safety check for your peace of mind.</p>
                          </div>
                          <div className="space-y-4 text-center p-6 rounded-[32px] bg-warm-accent/5 border border-warm-accent/10">
                            <div className="w-10 h-10 rounded-full bg-warm-accent/10 flex items-center justify-center text-warm-accent mx-auto">
                              <Settings className="w-5 h-5" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-warm-ink">Custom Rules</h4>
                            <p className="text-[10px] text-warm-ink/40 leading-relaxed italic">Add your own triggers or preferences in the settings to personalize results.</p>
                          </div>
                        </motion.div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full max-w-4xl relative z-10 px-4 sm:px-6">
                        {[
                          "Is 'Blue Box' cozy enough?",
                          "Search for 'The Fragrant Flower Blooms with Dignity'",
                          "What about 'Skip and Loafer'?",
                          "Any recommendations like 'Horimiya'?"
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setChatInput(suggestion)}
                            className="p-4 sm:p-10 glass-card rounded-[20px] sm:rounded-[40px] text-left text-xs sm:text-base text-warm-ink/60 hover:text-warm-ink transition-all duration-700 group relative overflow-hidden glow-border hover:scale-[1.02] hover:shadow-warm-accent/10"
                          >
                            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <div className="flex items-center gap-4 sm:gap-6 relative z-10 italic serif">
                              <div className="w-8 h-8 sm:w-14 h-14 rounded-lg sm:rounded-2xl bg-warm-accent/10 flex items-center justify-center text-warm-accent group-hover:bg-warm-accent group-hover:text-warm-bg group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-500 shrink-0">
                                <Sparkles className="w-4 h-4 sm:w-7 h-7" />
                              </div>
                              <span className="leading-tight truncate sm:whitespace-normal">{suggestion}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className={cn(
                          "flex gap-4 sm:gap-8",
                          msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 sm:w-14 h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden border transition-all duration-700 hover:scale-110 hover:rotate-3",
                          msg.role === 'user' ? "bg-warm-accent text-warm-bg border-warm-accent/50" : "bg-glass border-glass-border text-warm-accent"
                        )}>
                          {msg.role === 'user' ? <User className="w-5 h-5 sm:w-7 sm:h-7" /> : <Bot className="w-5 h-5 sm:w-7 sm:h-7" />}
                          <div className="absolute inset-0 shimmer opacity-20" />
                          {msg.role === 'model' && (
                            <div className="absolute inset-0 bg-warm-accent/10 animate-pulse" />
                          )}
                        </div>
                        <div className={cn(
                          "p-4 sm:p-8 rounded-[24px] sm:rounded-[40px] text-sm sm:text-lg leading-relaxed shadow-2xl max-w-[90%] sm:max-w-[85%] relative group glass-card transition-all duration-500",
                          msg.role === 'user' 
                            ? "bg-warm-accent text-warm-bg rounded-tr-none font-medium border-warm-accent/50 shadow-warm-accent/10" 
                            : "rounded-tl-none hover:border-warm-accent/30"
                        )}>
                          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                          
                          {/* Neural accent for model messages */}
                          {msg.role === 'model' && (
                            <div className="absolute top-0 left-0 w-1 h-12 bg-warm-accent/40 rounded-full -ml-0.5 mt-8" />
                          )}

                          <div className="markdown-body relative z-10">
                            <Markdown>{msg.text}</Markdown>
                          </div>
                          
                          {/* Subtle timestamp or status */}
                          <div className={cn(
                            "absolute bottom-[-28px] text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-40 transition-all duration-500 flex items-center gap-2",
                            msg.role === 'user' ? "right-6" : "left-6"
                          )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", msg.role === 'user' ? "bg-warm-bg" : "bg-warm-accent")} />
                            {msg.role === 'user' ? 'Transmission Secure' : 'Neural Response Verified'}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-glass border border-glass-border text-warm-accent flex items-center justify-center shrink-0 shadow-2xl">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="bg-glass border border-glass-border p-6 rounded-[32px] rounded-tl-none flex items-center gap-3 shadow-2xl">
                        <div className="w-2.5 h-2.5 bg-warm-accent rounded-full animate-bounce [animation-duration:1s]" />
                        <div className="w-2.5 h-2.5 bg-warm-accent rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]" />
                        <div className="w-2.5 h-2.5 bg-warm-accent rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input Area */}
                <div className="p-4 sm:p-10 border-t border-glass-border bg-glass/40 backdrop-blur-3xl relative z-30">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-warm-accent/40 to-transparent" />
                  
                  <form onSubmit={handleSendMessage} className="relative group max-w-5xl mx-auto">
                    <div className="absolute -inset-2 sm:-inset-6 bg-gradient-to-r from-warm-accent/20 via-warm-secondary/20 to-warm-accent/20 rounded-[24px] sm:rounded-[56px] blur-xl sm:blur-3xl opacity-0 group-hover:opacity-60 transition duration-1000"></div>
                    <div className="relative flex items-center gap-2 sm:gap-6 bg-glass border border-glass-border rounded-[24px] sm:rounded-[48px] p-2 pr-3 sm:p-5 sm:pr-8 shadow-2xl group-focus-within:border-warm-accent/50 transition-all duration-700 glow-border">
                      <div className="w-8 h-8 sm:w-14 h-14 rounded-lg sm:rounded-2xl bg-warm-accent/10 flex items-center justify-center text-warm-accent shrink-0 border border-warm-accent/20 group-focus-within:bg-warm-accent group-focus-within:text-warm-bg transition-all duration-500">
                        <Bot className="w-4 h-4 sm:w-7 h-7" />
                      </div>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e as any);
                          }
                        }}
                        placeholder="Search or ask anything..."
                        className="flex-1 bg-transparent border-none text-warm-ink placeholder:text-warm-ink/20 focus:ring-0 py-1 sm:py-4 px-1 sm:px-2 text-sm sm:text-xl font-medium"
                      />
                      <div className="flex items-center gap-1 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (chatInput.trim()) {
                              const name = chatInput.replace(/search\s+/i, '').trim();
                              analyzeMangaInternal(name, true);
                              setChatInput('');
                            }
                          }}
                          disabled={isChatLoading || !chatInput.trim()}
                          className="bg-warm-accent/10 text-warm-accent px-3 py-2 sm:px-6 sm:py-4 rounded-lg sm:rounded-2xl hover:bg-warm-accent hover:text-warm-bg disabled:opacity-30 transition-all text-[8px] sm:text-[11px] font-black uppercase tracking-widest sm:tracking-[0.4em] text-warm-accent/60 border border-warm-accent/20 flex items-center gap-1 sm:gap-3 display group/btn"
                        >
                          <Zap className="w-3.5 h-3.5 sm:w-5 h-5 group-hover/btn:animate-pulse" />
                          <span className="hidden sm:inline">Neural Search</span>
                        </button>
                        <button
                          type="submit"
                          disabled={isChatLoading || !chatInput.trim()}
                          className="bg-warm-accent text-warm-bg p-2.5 sm:p-5 rounded-lg sm:rounded-2xl hover:bg-warm-accent/90 disabled:opacity-30 transition-all shadow-[0_0_40px_rgba(59,130,246,0.4)] group/send"
                        >
                          <Send className="w-4 h-4 sm:w-7 h-7 group-hover/send:translate-x-1 group-hover/send:-translate-y-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-warm-ink/20 display">
                      <div className="w-1.5 h-1.5 rounded-full bg-warm-accent/40 animate-pulse" />
                      Neural Processing Unit Active
                      <div className="w-1.5 h-1.5 rounded-full bg-warm-accent/40 animate-pulse" />
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'pulse' && (
              <motion.div
                key="pulse-tab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 max-w-6xl mx-auto space-y-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <h2 className="display text-6xl font-black text-warm-ink tracking-tighter uppercase">Neural Pulse</h2>
                      <div className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border",
                        pulseConfig?.is_active ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-warm-ink/5 text-warm-ink/30 border-warm-ink/10"
                      )}>
                        <div className={cn("w-2 h-2 rounded-full", pulseConfig?.is_active ? "bg-emerald-500 animate-pulse" : "bg-warm-ink/20")} />
                        {pulseConfig?.is_active ? "Active Scan" : "Standby"}
                      </div>
                    </div>
                    <p className="text-warm-ink/40 italic serif text-xl">"Background neural scanning. Finding cozy frequencies while you sleep."</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Configuration Panel */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-glass border border-glass-border rounded-[40px] p-8 space-y-8 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-warm-accent/5 blur-[60px] -mr-16 -mt-16 rounded-full" />
                      
                      <div className="space-y-6 relative z-10">
                        <div className="flex items-center justify-between">
                          <h3 className="display text-xl font-black text-warm-ink uppercase tracking-widest">Scan Control</h3>
                          <button
                            onClick={() => updatePulseConfig({ is_active: !pulseConfig?.is_active })}
                            className={cn(
                              "w-14 h-8 rounded-full p-1 transition-all duration-500",
                              pulseConfig?.is_active ? "bg-emerald-500" : "bg-warm-ink/20"
                            )}
                          >
                            <div className={cn(
                              "w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500",
                              pulseConfig?.is_active ? "translate-x-6" : "translate-x-0"
                            )} />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-warm-ink/30 uppercase tracking-[0.3em]">Scan Interval (Minutes)</label>
                          <select
                            value={pulseConfig?.interval_minutes || 60}
                            onChange={(e) => updatePulseConfig({ interval_minutes: parseInt(e.target.value) })}
                            className="w-full bg-warm-bg/50 border border-glass-border rounded-2xl px-6 py-4 text-warm-ink focus:outline-none focus:border-warm-accent/50 transition-all font-bold"
                          >
                            <option value={5}>24/7 Continuous (5m)</option>
                            <option value={15}>Every 15 Minutes</option>
                            <option value={30}>Every 30 Minutes</option>
                            <option value={60}>Every Hour</option>
                            <option value={120}>Every 2 Hours</option>
                            <option value={360}>Every 6 Hours</option>
                          </select>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-warm-ink/30 uppercase tracking-[0.3em]">Neural Keywords</label>
                          <textarea
                            value={pulseConfig?.keywords || ""}
                            onChange={(e) => setPulseConfig(prev => prev ? { ...prev, keywords: e.target.value } : null)}
                            onBlur={() => updatePulseConfig({ keywords: pulseConfig?.keywords })}
                            placeholder="e.g. cozy romance, slice of life, no drama"
                            className="w-full bg-warm-bg/50 border border-glass-border rounded-2xl px-6 py-4 text-warm-ink focus:outline-none focus:border-warm-accent/50 transition-all serif italic text-sm min-h-[120px] resize-none"
                          />
                        </div>

                        {pulseConfig?.last_scan_at && (
                          <div className="pt-6 border-t border-warm-ink/5 flex items-center justify-between text-[10px] font-bold text-warm-ink/30 uppercase tracking-widest">
                            <span>Last Scan</span>
                            <span>{new Date(pulseConfig.last_scan_at).toLocaleTimeString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-warm-accent/5 border border-warm-accent/10 rounded-[32px] p-6 flex items-start gap-4">
                      <div className="bg-warm-accent/10 p-2 rounded-xl text-warm-accent">
                        <Info className="w-4 h-4" />
                      </div>
                      <p className="text-[11px] text-warm-ink/60 leading-relaxed serif italic">
                        "The Neural Pulse engine runs on our server 24/7. It will continue scanning even if you close this tab. Results will appear here automatically."
                      </p>
                    </div>
                  </div>

                  {/* Results Panel */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-4">
                      <h3 className="display text-xl font-black text-warm-ink uppercase tracking-widest">Pulse Results</h3>
                      <span className="text-[10px] font-black text-warm-ink/30 uppercase tracking-widest">{pulseResults.length} Titles Found</span>
                    </div>

                    {isPulseLoading ? (
                      <div className="flex flex-col items-center justify-center py-24 sm:py-32 space-y-4">
                        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-warm-accent animate-spin" />
                        <p className="text-[9px] sm:text-[10px] font-black text-warm-ink/30 uppercase tracking-widest">Syncing with Neural Server...</p>
                      </div>
                    ) : pulseResults.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 sm:py-32 space-y-8 bg-glass border border-dashed border-glass-border rounded-[40px] sm:rounded-[56px] px-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-warm-accent/5 flex items-center justify-center text-warm-accent/20">
                          <Zap className="w-10 h-10 sm:w-12 sm:h-12" />
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="display text-xl sm:text-2xl font-black text-warm-ink/40 uppercase tracking-widest">No Results Yet</h3>
                          <p className="text-warm-ink/20 italic serif text-sm sm:text-base">The pulse engine is searching for matches...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {pulseResults.map((result) => (
                          <motion.div
                            layout
                            key={result.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-glass border border-glass-border rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 space-y-6 group hover:border-warm-accent/30 transition-all shadow-2xl relative overflow-hidden flex flex-col h-full"
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-warm-accent/5 blur-[60px] -mr-16 -mt-16 rounded-full group-hover:bg-warm-accent/10 transition-all" />
                            
                            <div className="flex items-start justify-between relative z-10 gap-3">
                              <div className="space-y-1 truncate">
                                <h4 className="display text-xl sm:text-2xl font-black text-warm-ink uppercase tracking-tight group-hover:text-warm-accent transition-colors truncate">{result.manga_name}</h4>
                                <p className="text-[9px] sm:text-[10px] font-bold text-warm-ink/30 uppercase tracking-widest">{new Date(result.found_at).toLocaleDateString()}</p>
                              </div>
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-warm-accent/10 flex items-center justify-center text-warm-accent font-black text-xs sm:text-sm border border-warm-accent/20 shrink-0">
                                {result.report.cozinessScore}%
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-warm-ink/60 line-clamp-3 italic serif leading-relaxed relative z-10 flex-1">
                              "{result.report.summary}"
                            </p>

                            <div className="pt-4 sm:pt-6 border-t border-warm-ink/5 flex items-center gap-2 sm:gap-3 relative z-10">
                              <button
                                onClick={() => {
                                  setMangaName(result.manga_name);
                                  setActiveTab('chat');
                                  analyzeMangaInternal(result.manga_name);
                                }}
                                className="flex-1 py-3 sm:py-4 bg-warm-accent text-warm-bg rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] shadow-lg shadow-warm-accent/20 hover:bg-warm-accent/90 transition-all display"
                              >
                                Full Analysis
                              </button>
                              <button
                                onClick={() => deletePulseResult(result.id)}
                                className="p-3 sm:p-4 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl sm:rounded-2xl transition-all border border-red-500/10"
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 h-5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'blacklist' && (
              <motion.div
                key="blacklist-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 max-w-4xl mx-auto space-y-12"
              >
                <div className="space-y-4">
                  <h2 className="display text-6xl font-black text-warm-ink tracking-tighter uppercase">Neural Blacklist</h2>
                  <p className="text-warm-ink/40 italic serif text-xl">"Permanently excluded frequencies. These titles will never be recommended again."</p>
                </div>

                {blacklist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 space-y-8 bg-glass border border-dashed border-glass-border rounded-[56px]">
                    <div className="w-24 h-24 rounded-full bg-warm-accent/5 flex items-center justify-center text-warm-accent/20">
                      <ShieldCheck className="w-12 h-12" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="display text-2xl font-black text-warm-ink/40 uppercase tracking-widest">Blacklist is Empty</h3>
                      <p className="text-warm-ink/20 italic serif">You haven't blacklisted any titles yet.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blacklist.map((name) => (
                      <motion.div
                        layout
                        key={name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 rounded-[32px] border border-glass-border flex items-center justify-between group hover:border-red-500/30 transition-all shadow-xl"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                            <Ban className="w-6 h-6" />
                          </div>
                          <span className="display text-2xl font-black text-warm-ink uppercase tracking-tight">{name}</span>
                        </div>
                        <button
                          onClick={() => {
                            setBlacklist(prev => prev.filter(n => n !== name));
                            showToast(`"${name}" removed from blacklist`, "info");
                          }}
                          className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-red-500/20"
                        >
                          Remove
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'library' && (
              <motion.div
                key="library-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 max-w-7xl mx-auto space-y-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <h2 className="display text-6xl font-black text-warm-ink tracking-tighter uppercase">Neural Library</h2>
                      {savedItems.length > 0 && (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to clear all archived analyses?")) {
                              setSavedItems([]);
                              showToast("Library cleared", "info");
                            }
                          }}
                          className="px-4 py-2 bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/10"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <p className="text-warm-ink/40 italic serif text-xl">"Your personal library of decoded neural frequencies."</p>
                  </div>
                  <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-ink/20 group-focus-within:text-warm-accent transition-colors" />
                    <input 
                      type="text"
                      value={savedSearchQuery}
                      onChange={(e) => setSavedSearchQuery(e.target.value)}
                      placeholder="Search library..."
                      className="w-full bg-glass border border-glass-border rounded-full pl-14 pr-6 py-4 text-sm font-medium text-warm-ink focus:outline-none focus:border-warm-accent/50 transition-all shadow-xl"
                    />
                  </div>
                </div>

                {savedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 space-y-8 bg-glass border border-dashed border-glass-border rounded-[56px]">
                    <div className="w-24 h-24 rounded-full bg-warm-accent/5 flex items-center justify-center text-warm-accent/20">
                      <Heart className="w-12 h-12 animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="display text-2xl font-black text-warm-ink/40 uppercase tracking-widest">No Library Found</h3>
                      <p className="text-warm-ink/20 italic serif">Start an analysis and save it to see it here.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="px-8 py-4 bg-warm-accent text-warm-bg rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-warm-accent/20 hover:scale-105 transition-all"
                    >
                      Return to Interface
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                    {savedItems.filter(item => 
                      item.report.name.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
                      item.report.summary.toLowerCase().includes(savedSearchQuery.toLowerCase())
                    ).map((item, idx) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card rounded-[48px] p-6 md:p-8 border border-glass-border hover:border-warm-accent/30 transition-all duration-700 group relative overflow-hidden flex flex-col gap-6 md:gap-8 shadow-2xl hover:scale-[1.02] glow-border h-full"
                      >
                        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                        
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black text-warm-accent uppercase tracking-[0.3em] display">
                              {item.report.score}% Match
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-warm-ink/20 uppercase">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-4 relative z-10 flex-1">
                          <h3 className="display text-3xl font-black text-warm-ink tracking-tight group-hover:text-warm-accent transition-colors leading-none uppercase">{item.report.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-warm-accent/5 text-warm-accent text-[9px] font-black uppercase tracking-widest rounded-full border border-warm-accent/10">
                              {item.report.type}
                            </span>
                            <span className="px-3 py-1 bg-warm-ink/5 text-warm-ink/40 text-[9px] font-black uppercase tracking-widest rounded-full border border-warm-ink/10">
                              {item.report.year}
                            </span>
                          </div>
                          <p className="text-sm text-warm-ink/60 line-clamp-3 italic serif leading-relaxed">
                            {item.report.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 relative z-10 pt-6 border-t border-warm-accent/10">
                          <button
                            onClick={() => loadSavedItem(item)}
                            className="flex-1 py-4 bg-warm-accent text-warm-bg rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-warm-accent/20 hover:bg-warm-accent/90 transition-all display"
                          >
                            Access Data
                          </button>
                          <button
                            onClick={(e) => deleteSavedItem(item.id, e)}
                            className="p-4 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-red-500/10"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 max-w-4xl mx-auto space-y-12"
              >
                <div className="space-y-4">
                  <h2 className="serif text-4xl font-medium text-warm-ink">Optional Preferences</h2>
                  <p className="text-warm-ink/40 italic serif text-lg">"Define your own rules. The AI will check every manga against these."</p>
                </div>

                <div className="bg-glass border border-glass-border rounded-[32px] p-8 space-y-8 shadow-xl">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newPreference.trim()) {
                        setUserPreferences([...userPreferences, newPreference.trim()]);
                        setNewPreference('');
                      }
                    }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <input
                      type="text"
                      value={newPreference}
                      onChange={(e) => setNewPreference(e.target.value)}
                      placeholder="Add a new preference (e.g. 'No cliffhangers')"
                      className="flex-1 bg-warm-bg/50 border border-glass-border rounded-2xl px-6 py-4 text-warm-ink focus:outline-none focus:border-warm-accent/50 transition-all serif italic text-sm sm:text-base"
                    />
                    <button
                      type="submit"
                      className="px-8 py-4 bg-warm-accent text-warm-bg rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-warm-accent/90 transition-all shadow-lg shadow-warm-accent/20 whitespace-nowrap"
                    >
                      Add Rule
                    </button>
                  </form>

                    <div className="space-y-3">
                      {userPreferences.map((pref, i) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={i}
                          className="flex items-center justify-between p-5 bg-warm-accent/5 border border-warm-accent/10 rounded-2xl group hover:bg-warm-accent/10 transition-all relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 bg-warm-accent/10 rounded-xl flex items-center justify-center text-warm-accent shadow-inner">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="text-warm-ink/80 font-medium serif italic text-base">{pref}</span>
                          </div>
                          <button
                            onClick={() => setUserPreferences(userPreferences.filter((_, idx) => idx !== i))}
                            className="p-2 text-warm-ink/20 hover:text-red-500 transition-colors relative z-10"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                      {userPreferences.length === 0 && (
                        <div className="text-center py-16 border-2 border-dashed border-glass-border rounded-[32px] bg-glass/20">
                          <div className="w-16 h-16 bg-warm-ink/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-8 h-8 text-warm-ink/20" />
                          </div>
                          <p className="text-warm-ink/30 italic serif text-lg">No optional preferences set yet.</p>
                          <p className="text-warm-ink/20 text-xs uppercase tracking-widest mt-2">Add your first rule above</p>
                        </div>
                      )}
                    </div>
                </div>

                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-[32px] p-8 flex items-start gap-6">
                  <div className="bg-yellow-500/10 p-4 rounded-2xl text-yellow-500">
                    <Info className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-yellow-500/80">How it works</h4>
                    <p className="text-sm text-warm-ink/60 leading-relaxed italic">
                      "These rules are added to the AI's analysis prompt alongside the 11 Hard Rules. 
                      The report will show a separate 'Optional Rule Preferences' section detailing how well each manga matches your personal taste."
                    </p>
                  </div>
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-8 flex items-start gap-6">
                  <div className="bg-red-500/10 p-4 rounded-2xl text-red-500">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-red-500/80">System Maintenance</h4>
                      <p className="text-sm text-warm-ink/60 leading-relaxed italic">
                        "If you're seeing an older version of the app or experiencing interface bugs, clearing the cache might help. This will reset your local data."
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm("This will clear your local preferences and saved items. Continue?")) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                      className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-red-500/20"
                    >
                      Clear Cache & Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Discovery tab removed as per user request */}

            {activeTab === 'comfort' && (
              <motion.div
                key="comfort-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 max-w-[1600px] mx-auto space-y-12"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h2 className="serif text-4xl font-medium text-warm-ink mb-2">Comfort Feed</h2>
                    <p className="text-warm-ink/40 italic serif text-lg">"Hand-picked wholesome mangas that will never hurt you."</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsFastSearch(!isFastSearch)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg",
                        isFastSearch 
                          ? "bg-warm-accent text-warm-bg shadow-warm-accent/20" 
                          : "bg-glass border border-glass-border text-warm-ink/60 hover:bg-warm-accent/10 hover:text-warm-accent"
                      )}
                    >
                      <Zap className={cn("w-4 h-4", isFastSearch && "fill-current")} />
                      Fast Search {isFastSearch ? 'ON' : 'OFF'}
                    </button>
                    <button
                      onClick={() => fetchComfortMangas()}
                      disabled={isComfortLoading}
                      className="flex items-center gap-3 px-8 py-4 bg-warm-accent text-warm-bg hover:bg-warm-accent/90 disabled:opacity-50 text-sm font-bold uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-warm-accent/20"
                    >
                      <RefreshCw className={cn("w-5 h-5", isComfortLoading && "animate-spin")} />
                      Refresh Comfort
                    </button>
                  </div>
                </div>

                {isComfortLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-12">
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-48 h-48 rounded-full border-4 border-warm-accent/10 border-t-warm-accent"
                      />
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                         <span className="text-5xl font-black text-warm-ink leading-none">{comfortProgress}</span>
                         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-warm-ink/40 mt-2">Analyzed</span>
                      </div>
                    </div>
                    <div className="text-center space-y-4 max-w-2xl">
                      <h3 className="serif text-4xl font-medium text-warm-ink">Generating Comfort Feed</h3>
                      <p className="text-warm-ink/40 italic serif text-lg">"Performing deep safety audits in parallel. We are silently deleting any manga that fails your strict safety rules."</p>
                      
                      {/* Blocked Counter */}
                      {comfortProgress > 0 && (comfortProgress - comfortItems.length) > 0 && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mt-4">
                          <ShieldAlert className="w-4 h-4 text-red-500" />
                          <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                            {comfortProgress - comfortItems.length} Toxic Mangas Blocked
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={cn(
                          "h-80 bg-glass rounded-[48px] border transition-all duration-700 relative overflow-hidden",
                          i < comfortItems.length ? "opacity-100 border-warm-accent/30 shadow-2xl shadow-warm-accent/10" : "opacity-20 animate-pulse border-glass-border"
                        )}>
                           {i < comfortItems.length ? (
                             <div className="h-full flex flex-col items-center justify-center gap-4">
                               <div className="w-16 h-16 bg-warm-accent/20 rounded-full flex items-center justify-center">
                                 <CheckCircle2 className="w-8 h-8 text-warm-accent" />
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-warm-accent">100% Safe Match</span>
                             </div>
                           ) : (
                             <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-12 h-12 bg-warm-ink/5 rounded-full animate-ping" />
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : error ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto p-10 bg-red-500/5 border border-red-500/20 rounded-[40px] text-center space-y-8 shadow-2xl"
                  >
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="serif text-2xl font-medium text-warm-ink">Comfort Feed Failed</h3>
                      <p className="text-warm-ink/40 italic serif">{error}</p>
                    </div>
                    <button 
                      onClick={() => { setError(null); fetchComfortMangas(); }}
                      className="w-full py-4 bg-warm-accent text-warm-bg rounded-2xl transition-all font-bold uppercase tracking-widest text-xs shadow-xl shadow-warm-accent/20"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : comfortItems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto p-12 bg-glass border border-glass-border rounded-[40px] text-center space-y-8 shadow-2xl"
                  >
                    <div className="w-24 h-24 bg-warm-accent/10 rounded-full flex items-center justify-center mx-auto relative">
                      <div className="absolute inset-0 bg-warm-accent/20 rounded-full animate-ping opacity-20" />
                      <Heart className="w-12 h-12 text-warm-accent" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="serif text-3xl font-medium text-warm-ink">Your Comfort Feed is Empty</h3>
                      <p className="text-warm-ink/50 italic serif leading-relaxed">
                        "We couldn't find any mangas that perfectly match your strict safety rules right now. Try refreshing or adjusting your preferences."
                      </p>
                    </div>
                    <button 
                      onClick={() => fetchComfortMangas()}
                      className="w-full py-5 bg-warm-accent text-warm-bg rounded-2xl transition-all font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-warm-accent/20 active:scale-95"
                    >
                      Refresh Neural Search
                    </button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {comfortItems.map((item, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={item.name}
                        onClick={() => {
                          setReport(item);
                          setReportTab('safety');
                          setActiveTab('report');
                        }}
                        className="bg-glass border border-glass-border rounded-[24px] md:rounded-[32px] overflow-hidden hover:border-warm-accent/50 transition-all group flex flex-col h-full shadow-lg relative cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-warm-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="p-4 md:p-8 flex-1 flex flex-col space-y-3 md:space-y-6 relative z-10">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                                <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest text-warm-accent bg-warm-accent/10 px-1.5 md:px-3 py-0.5 md:py-1 rounded-full border border-warm-accent/10">
                                  {item.type}
                                </span>
                                <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest text-warm-ink/40 bg-warm-ink/5 px-1.5 md:px-3 py-0.5 md:py-1 rounded-full border border-warm-ink/10">
                                  {item.year}
                                </span>
                                {item.lightNovel?.exists && (
                                  <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 md:px-3 py-0.5 md:py-1 rounded-full border border-emerald-500/10 flex items-center gap-1 md:gap-2">
                                    <BookOpen className="w-2 h-2 md:w-3 h-3" />
                                    LN
                                  </span>
                                )}
                              </div>
                              <h3 className="serif text-lg md:text-2xl font-medium text-warm-ink leading-tight group-hover:text-warm-accent transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-bold text-warm-ink/40 uppercase tracking-widest">
                                <Users className="w-2 h-2 md:w-3 h-3 text-warm-accent/40" />
                                <span>{item.mcs.male} & {item.mcs.female}</span>
                                <span className="mx-0.5">•</span>
                                <span className="text-warm-accent/60">{item.cozinessLevel}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              <CircularProgress value={item.safetyScore || 0} label="Safety" size={width < 768 ? 36 : 50} strokeWidth={width < 768 ? 4 : 5} />
                              <CircularProgress value={item.score} label="Cozy" size={width < 768 ? 36 : 50} strokeWidth={width < 768 ? 4 : 5} />
                            </div>
                          </div>
                          
                          <p className="text-[10px] md:text-sm text-warm-ink/60 leading-relaxed serif italic">
                            "{item.summary}"
                          </p>
                          
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {item.vibeTags?.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-[7px] md:text-[9px] font-bold uppercase tracking-wider text-warm-accent/70 bg-warm-accent/5 px-1.5 py-0.5 md:py-1 rounded-md border border-warm-accent/10">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="pt-1.5 mt-auto border-t border-warm-ink/5 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-warm-accent uppercase tracking-widest">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{item.score}% Match</span>
                            </div>
                            <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-warm-ink/30 uppercase tracking-widest group-hover:text-warm-accent transition-colors">
                              <span>Report</span>
                              <ChevronRight className="w-2.5 h-2.5" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {comfortItems.length > 0 && !isComfortLoading && (
                  <div className="mt-12 flex justify-center pb-20">
                    <button
                      onClick={() => fetchComfortMangas(true)}
                      className="group relative px-10 py-5 bg-warm-ink text-warm-bg rounded-[24px] font-black uppercase tracking-[0.4em] text-[10px] hover:scale-105 transition-all shadow-2xl overflow-hidden border border-warm-ink/10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-warm-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative z-10 flex items-center gap-4">
                        <Sparkles className="w-4 h-4 animate-pulse text-warm-accent" />
                        Load More Neural Matches
                      </span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'report' && (
              <motion.div
                key="report-tab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full relative overflow-hidden"
              >
                {/* Neural Background Pattern for PC */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] hidden lg:block">
                  <svg width="100%" height="100%">
                    <pattern id="neural-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="currentColor" />
                      <line x1="2" y1="2" x2="100" y2="2" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="2" y1="2" x2="2" y2="100" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#neural-grid)" />
                  </svg>
                </div>
                
                {loading && (
                  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-12">
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 rounded-full border-4 border-warm-accent/10 border-t-warm-accent"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-warm-accent animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="w-full max-w-md space-y-6">
                      <div className="text-center space-y-2">
                        <h3 className="serif text-3xl font-medium text-warm-ink">Deep Vibe Analysis</h3>
                        <p className="text-warm-ink/40 italic serif">"Cross-referencing databases & trope patterns..."</p>
                      </div>
                      
                      <div className="space-y-3">
                        {steps.map((step) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={step.id} 
                            className={cn(
                              "flex items-center gap-4 p-5 rounded-2xl border transition-all",
                              step.status === 'complete' ? "bg-warm-accent/10 border-warm-accent/20 text-warm-accent" :
                              step.status === 'loading' ? "bg-glass border-glass-border text-warm-ink" :
                              "bg-glass/50 border-glass-border/50 text-warm-ink/30"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              step.status === 'complete' ? "bg-warm-accent text-warm-bg" :
                              step.status === 'loading' ? "bg-warm-accent/10 text-warm-accent" :
                              "bg-warm-ink/5 text-warm-ink/20"
                            )}>
                              {step.status === 'complete' ? <Check className="w-6 h-6" /> : step.icon}
                            </div>
                            <span className="font-bold uppercase tracking-widest text-[10px]">{step.label}</span>
                            {step.status === 'loading' && (
                              <div className="ml-auto flex gap-1">
                                <div className="w-1.5 h-1.5 bg-warm-accent rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-warm-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-1.5 h-1.5 bg-warm-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto mt-20 p-10 bg-red-500/5 border border-red-500/20 rounded-[40px] text-center space-y-8 shadow-2xl"
                  >
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="serif text-2xl font-medium text-warm-ink">Analysis Failed</h3>
                      <p className="text-warm-ink/40 italic serif">{error}</p>
                    </div>
                    <button 
                      onClick={() => { setError(null); setActiveTab('chat'); }}
                      className="w-full py-4 bg-warm-accent text-warm-bg rounded-2xl transition-all font-bold uppercase tracking-widest text-xs shadow-xl shadow-warm-accent/20"
                    >
                      Back to Chat
                    </button>
                  </motion.div>
                )}

            {report && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-[1800px] mx-auto space-y-8 sm:space-y-12 pb-32 relative z-10 px-4 sm:px-12"
              >
                {/* Hero Section - Bento Grid Style */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                  {/* Main Info Card */}
                  <div className="lg:col-span-8 glass-card rounded-[40px] sm:rounded-[56px] p-6 sm:p-16 shadow-2xl relative overflow-hidden flex flex-col justify-between group md:min-h-[500px]">
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    
                    <div className="space-y-6 sm:space-y-10 relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                          <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-warm-accent/20 text-warm-accent text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-full border border-warm-accent/20">
                            {report.type}
                          </span>
                          <span className="flex items-center gap-2 text-warm-ink/40 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em]">
                            <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                            {report.year}
                          </span>
                          {report.volumes && (
                            <span className="flex items-center gap-2 text-warm-ink/40 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em]">
                              <Book className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                              {report.volumes}
                            </span>
                          )}
                        </div>
    
                        {/* Reading Progress Tracker */}
                        <div className="flex items-center justify-between sm:justify-start gap-4 bg-glass border border-glass-border p-2 rounded-2xl w-full sm:w-auto">
                          <div className="flex flex-col items-start sm:items-end px-2">
                            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-warm-ink/30">Reading Progress</span>
                            <span className="text-[10px] font-mono text-warm-accent">CH {savedItems.find(i => i.report.name === report.name)?.readingProgress || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => {
                                const item = savedItems.find(i => i.report.name === report.name);
                                if (item) updateReadingProgress(item.id, Math.max(0, (item.readingProgress || 0) - 1));
                              }}
                              className="w-8 h-8 rounded-lg bg-warm-ink/5 hover:bg-warm-ink/10 flex items-center justify-center text-warm-ink/40 transition-all"
                            >
                              -
                            </button>
                            <button 
                              onClick={() => {
                                const item = savedItems.find(i => i.report.name === report.name);
                                if (item) updateReadingProgress(item.id, (item.readingProgress || 0) + 1);
                              }}
                              className="w-8 h-8 rounded-lg bg-warm-accent/10 hover:bg-warm-accent/20 flex items-center justify-center text-warm-accent transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <h2 className="display text-3xl sm:text-7xl font-black text-warm-ink tracking-tighter leading-tight sm:leading-[0.9] text-glow uppercase">{report.name}</h2>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                        <div className="flex items-center gap-3 sm:gap-4 bg-warm-accent/5 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border border-warm-accent/10 glow-border">
                          <Users className="w-4 h-4 sm:w-5 h-5 text-warm-accent" />
                          <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-warm-ink/80">
                            {report.mcs?.male || 'N/A'} <span className="text-warm-accent/40 mx-1">&</span> {report.mcs?.female || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 bg-warm-accent/5 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border border-warm-accent/10 glow-border">
                          <Percent className="w-4 h-4 sm:w-5 h-5 text-warm-accent" />
                          <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-warm-ink/80">{report.focusPercentage || 0}% Focus</span>
                        </div>
                      </div>
    
                      <div className="prose prose-invert italic text-warm-ink/70 leading-relaxed text-sm sm:text-lg serif border-l-4 border-warm-accent/20 pl-4 sm:pl-6 min-h-[100px] sm:min-h-[120px]">
                        <Markdown>{report.summary}</Markdown>
                      </div>
                    </div>

                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-warm-accent/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-warm-accent/10 p-3 rounded-2xl shrink-0">
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-warm-accent" />
                    </div>
                    <div>
                      <h3 className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-warm-ink/40 mb-1">The Verdict</h3>
                      <p className="text-xs md:text-sm font-bold text-warm-ink/80 leading-tight">{report.verdict}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={saveToLibrary}
                      className="flex-1 sm:flex-none p-3 md:p-4 bg-warm-accent/10 text-warm-accent rounded-2xl hover:bg-warm-accent hover:text-warm-bg transition-all shadow-lg shadow-warm-accent/5 flex items-center justify-center"
                      title="Save to Library"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={downloadReport}
                      className="flex-1 sm:flex-none p-3 md:p-4 bg-glass border border-glass-border text-warm-ink/40 rounded-2xl hover:bg-warm-accent hover:text-warm-bg transition-all shadow-lg flex items-center justify-center"
                      title="Download Report"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => addToBlacklist(report.name)}
                      className="flex-1 sm:flex-none p-3 md:p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5 flex items-center justify-center"
                      title="Blacklist this title"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => findSimilarDynamic(report.name, report.cozinessLevel)}
                      className="flex-1 sm:flex-none px-6 py-3 md:py-4 bg-warm-accent/10 text-warm-accent rounded-2xl hover:bg-warm-accent hover:text-warm-bg transition-all shadow-lg shadow-warm-accent/5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest display"
                      title="Find Similar Dynamic"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="hidden sm:inline">Find Similar</span>
                    </button>
                    <button 
                      onClick={() => setReportTab('assistant')}
                      className="flex-1 sm:flex-none px-6 py-3 md:py-4 bg-glass border border-glass-border text-warm-ink/60 rounded-2xl hover:bg-warm-accent hover:text-warm-bg transition-all shadow-lg flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest display"
                      title="Interactive Safety Assistant"
                    >
                      <Bot className="w-4 h-4" />
                      <span className="hidden sm:inline">Assistant</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
                <div className="glass-card rounded-[56px] p-10 md:p-16 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center gap-12 group">
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-warm-accent via-red-400 to-emerald-400 opacity-50" />
                  
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-10 lg:gap-16 w-full relative z-10">
                  <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-700">
                    <CircularProgress 
                      value={report.score} 
                      label="Coziness" 
                      size={width < 400 ? 80 : width < 1024 ? 100 : 160}
                      strokeWidth={10}
                    />
                  </div>
                  <div className="hidden lg:block h-px bg-warm-accent/10 w-full" />
                  <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-700 [transition-delay:100ms]">
                    <CircularProgress 
                      value={report.focusPercentage} 
                      label="Couple" 
                      size={width < 400 ? 80 : width < 1024 ? 100 : 160}
                      strokeWidth={10}
                    />
                  </div>
                  <div className="hidden lg:block h-px bg-warm-accent/10 w-full" />
                  <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-700 [transition-delay:200ms]">
                    <CircularProgress 
                      value={report.safetyScore || 0} 
                      label="Safety" 
                      size={width < 400 ? 80 : width < 1024 ? 100 : 160}
                      strokeWidth={10}
                    />
                  </div>
                  {report.optionalRules && report.optionalRules.length > 0 && (
                    <>
                      <div className="hidden lg:block h-px bg-warm-accent/10 w-full" />
                      <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-700 [transition-delay:300ms]">
                        <CircularProgress 
                          value={Math.round((report.optionalRules.filter(r => r.status === 'pass').length / report.optionalRules.length) * 100)} 
                          label="Preferences" 
                          size={width < 400 ? 70 : width < 768 ? 90 : 130}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="w-full bg-warm-accent/10 rounded-3xl p-4 md:p-6 text-center border border-warm-accent/20 mt-4 relative z-10 glow-border">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-warm-accent/60 block mb-2 display">Neural Vibe Status</span>
                  <span className="text-xl md:text-2xl font-serif italic text-warm-ink text-glow">{report.cozinessLevel}</span>
                </div>
              </div>
            </div>
          </div>

            {/* Warnings & Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-red-500/5 border border-red-500/10 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex items-start gap-4 md:gap-6 shadow-xl">
                <div className="bg-red-500/10 p-3 md:p-4 rounded-xl md:rounded-2xl text-red-500 shrink-0">
                  <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-red-500/60">Critical Warnings</h3>
                  <p className="text-xs md:text-sm text-warm-ink/80 leading-relaxed italic serif">{report.warnings}</p>
                </div>
              </div>

              <div className="bg-warm-accent/5 border border-warm-accent/10 rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex items-start gap-4 md:gap-6 shadow-xl">
                <div className="bg-warm-accent/10 p-3 md:p-4 rounded-xl md:rounded-2xl text-warm-accent shrink-0">
                  <BarChart3 className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-warm-accent/60">Coziness Analysis</h3>
                  <p className="text-xs md:text-sm text-warm-ink/80 leading-relaxed italic serif">{report.cozinessAnalysis}</p>
                </div>
              </div>
            </div>

            {/* Quick Navigation - Real Tabs */}
            <div className="sticky top-4 z-30 flex justify-center px-4 pointer-events-none">
              <div className="bg-glass/90 backdrop-blur-3xl border border-glass-border p-2 rounded-full shadow-2xl pointer-events-auto flex items-center gap-1">
                {[
                  { id: 'safety', label: 'Safety', icon: ShieldCheck },
                  { id: 'preferences', label: 'Preferences', icon: ShieldAlert, condition: userPreferences.length > 0 },
                  { id: 'dislikes', label: 'Dislikes', icon: AlertTriangle, condition: report.potentialDislikes && report.potentialDislikes.length > 0 },
                  { id: 'roadmap', label: 'Roadmap', icon: BookOpen, condition: report.chapterRoadmap && report.chapterRoadmap.length > 0 },
                  { id: 'lightnovel', label: 'Light Novel', icon: BookOpen, condition: true },
                  { id: 'assistant', label: 'Assistant', icon: Bot, condition: true },
                  { id: 'evidence', label: 'Evidence', icon: FileText, condition: true },
                  { id: 'sources', label: 'Sources', icon: LinkIcon, condition: report.citations && report.citations.length > 0 },
                ].filter(item => item.condition !== false).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setReportTab(item.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 display",
                      reportTab === item.id 
                        ? "bg-warm-accent text-warm-bg shadow-[0_0_30px_rgba(59,130,246,0.4)] scale-105" 
                        : "text-warm-ink/40 hover:bg-warm-accent/10 hover:text-warm-accent"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", reportTab === item.id ? "animate-pulse" : "")} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sections - Tabbed Content */}
            <div className="min-h-[600px] relative">
              <AnimatePresence mode="wait">
                {reportTab === 'safety' && (
                  <motion.section
                    key="safety"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 md:space-y-12"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-warm-accent/20 flex items-center justify-center text-warm-accent border border-warm-accent/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="display text-2xl md:text-4xl font-black text-warm-ink tracking-tighter uppercase">Emotional Safety</h3>
                          <p className="text-[10px] font-black text-warm-accent/60 uppercase tracking-[0.4em] display">Neural Compliance Check</p>
                        </div>
                      </div>

                      {report.panicTriggers && (
                        <div className="w-full bg-red-500/10 border border-red-500/20 rounded-[32px] p-8 flex items-start gap-6 animate-pulse shadow-2xl shadow-red-500/5">
                          <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/20">
                            <AlertTriangle className="w-8 h-8" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-black text-red-500 uppercase tracking-[0.3em] display">CRITICAL PANIC TRIGGER ALERT</h4>
                            <p className="text-base text-red-500/90 serif italic leading-relaxed">{report.panicTriggers}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setShowAllEvidence(!showAllEvidence)}
                          className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg display",
                            showAllEvidence 
                              ? "bg-warm-accent text-warm-bg shadow-warm-accent/20" 
                              : "bg-glass border border-glass-border text-warm-ink/60 hover:bg-warm-accent/10 hover:text-warm-accent"
                          )}
                        >
                          <FileText className="w-4 h-4" />
                          {showAllEvidence ? 'Hide Evidence' : 'Show All Evidence'}
                        </button>
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-warm-accent/5 rounded-xl border border-warm-accent/10">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black text-warm-ink/40 uppercase tracking-widest">System Verified</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {report.safetyChecks && Object.entries(report.safetyChecks).map(([key, check]) => {
                        const labels: Record<string, string> = {
                          teenRomance: 'Teen-to-Teen Only',
                          deaths: 'No Deaths',
                          trauma: 'No Trauma/Loss',
                          sexualization: 'No Fanservice',
                          loveTriangles: 'No Love Triangles',
                          sidelining: 'No Sidelining',
                          preEstablished: 'No Pre-established',
                          heavyDrama: 'No Heavy Drama',
                          bullying: 'No Bullying',
                          equalPOV: 'Equal POVs',
                          pastRelationships: 'No Past Relationships',
                          indirectRomance: 'No Indirect Romance',
                          straightRomance: 'Straight Romance Only',
                          noEmotionalTrauma: 'No Side Character Trauma'
                        };
                        
                        return (
                          <DetailPanel
                            key={key}
                            label={labels[key] || key}
                            status={check.pass ? 'pass' : 'fail'}
                            description={check.description}
                            evidenceChapter={check.evidenceChapter}
                            evidenceDetails={check.evidenceDetails}
                            isSafety={true}
                            forceView={showAllEvidence ? 'evidence' : undefined}
                          />
                        );
                      })}
                    </div>

                    {report.ruleImpactAnalysis && (
                      <div className="bg-glass backdrop-blur-xl rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-glass-border shadow-2xl">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                          <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-warm-accent" />
                          <h3 className="serif text-xl md:text-2xl font-medium text-warm-ink">Rule Impact Analysis</h3>
                        </div>
                        <div className="prose prose-invert max-w-none text-xs md:text-sm text-warm-ink/80 leading-relaxed serif italic border-l-4 border-warm-accent/20 pl-4 md:pl-6">
                          <Markdown>{report.ruleImpactAnalysis}</Markdown>
                        </div>
                      </div>
                    )}

                    {report.sideCharacterTreatment && (
                      <div className="bg-emerald-500/5 backdrop-blur-xl rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-emerald-500/20 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                          <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                          <h3 className="serif text-xl md:text-2xl font-medium text-warm-ink">Side Character Safety</h3>
                        </div>
                        <div className="prose prose-invert max-w-none text-xs md:text-sm text-warm-ink/80 leading-relaxed serif italic border-l-4 border-emerald-500/20 pl-4 md:pl-6">
                          <Markdown>{report.sideCharacterTreatment}</Markdown>
                        </div>
                      </div>
                    )}

                    {report.userPreferenceAlignment && (
                      <div className="bg-blue-500/5 backdrop-blur-xl rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-blue-500/20 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                          <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                          <h3 className="serif text-xl md:text-2xl font-medium text-warm-ink">Preference Alignment</h3>
                        </div>
                        <div className="prose prose-invert max-w-none text-xs md:text-sm text-warm-ink/80 leading-relaxed serif italic border-l-4 border-blue-500/20 pl-4 md:pl-6">
                          <Markdown>{report.userPreferenceAlignment}</Markdown>
                        </div>
                      </div>
                    )}
                  </motion.section>
                )}

                {reportTab === 'lightnovel' && (
                  <motion.section
                    key="lightnovel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 md:space-y-12"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 px-6">
                      {report.lightNovel?.exists ? (
                        <>
                          <div className="glass-card rounded-[40px] p-8 md:p-12 space-y-8 border border-glass-border shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                            <div className="space-y-6 relative z-10">
                              <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-warm-accent/60 display">LN Status</h4>
                                <span className="px-4 py-1.5 bg-warm-accent/10 text-warm-accent text-[9px] font-black uppercase tracking-widest rounded-full border border-warm-accent/20">
                                  {report.lightNovel.status}
                                </span>
                              </div>
                              <h5 className="display text-3xl font-black text-warm-ink tracking-tight leading-none">
                                {report.lightNovel.title?.length > 100 ? report.lightNovel.title.substring(0, 100) + '...' : report.lightNovel.title}
                              </h5>
                              
                              {report.lightNovel.panicTriggers && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4 animate-pulse">
                                  <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest display">Panic Trigger Alert</p>
                                    <p className="text-xs text-red-500/80 serif italic">{report.lightNovel.panicTriggers}</p>
                                  </div>
                                </div>
                              )}
    
                              <div className="flex items-center gap-3 text-warm-ink/40">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest leading-relaxed">
                                  {report.lightNovel.volumes?.length > 40 ? report.lightNovel.volumes.substring(0, 40) + '...' : report.lightNovel.volumes}
                                </span>
                              </div>
    
                              {report.lightNovel.adaptationStatus && (
                                <div className="pt-6 border-t border-warm-ink/5">
                                  <p className="text-[10px] font-black text-warm-accent/60 uppercase tracking-[0.4em] display mb-3">Adaptation Status</p>
                                  <p className="text-sm text-warm-ink/70 serif italic leading-relaxed">
                                    {report.lightNovel.adaptationStatus}
                                  </p>
                                </div>
                              )}
    
                              {report.lightNovel.endingVibe && (
                                <div className="pt-6 border-t border-warm-ink/5">
                                  <p className="text-[10px] font-black text-warm-accent/60 uppercase tracking-[0.4em] display mb-3">Ending Vibe</p>
                                  <p className="text-sm text-warm-ink/70 serif italic leading-relaxed">
                                    {report.lightNovel.endingVibe}
                                  </p>
                                </div>
                              )}
    
                              {report.lightNovel.sideStories && (
                                <div className="pt-6 border-t border-warm-ink/5">
                                  <p className="text-[10px] font-black text-warm-accent/60 uppercase tracking-[0.4em] display mb-3">Side Stories & Epilogues</p>
                                  <p className="text-sm text-warm-ink/70 serif italic leading-relaxed">
                                    {report.lightNovel.sideStories}
                                  </p>
                                </div>
                              )}
    
                              {report.lightNovel.characterDevelopment && (
                                <div className="pt-6 border-t border-warm-ink/5">
                                  <p className="text-[10px] font-black text-warm-accent/60 uppercase tracking-[0.4em] display mb-3">Character Evolution</p>
                                  <p className="text-sm text-warm-ink/70 serif italic leading-relaxed">
                                    {report.lightNovel.characterDevelopment}
                                  </p>
                                </div>
                              )}
    
                              {report.lightNovel.worldBuilding && (
                                <div className="pt-6 border-t border-warm-ink/5">
                                  <p className="text-[10px] font-black text-warm-accent/60 uppercase tracking-[0.4em] display mb-3">World Lore & Setting</p>
                                  <p className="text-sm text-warm-ink/70 serif italic leading-relaxed">
                                    {report.lightNovel.worldBuilding}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
    
                          <div className="glass-card rounded-[40px] p-8 md:p-12 space-y-8 border border-glass-border shadow-2xl relative overflow-hidden group">
                             <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                             <div className="space-y-6 relative z-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-warm-accent/60 display">Vibe Comparison</h4>
                                <div className="text-base text-warm-ink/70 leading-relaxed serif italic border-l-2 border-warm-accent/20 pl-6 max-h-[300px] overflow-y-auto scrollbar-hide">
                                  {report.lightNovel.cozinessComparison || <p className="opacity-30">No comparison data retrieved.</p>}
                                </div>
                             </div>
                          </div>
    
                          <div className="lg:col-span-2 glass-card rounded-[40px] p-8 md:p-12 space-y-8 border border-glass-border shadow-2xl relative overflow-hidden group">
                             <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                <div className="space-y-6">
                                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-warm-accent/60 display">Key Differences</h4>
                                   <div className="text-sm text-warm-ink/80 leading-relaxed serif whitespace-pre-wrap max-h-[300px] overflow-y-auto scrollbar-hide">
                                      {report.lightNovel.differencesFromManga || <p className="opacity-30 italic">No difference data retrieved.</p>}
                                   </div>
                                </div>
                                <div className="space-y-6">
                                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/60 display">Safety Warnings (LN Only)</h4>
                                   <div className="text-sm text-red-500/80 leading-relaxed serif italic bg-red-500/5 p-6 rounded-2xl border border-red-500/10 max-h-[300px] overflow-y-auto scrollbar-hide">
                                      {report.lightNovel.safetyWarnings || <p className="opacity-30 italic">No safety warnings found.</p>}
                                   </div>
                                </div>
                             </div>
                          </div>
    
                          {report.lightNovel.roadmap && report.lightNovel.roadmap.length > 0 && (
                            <div className="lg:col-span-2 space-y-8 mt-12">
                              <div className="flex items-center gap-4 px-6">
                                <div className="w-12 h-12 rounded-2xl bg-warm-accent/20 flex items-center justify-center text-warm-accent border border-warm-accent/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                  <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <h3 className="display text-2xl md:text-4xl font-black text-warm-ink tracking-tighter uppercase">Light Novel Roadmap</h3>
                                    <span className="px-2 py-0.5 bg-warm-accent/10 text-warm-accent text-[8px] font-black uppercase tracking-widest rounded-full border border-warm-accent/20">Volume-by-Volume Neural Breakdown</span>
                                  </div>
                                  <p className="text-[10px] font-black text-warm-accent/60 uppercase tracking-[0.4em] display">Deep Source Context Analysis</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
                                {report.lightNovel.roadmap.map((vol, idx) => (
                                  <div key={idx} className="glass-card rounded-[40px] p-8 md:p-10 border border-glass-border shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden bg-warm-ink/[0.02]">
                                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                                    <div className="relative z-10 space-y-8">
                                      <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-warm-accent/60 display">{vol.volume}</span>
                                          <h4 className="display text-2xl font-black text-warm-ink tracking-tight leading-tight">{vol.summary}</h4>
                                        </div>
                                        <div className={cn(
                                          "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-lg",
                                          vol.vibe === 'comfy' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10" :
                                          vol.vibe === 'warning' ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/10" :
                                          "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-yellow-500/10"
                                        )}>
                                          {vol.vibe}
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-8">
                                        <div className="space-y-4">
                                          <h5 className="text-[9px] font-black uppercase tracking-widest text-warm-ink/40 display">Detailed Events</h5>
                                          <p className="text-sm md:text-base text-warm-ink/70 leading-relaxed serif italic border-l-2 border-warm-accent/20 pl-6">
                                            {vol.detailedEvents}
                                          </p>
                                        </div>
                                        
                                        <div className="space-y-4">
                                          <h5 className="text-[9px] font-black uppercase tracking-widest text-red-500/60 display">Safety Notes</h5>
                                          <p className="text-xs md:text-sm text-red-500/80 leading-relaxed serif italic bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
                                            {vol.safetyNotes}
                                          </p>
                                        </div>
    
                                        <div className="space-y-4">
                                          <h5 className="text-[9px] font-black uppercase tracking-widest text-warm-accent/60 display">Neural Verdict</h5>
                                          <p className="text-xs md:text-sm text-warm-ink/60 leading-relaxed serif italic border-l-2 border-warm-accent/10 pl-6">
                                            {vol.verdict}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="lg:col-span-2">
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto p-12 bg-glass border border-glass-border rounded-[40px] text-center space-y-8 shadow-2xl"
                          >
                            <div className="w-24 h-24 bg-warm-ink/5 rounded-full flex items-center justify-center mx-auto">
                              <BookX className="w-12 h-12 text-warm-ink/20" />
                            </div>
                            <div className="space-y-4">
                              <h3 className="serif text-3xl font-medium text-warm-ink">No Light Novel Found</h3>
                              <p className="text-warm-ink/50 italic serif leading-relaxed">
                                "Our neural audit confirms that this title is a manga-original or does not have a publicly documented light novel adaptation. The analysis focused entirely on the source manga material."
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}

                {reportTab === 'dislikes' && report.potentialDislikes && report.potentialDislikes.length > 0 && (
                  <motion.section
                    key="dislikes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-medium text-warm-ink serif">Potential Dislikes</h2>
                        <p className="text-sm text-warm-ink/40 italic serif">"A brutal, honest look at what you might hate based on your strict preferences."</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {report.potentialDislikes.map((dislike, idx) => (
                        <div key={idx} className="bg-glass border border-glass-border rounded-[32px] p-6 space-y-4 hover:border-red-500/30 transition-colors group">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-medium text-warm-ink serif group-hover:text-red-500 transition-colors">{dislike.factor}</h3>
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
                              dislike.severity.toLowerCase() === 'high' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                              dislike.severity.toLowerCase() === 'medium' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                              "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                            )}>
                              {dislike.severity} Severity
                            </span>
                          </div>
                          <p className="text-sm text-warm-ink/70 leading-relaxed italic serif">"{dislike.description}"</p>
                          {dislike.chapter && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-warm-ink/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-warm-ink/40">
                              <BookOpen className="w-3 h-3" />
                              {dislike.chapter}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {reportTab === 'preferences' && userPreferences.length > 0 && (
                  <motion.section
                    key="preferences"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 md:space-y-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 bg-glass backdrop-blur-3xl rounded-[40px] p-8 md:p-10 border border-glass-border shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-warm-accent/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                        <div className="relative z-10 space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-warm-accent/20 rounded-2xl">
                              <ShieldAlert className="w-8 h-8 text-warm-accent" />
                            </div>
                            <div>
                              <h3 className="serif text-3xl md:text-4xl font-medium text-warm-ink">Preferences Analysis</h3>
                              <p className="text-xs md:text-sm text-warm-ink/40 uppercase tracking-[0.2em] font-bold mt-1">Deep Neural Scan Results</p>
                            </div>
                          </div>
                          <p className="text-base md:text-lg text-warm-ink/70 leading-relaxed serif italic max-w-2xl">
                            "We've cross-referenced your personal comfort rules against the entire series narrative. Here's how it aligns with your unique taste."
                          </p>
                        </div>
                      </div>

                      <div className="bg-warm-accent rounded-[40px] p-8 md:p-10 text-warm-bg shadow-2xl shadow-warm-accent/20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="text-6xl md:text-7xl font-serif font-black">
                          {report.optionalRules ? report.optionalRules.filter(r => r.status === 'pass').length : 0}
                          <span className="text-3xl md:text-4xl opacity-50">/{report.optionalRules ? report.optionalRules.length : userPreferences.length}</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs md:text-sm font-black uppercase tracking-[0.3em]">Rules Met</h4>
                          <p className="text-[10px] md:text-xs opacity-70 serif italic">Compatibility Score</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                      {report.optionalRules && report.optionalRules.length > 0 ? (
                        report.optionalRules.map((rule, idx) => (
                          <DetailPanel
                            key={idx}
                            label={rule.rule}
                            status={rule.status}
                            description={rule.comment}
                            evidenceChapter={rule.evidenceChapter}
                            evidenceDetails={rule.evidenceDetails}
                          />
                        ))
                      ) : (
                        <div className="col-span-1 md:col-span-2 p-12 bg-glass border border-glass-border rounded-[40px] text-center space-y-4">
                          <div className="w-16 h-16 bg-warm-accent/10 rounded-full flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-8 h-8 text-warm-accent animate-pulse" />
                          </div>
                          <h4 className="serif text-2xl text-warm-ink">Neural Scan Incomplete</h4>
                          <p className="serif text-lg text-warm-ink/40 italic max-w-md mx-auto">
                            "The neural link was unable to find specific data for your preferences in this title, or the analysis is still being processed."
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}

                {reportTab === 'roadmap' && report.chapterRoadmap && report.chapterRoadmap.length > 0 && (
                  <motion.section
                    key="roadmap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 md:space-y-10"
                  >
                    <div className="bg-glass backdrop-blur-xl rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-glass-border shadow-2xl">
                      <div className="flex items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-warm-accent" />
                          <h3 className="serif text-xl md:text-3xl font-medium text-warm-ink">Chapter-by-Chapter Roadmap</h3>
                        </div>
                      </div>
                      <div className="space-y-6 md:space-y-8">
                        {report.chapterRoadmap.map((item, idx) => (
                          <div key={idx} className="relative pl-8 md:pl-10 border-l-2 border-warm-accent/20 pb-6 md:pb-8 last:pb-0 group/roadmap">
                            <div className={cn(
                              "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-warm-bg shadow-lg transition-transform duration-300 group-hover/roadmap:scale-125 z-10",
                              item.vibe === 'comfy' ? "bg-emerald-500 shadow-emerald-500/20" : 
                              item.vibe === 'warning' ? "bg-red-500 shadow-red-500/20" : "bg-yellow-500 shadow-yellow-500/20"
                            )} />
                            <div className="bg-glass border border-glass-border rounded-[32px] md:rounded-[40px] p-6 md:p-12 space-y-6 md:space-y-10 shadow-2xl hover:border-warm-accent/30 transition-all duration-700 relative overflow-hidden group/card glow-border">
                              <div className="absolute inset-0 shimmer opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                              
                              <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3 md:gap-5">
                                  <div className="w-10 h-10 md:w-14 md:h-14 bg-warm-accent/10 rounded-xl md:rounded-2xl flex items-center justify-center text-warm-accent shadow-inner border border-warm-accent/20 group-hover/card:scale-110 transition-transform duration-500">
                                    <BookOpen className="w-5 h-5 md:w-7 md:h-7" />
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[10px] md:text-base uppercase tracking-[0.4em] text-warm-ink/80 display">Chapters {item.range}</h4>
                                    <p className="text-[8px] md:text-[9px] font-black text-warm-accent/60 uppercase tracking-[0.2em] display">Neural Timeline Segment</p>
                                  </div>
                                </div>
                                <span className={cn(
                                  "text-[8px] md:text-[12px] font-black uppercase tracking-[0.2em] px-3 md:px-5 py-1.5 md:py-2 rounded-full border shadow-sm display",
                                  item.vibe === 'comfy' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                                  item.vibe === 'warning' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                )}>
                                  {item.vibe}
                                </span>
                              </div>
                              
                              <p className="text-sm md:text-xl text-warm-ink/70 leading-relaxed italic whitespace-pre-wrap serif relative z-10">"{item.summary}"</p>
                              
                              <div className="bg-warm-ink/5 rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-warm-ink/5 space-y-3 md:space-y-6 relative z-10">
                                <h5 className="text-[10px] md:text-[12px] font-black text-warm-ink/40 uppercase tracking-[0.4em] mb-2 md:mb-4 flex items-center gap-2 md:gap-3 display">
                                  <Eye size={14} className="text-warm-accent" />
                                  Neural Event Log & Vibe Analysis
                                </h5>
                                <p className="text-xs md:text-base text-warm-ink/70 leading-relaxed whitespace-pre-wrap font-medium serif italic">"{item.detailedEvents}"</p>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-10 pt-6 md:pt-10 border-t border-warm-accent/10 relative z-10">
                                <div className="bg-emerald-500/5 p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-emerald-500/10 group/like hover:bg-emerald-500/10 transition-all duration-500">
                                  <h5 className="text-[10px] md:text-[12px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2 md:mb-4 flex items-center gap-2 md:gap-3 display">
                                    <Heart size={14} className="fill-current" />
                                    Neural Resonance
                                  </h5>
                                  <p className="text-[11px] md:text-sm text-warm-ink/60 leading-relaxed whitespace-pre-wrap italic serif">{item.likes}</p>
                                </div>
                                <div className="bg-red-500/5 p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-red-500/10 group/dislike hover:bg-red-500/10 transition-all duration-500">
                                  <h5 className="text-[10px] md:text-[12px] font-black text-red-500 uppercase tracking-[0.4em] mb-2 md:mb-4 flex items-center gap-2 md:gap-3 display">
                                    <AlertCircle size={14} className="fill-current" />
                                    Neural Interference
                                  </h5>
                                  <p className="text-[11px] md:text-sm text-warm-ink/60 leading-relaxed whitespace-pre-wrap italic serif">{item.dislikes}</p>
                                </div>
                              </div>
                              
                              {item.ruleImpactAnalysis && (
                                <div className="mt-6 md:mt-10 p-4 md:p-8 bg-warm-accent/5 rounded-[24px] md:rounded-[32px] border border-warm-accent/10 relative z-10">
                                  <h5 className="text-[10px] md:text-[12px] font-black text-warm-accent uppercase tracking-[0.4em] mb-2 md:mb-4 flex items-center gap-2 md:gap-3 display">
                                    <Zap size={14} className="fill-current" />
                                    Neural Compliance Analysis
                                  </h5>
                                  <p className="text-[11px] md:text-sm text-warm-ink/70 leading-relaxed italic serif">{item.ruleImpactAnalysis}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.section>
                )}

                {reportTab === 'sources' && report.citations && report.citations.length > 0 && (
                  <motion.section
                    key="sources"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 max-w-4xl mx-auto"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-warm-accent/10 flex items-center justify-center text-warm-accent">
                        <LinkIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-medium text-warm-ink serif">Neural Source Citations</h2>
                        <p className="text-sm text-warm-ink/40 italic serif">"Verified data origins for this report."</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {report.citations.map((source, idx) => (
                        <a 
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-glass border border-glass-border rounded-[24px] p-6 flex items-center justify-between group hover:border-warm-accent/30 transition-all duration-500"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-warm-ink/5 flex items-center justify-center text-warm-ink/40 group-hover:text-warm-accent transition-colors">
                              <Globe className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-warm-ink group-hover:text-warm-accent transition-colors">{source.title}</h4>
                              <p className="text-[10px] text-warm-ink/40 truncate max-w-[150px]">{source.url}</p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-warm-ink/20 group-hover:text-warm-accent transition-colors" />
                        </a>
                      ))}
                    </div>
                  </motion.section>
                )}

                {reportTab === 'assistant' && (
                  <motion.section
                    key="assistant"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 max-w-4xl mx-auto"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-warm-accent/10 flex items-center justify-center text-warm-accent">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-medium text-warm-ink serif">Interactive Safety Assistant</h2>
                        <p className="text-sm text-warm-ink/40 italic serif">"Ask specific questions about {report.name}'s safety or plot."</p>
                      </div>
                    </div>

                    <div className="bg-glass border border-glass-border rounded-[40px] overflow-hidden flex flex-col h-[600px] shadow-2xl">
                      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        {chatMessages.filter(m => m.text.includes(report.name) || chatMessages.indexOf(m) > chatMessages.findIndex(x => x.text.includes(report.name))).map((msg, i) => (
                          <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-warm-accent text-warm-bg" : "bg-warm-ink/5 text-warm-accent")}>
                              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={cn("p-4 rounded-2xl text-sm leading-relaxed max-w-[80%]", msg.role === 'user' ? "bg-warm-accent text-warm-bg" : "bg-warm-ink/5 text-warm-ink/80")}>
                              <Markdown>{msg.text}</Markdown>
                            </div>
                          </div>
                        ))}
                        {isChatLoading && (
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-warm-ink/5 text-warm-accent flex items-center justify-center">
                              <Sparkles className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="bg-warm-ink/5 p-4 rounded-2xl flex gap-2">
                              <div className="w-1.5 h-1.5 bg-warm-accent rounded-full animate-bounce" />
                              <div className="w-1.5 h-1.5 bg-warm-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                              <div className="w-1.5 h-1.5 bg-warm-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        )}
                      </div>
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!chatInput.trim()) return;
                          const query = `Regarding "${report.name}": ${chatInput}`;
                          handleSendMessage(undefined, query);
                          setChatInput('');
                        }}
                        className="p-6 border-t border-glass-border bg-warm-ink/[0.02] flex gap-4"
                      >
                        <input 
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder={`Ask about ${report.name}...`}
                          className="flex-1 bg-glass border border-glass-border rounded-2xl px-6 py-3 text-sm text-warm-ink focus:ring-1 focus:ring-warm-accent outline-none"
                        />
                        <button 
                          type="submit"
                          className="bg-warm-accent text-warm-bg p-3 rounded-2xl hover:bg-warm-accent/90 transition-all shadow-lg"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </motion.section>
                )}
                {reportTab === 'evidence' && (
                  <motion.section
                    key="evidence"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 md:space-y-12"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-warm-accent/20 flex items-center justify-center text-warm-accent border border-warm-accent/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="display text-2xl md:text-4xl font-black text-warm-ink tracking-tighter uppercase">Absolute Proof & Evidence</h3>
                          <p className="text-[10px] font-black text-warm-accent/60 uppercase tracking-[0.4em] display">Neural Verification Logs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-6 text-[9px] font-black uppercase tracking-widest text-warm-ink/20 md:hidden">
                        <ArrowRight className="w-3 h-3 animate-pulse" />
                        Scroll horizontally to explore
                      </div>
                    </div>
                    
                    {(!report.proofs || report.proofs.length === 0) ? (
                      <div className="text-center py-32 bg-warm-ink/[0.02] rounded-[56px] border border-dashed border-warm-ink/10">
                        <FileText className="w-20 h-20 text-warm-ink/5 mx-auto mb-8" />
                        <p className="text-warm-ink/40 italic serif text-xl">No specific evidence points generated for this report yet.</p>
                      </div>
                    ) : (
                      <div className="flex lg:grid overflow-x-auto lg:overflow-x-visible gap-6 md:gap-10 pb-12 lg:pb-0 snap-x snap-mandatory no-scrollbar px-6 -mx-6 lg:mx-0 lg:px-0 cursor-grab active:cursor-grabbing lg:cursor-default lg:grid-cols-2 xl:grid-cols-3">
                        {report.proofs.map((proof, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="flex-shrink-0 lg:flex-shrink w-[85vw] md:w-[450px] lg:w-full snap-center p-6 md:p-10 rounded-[32px] md:rounded-[48px] bg-glass border border-glass-border space-y-4 md:space-y-10 shadow-2xl hover:border-warm-accent/30 transition-all group relative overflow-hidden flex flex-col glow-border"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-warm-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                            
                            <div className="flex items-center justify-between relative z-10">
                              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-warm-accent bg-warm-accent/10 px-3 md:px-5 py-1.5 md:py-2 rounded-full border border-warm-accent/10 display">
                                Chapter {proof.chapter}
                              </span>
                              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-warm-ink/40 bg-warm-ink/5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-warm-ink/10 display">
                                {proof.who}
                              </span>
                            </div>
                            
                            <div className="flex-1 space-y-4 md:space-y-6 relative z-10">
                              <h4 className="text-[9px] md:text-[10px] font-black text-warm-ink/30 uppercase tracking-[0.4em] display">Neural Event Log</h4>
                              <p className="text-base md:text-xl text-warm-ink/90 leading-relaxed font-medium serif italic whitespace-pre-wrap">"{proof.action}"</p>
                            </div>
                            
                            <div className="space-y-4 md:space-y-6 pt-6 md:pt-8 border-t border-warm-accent/10 relative z-10">
                              <div className="bg-warm-accent/5 p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-warm-accent/10 group/sub">
                                <h4 className="text-[9px] md:text-[10px] font-black text-warm-accent uppercase tracking-[0.3em] mb-2 md:mb-4 flex items-center gap-2 display">
                                  <Heart size={12} className="fill-current animate-pulse" />
                                  Why I'll like it
                                </h4>
                                <p className="text-[11px] md:text-sm text-warm-ink/60 italic leading-relaxed serif whitespace-pre-wrap">"{proof.whyILike}"</p>
                              </div>
                              <div className="bg-emerald-500/5 p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-emerald-500/10 group/sub">
                                <h4 className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2 md:mb-4 flex items-center gap-2 display">
                                  <CheckCircle2 size={12} className="fill-current" />
                                  Absolute Proof
                                </h4>
                                <p className="text-[11px] md:text-sm text-warm-ink/70 leading-relaxed font-medium whitespace-pre-wrap">{proof.absoluteProof}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.section>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </motion.div>
    )}
  </AnimatePresence>

      {/* Floating Assistant Button */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
        <AnimatePresence>
          {isAssistantOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="w-[calc(100vw-48px)] sm:w-[350px] lg:w-[450px] h-[500px] lg:h-[min(650px,80vh)] bg-glass backdrop-blur-3xl border border-glass-border rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-glass-border bg-warm-accent/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-warm-accent rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-warm-bg" />
                  </div>
                  <div>
                    <span className="serif font-medium text-warm-ink block leading-none">Cozy Assistant</span>
                    <span className="text-[9px] text-warm-ink/40 uppercase tracking-widest">
                      {useLocalAI ? "Local Mode (Infinite)" : "Cloud Mode (Gemini)"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleLocalAI}
                    className={cn(
                      "p-2 rounded-lg transition-all border relative overflow-hidden",
                      useLocalAI 
                        ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                        : "bg-warm-accent/5 border-glass-border text-warm-ink/40 hover:text-warm-accent"
                    )}
                    title={useLocalAI ? "Switch to Cloud AI" : "Switch to Local AI (No Limits)"}
                  >
                    <Zap className={cn("w-4 h-4", (localAIStatus === "loading" || localAIStatus === "checking") && "animate-pulse")} />
                    {(localAIStatus === "loading" || localAIStatus === "checking") && (
                      <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
                    )}
                  </button>
                  <button 
                    onClick={() => setIsAssistantOpen(false)}
                    className="p-2 hover:bg-warm-accent/10 rounded-full text-warm-ink/40"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {(localAIStatus === "loading" || localAIStatus === "checking" || localAIStatus === "error") && (
                <div className={cn(
                  "p-4 border-b border-glass-border",
                  localAIStatus === "error" ? "bg-red-500/5" : "bg-yellow-500/5"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      localAIStatus === "error" ? "text-red-500" : "text-yellow-500"
                    )}>
                      {localAIStatus === "checking" ? "Checking Hardware..." : 
                       localAIStatus === "error" ? "Local AI Error" : "Downloading Local Brain..."}
                    </span>
                    {localAIStatus === "loading" && (
                      <span className="text-[10px] text-yellow-500/60">{Math.round(localAIProgress * 100)}%</span>
                    )}
                  </div>
                  {localAIStatus !== "error" && (
                    <div className="h-1 bg-yellow-500/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-yellow-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${localAIProgress * 100}%` }}
                      />
                    </div>
                  )}
                  <p className={cn(
                    "text-[9px] mt-1 truncate italic",
                    localAIStatus === "error" ? "text-red-500/60" : "text-yellow-500/40"
                  )}>
                    {localAIMessage || (localAIStatus === "checking" ? "Verifying WebGPU support..." : "")}
                  </p>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <Sparkles className="w-8 h-8 text-warm-accent/40" />
                    <p className="text-xs text-warm-ink/40 italic serif">"I'm here to help with anything! Ask me to analyze a manga or just chat."</p>
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={cn(
                      "flex gap-2",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                      <div className={cn(
                        "p-3 rounded-2xl text-xs leading-relaxed max-w-[85%]",
                        msg.role === 'user' ? "bg-warm-accent text-warm-bg" : "bg-warm-accent/5 border border-glass-border text-warm-ink/80"
                      )}>
                        <Markdown>{msg.text}</Markdown>
                        {msg.role === 'model' && (
                          <button 
                            onClick={() => speakText(msg.text)}
                            className="mt-2 text-[10px] flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity"
                          >
                            <Volume2 className="w-3 h-3" />
                            Listen
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-glass-border">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startListening}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isListening ? "bg-red-500 text-white animate-pulse" : "bg-warm-accent/10 text-warm-accent hover:bg-warm-accent/20"
                    )}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type anything..."
                    className="flex-1 bg-warm-bg/50 border border-glass-border rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-warm-accent/30 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="bg-warm-accent text-warm-bg p-2 rounded-xl hover:bg-warm-accent/90 disabled:opacity-30"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all relative",
            isAssistantOpen ? "bg-warm-bg text-warm-accent border border-warm-accent" : "bg-warm-accent text-warm-bg"
          )}
        >
          {isSpeaking ? (
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-current animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-1 h-6 bg-current animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-4 bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          ) : (
            isAssistantOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />
          )}
          {isChatLoading && (
            <div className="absolute inset-0 border-4 border-warm-accent/30 border-t-warm-accent rounded-full animate-spin" />
          )}
        </motion.button>
      </div>
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-warm-ink text-warm-bg rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] border border-white/10"
          >
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              toast.type === 'success' ? "bg-emerald-500" : 
              toast.type === 'error' ? "bg-red-500" : "bg-blue-500"
            )} />
            <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
</div>
);
}
