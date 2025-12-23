
import { Language, Theme } from '../types';

// Exported for use in App component
export interface ThemePalette {
  keyword: string;
  string: string;
  comment: string;
  function: string;
  number: string;
  operator: string;
  bg: string;
  text: string;
  isDark: boolean;
}

// Exported to allow access to theme colors in UI components
export const THEME_PALETTES: Record<Theme, ThemePalette> = {
  'vsc-light': { keyword: '#0000ff', string: '#a31515', comment: '#008000', function: '#795e26', number: '#098658', operator: '#000000', bg: '#ffffff', text: '#000000', isDark: false },
  'xcode-light': { keyword: '#9b2393', string: '#c41a16', comment: '#007400', function: '#326d74', number: '#1c00cf', operator: '#000000', bg: '#ffffff', text: '#000000', isDark: false },
  'atom-light': { keyword: '#a626a4', string: '#50a14f', comment: '#40a070', function: '#4078f2', number: '#986801', operator: '#383a42', bg: '#fafafa', text: '#383a42', isDark: false },
  'quiet-light': { keyword: '#4b69c6', string: '#448c27', comment: '#70975a', function: '#aa3731', number: '#ab652f', operator: '#333333', bg: '#f5f5f5', text: '#333333', isDark: false },
  'github-light': { keyword: '#d73a49', string: '#032f62', comment: '#6a737d', function: '#6f42c1', number: '#005cc5', operator: '#d73a49', bg: '#ffffff', text: '#24292e', isDark: false },
  'github-dark': { keyword: '#ff7b72', string: '#a5d6ff', comment: '#8b949e', function: '#d2a8ff', number: '#79c0ff', operator: '#ff7b72', bg: '#0d1117', text: '#c9d1d9', isDark: true },
  'dracula': { keyword: '#ff79c6', string: '#f1fa8c', comment: '#6272a4', function: '#50fa7b', number: '#bd93f9', operator: '#ff79c6', bg: '#282a36', text: '#f8f8f2', isDark: true },
  'monokai': { keyword: '#f92672', string: '#e6db74', comment: '#75715e', function: '#a6e22e', number: '#ae81ff', operator: '#f92672', bg: '#272822', text: '#f8f8f2', isDark: true },
  'solarized-light': { keyword: '#859900', string: '#2aa198', comment: '#93a1a1', function: '#268bd2', number: '#d33682', operator: '#859900', bg: '#fdf6e3', text: '#657b83', isDark: false },
  'vsc-dark-plus': { keyword: '#569cd6', string: '#ce9178', comment: '#6a9955', function: '#dcdcaa', number: '#b5cea8', operator: '#d4d4d4', bg: '#1e1e1e', text: '#d4d4d4', isDark: true },
  'one-dark': { keyword: '#c678dd', string: '#98c379', comment: '#5c6370', function: '#61afef', number: '#d19a66', operator: '#56b6c2', bg: '#282c34', text: '#abb2bf', isDark: true },
  'nord': { keyword: '#81a1c1', string: '#a3be8c', comment: '#616e88', function: '#88c0d0', number: '#b48ead', operator: '#81a1c1', bg: '#2e3440', text: '#d8dee9', isDark: true },
  'night-owl': { keyword: '#c792ea', string: '#ecc48d', comment: '#637777', function: '#82aaff', number: '#f78c6c', operator: '#c792ea', bg: '#011627', text: '#d6deeb', isDark: true },
  'shades-of-purple': { keyword: '#ff9d00', string: '#a5ff90', comment: '#b362ff', function: '#fad000', number: '#ff628c', operator: '#ff9d00', bg: '#2d2b55', text: '#ffffff', isDark: true },
  'synthwave-84': { keyword: '#f92aad', string: '#ff8b39', comment: '#848bbd', function: '#36f9f6', number: '#f97e72', operator: '#f92aad', bg: '#262335', text: '#ffffff', isDark: true },
  'ayu-light': { keyword: '#555555', string: '#86b300', comment: '#abb0b6', function: '#f29718', number: '#ff3333', operator: '#ed9366', bg: '#fafafa', text: '#5c6773', isDark: false }
};

const KEYWORDS_LIST = "break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|if|import|in|instanceof|new|null|return|super|switch|this|throw|true|try|typeof|var|void|while|with|yield|await|let|static|public|private|protected|async|interface|type|struct|enum|fn|println|using|namespace|int|float|double|bool|string|list|map|set|final|NULL|nullptr|override|virtual|include|import|from";

export function highlightToHtml(code: string, language: Language, theme: Theme): string {
  const palette = THEME_PALETTES[theme];
  
  // 1. 转义基础字符
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. 语法高亮逻辑
  const patterns = [
    { name: 'comment', regex: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/m },
    { name: 'string', regex: /(&quot;.*?&quot;|&#039;.*?&#039;|`.*?`)/ },
    { name: 'keyword', regex: new RegExp(`\\b(${KEYWORDS_LIST})\\b`) },
    { name: 'number', regex: /\b\d+\b/ },
    { name: 'function', regex: /([a-zA-Z_]\w*)(?=\s*(\(|&lt;))/ }
  ];

  const fullRegex = new RegExp(patterns.map(p => p.regex.source).join('|'), 'gm');

  let highlighted = escaped.replace(fullRegex, (match) => {
    if (/^(\/\/|\/\*|#)/.test(match)) return `<span style="color: ${palette.comment}; font-style: italic;">${match}</span>`;
    if (/^(&quot;|&#039;|`)/.test(match)) return `<span style="color: ${palette.string};">${match}</span>`;
    if (new RegExp(`^(${KEYWORDS_LIST})$`).test(match)) return `<span style="color: ${palette.keyword}; font-weight: bold;">${match}</span>`;
    if (/^\d+$/.test(match)) return `<span style="color: ${palette.number};">${match}</span>`;
    return `<span style="color: ${palette.function}; font-weight: 500;">${match}</span>`;
  });

  // 3. 处理 Word 布局兼容性
  const parts = highlighted.split(/(<[^>]*>)/g);
  const wordReadyParts = parts.map(part => {
    if (part.startsWith('<')) return part;
    return part.replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>');
  });
  
  const finalContent = wordReadyParts.join('');

  // 4. 使用 Table 布局确保背景色在 Word 中完美呈现
  return `
<table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="${palette.bg}" style="background-color: ${palette.bg}; width: 100%; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
  <tr>
    <td bgcolor="${palette.bg}" style="padding: 20px; background-color: ${palette.bg}; color: ${palette.text}; font-family: 'Consolas', 'Courier New', monospace; font-size: 10.5pt; line-height: 1.5; vertical-align: top; mso-line-height-rule: exactly;">
      <div style="font-family: 'Consolas', 'Courier New', monospace; color: ${palette.text};">
        ${finalContent}
      </div>
    </td>
  </tr>
</table>`;
}
