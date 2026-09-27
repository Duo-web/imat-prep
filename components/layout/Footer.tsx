import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎓</span>
              <span className="font-bold text-xl text-white">
                IMAT<span className="text-blue-500">Prep</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              The smarter, cheaper way to prepare for the IMAT exam. Built for
              students who want to study Medicine in Italy.
            </p>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <span className="text-green-400 font-semibold">€79/year</span>
              <span className="text-gray-600">vs competitors €279/year</span>
            </div>
          </div>

          {/* Study */}
          <div>
            <h4 className="text-white font-semibold mb-4">Study</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/papers" className="hover:text-white transition">Past Papers</Link></li>
              <li><Link href="/quiz" className="hover:text-white transition">Practice Questions</Link></li>
              <li><Link href="/simulator" className="hover:text-white transition">Exam Simulators</Link></li>
              <li><Link href="/planner" className="hover:text-white transition">Study Planner</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/#comparison" className="hover:text-white transition">vs IMAT Buddy</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Create Account</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Log In</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Info</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About IMAT</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-gray-600">
            © 2026 IMATPrep. Built with ❤️ for IMAT students worldwide.
          </p>
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-medium">
              🟢 Free tier always available
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
