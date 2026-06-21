"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import LocaleToggle from "@/components/LocaleToggle"
import { translations } from "@/lib/translations"
import type { Locale } from "@/lib/translations"

export default function Home() {
  const [repo, setRepo] = useState("")
  const [recent, setRecent] = useState<string[]>([])
  const [locale, setLocale] = useState<Locale>("en")
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("recentRepos")
    if (stored) setRecent(JSON.parse(stored))
    const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/)
    if (match?.[1] === "es") setLocale("es")
  }, [])

  const T = translations[locale]

  function handleAnalyze(e?: FormEvent) {
    e?.preventDefault()
    if (!repo.trim()) return

    const cleaned = repo
      .trim()
      .replace("https://github.com/", "")
      .replace("github.com/", "")

    const updated = [cleaned, ...recent.filter(r => r !== cleaned)].slice(0, 5)

    localStorage.setItem("recentRepos", JSON.stringify(updated))
    setRecent(updated)

    router.push(`/repo/${cleaned}`)
  }

  function removeRecent(r: string) {
    const updated = recent.filter(item => item !== r)
    localStorage.setItem("recentRepos", JSON.stringify(updated))
    setRecent(updated)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white px-6">

      {/* Locale toggle */}
      <div className="fixed top-4 right-4 z-50">
        <LocaleToggle locale={locale} onLocaleChange={setLocale} />
      </div>

      <div className="max-w-xl w-full text-center">

        {/* Logo / Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-4 bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          GitHub Repo Insights
        </h1>

        <p className="text-neutral-400 mb-10 text-lg">
          {T.tagline}
        </p>

        <form onSubmit={handleAnalyze} className="flex gap-3 mb-10">

          <label htmlFor="repo-input" className="sr-only">
            GitHub repository (owner/repo)
          </label>

          <input
            id="repo-input"
            type="text"
            placeholder={T.placeholder}
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            aria-label="GitHub repository URL or owner/repo"
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none
                       focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50
                       placeholder:text-neutral-600 transition"
          />

          <button
            type="submit"
            className="rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3
                       font-medium hover:opacity-90 active:scale-[0.97] transition-all shadow-lg shadow-indigo-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!repo.trim()}
          >
            {T.analyze}
          </button>

        </form>

        {recent.length > 0 && (
          <div className="text-left">

            <p className="text-sm text-neutral-500 mb-3 uppercase tracking-wider font-medium">
              {T.recent}
            </p>

            <div className="space-y-2">

              {recent.map((r) => (
                <div
                  key={r}
                  className="flex items-center gap-2 group"
                >
                  <button
                    onClick={() => router.push(`/repo/${r}`)}
                    className="flex-1 text-left bg-neutral-900/60 border border-neutral-800 px-4 py-2.5 rounded-xl
                               hover:bg-neutral-800/80 hover:border-neutral-700 transition-all flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="text-sm">{r}</span>
                  </button>
                  <button
                    onClick={() => removeRecent(r)}
                    className="p-2 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-neutral-800/60 transition opacity-0 group-hover:opacity-100"
                    aria-label={`Remove ${r} from recent`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

            </div>

          </div>
        )}

        <p className="mt-14 text-xs text-neutral-600">
          {T.apiNote}
        </p>

      </div>

    </main>
  )
}