"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import type { CommitEntry } from "@/lib/github"

export default function CommitChart({ data }: { data: CommitEntry[] }) {
  return (
    <div className="h-80">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart data={data}>

          <CartesianGrid stroke="#262626" strokeDasharray="3 3" />

          <XAxis
            dataKey="week"
            stroke="#666"
            tick={{ fontSize: 12 }}
          />

          <YAxis stroke="#666" tick={{ fontSize: 12 }} />

          <Tooltip
            contentStyle={{
              backgroundColor: "#171717",
              border: "1px solid #333",
              borderRadius: "8px",
              fontSize: 13,
            }}
            labelFormatter={(v) => `Week ${v}`}
          />

          <Line
            type="monotone"
            dataKey="commits"
            stroke="#6366F1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#6366F1" }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}