export type CodeToken = { text: string; kind: "text" | "keyword" | "string" };

// Match quoted strings before keywords, and never split a JS identifier.
const tokenPattern =
  /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?<![\w$])\b(?:const|let|await|try|catch|if|throw|return|true|false|undefined|async|def|with|as|raise|yield|None|True|False)\b(?![\w$]))/g;
const keywordPattern =
  /^(?:const|let|await|try|catch|if|throw|return|true|false|undefined|async|def|with|as|raise|yield|None|True|False)$/;

export function codeTokens(line: string): CodeToken[] {
  return line
    .split(tokenPattern)
    .filter(Boolean)
    .map((text) => ({
      text,
      kind: keywordPattern.test(text)
        ? "keyword"
        : /^["']/.test(text)
          ? "string"
          : "text",
    }));
}
