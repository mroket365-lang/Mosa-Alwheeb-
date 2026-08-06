import React, { useState } from 'react';
import { flutterCodeFiles, FlutterFile } from '../data/flutterCodeFiles';
import { Language } from '../types';
import { translations } from '../translations';
import JSZip from 'jszip';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  FileCode, 
  Folder, 
  Smartphone, 
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';

interface FlutterStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  darkMode: boolean;
}

export const FlutterStudioModal: React.FC<FlutterStudioModalProps> = ({
  isOpen,
  onClose,
  language,
  darkMode,
}) => {
  const t = translations[language];

  const [selectedFileIndex, setSelectedFileIndex] = useState(1); // main.dart default
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activeView, setActiveView] = useState<'code' | 'phone'>('code');

  if (!isOpen) return null;

  const currentFile = flutterCodeFiles[selectedFileIndex] || flutterCodeFiles[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      flutterCodeFiles.forEach((f) => {
        zip.file(f.path, f.content);
      });

      // Add a README.md for the Flutter project
      zip.file('README.md', `# Phoenix Finance - Flutter Project

Generated for: Phoenix Finance (تطبيق فينكس المالي)

## How to run this Flutter project:

1. Make sure Flutter SDK (>=3.0.0) is installed:
   \`\`\`bash
   flutter --version
   \`\`\`

2. Fetch dependencies:
   \`\`\`bash
   flutter pub get
   \`\`\`

3. Run on your connected device or web:
   \`\`\`bash
   flutter run
   \`\`\`

Features included:
- Arabic RTL & English/Chinese localization support
- Dark Mode / Light Mode state
- Multi-Account Balance Cards & Quick Transfers
- Refund Requests Tracker
- Fl_chart Financial Analytics
- Gemini AI Assistant Chat Interface
`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'phoenix_finance_flutter_project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error zipping Flutter project:', err);
      alert('Failed to generate zip file');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-6xl h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden relative ${
        darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-zinc-700/40 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Code2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base tracking-tight">{t.flutterStudio}</h2>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono font-bold">
                  Flutter SDK 3.x
                </span>
              </div>
              <p className="text-xs text-slate-400">
                مشروع فلاتر كامل وجاهز للتشغيل مباشرة مع دعمه الكامل للغة العربية وRTL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="p-1 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-1 text-xs">
              <button
                onClick={() => setActiveView('code')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeView === 'code' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>شفرة الكود (Dart)</span>
              </button>
              <button
                onClick={() => setActiveView('phone')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeView === 'phone' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>معاينة الهاتف</span>
              </button>
            </div>

            {/* Download Zip */}
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'جاري الضغط...' : t.downloadFlutterProject}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        {activeView === 'code' ? (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar File Tree */}
            <div className={`w-64 border-l border-zinc-700/40 p-4 overflow-y-auto space-y-1 text-xs ${
              darkMode ? 'bg-zinc-950/60' : 'bg-slate-50'
            }`}>
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] px-2 pb-2 tracking-wider">
                <Folder className="w-3.5 h-3.5 text-blue-500" />
                <span>ملفات المشروع (Project)</span>
              </div>

              {flutterCodeFiles.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-start px-3 py-2 rounded-xl font-mono flex items-center justify-between transition-all ${
                    selectedFileIndex === idx
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                      : darkMode
                      ? 'text-zinc-300 hover:bg-zinc-800'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span className="truncate">{file.filename}</span>
                  </div>
                  <span className="text-[10px] opacity-70 uppercase font-bold">{file.language}</span>
                </button>
              ))}
            </div>

            {/* Code Content Display */}
            <div className="flex-1 flex flex-col bg-[#1E1E1E] text-zinc-100 overflow-hidden">
              
              {/* File Info Bar */}
              <div className="px-6 py-2.5 bg-[#252526] border-b border-zinc-800 flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-semibold flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  {currentFile.path}
                </span>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.copied : t.copyCode}</span>
                </button>
              </div>

              {/* Code Box */}
              <div className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed text-slate-200">
                <pre className="whitespace-pre-wrap select-text">{currentFile.content}</pre>
              </div>

            </div>

          </div>
        ) : (
          /* Phone Frame Simulator */
          <div className="flex-1 bg-slate-950 flex items-center justify-center p-6 overflow-auto">
            <div className="w-[360px] h-[680px] bg-slate-900 rounded-[48px] p-4 border-[6px] border-slate-700 shadow-2xl relative flex flex-col overflow-hidden">
              
              {/* Phone Notch */}
              <div className="w-32 h-5 bg-slate-950 rounded-b-2xl mx-auto mb-2 flex items-center justify-center gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-slate-800" />
                <div className="w-10 h-1 rounded-full bg-slate-800" />
              </div>

              {/* Mobile App Screen Frame */}
              <div className="flex-1 bg-zinc-900 rounded-[32px] overflow-y-auto p-4 text-white text-xs space-y-4">
                
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="font-bold text-sm bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    فينكس المالي 📱
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    Flutter App
                  </span>
                </div>

                {/* Mobile Balance Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                  <p className="text-[10px] text-blue-200 uppercase">Total Balance</p>
                  <p className="text-2xl font-mono font-bold mt-1">$213,231.25</p>
                  <div className="flex gap-2 mt-3 text-[10px]">
                    <span className="bg-white/20 px-2 py-1 rounded">💳 المحفظة: $48k</span>
                    <span className="bg-white/20 px-2 py-1 rounded">🏦 البنك: $124k</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">💸 تحويل</div>
                  <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">📄 استرداد</div>
                  <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">🤖 AI مساعد</div>
                </div>

                {/* Recent Txs */}
                <div>
                  <p className="font-bold mb-2 text-zinc-300">أحدث المعاملات</p>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-zinc-800/80 flex items-center justify-between">
                      <span>🛍️ مشتريات</span>
                      <span className="font-mono text-rose-400">-$1,240</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-800/80 flex items-center justify-between">
                      <span>💵 راتب شهري</span>
                      <span className="font-mono text-emerald-400">+$28,000</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Home Indicator */}
              <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-2 shrink-0" />

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
