export default function Loading() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 md:p-10">

      {/* Top indeterminate progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-neutral-900 progress-indeterminate z-50" />

      <div className="max-w-5xl mx-auto">

        {/* Back link */}
        <div className="h-4 w-28 shimmer rounded mb-8" />

        {/* Cycling step labels */}
        <div className="relative h-4 mb-8 -mt-4">
          <p className="load-step-1 absolute inset-0 flex items-center gap-1.5 text-xs text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-ping shrink-0" />
            Fetching repository info...
          </p>
          <p className="load-step-2 absolute inset-0 flex items-center gap-1.5 text-xs text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-ping shrink-0" />
            Loading contributors...
          </p>
          <p className="load-step-3 absolute inset-0 flex items-center gap-1.5 text-xs text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-ping shrink-0" />
            Computing commit activity...
          </p>
        </div>

        {/* Header */}
        <div className="h-9 w-72 shimmer rounded mb-3" />
        <div className="h-4 w-96 shimmer rounded opacity-60 mb-10" />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 shimmer rounded-xl" />
          ))}
        </div>

        {/* Health Score */}
        <div className="h-24 shimmer rounded-xl mb-14" />

        {/* Contributors */}
        <div className="h-5 w-40 shimmer rounded mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-18 shimmer rounded-xl" />
          ))}
        </div>

        {/* Languages */}
        <div className="h-5 w-28 shimmer rounded mb-5" />
        <div className="h-72 shimmer rounded-xl mb-14 opacity-80" />

        {/* Commit chart bars preview */}
        <div className="h-5 w-36 shimmer rounded mb-5" />
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

      </div>
    </main>
  )
}