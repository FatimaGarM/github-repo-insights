// ── Types ──────────────────────────────────────────────

export interface GitHubRepo {
  full_name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  html_url: string
  owner: { login: string; avatar_url: string }
  language: string | null
  created_at: string
  updated_at: string
  license: { name: string } | null
}

export interface Contributor {
  id: number
  login: string
  avatar_url: string
  contributions: number
  html_url: string
}

export interface CommitWeek {
  total: number
  week: number
  days: number[]
}

export type LanguageMap = Record<string, number>

export interface LanguageEntry {
  name: string
  value: number
}

export interface CommitEntry {
  week: number
  commits: number
}

// ── API helpers ────────────────────────────────────────

const HEADERS = { Accept: "application/vnd.github+json" }

export async function getRepo(owner: string, repo: string): Promise<GitHubRepo> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: HEADERS,
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error("Repository not found")
  }

  return res.json()
}

export async function getContributors(owner: string, repo: string): Promise<Contributor[]> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contributors`,
    {
      headers: HEADERS,
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) return []
  return res.json()
}

export async function getLanguages(owner: string, repo: string): Promise<LanguageMap> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    {
      headers: HEADERS,
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) return {}
  return res.json()
}

export async function getCommitActivity(owner: string, repo: string): Promise<CommitWeek[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`

  // GitHub returns 202 while it computes stats for repos not recently queried.
  // Retry up to 5 times with a 2-second delay before giving up.
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      headers: HEADERS,
      next: { revalidate: 60 },
    })

    if (res.status === 202) {
      await new Promise((r) => setTimeout(r, 2000))
      continue
    }

    if (!res.ok) return []

    const data = await res.json()
    return Array.isArray(data) ? data : []
  }

  return []
}