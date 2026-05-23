// Central SEO constants for Healthsight (Lagos State Health District I).

export const SITE_NAME = "Healthsight"
export const SITE_LONG_NAME = "Healthsight — Lagos State Health District I"

export const SITE_DESCRIPTION =
  "Healthsight is the digital health platform for Lagos State Health District I — coordinating primary healthcare, patient screenings, facility assessments, and appointments across the district."

export const SITE_KEYWORDS = [
  "Lagos State Health District I",
  "LSHD1",
  "Healthsight",
  "primary healthcare Lagos",
  "PHC",
  "health screening",
  "SafeCare assessment",
  "patient management",
  "Lagos State health",
  "healthcare Nigeria",
]

// metadataBase / canonical root. Override via NEXT_PUBLIC_SITE_URL in the env.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

/** Build a "<title> | Healthsight" string for client-side document.title use. */
export function pageTitle(title?: string) {
  return title ? `${title} | ${SITE_NAME}` : SITE_LONG_NAME
}
