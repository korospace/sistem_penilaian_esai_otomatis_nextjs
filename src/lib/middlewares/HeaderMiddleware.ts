// nextjs
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
// types
import { MiddlewareFactoryType } from "../types/ResultTypes";

/**
 * MIDDLEWARE PATH
 * ----------------------------
 */
const requiredPath: string[] = [];

/**
 * MIDDLEWARE RULES
 * ----------------------------
 */
const HeaderMiddleware: MiddlewareFactoryType = (
  middleware: NextMiddleware
) => {
  return async (req: NextRequest, next: NextFetchEvent) => {
    req.headers.set("Referrer-Policy", "no-referrer-when-downgrade");
    req.headers.set("X-XSS-Protection", "1; mode=block");
    req.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    req.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' platform.twitter.com plausible.io utteranc.es *.cloudflare.com 'unsafe-inline' 'unsafe-eval' plausible.io/js/plausible.js utteranc.es/client.js; style-src 'self' *.cloudflare.com 'unsafe-inline'; img-src 'self' * data:; font-src 'self' data: ; connect-src 'self' plausible.io/api/event; media-src 'self'; frame-src 'self' platform.twitter.com plausible.io utteranc.es github.com *.youtube.com *.vimeo.com; object-src 'none'; base-uri 'self';"
    );
    req.headers.set("Expect-CT", "enforce, max-age=30");
    req.headers.set(
      "Permissions-Policy",
      "autoplay=(self), camera=(), encrypted-media=(self), fullscreen=(), geolocation=(self), gyroscope=(self), magnetometer=(), microphone=(), midi=(), payment=(), sync-xhr=(self), usb=()"
    );
    req.headers.set("Access-Control-Allow-Origin", "*");
    req.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    req.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,X-Requested-With,X-CSRF-Token"
    );
    req.headers.set("X-Content-Type-Options", "nosniff");
    req.headers.set("X-Permitted-Cross-Domain-Policies", "none");
    req.headers.set(
      "Feature-Policy",
      "camera 'none'; fullscreen 'self'; geolocation *; microphone 'self' https://peduli-pusdatin-dinsos.jakarta.go.id/*"
    );

    return middleware(req, next);
  };
};

export default HeaderMiddleware;
