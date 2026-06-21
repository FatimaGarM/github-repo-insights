"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { translations } from "@/lib/translations"
import type { Locale } from "@/lib/translations"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [locale, setLocale] = useState<Locale>("en")

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/)
    if (match?.[1] === "es") setLocale("es")
  }, [])

  const T = translations[locale]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white px-6">

      <div className="max-w-md w-full text-center">

        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-3">
          {T.somethingWentWrong}
        </h1>

        <p className="text-neutral-400 mb-8">
          {error.message || T.errorDescription}
        </p>

        <div className="flex gap-3 justify-center">

          <button
            onClick={reset}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-2.5 text-sm
                       hover:bg-neutral-800 hover:border-neutral-600 transition-all"
          >
            {T.tryAgain}
          </button>

          <Link
            href="/"
            className="rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm
                       font-medium hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20"
          >
            {T.backToHome}
          </Link>

        </div>

      </div>

    </main>
  )
}
