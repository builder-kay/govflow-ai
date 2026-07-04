import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "govflow-admin-session";

function safeEqual(actual: string | null | undefined, expected: string): boolean {
  if (!actual) return false;
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export function getAdminSecret(): string | null {
  const secret = process.env.RELAY_OPS_SECRET;
  if (!secret) return null;
  const trimmed = secret.trim();
  return trimmed ? trimmed : null;
}

export function isAdminAuthorized(request: NextRequest): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  const headerSecret = request.headers.get("x-relay-ops-secret")?.trim() ?? null;
  const cookieSecret = request.cookies.get(ADMIN_SESSION_COOKIE)?.value?.trim() ?? null;

  return safeEqual(headerSecret, secret) || safeEqual(cookieSecret, secret);
}
