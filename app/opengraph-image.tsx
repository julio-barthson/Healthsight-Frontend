import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-render"
import { SITE_LONG_NAME } from "@/lib/seo"

export const alt = SITE_LONG_NAME
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    title: "Healthsight",
    subtitle:
      "Digital primary-healthcare platform for Lagos State Health District I.",
  })
}
