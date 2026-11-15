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
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
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

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account created — please log in.");
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 relative overflow-hidden flex items-center justify-center">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/40 via-blue-800/50 to-gray-950" />
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
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
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40 [animation-delay:1s]" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10 px-4 py-8"
        style={{ perspective: 1500 }}
      >
        <motion.div
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">

            {/* Border glow */}
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
              <motion.div className="absolute top-0 left-0 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent" animate={{ left: ["-50%", "100%"], opacity: [0.3, 0.8, 0.3] }} transition={{ left: { duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror" } }} />
              <motion.div className="absolute top-0 right-0 w-[2px] h-1/2 bg-gradient-to-b from-transparent via-blue-400 to-transparent" animate={{ top: ["-50%", "100%"], opacity: [0.3, 0.8, 0.3] }} transition={{ top: { duration: 2.5, repeat: Infinity, repeatDelay: 1, delay: 0.6, ease: "easeInOut" }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 0.6 } }} />
              <motion.div className="absolute bottom-0 right-0 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent" animate={{ right: ["-50%", "100%"], opacity: [0.3, 0.8, 0.3] }} transition={{ right: { duration: 2.5, repeat: Infinity, repeatDelay: 1, delay: 1.2, ease: "easeInOut" }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.2 } }} />
              <motion.div className="absolute bottom-0 left-0 w-[2px] h-1/2 bg-gradient-to-b from-transparent via-blue-400 to-transparent" animate={{ bottom: ["-50%", "100%"], opacity: [0.3, 0.8, 0.3] }} transition={{ bottom: { duration: 2.5, repeat: Infinity, repeatDelay: 1, delay: 1.8, ease: "easeInOut" }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.8 } }} />
            </div>

            {/* Glass surface */}
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06] shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`, backgroundSize: "30px 30px" }} />

              {/* Heading */}
              <div className="text-center space-y-1 mb-6">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.8 }} className="mx-auto w-11 h-11 rounded-full border border-blue-400/30 bg-blue-600/20 flex items-center justify-center">
                  <span className="text-xl">🎓</span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  Create your account
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/50 text-xs">
                  Free forever. No credit card required.
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Name */}
                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="relative">
                  <div className="relative flex items-center rounded-lg overflow-hidden">
                    <User className={`absolute left-3 w-4 h-4 transition-colors duration-300 ${focusedInput === "name" ? "text-blue-400" : "text-white/35"}`} />
                    <Input type="text" name="name" placeholder="Full name" autoComplete="name" required value={form.name} onChange={handleChange} onFocus={() => setFocusedInput("name")} onBlur={() => setFocusedInput(null)} className="bg-white/5 border-white/10 focus-visible:border-blue-400/60 focus-visible:ring-blue-400/20 text-white h-10 pl-10 pr-3" />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="relative">
                  <div className="relative flex items-center rounded-lg overflow-hidden">
                    <Mail className={`absolute left-3 w-4 h-4 transition-colors duration-300 ${focusedInput === "email" ? "text-blue-400" : "text-white/35"}`} />
                    <Input type="email" name="email" placeholder="Email address" autoComplete="email" required value={form.email} onChange={handleChange} onFocus={() => setFocusedInput("email")} onBlur={() => setFocusedInput(null)} className="bg-white/5 border-white/10 focus-visible:border-blue-400/60 focus-visible:ring-blue-400/20 text-white h-10 pl-10 pr-3" />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="relative">
                  <div className="relative flex items-center rounded-lg overflow-hidden">
                    <Lock className={`absolute left-3 w-4 h-4 transition-colors duration-300 ${focusedInput === "password" ? "text-blue-400" : "text-white/35"}`} />
                    <Input type={showPassword ? "text" : "password"} name="password" placeholder="At least 8 characters" autoComplete="new-password" required value={form.password} onChange={handleChange} onFocus={() => setFocusedInput("password")} onBlur={() => setFocusedInput(null)} className="bg-white/5 border-white/10 focus-visible:border-blue-400/60 focus-visible:ring-blue-400/20 text-white h-10 pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-white/35 hover:text-white transition-colors duration-200" tabIndex={-1}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full relative group/btn mt-2">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <div className="relative overflow-hidden bg-blue-600 hover:bg-blue-500 h-10 rounded-lg transition-colors duration-300 flex items-center justify-center">
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }} style={{ opacity: isLoading ? 1 : 0, transition: "opacity 0.3s" }} />
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-sm font-semibold text-white">
                          Create Free Account
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-white/[0.06]" />
                  <motion.span className="text-xs text-white/35" animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>or</motion.span>
                  <div className="flex-1 border-t border-white/[0.06]" />
                </div>

                {/* Log in link */}
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-xs text-white/50">
                  Already have an account?{" "}
                  <Link href="/login" className="relative inline-block group/login font-medium text-white/80 hover:text-white transition-colors duration-200">
                    Log in
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-400 group-hover/login:w-full transition-all duration-300" />
                  </Link>
                </motion.p>

                {/* Trust note */}
                <p className="text-center text-xs text-white/25">
                  🔒 Your data is secure. We never spam or share your email.
                </p>

              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
