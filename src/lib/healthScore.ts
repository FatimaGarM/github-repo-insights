import type { GitHubRepo, Contributor, CommitWeek } from "./github"

export function calculateHealthScore(
  repo: GitHubRepo,
  contributors: Contributor[],
  commits: CommitWeek[]
) {
  let score = 15

  const recentCommits = commits
    .slice(-12)
    .reduce((sum, week) => sum + week.total, 0)

  // Activity (40 pts)

  if (recentCommits > 1000) score += 40
  else if (recentCommits > 500) score += 35
  else if (recentCommits > 200) score += 30
  else if (recentCommits > 100) score += 25
  else if (recentCommits > 50) score += 20
  else if (recentCommits > 10) score += 10

  // Contributors (20 pts)

  if (contributors.length > 100) score += 20
  else if (contributors.length > 50) score += 18
  else if (contributors.length > 20) score += 15
  else if (contributors.length > 10) score += 12
  else if (contributors.length > 3) score += 8

  // Popularity (25 pts)

  if (repo.stargazers_count > 100000) score += 25
  else if (repo.stargazers_count > 50000) score += 22
  else if (repo.stargazers_count > 10000) score += 18
  else if (repo.stargazers_count > 1000) score += 12
  else if (repo.stargazers_count > 100) score += 6

  // Community adoption (15 pts)

  if (repo.forks_count > 50000) score += 15
  else if (repo.forks_count > 10000) score += 12
  else if (repo.forks_count > 1000) score += 8
  else if (repo.forks_count > 100) score += 4

  return Math.max(15, Math.min(score, 100))
}