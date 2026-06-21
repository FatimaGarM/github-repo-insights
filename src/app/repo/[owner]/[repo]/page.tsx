import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import type { Metadata } from "next"
import { getRepo, getContributors, getLanguages } from "@/lib/github"
import type { LanguageEntry } from "@/lib/github"
import LanguageChart from "@/components/LanguageChart"
import CommitSection, { CommitSectionSkeleton } from "./CommitSection"
import LocaleToggle from "@/components/LocaleToggle"
import { getLocale } from "@/lib/getLocale"
import { t } from "@/lib/translations"

type Props = { params: Promise<{ owner: string; repo: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params
  return { title: `${owner}/${repo}` }
}

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export default async function RepoPage({ params }: Props) {
  const { owner, repo } = await params
  const locale = await getLocale()

  const [repoData, contributors, languages] = await Promise.all([
    getRepo(owner, repo),
    getContributors(owner, repo),
    getLanguages(owner, repo),
  ])

  const languageData: LanguageEntry[] = Object.entries(languages).map(
    ([name, value]) => ({ name, value })
  )

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 md:p-10">

      {/* Locale toggle */}
      <div className="fixed top-4 right-4 z-50">
        <LocaleToggle locale={locale} />
      </div>

      <div className="max-w-5xl mx-auto">

        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white
                     mb-8 py-2 px-3 -ml-3 rounded-lg hover:bg-neutral-800/50 transition-all group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          {t(locale, 'backToSearch')}
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {repoData.full_name}
            </h1>
            <p className="text-neutral-400 max-w-2xl">
              {repoData.description || t(locale, 'noDescription')}
            </p>
            {repoData.license && (
              <span className="inline-block mt-3 text-xs bg-neutral-800 text-neutral-400 px-2.5 py-1 rounded-full">
                {repoData.license.name}
              </span>
            )}
          </div>

          <a
            href={repoData.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-neutral-700
                       bg-neutral-900 px-4 py-2.5 text-sm hover:bg-neutral-800 hover:border-neutral-600 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {t(locale, 'viewOnGitHub')}
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800 hover:border-neutral-700 transition">
            <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">{t(locale, 'stars')}</p>
            <p className="text-2xl font-bold">{formatNumber(repoData.stargazers_count)}</p>
          </div>

          <div className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800 hover:border-neutral-700 transition">
            <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">{t(locale, 'forks')}</p>
            <p className="text-2xl font-bold">{formatNumber(repoData.forks_count)}</p>
          </div>

          <div className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800 hover:border-neutral-700 transition">
            <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">{t(locale, 'watchers')}</p>
            <p className="text-2xl font-bold">{formatNumber(repoData.watchers_count)}</p>
          </div>

          <div className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800 hover:border-neutral-700 transition">
            <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">{t(locale, 'openIssues')}</p>
            <p className="text-2xl font-bold">{formatNumber(repoData.open_issues_count)}</p>
          </div>

        </div>

        {/* Health Score + Commit Activity (streamed) */}
        <Suspense fallback={<CommitSectionSkeleton locale={locale} />}>
          <CommitSection owner={owner} repo={repo} repoData={repoData} contributors={contributors} locale={locale} />
        </Suspense>

        {/* Contributors */}
        {contributors.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold mb-5 text-neutral-200">
              {t(locale, 'topContributors')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {contributors.slice(0, 8).map((c) => (
                <a
                  key={c.id}
                  href={c.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex items-center gap-3
                             hover:border-neutral-700 hover:bg-neutral-800/50 transition-all group"
                >
                  <Image
                    src={c.avatar_url}
                    alt={`${c.login}'s avatar`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="overflow-hidden">
                    <p className="font-medium text-sm truncate group-hover:text-indigo-400 transition-colors">{c.login}</p>
                    <p className="text-xs text-neutral-500">
                      {c.contributions} {t(locale, 'commits')}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languageData.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold mb-5 text-neutral-200">
              {t(locale, 'languages')}
            </h2>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
              <LanguageChart data={languageData} />
            </div>
          </section>
        )}

        {/* Footer spacer */}
        <div className="h-16" />

      </div>

    </main>
  )
}