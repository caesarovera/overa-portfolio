import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV === "development";

// Everything the page loads comes from its own origin: fonts are self-hosted
// (see lib/fonts.ts), images go through /_next/image, and there is no analytics
// or embed. Anything from another origin is therefore refused.
//
// script-src keeps 'unsafe-inline' because the no-flash theme script in
// layout.tsx and Next's own RSC payload are inline. A nonce would remove it, but
// that needs middleware and turns this static page into a per-request render.
// style-src keeps it because GSAP animates through inline style attributes.
// next dev needs 'unsafe-eval' for fast refresh; production does not get it.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // A second package-lock.json sits in the parent folder, so Next infers THAT
  // directory as the workspace root and warns on every build. Pinning the root
  // here also keeps the standalone build trace scoped to this project rather
  // than to whatever else happens to live alongside it.
  outputFileTracingRoot: path.resolve(__dirname),
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
