"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  MessageSquareText,
  Phone,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseIdentifier, phoneToEmailAlias } from "@/lib/auth-identifiers";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup" | "reset";

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="flex items-center gap-2 text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading sign in...
          </div>
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = useMemo(() => searchParams.get("next") || "/home", [searchParams]);

  const [mode, setMode] = useState<Mode>("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [ussdCode, setUssdCode] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendAvailableIn, setResendAvailableIn] = useState(0);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace(redirectTo);
      }
    });
  }, [redirectTo, router]);

  useEffect(() => {
    const parsed = parseIdentifier(identifier);
    if (!parsed || parsed.type !== "phone") {
      setOtpCode("");
      setUssdCode(null);
      setOtpVerified(false);
    }
  }, [identifier]);

  useEffect(() => {
    if (mode === "login") {
      setOtpVerified(false);
      setResendAvailableIn(0);
    }
  }, [mode]);

  useEffect(() => {
    if (resendAvailableIn <= 0) return;
    const timer = window.setTimeout(() => setResendAvailableIn((prev) => Math.max(0, prev - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendAvailableIn]);

  const parsedIdentifier = useMemo(() => parseIdentifier(identifier), [identifier]);
  const normalizedPhone = parsedIdentifier?.type === "phone" ? parsedIdentifier.value : null;
  const passwordStrength =
    password.length >= 10 ? "Strong" : password.length >= 6 ? "Okay" : "Weak";

  const resolveAuthEmail = () => {
    if (!normalizedPhone) {
      throw new Error("Enter a valid Ghana mobile number (e.g. 0241234567).");
    }
    return phoneToEmailAlias(normalizedPhone);
  };

  const handleSendOtp = async () => {
    setError("");
    setStatus("");
    setUssdCode(null);

    if (!normalizedPhone) {
      setError("Enter a valid Ghana mobile number first (e.g. 0241234567).");
      return;
    }
    if (mode === "login") {
      setError("OTP is only needed for Sign up or Reset password.");
      return;
    }
    if (resendAvailableIn > 0) {
      setError(`Please wait ${resendAvailableIn}s before requesting another OTP.`);
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone, purpose: mode }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        ussdCode?: string | null;
        code?: string;
      };
      if (!response.ok) {
        if (payload.code === "ACCOUNT_EXISTS") {
          setMode("login");
        } else if (payload.code === "ACCOUNT_NOT_FOUND") {
          setMode("signup");
        }
        throw new Error(payload.error || "Failed to send OTP.");
      }
      setStatus(payload.message || "OTP sent to your phone.");
      setUssdCode(payload.ussdCode ?? null);
      setOtpVerified(false);
      setResendAvailableIn(45);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setStatus("");

    if (!normalizedPhone) {
      setError("Enter a valid Ghana mobile number first.");
      return;
    }

    if (!/^\d{6}$/.test(otpCode.trim())) {
      setError("OTP must be a 6-digit code.");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone, code: otpCode.trim() }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string; message?: string; phone?: string };
      if (!response.ok) {
        throw new Error(payload.error || "OTP verification failed.");
      }
      setStatus(payload.message || "Phone number verified.");
      setOtpVerified(true);
    } catch (err) {
      setOtpVerified(false);
      setError(err instanceof Error ? err.message : "OTP verification failed.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setStatus("");
    if (!hasSupabaseConfig) {
      setError("Supabase is not configured yet.");
      return;
    }
    if (!normalizedPhone) {
      setError("Enter your Ghana mobile number first.");
      return;
    }
    setStatus("Verify OTP and set a new password to recover your account.");
    setMode("reset");
    setOtpVerified(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setError("");

    if (!hasSupabaseConfig) {
      setError("Supabase is not configured yet. Add environment variables first.");
      return;
    }

    if (!normalizedPhone) {
      setError("Enter a valid Ghana mobile number (e.g. 0241234567).");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Use at least 6 characters for your password.");
      return;
    }

    setLoading(true);
    const supabase = getSupabaseBrowserClient();

    try {
      const authEmail = resolveAuthEmail();

      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });
        if (signInError) {
          const msg = signInError.message.toLowerCase();
          if (msg.includes("invalid login credentials")) {
            throw new Error(
              "Wrong phone/password. If this number has no account, sign up first. If you forgot password, use Reset password."
            );
          }
          throw signInError;
        }
        router.replace(redirectTo);
      } else if (mode === "signup") {
        if (!otpVerified) {
          throw new Error("Verify your OTP first before creating an account.");
        }
        if (!otpCode.trim()) {
          throw new Error("Enter the OTP code sent to your phone.");
        }

        const signupResponse = await fetch("/api/auth/phone-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: normalizedPhone,
            password,
            code: otpCode.trim(),
          }),
        });
        const signupPayload = (await signupResponse.json().catch(() => ({}))) as {
          error?: string;
          code?: string;
          message?: string;
        };

        if (!signupResponse.ok) {
          if (signupPayload.code === "ACCOUNT_EXISTS" || signupResponse.status === 409) {
            setMode("login");
            setStatus(
              "Account already exists. Please log in instead, or use Forgot password if needed."
            );
            return;
          }
          throw new Error(signupPayload.error || "Signup failed.");
        }

        setStatus(signupPayload.message || "Account created successfully. Please log in.");
        setMode("login");
        setOtpVerified(false);
      } else {
        if (!otpVerified) {
          throw new Error("Verify your OTP first before resetting your password.");
        }
        if (!otpCode.trim()) {
          throw new Error("Enter the OTP code sent to your phone.");
        }
        const resetResponse = await fetch("/api/auth/phone-reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: normalizedPhone,
            password,
            code: otpCode.trim(),
          }),
        });
        const resetPayload = (await resetResponse.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        if (!resetResponse.ok) {
          throw new Error(resetPayload.error || "Password reset failed.");
        }
        setStatus(resetPayload.message || "Password reset successful. Please log in.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        setOtpCode("");
        setOtpVerified(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError("");
    setStatus("");
    if (nextMode === "login") {
      setOtpCode("");
      setConfirmPassword("");
      setOtpVerified(false);
    }
  };

  const modeTitle =
    mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password";
  const modeDescription =
    mode === "login"
      ? "Log in with your Ghana mobile number."
      : mode === "signup"
        ? "Secure your account with OTP and password."
        : "Verify OTP, then set a new password.";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-soft-blue/20 to-background px-4 py-4 md:py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(15,107,79,0.1), transparent 35%), radial-gradient(circle at 80% 70%, rgba(244,197,66,0.12), transparent 30%)",
        }}
      />
      <div className="relative mx-auto mb-2 flex max-w-6xl">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.95fr_1fr] lg:items-start">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="order-1 lg:order-2"
        >
          <Card className="rounded-3xl border-primary/20 bg-white/95 shadow-xl backdrop-blur">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg leading-snug sm:text-xl">{modeTitle}</CardTitle>
                  <CardDescription className="mt-1 text-sm">{modeDescription}</CardDescription>
                </div>
                <span className="inline-flex w-fit shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
                  {mode === "login" ? "Sign in" : mode === "signup" ? "Sign up" : "Recovery"}
                </span>
              </div>

              {mode !== "reset" ? (
                <div className="relative flex rounded-xl bg-soft-blue/40 p-1">
                  <motion.span
                    className="absolute bottom-1 top-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-sm"
                    initial={false}
                    animate={{ left: mode === "login" ? "0.25rem" : "calc(50% + 0.125rem)" }}
                    transition={{ type: "spring", stiffness: 480, damping: 32 }}
                  />
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className={cn(
                      "relative z-10 flex-1 whitespace-nowrap rounded-lg px-2 py-2.5 text-center text-sm font-semibold transition-colors sm:px-3",
                      mode === "login" ? "text-primary-dark" : "text-muted"
                    )}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className={cn(
                      "relative z-10 flex-1 whitespace-nowrap rounded-lg px-2 py-2.5 text-center text-sm font-semibold transition-colors sm:px-3",
                      mode === "signup" ? "text-primary-dark" : "text-muted"
                    )}
                  >
                    Sign up
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-primary/20 bg-soft-blue/20 px-3 py-2 text-xs text-primary-dark">
                  Password reset mode — verify OTP and set a new password.
                </div>
              )}
            </CardHeader>
            <CardContent>
              {!hasSupabaseConfig ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  Supabase configuration missing. Add `NEXT_PUBLIC_SUPABASE_URL` and
                  `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your `.env` file, then restart the dev server.
                </p>
              ) : (
                <form className="space-y-3.5" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Ghana mobile number</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="0241234567"
                        className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {mode !== "login" ? (
                      <motion.div
                        key="otp-block"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.16 }}
                        className="rounded-xl border border-primary/20 bg-soft-blue/20 p-3 shadow-sm"
                      >
                        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary-dark">
                          <MessageSquareText className="h-4 w-4" />
                          {mode === "signup"
                            ? "Phone verification (Arkesel OTP)"
                            : "Password reset verification (Arkesel OTP)"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <input
                            type="text"
                            value={otpCode}
                            onChange={(e) => {
                              setOtpCode(e.target.value);
                              setOtpVerified(false);
                            }}
                            placeholder="Enter 6-digit OTP"
                            className="h-10 min-w-[180px] flex-1 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleSendOtp}
                            disabled={otpLoading || resendAvailableIn > 0}
                          >
                            {resendAvailableIn > 0 ? `Resend in ${resendAvailableIn}s` : "Send OTP"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleVerifyOtp}
                            disabled={otpLoading}
                          >
                            Verify
                          </Button>
                        </div>
                        {ussdCode ? (
                          <p className="mt-2 text-xs text-primary-dark">
                            SMS delayed? Dial <span className="font-semibold">{ussdCode}</span> to
                            check your OTP via Arkesel shortcode.
                          </p>
                        ) : null}
                        {otpVerified ? (
                          <p className="mt-2 text-xs font-medium text-emerald-700">
                            OTP verified. You can continue.
                          </p>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                        <KeyRound className="h-4 w-4" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted">Password strength: {passwordStrength}</p>
                  </div>

                  <AnimatePresence initial={false}>
                    {mode !== "login" ? (
                      <motion.div
                        key="confirm-password"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.16 }}
                      >
                        <label className="mb-1 block text-sm font-medium text-foreground">
                          Confirm password
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                            <KeyRound className="h-4 w-4" />
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat your password"
                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {mode === "login" ? (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  ) : mode === "reset" ? (
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Back to log in
                    </button>
                  ) : null}

                  {error ? (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  ) : null}
                  {status ? (
                    <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      {status}
                    </p>
                  ) : null}

                  {mode === "signup" ? (
                    <p className="text-xs leading-relaxed text-muted">
                      By creating an account, you agree to our{" "}
                      <a href="/terms" className="font-medium text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="font-medium text-primary hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    className="h-12 w-full text-base"
                    disabled={loading || otpLoading || ((mode === "signup" || mode === "reset") && !otpVerified)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : mode === "login" ? (
                      <>
                        <LogIn className="h-4 w-4" />
                        Log in
                      </>
                    ) : mode === "signup" ? (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Create account
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        Reset password
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.05 }}
          className="order-2 lg:order-1"
        >
          <div className="rounded-3xl border border-primary/10 bg-white/95 p-5 shadow-sm backdrop-blur md:p-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-soft-blue px-3 py-1 text-xs font-semibold text-primary-dark shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure citizen access
            </p>
            <h2 className="mt-3 text-xl font-bold leading-tight text-foreground sm:text-2xl md:text-3xl">
              Modern access to GovFlow AI
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Sign in with your Ghana mobile number to save progress and continue services across
              sessions.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-background/70 p-3">
                <p className="text-xs font-semibold text-primary-dark">Unified account</p>
                <p className="mt-1 text-sm text-muted">
                  Business, Passport, and Ghana Card in one profile.
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-background/70 p-3">
                <p className="text-xs font-semibold text-primary-dark">Fast recovery</p>
                <p className="mt-1 text-sm text-muted">
                  OTP-based reset if you forget your password.
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-background/70 p-3 sm:col-span-2 lg:col-span-1">
                <p className="text-xs font-semibold text-primary-dark">Session continuity</p>
                <p className="mt-1 text-sm text-muted">Continue exactly from where you left off.</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-background/70 p-3 sm:col-span-2 lg:col-span-1">
                <p className="text-xs font-semibold text-primary-dark">Secure by default</p>
                <p className="mt-1 text-sm text-muted">Phone identity + OTP verification workflow.</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
