"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              IMAT<span className="text-blue-600">Prep</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/papers" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Past Papers
            </Link>
            <Link href="/quiz" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Practice
            </Link>
            <Link href="/simulator" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Simulators
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Pricing
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 flex flex-col gap-4">
          <Link href="/papers" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>
            📄 Past Papers
          </Link>
          <Link href="/quiz" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>
            🧠 Practice Questions
          </Link>
          <Link href="/simulator" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>
            🧪 Simulators
          </Link>
          <Link href="/#pricing" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>
            💰 Pricing
          </Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Link href="/login" className="text-sm font-medium text-center py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-semibold text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Start Free — No Card Needed
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
