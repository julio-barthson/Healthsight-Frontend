import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-render"

export const alt = "Create your Healthsight account"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    title: "Create your account",
    subtitle: "Join the Lagos State Health District I platform.",
  })
}
