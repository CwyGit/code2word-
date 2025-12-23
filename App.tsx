
import React, { useState, useRef } from 'react';
import { 
  ClipboardDocumentIcon, 
  TrashIcon, 
  SparklesIcon, 
  CheckIcon,
  DocumentDuplicateIcon,
  SwatchIcon,
  LanguageIcon,
  BarsArrowUpIcon,
  CommandLineIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { Language, LANGUAGES, THEMES, CodeState, Theme, TRANSLATIONS, Locale } from './types';
import { highlightToHtml, THEME_PALETTES } from './utils/highlightUtils';
import { enhanceCode } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<CodeState>({
    code: `/* 二叉树的后序遍历递归算法 */\nvoid PostOrderTraverse(BiTree T)\n{\n    if (T == NULL)\n        return;\n\n    /* 先后序遍历左子树 */\n    PostOrderTraverse(T->lchild);\n\n    /* 再后序遍历右子树 */\n    PostOrderTraverse(T->rchild);\n\n    /* 显示结点数据 */\n    printf("%c", T->data);\n}`,
    language: 'cpp',
    theme: 'vsc-dark-plus',
    fontSize: 14,
    locale: 'zh'
  });

  const [activeLoadingAction, setActiveLoadingAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[state.locale];

  const handleCopy = async () => {
    const formattedHtml = highlightToHtml(state.code, state.language, state.theme);
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body>
        <!--StartFragment-->
        ${formattedHtml}
        <!--EndFragment-->
      </body>
      </html>
    `.trim();

    try {
      const blobHtml = new Blob([fullHtml], { type: 'text/html' });
      const blobText = new Blob([state.code], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText,
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = formattedHtml;
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      document.body.appendChild(tempContainer);
      const range = document.createRange();
      range.selectNode(tempContainer);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand('copy');
      document.body.removeChild(tempContainer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const removeEmptyLines = () => {
    const cleaned = state.code
      .split('\n')
      .filter(line => line.trim() !== '')
      .join('\n');
    setState(prev => ({ ...prev, code: cleaned }));
  };

  const handleAiAction = async (actionKey: string, baseInstruction: string) => {
    if (activeLoadingAction) return;
    
    setActiveLoadingAction(actionKey);
    try {
      // 动态增强指令：根据当前 UI 语言决定注释语言
      let finalInstruction = baseInstruction;
      if (actionKey === 'comments') {
        const commentLang = state.locale === 'zh' ? '中文 (Simplified Chinese)' : 'English';
        finalInstruction = `${baseInstruction} Ensure all added comments are in ${commentLang}.`;
      }

      const result = await enhanceCode(state.code, state.language, finalInstruction);
      setState(prev => ({ ...prev, code: result }));
    } catch (err) {
      alert(state.locale === 'zh' ? "AI 任务执行失败" : "AI task failed");
    } finally {
      setActiveLoadingAction(null);
    }
  };

  const palette = THEME_PALETTES[state.theme];
  const currentThemeData = THEMES.find(th => th.value === state.theme);

  const aiTools = [
    { id: 'format', label: t.aiFormat, icon: WrenchScrewdriverIcon, prompt: "Format the code with standard indentation and clean structure." },
    { id: 'refactor', label: t.aiRefactor, icon: RocketLaunchIcon, prompt: "Refactor the code for better readability and best practices while preserving logic." },
    { id: 'optimize', label: t.aiOptimize, icon: BeakerIcon, prompt: "Optimize the code for performance and efficiency." },
    { id: 'comments', label: t.aiComments, icon: ChatBubbleLeftRightIcon, prompt: "Add professional, concise comments to the code." },
    { id: 'modernize', label: t.aiModernize, icon: SparklesIcon, prompt: "Modernize the syntax using the latest language features." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 transform rotate-1 hover:rotate-0 transition-transform">
            <DocumentDuplicateIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
              {t.title} <span className="text-indigo-600 font-serif italic">{t.pro}</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-0.5">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setState(p => ({ ...p, locale: p.locale === 'zh' ? 'en' : 'zh' }))} className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-slate-600 font-black text-xs uppercase flex items-center gap-2">
            <LanguageIcon className="w-4 h-4 text-indigo-500" />
            {state.locale === 'zh' ? 'English' : '中文'}
          </button>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <SwatchIcon className="w-4 h-4 text-slate-400 ml-1" />
            <select value={state.theme} onChange={(e) => setState(p => ({ ...p, theme: e.target.value as Theme }))} className="bg-transparent border-none text-xs font-black text-slate-700 px-2 outline-none focus:ring-0 cursor-pointer">
              {THEMES.map(theme => (
                <option key={theme.value} value={theme.value}>{theme.label}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleCopy}
            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black transition-all shadow-2xl active:scale-95 transform ${
              copied ? 'bg-emerald-500 text-white shadow-emerald-200 scale-105' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:-translate-y-1'
            }`}
          >
            {copied ? <CheckIcon className="w-6 h-6" /> : <ClipboardDocumentIcon className="w-6 h-6" />}
            <span className="text-lg uppercase">{copied ? t.copyBtnReady : t.copyBtn}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-[1800px] mx-auto w-full grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col overflow-hidden h-[620px]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <select value={state.language} onChange={(e) => setState(p => ({ ...p, language: e.target.value as Language }))} className="bg-white border border-slate-200 rounded-xl text-[11px] font-black px-4 py-2 uppercase outline-none shadow-sm cursor-pointer">
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => handleAiAction('format', "Format the code with consistent indentation and clean structure.")} 
                  className={`transition-colors p-1 ${activeLoadingAction === 'format' ? 'text-indigo-400 animate-spin' : 'text-indigo-600 hover:text-indigo-800'}`} 
                  title={t.aiFormat}
                 >
                    {activeLoadingAction === 'format' ? <ArrowPathIcon className="w-5 h-5" /> : <CommandLineIcon className="w-5 h-5" />}
                 </button>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.editorLabel}</span>
              </div>
            </div>
            <textarea
              value={state.code}
              onChange={(e) => setState(p => ({ ...p, code: e.target.value }))}
              spellCheck={false}
              className="flex-1 p-10 code-font text-sm text-slate-800 focus:outline-none resize-none bg-white leading-loose font-mono"
              placeholder={t.placeholder}
            />
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-amber-500" /> {t.aiAssistant}
              </h3>
              <button onClick={removeEmptyLines} className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl text-[11px] font-black hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm flex items-center gap-2">
                <BarsArrowUpIcon className="w-4 h-4" /> {t.removeEmpty}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {aiTools.map((action) => {
                const isLoading = activeLoadingAction === action.id;
                return (
                  <button 
                    key={action.id} 
                    disabled={!!activeLoadingAction || !state.code} 
                    onClick={() => handleAiAction(action.id, action.prompt)} 
                    className={`bg-slate-50 border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600 px-3 py-4 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm flex flex-col items-center gap-2 ${isLoading ? 'bg-indigo-50 border-indigo-200' : ''}`}
                  >
                    {isLoading ? (
                      <ArrowPathIcon className="w-5 h-5 text-indigo-500 animate-spin" />
                    ) : (
                      <action.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                    )}
                    <span className={isLoading ? 'text-indigo-600' : ''}>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 sticky top-28 h-fit">
          <div className={`rounded-[2.5rem] border-2 overflow-hidden shadow-2xl transition-all ${
            currentThemeData?.type === 'dark' ? 'bg-[#1e1e1e] border-slate-800' : 'bg-white border-slate-100'
          }`}>
            <div className={`px-8 py-5 border-b flex items-center justify-between ${
               currentThemeData?.type === 'dark' ? 'bg-[#151515] border-slate-800' : 'bg-slate-50 border-slate-100'
             }`}>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-[10px] font-black px-4 py-1.5 rounded-xl bg-indigo-600 text-white uppercase tracking-widest">{t.previewLabel}</span>
            </div>
            <div 
              className="p-1 overflow-auto max-h-[650px]"
              style={{ backgroundColor: currentThemeData?.type === 'dark' ? palette.bg : '#fff' }}
              dangerouslySetInnerHTML={{ 
                __html: highlightToHtml(state.code, state.language, state.theme) 
              }}
            />
          </div>

          <div className="p-10 bg-indigo-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <h4 className="font-black text-xl mb-6 flex items-center gap-3">
              <CheckIcon className="w-6 h-6 text-emerald-400" /> {t.tipTitle}
            </h4>
            <div className="space-y-4 opacity-90 text-sm font-bold">
              <p>• {t.tip1}</p>
              <p>• {t.tip2}</p>
              <p>• {t.tip3}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
