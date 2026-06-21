"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import type { Locale } from "@/lib/translations"

export default function LocaleToggle({
  locale,
  onLocaleChange,
}: {
  locale: Locale
  onLocaleChange?: (next: Locale) => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function toggle() {
    const next = locale === "en" ? "es" : "en"
    document.cookie = `locale=${next}; path=/; max-age=31536000`
    onLocaleChange?.(next)
    startTransition(() => router.refresh())
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white
                 border border-neutral-800 hover:border-neutral-600 rounded-lg px-3 py-1.5
                 transition-all disabled:opacity-50 bg-neutral-900/60 hover:bg-neutral-800/60"
      title={locale === "en" ? "Cambiar a español" : "Switch to English"}
    >
      <span className="text-sm leading-none">{locale === "en" ? "🇪🇸" : "🇬🇧"}</span>
      <span>{locale === "en" ? "ES" : "EN"}</span>
    </button>
  )
}
