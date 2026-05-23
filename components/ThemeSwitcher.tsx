"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Flame } from "lucide-react"

import { cn } from "@/lib/utils"

// PRD §11.2 — three named brand themes in a pill switcher.
const OPTIONS = [
  { value: "light", label: "Daylight", Icon: Sun },
  { value: "dark", label: "Night", Icon: Moon },
  { value: "lagos-warmth", label: "Lagos Warmth", Icon: Flame },
] as const

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  // While "system" is active, highlight the resolved (light/dark) option.
  const active = !mounted
    ? undefined
    : theme === "system"
      ? resolvedTheme
      : theme

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-card/70 p-0.5 backdrop-blur-sm",
        className
      )}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const isActive = active === value
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-full transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
          </button>
        )
      })}
    </div>
  )
}
