"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { LanguageEntry } from "@/lib/github"

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#14B8A6",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
]

function formatBytes(bytes: number) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)}M`
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)}k`
  return `${bytes}`
}

export default function LanguageChart({ data }: { data: LanguageEntry[] }) {
  const total = data.reduce((acc, d) => acc + d.value, 0)

  const sorted = [...data].sort((a, b) => b.value - a.value)

  const topLanguages = sorted.slice(0, 5)

  const othersValue = sorted
    .slice(5)
    .reduce((sum, lang) => sum + lang.value, 0)

  const chartData =
    othersValue > 0
      ? [...topLanguages, { name: "Others", value: othersValue }]
      : topLanguages

  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              animationDuration={600}
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#171717",
                border: "1px solid #333",
                borderRadius: "8px",
                fontSize: 13,
              }}
              formatter={(value) => formatBytes(Number(value))}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {chartData.map((lang, index) => {
          const pct =
            total > 0
              ? ((lang.value / total) * 100).toFixed(1)
              : "0"

          return (
            <div
              key={lang.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
                <span className="text-sm">{lang.name}</span>
              </div>

              <span className="text-sm text-neutral-400">
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}