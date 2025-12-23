
export type Language = 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'java' 
  | 'cpp' 
  | 'csharp' 
  | 'html' 
  | 'css' 
  | 'sql' 
  | 'go' 
  | 'rust' 
  | 'json';

export type Theme = 
  | 'github-light' 
  | 'github-dark' 
  | 'dracula' 
  | 'monokai' 
  | 'solarized-light' 
  | 'vsc-dark-plus'
  | 'vsc-light'
  | 'xcode-light'
  | 'atom-light'
  | 'quiet-light'
  | 'one-dark'
  | 'nord'
  | 'night-owl'
  | 'shades-of-purple'
  | 'synthwave-84'
  | 'ayu-light';

export type Locale = 'zh' | 'en';

export interface CodeState {
  code: string;
  language: Language;
  theme: Theme;
  fontSize: number;
  locale: Locale;
}

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'json', label: 'JSON' },
];

export const THEMES: { value: Theme; label: string; type: 'light' | 'dark' }[] = [
  { value: 'vsc-light', label: 'VS Code Light (Green Com)', type: 'light' },
  { value: 'xcode-light', label: 'Xcode Light', type: 'light' },
  { value: 'atom-light', label: 'Atom Light', type: 'light' },
  { value: 'quiet-light', label: 'Quiet Light', type: 'light' },
  { value: 'github-light', label: 'GitHub Light', type: 'light' },
  { value: 'ayu-light', label: 'Ayu Light', type: 'light' },
  { value: 'solarized-light', label: 'Solarized Light', type: 'light' },
  { value: 'vsc-dark-plus', label: 'VS Code Dark+', type: 'dark' },
  { value: 'github-dark', label: 'GitHub Dark', type: 'dark' },
  { value: 'one-dark', label: 'One Dark', type: 'dark' },
  { value: 'dracula', label: 'Dracula', type: 'dark' },
  { value: 'monokai', label: 'Monokai', type: 'dark' },
  { value: 'nord', label: 'Nord', type: 'dark' },
  { value: 'night-owl', label: 'Night Owl', type: 'dark' },
  { value: 'shades-of-purple', label: 'Shades of Purple', type: 'dark' },
  { value: 'synthwave-84', label: 'SynthWave \'84', type: 'dark' },
];

export const TRANSLATIONS = {
  zh: {
    title: 'Code2Word',
    pro: 'Pro',
    subtitle: '专为 Word 文档优化的格式化工具',
    copyBtn: '复制到 Word',
    copyBtnReady: '已复制！',
    editorLabel: '代码编辑',
    previewLabel: 'WORD 效果预览',
    aiAssistant: '智能工具',
    aiFormat: '自动格式化',
    aiRefactor: '美化重构',
    aiOptimize: '性能优化',
    aiComments: '专业注释',
    aiModernize: '现代语法',
    removeEmpty: '去除空行',
    aiWorking: '魔法加载中...',
    tipTitle: '粘贴技巧：',
    tip1: '• 点击复制后，直接在 Word 中 Ctrl+V 即可。',
    tip2: '• 使用表格布局确保背景色和边距完美保留。',
    tip3: '• 建议使用 Consolas 或 Courier New 字体。',
    clearConfirm: '确定清空所有代码？',
    placeholder: '在此粘贴您的代码...',
    footer: '让代码在文档中焕发光彩'
  },
  en: {
    title: 'Code2Word',
    pro: 'Pro',
    subtitle: 'Doc-Friendly Formatter',
    copyBtn: 'Copy for Word',
    copyBtnReady: 'Copied!',
    editorLabel: 'Editor',
    previewLabel: 'WORD PREVIEW',
    aiAssistant: 'Smart Tools',
    aiFormat: 'Auto Format',
    aiRefactor: 'Beautify',
    aiOptimize: 'Optimize',
    aiComments: 'Add Docs',
    aiModernize: 'Modernize',
    removeEmpty: 'Trim Lines',
    aiWorking: 'Working...',
    tipTitle: 'Pasting Tips:',
    tip1: '• Click Copy and use Ctrl+V in MS Word directly.',
    tip2: '• Table layout ensures background color is kept.',
    tip3: '• Fonts like Consolas work best in Word.',
    clearConfirm: 'Clear all code?',
    placeholder: 'Paste your code here...',
    footer: 'Making code look beautiful in documents'
  }
};
