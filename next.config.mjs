import { fileURLToPath } from "node:url"
import { dirname } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the Turbopack workspace root to this project so it always resolves the
  // local `next` install (fixes the dev-time "Next.js package not found" panic).
  turbopack: {
    root: __dirname,
  },
  // Tree-shake heavy barrel imports for smaller/faster bundles.
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@tabler/icons-react",
      "recharts",
      "date-fns",
    ],
  },
}

export default nextConfig
