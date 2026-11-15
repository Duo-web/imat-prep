"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Minimal Input primitive (matches the template's slot-based Input) ─── */
function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-white/30 disabled:pointer-events-none disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* 3-D tilt on hover */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 relative overflow-hidden flex items-center justify-center">

      {/* ── Background gradient — blue instead of purple ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/40 via-blue-800/50 to-gray-950" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Top radial glow — blue */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-blue-400/20 blur-[80px]" />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-blue-300/20 blur-[60px]"
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-blue-500/20 blur-[60px]"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", delay: 1 }}
      />

      {/* Soft ambient blobs */}
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40 [animation-delay:1s]" />

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10 px-4"
        style={{ perspective: 1500 }}
      >
        <motion.div
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">

            {/* Animated border glow */}
            <motion.div
              className="absolute -inset-[1px] rounded-2xl"
              animate={{
                boxShadow: [
                  "0 0 10px 2px rgba(96,165,250,0.08)",
                  "0 0 20px 6px rgba(96,165,250,0.15)",
                  "0 0 10px 2px rgba(96,165,250,0.08)",
                ],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
            />

            {/* Traveling light beams */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
              {/* Top */}
              <motion.div
                className="absolute top-0 left-0 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                animate={{ left: ["-50%", "100%"], opacity: [0.3, 0.8, 0.3] }}
                transition={{ left: { duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror" } }}
              />
              {/* Right */}
              <motion.div
                className="absolute top-0 right-0 w-[2px] h-1/2 bg-gradient-to-b from-transparent via-blue-400 to-transparent"
                animate={{ top: ["-50%", "100%"], opacity: [0.3, 0.8, 0.3] }}
                transition={{ top: { duration: 2.5, repeat: Infinity, repeatDelay: 1, delay: 0.6, ease: "easeInOut" }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 0.6 } }}
              />
              {/* Bottom */}
              <motion.div
                className="absolute bottom-0 right-0 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                animate={{ right: ["-50%", "100%"], opacity: [0.3, 0.8, 0.3] }}
                transition={{ right: { duration: 2.5, repeat: Infinity, repeatDelay: 1, delay: 1.2, ease: "easeInOut" }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.2 } }}
              />
              {/* Left */}
              <motion.div
                className="absolute bottom-0 left-0 w-[2px] h-1/2 bg-gradient-to-b from-transparent via-blue-400 to-transparent"
                animate={{ bottom: ["-50%", "100%"], opacity: [0.3, 0.8, 0.3] }}
                transition={{ bottom: { duration: 2.5, repeat: Infinity, repeatDelay: 1, delay: 1.8, ease: "easeInOut" }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.8 } }}
              />
            </div>

            {/* Glass card */}
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06] shadow-2xl overflow-hidden">

              {/* Subtle grid texture */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Logo + heading */}
              <div className="text-center space-y-1 mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-11 h-11 rounded-full border border-blue-400/30 bg-blue-600/20 flex items-center justify-center"
                >
                  <span className="text-xl">🎓</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                >
                  Welcome back
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/50 text-xs"
                >
                  Log in to continue your IMAT preparation
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  <div className="relative flex items-center rounded-lg overflow-hidden">
                    <Mail
                      className={`absolute left-3 w-4 h-4 transition-colors duration-300 ${
                        focusedInput === "email" ? "text-blue-400" : "text-white/35"
                      }`}
                    />
                    <Input
                      type="email"
                      placeholder="Email address"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      className="bg-white/5 border-white/10 focus-visible:border-blue-400/60 focus-visible:ring-blue-400/20 text-white h-10 pl-10 pr-3"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  <div className="relative flex items-center rounded-lg overflow-hidden">
                    <Lock
                      className={`absolute left-3 w-4 h-4 transition-colors duration-300 ${
                        focusedInput === "password" ? "text-blue-400" : "text-white/35"
                      }`}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      className="bg-white/5 border-white/10 focus-visible:border-blue-400/60 focus-visible:ring-blue-400/20 text-white h-10 pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-white/35 hover:text-white transition-colors duration-200"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="appearance-none h-4 w-4 rounded border border-white/20 bg-white/5 checked:bg-blue-500 checked:border-blue-500 transition-all duration-200"
                      />
                      {rememberMe && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center text-white pointer-events-none"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <span className="text-xs text-white/50 hover:text-white/70 transition-colors duration-200">
                      Remember me
                    </span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs text-white/50 hover:text-white transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/btn mt-1"
                >
                  {/* Blue glow behind button */}
                  <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

                  <div className="relative overflow-hidden bg-blue-600 hover:bg-blue-500 h-10 rounded-lg transition-colors duration-300 flex items-center justify-center">
                    {/* Shimmer on loading */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                      style={{ opacity: isLoading ? 1 : 0, transition: "opacity 0.3s" }}
                    />

                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-1.5 text-sm font-semibold text-white"
                        >
                          Log In
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 border-t border-white/[0.06]" />
                  <motion.span
                    className="text-xs text-white/35"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    or
                  </motion.span>
                  <div className="flex-1 border-t border-white/[0.06]" />
                </div>

                {/* Sign up link */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-xs text-white/50"
                >
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="relative inline-block group/signup font-medium text-white/80 hover:text-white transition-colors duration-200"
                  >
                    Sign up free
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-400 group-hover/signup:w-full transition-all duration-300" />
                  </Link>
                </motion.p>

              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
