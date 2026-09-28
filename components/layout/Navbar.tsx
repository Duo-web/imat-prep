"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/papers", label: "Past Papers" },
  { href: "/quiz", label: "Practice" },
  { href: "/simulator", label: "Simulator" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600">
          🎓 <span>IMAT Prep</span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg" />
          ) : session?.user ? (
            // Logged in
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/dashboard"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {session.user.name?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            // Logged out
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden border-t border-gray-100 px-4 py-2 flex gap-4 overflow-x-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === link.href
                ? "text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {link.label}
          </Link>
        ))}
        {session?.user && (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm font-medium whitespace-nowrap text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
