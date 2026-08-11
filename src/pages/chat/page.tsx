import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

type ChatState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const getMockResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes('yoruba')) {
    return 'Towera has over 12,000 hours of verified Yoruba speech data, covering conversational, formal, and traditional contexts. We also have parallel English-Yoruba translation datasets with more than 3 million aligned sentence pairs.';
  }
  if (lower.includes('igbo')) {
    return 'Our Igbo corpus contains proverbs, folk tales, and modern conversational data — over 8,500 hours of audio and 2 million text tokens. It is one of the most culturally rich datasets in our collection.';
  }
  if (lower.includes('hausa')) {
    return 'Towera\'s Hausa dataset is one of the most comprehensive available, with news transcripts, radio recordings, and educational content spanning 15,000 hours of audio.';
  }
  if (lower.includes('pidgin') || lower.includes('nigerian pidgin')) {
    return 'Nigerian Pidgin is a fascinating bridge language. Towera has collected 5,000 hours of conversational Pidgin data from Lagos, Port Harcourt, and Benin City, covering street conversations, market banter, and media content.';
  }
  if (lower.includes('tiv') || lower.includes('kanuri') || lower.includes('fulfulde') || lower.includes('ijaw')) {
    return 'We are actively building datasets for Nigeria\'s minority languages. Tiv, Kanuri, Fulfulde, and Ijaw are all in our pipeline with community contributors recording audio and translating texts. Would you like to contribute?';
  }
  if (lower.includes('dataset') || lower.includes('data')) {
    return 'Towera offers six types of datasets: speech, text corpus, parallel translations, OCR, handwriting, and pronunciation guides. All data is verified, structured, and licensed for AI training. Which type interests you?';
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('buy') || lower.includes('purchase')) {
    return 'Our API pricing is tiered based on dataset size and usage. Starter plans begin at 50,000 Naira per month for academic researchers, and enterprise licenses are available for large-scale AI training. I can connect you with our sales team for a custom quote.';
  }
  if (lower.includes('contribute') || lower.includes('record') || lower.includes('upload')) {
    return 'You can contribute through Towera Studio, our web platform. Native speakers can record audio, translate sentences, validate recordings, upload stories, and annotate data. Think of it as GitHub plus Duolingo for Nigerian languages. Would you like a contributor invite?';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! I am Towera\'s voice assistant. I can tell you about our Nigerian language datasets, help you explore our products, or connect you with our team. What would you like to know?';
  }
  if (lower.includes('api')) {
    return 'The Towera API gives developers access to speech datasets, translation pairs, OCR data, handwriting samples, and pronunciation guides. It is RESTful, well-documented, and supports bulk downloads. We offer SDKs for Python and JavaScript.';
  }
  if (lower.includes('studio')) {
    return 'Towera Studio is our contributor platform where native speakers record audio, translate sentences, validate recordings, and upload stories. It is designed like a mix of GitHub, Duolingo, and Mechanical Turk — but built specifically for Nigerian language data.';
  }
  if (lower.includes('translate') || lower.includes('translation')) {
    return 'Towera Translate offers parallel datasets for language pairs like English to Yoruba, French to Hausa, and Igbo to English. These are essential for building machine translation systems tailored to Nigerian languages.';
  }
  if (lower.includes('towera')) {
    return 'Towera collects, verifies, structures, and licenses high-quality Nigerian language datasets that power the next generation of AI. We cover over 500 languages with speech, text, and translation data. Our mission is to preserve, digitize, and power every Nigerian language through trusted AI datasets.';
  }
  if (lower.includes('language') || lower.includes('how many')) {
    return 'Nigeria is home to over 500 languages. Towera is building datasets for the major ones — Yoruba, Igbo, Hausa, Fulfulde, Tiv, Kanuri, Ijaw, Edo, Ibibio, Nupe, and many more. We believe every language deserves to be represented in AI.';
  }
  return 'I can tell you about Towera\'s Nigerian language datasets, our products like Atlas, Voice, Corpus, and Studio, or help you get started with data access. What are you looking for?';
};

function Orb({ state }: { state: ChatState }) {
  const getOrbClasses = () => {
    switch (state) {
      case 'idle':
        return 'animate-orb-idle';
      case 'listening':
        return 'animate-orb-listening';
      case 'thinking':
        return 'animate-orb-thinking';
      case 'speaking':
        return 'animate-orb-speaking';
      default:
        return '';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Ripple rings for listening */}
      {state === 'listening' && (
        <>
          <div className="absolute w-40 h-40 rounded-full border-2 border-primary-300/60 animate-ripple-1" />
          <div className="absolute w-40 h-40 rounded-full border-2 border-primary-300/50 animate-ripple-2" />
          <div className="absolute w-40 h-40 rounded-full border-2 border-primary-300/40 animate-ripple-3" />
        </>
      )}

      {/* Main orb */}
      <div
        className={`
          w-36 h-36 md:w-44 md:h-44 rounded-full relative z-10
          bg-gradient-to-br from-primary-200 via-primary-400 to-accent-300
          shadow-[0_0_80px_oklch(var(--primary-300)/0.35),inset_0_0_40px_oklch(var(--background-50)/0.3)]
          transition-all duration-500
          ${getOrbClasses()}
        `}
      >
        {/* Inner spherical highlight */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-background-50/50 via-transparent to-primary-600/20" />
        {/* Bottom reflection */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-background-50/20 rounded-full blur-md" />
      </div>

      {/* Sound wave bars for listening */}
      {state === 'listening' && (
        <div className="absolute flex items-end gap-1.5 h-12 -bottom-16">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 bg-primary-500 rounded-full animate-sound-bar"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      )}

      {/* Flowing dots for speaking */}
      {state === 'speaking' && (
        <div className="absolute flex items-center gap-2 -bottom-16">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-400 animate-speak-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      )}

      {/* Processing text for thinking */}
      {state === 'thinking' && (
        <div className="absolute -bottom-16 text-foreground-500 text-sm font-medium tracking-wide animate-pulse">
          Thinking...
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  useDocumentMeta(
    'Converse with Towera — Ask About Nigerian Language Datasets',
    'Talk to Towera by voice or text to explore our Nigerian language datasets, products, and how to contribute.'
  );
  const navigate = useNavigate();
  const [chatState, setChatState] = useState<ChatState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [showMessages, setShowMessages] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasSpeechRecognition =
    typeof window !== 'undefined' &&
    (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));

  const hasSpeechSynthesis =
    typeof window !== 'undefined' && ('speechSynthesis' in window);

  useEffect(() => {
    if (!hasSpeechRecognition) {
      setBrowserSupported(false);
    }
  }, [hasSpeechRecognition]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
      recognitionRef.current = null;
    }
  }, []);

  const speakResponse = useCallback((text: string) => {
    if (!hasSpeechSynthesis) {
      setChatState('idle');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setChatState('speaking');
    utterance.onend = () => setChatState('idle');
    utterance.onerror = () => setChatState('idle');

    window.speechSynthesis.speak(utterance);
  }, [hasSpeechSynthesis]);

  const processUserInput = useCallback((text: string) => {
    if (!text.trim()) return;

    const cleanText = text.trim();
    setMessages((prev) => [...prev, { role: 'user', text: cleanText }]);
    setShowMessages(true);
    setChatState('thinking');
    setTranscript('');
    setInputText('');

    // Simulate processing delay
    setTimeout(() => {
      const response = getMockResponse(cleanText);
      setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
      speakResponse(response);
    }, 1200);
  }, [speakResponse]);

  const startListening = useCallback(() => {
    if (!hasSpeechRecognition) return;

    stopListening();
    setTranscript('');

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setChatState('listening');
      setShowMessages(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        transcriptRef.current = finalTranscript;
      }
      if (interimTranscript) {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setChatState('idle');
      } else if (event.error === 'aborted') {
        setChatState('idle');
      } else {
        setChatState('idle');
      }
    };

    recognition.onend = () => {
      const finalText = transcriptRef.current;
      if (finalText && finalText.trim()) {
        processUserInput(finalText);
      } else {
        setChatState('idle');
      }
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setChatState('idle');
    }
  }, [hasSpeechRecognition, stopListening, processUserInput]);

  const handleMicClick = useCallback(() => {
    if (chatState === 'listening') {
      stopListening();
      setChatState('idle');
    } else if (chatState === 'speaking') {
      window.speechSynthesis?.cancel();
      setChatState('idle');
    } else {
      startListening();
    }
  }, [chatState, stopListening, startListening]);

  const handleTextSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      processUserInput(inputText);
    }
  }, [inputText, processUserInput]);

  const handleClose = useCallback(() => {
    stopListening();
    window.speechSynthesis?.cancel();
    navigate('/');
  }, [stopListening, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      window.speechSynthesis?.cancel();
    };
  }, [stopListening]);

  return (
    <div className="h-screen w-screen bg-background-50 flex flex-col overflow-hidden relative">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 z-20">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-foreground-900 font-semibold text-sm md:text-base tracking-tight hover:text-primary-600 transition-colors duration-200"
          >
            Converse with Towera
          </Link>
          <i className="ri-arrow-down-s-line text-foreground-400 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          {!browserSupported && (
            <span className="text-xs text-foreground-400 hidden md:inline">
              Type mode
            </span>
          )}
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-200 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Close conversation"
          >
            <i className="ri-close-line text-foreground-600 text-lg" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      {showMessages && messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-2 space-y-4 z-10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`
                  max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-primary-500 text-background-50 rounded-br-md'
                    : 'bg-background-200 text-foreground-800 rounded-bl-md'
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {/* Live transcript while listening */}
          {chatState === 'listening' && transcript && !messages.find(m => m.role === 'user' && m.text === transcript) && (
            <div className="flex justify-end animate-fade-in">
              <div className="max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl rounded-br-md bg-primary-400/60 text-background-50 text-sm">
                {transcript}
                <span className="inline-block w-1 h-4 bg-background-50/70 ml-1 animate-pulse" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Empty state hint */}
      {!showMessages && (
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-foreground-400 text-sm text-center max-w-md">
            Tap the microphone and ask about Towera\'s Nigerian language datasets, or type your question below.
          </p>
        </div>
      )}

      {/* Center Orb - positioned in the middle when no messages, or above input when there are messages */}
      <div className={`flex items-center justify-center z-10 ${showMessages && messages.length > 0 ? 'py-6' : 'flex-1'}`}>
        <Orb state={chatState} />
      </div>

      {/* Spacer for messages view */}
      {showMessages && messages.length > 0 && <div className="flex-1 min-h-0" />}

      {/* Bottom Input Bar */}
      <div className="px-4 md:px-6 pb-6 pt-2 z-20">
        <form
          onSubmit={handleTextSubmit}
          className="flex items-center gap-2 bg-background-100 border border-background-200 rounded-full px-4 py-2.5 shadow-sm"
        >
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-200 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
            aria-label="Attach file"
          >
            <i className="ri-add-line text-foreground-500 text-lg" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={chatState === 'listening' ? 'Listening...' : 'Type a message'}
            className="flex-1 bg-transparent text-foreground-900 text-sm placeholder:text-foreground-400 outline-none min-w-0"
            disabled={chatState === 'listening' || chatState === 'thinking'}
          />

          {inputText.trim() ? (
            <button
              type="submit"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-500 text-background-50 hover:bg-primary-600 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <i className="ri-arrow-up-line text-sm" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMicClick}
              className={`
                w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer shrink-0
                ${chatState === 'listening'
                  ? 'bg-accent-500 text-background-50 hover:bg-accent-600 active:scale-95'
                  : chatState === 'speaking'
                    ? 'bg-primary-500 text-background-50 hover:bg-primary-600 active:scale-95'
                    : 'hover:bg-background-200 text-foreground-500 active:scale-95'
                }
              `}
              aria-label={chatState === 'listening' ? 'Stop listening' : 'Start voice input'}
            >
              {chatState === 'listening' ? (
                <i className="ri-stop-fill text-sm" />
              ) : chatState === 'speaking' ? (
                <i className="ri-volume-up-fill text-sm" />
              ) : (
                <i className="ri-mic-line text-sm" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground-900 text-background-50 hover:bg-foreground-800 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
            aria-label="Close"
          >
            <i className="ri-close-line text-sm" />
          </button>
        </form>
      </div>
    </div>
  );
}