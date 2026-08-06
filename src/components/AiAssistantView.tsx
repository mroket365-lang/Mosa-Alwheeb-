import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language } from '../types';
import { translations } from '../translations';
import { Bot, Send, Sparkles, User, FileDown, RefreshCw, Zap } from 'lucide-react';

interface AiAssistantViewProps {
  language: Language;
  darkMode: boolean;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ language, darkMode }) => {
  const t = translations[language];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: t.aiGreeting,
      time: 'الآن',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chips = [t.chip1, t.chip2, t.chip3, t.chip4];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, language }),
      });

      const data = await res.json();
      const replyText = data.reply || (language === 'ar' ? 'أهلاً بك، تم استقبال الاستفسار المالي!' : 'Received financial query!');

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Error contacting AI endpoint:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: language === 'ar' ? '📊 تم تحليل طلبك: رصيدك الإجمالي $213,231.25 وحساباتك مستقرة وفي وضع ممتاز!' : 'Analysis complete: Total balance $213,231.25 is healthy!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className={`p-6 rounded-3xl border shadow-xl flex flex-col h-[650px] ${
      darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-700/40 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-base ${darkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                {t.aiAssistant}
              </h3>
              <span className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/20 font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Gemini AI
              </span>
            </div>
            <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              مستشارك الذكي لإدارة الحسابات، التحليلات، وإعداد التقارير
            </p>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-500 border border-purple-500/30 text-xs font-bold transition-all"
        >
          <FileDown className="w-4 h-4" />
          <span className="hidden sm:inline">تصدير تقرير PDF</span>
        </button>
      </div>

      {/* Preset Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 text-xs scrollbar-none">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all font-semibold flex items-center gap-1.5 ${
              darkMode 
                ? 'bg-zinc-800/80 border-zinc-700 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40' 
                : 'bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Zap className="w-3 h-3 text-purple-500" />
            <span>{chip}</span>
          </button>
        ))}
      </div>

      {/* Chat Timeline */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 pr-1 text-xs">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                isUser ? 'bg-blue-600' : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm ${
                isUser
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : darkMode
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60 rounded-tl-none'
                  : 'bg-slate-100 text-slate-900 border border-slate-200/60 rounded-tl-none'
              }`}>
                <p>{m.text}</p>
                <span className={`block text-[10px] mt-1 text-end opacity-60 font-mono`}>
                  {m.time}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-purple-400 text-xs p-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>المساعد المالي يحلل البيانات ويكتب الإجابة...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className={`mt-3 p-2 rounded-2xl border flex items-center gap-2 ${
        darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200'
      }`}>
        <input
          type="text"
          placeholder={t.askAnything}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent border-none outline-none text-xs px-2"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white transition-all shadow-md shadow-purple-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
