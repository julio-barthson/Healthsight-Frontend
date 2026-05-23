"use client"

import { useEffect } from "react"
import { pageTitle } from "@/lib/seo"

/**
 * Sets document.title to "<title> | Healthsight" for client-rendered pages
 * (the dashboard is behind auth, so this is a tab/UX win rather than crawl SEO).
 * Pass a falsy value while data is still loading to keep the inherited title.
 */
export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    if (!title) return
    const previous = document.title
    document.title = pageTitle(title)
    return () => {
      document.title = previous
    }
  }, [title])
}
