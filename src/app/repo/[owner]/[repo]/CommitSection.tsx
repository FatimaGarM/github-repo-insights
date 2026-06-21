import CommitChart from "@/components/CommitChart"
import { getCommitActivity } from "@/lib/github"
import { calculateHealthScore } from "@/lib/healthScore"
import type { CommitEntry, GitHubRepo, Contributor } from "@/lib/github"
import { t } from "@/lib/translations"
import type { Locale } from "@/lib/translations"

function healthColor(score: number, locale: Locale) {
  if (score > 75) return { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: t(locale, 'veryActive') }
  if (score > 40) return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: t(locale, 'moderate') }
  return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: t(locale, 'lowActivity') }
}

export function CommitSectionSkeleton({ locale = 'en' }: { locale?: Locale }) {
  return (
    <>
      {/* Health Score skeleton */}
      <div className="mt-6 bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-36 shimmer rounded" />
          <div className="h-8 w-24 shimmer rounded" />
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="h-4 w-24 shimmer rounded" />
          <div className="w-32 h-2 shimmer rounded-full" />
          <p className="flex items-center gap-1.5 text-xs text-neutral-600">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-ping" />
            {t(locale, 'computingActivity')}
          </p>
        </div>
      </div>

      {/* Commit chart skeleton */}
      <section className="mt-14">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-5 w-36 shimmer rounded" />
          <p className="flex items-center gap-1.5 text-xs text-neutral-600">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-ping" />
            {t(locale, 'fetchingStats')}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
          <div className="flex items-end gap-0.5 h-48">
            {Array.from({ length: 52 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 shimmer rounded-sm"
                style={{ height: `${20 + Math.abs(Math.sin(i * 0.4) * 30 + Math.sin(i * 0.13) * 20)}%` }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default async function CommitSection({
  owner,
  repo,
  repoData,
  contributors,
  locale = 'en',
}: {
  owner: string
  repo: string
  repoData: GitHubRepo
  contributors: Contributor[]
  locale?: Locale
}) {
  const commitActivity = await getCommitActivity(owner, repo)
  const commits = commitActivity ?? []

  const commitData: CommitEntry[] = commits.map((week, index) => ({
    week: index + 1,
    commits: week.total,
  }))

  const healthScore = calculateHealthScore(repoData, contributors, commits)
  const health = healthColor(healthScore, locale)

  return (
    <>
      {/* Health Score */}
      <div className={`mt-6 ${health.bg} ${health.border} border rounded-xl p-6 flex items-center justify-between`}>
        <div>
          <p className="text-neutral-400 text-sm mb-1">{t(locale, 'repositoryHealth')}</p>
          <p className="text-3xl font-bold">{healthScore}<span className="text-lg text-neutral-500">/100</span></p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <span className={`${health.text} font-medium text-lg`}>{health.label}</span>
          <div className="w-32 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                healthScore > 75 ? "bg-green-500" : healthScore > 40 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Commit Activity */}
      {commitData.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold mb-5 text-neutral-200">
            {t(locale, 'commitActivity')} <span className="text-sm font-normal text-neutral-500">{t(locale, 'last52weeks')}</span>
          </h2>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
            <CommitChart data={commitData} />
          </div>
        </section>
      )}
    </>
  )
}
