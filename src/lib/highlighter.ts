import { createElement, Fragment, type ReactNode } from "react"
import {
  createHighlighter,
  type BundledLanguage,
  type BundledTheme,
  type GrammarState,
  type HighlighterGeneric,
} from "shiki"

const THEME: BundledTheme = "github-dark"

type CodeHighlighter = {
  highlight: (
    code: string,
    state?: GrammarState
  ) => {
    lines: ReactNode[]
    state?: GrammarState
  }
}

let highlighterPromise: Promise<
  HighlighterGeneric<BundledLanguage, BundledTheme>
> | null = null

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: [THEME],
    langs: [],
  })

  return highlighterPromise
}

/**
 * Loads (once) a Shiki highlighter and makes sure the requested language
 * grammar is available. Used by `useHighlightedCode`.
 */
export async function loadHighlighter(language: string): Promise<CodeHighlighter> {
  const highlighter = await getHighlighter()

  if (!highlighter.getLoadedLanguages().includes(language)) {
    await highlighter.loadLanguage(language as BundledLanguage)
  }

  return {
    highlight(code, state) {
      const { tokens } = highlighter.codeToTokens(code, {
        lang: language as BundledLanguage,
        theme: THEME,
        grammarState: state,
      })

      const lines = tokens.map((line, lineIndex) =>
        createElement(
          Fragment,
          { key: lineIndex },
          ...line.map((token, tokenIndex) =>
            createElement(
              "span",
              {
                key: tokenIndex,
                style: token.color ? { color: token.color } : undefined,
              },
              token.content
            )
          )
        )
      )

      return {
        lines,
        state: highlighter.getLastGrammarState(tokens),
      }
    },
  }
}
