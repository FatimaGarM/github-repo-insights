import type { GitHubRepo, Contributor, CommitWeek } from "./github"

export function calculateHealthScore(
  repo: GitHubRepo,
  contributors: Contributor[],
  commits: CommitWeek[]
) {
  let score = 0

  const recentCommits = commits.slice(-12).reduce(
    (sum, week) => sum + week.total,
    0
  )

  if (recentCommits > 200) score += 30
  else if (recentCommits > 50) score += 20
  else if (recentCommits > 10) score += 10

  if (contributors.length > 50) score += 25
  else if (contributors.length > 10) score += 15
  else if (contributors.length > 3) score += 10

  if (repo.stargazers_count > 10000) score += 20
  else if (repo.stargazers_count > 1000) score += 10
  else if (repo.stargazers_count > 100) score += 5

  if (repo.open_issues_count < 50) score += 15
  else if (repo.open_issues_count < 200) score += 10

  return Math.min(score, 100)
}