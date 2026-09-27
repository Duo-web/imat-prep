import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
          Your IMAT journey starts today.
          <br />
          <span className="text-blue-200">It starts free.</span>
        </h2>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
          No credit card. No commitment. Download past papers and start
          practising in the next 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/papers"
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 active:scale-95 transition-all text-lg shadow-lg"
          >
            📄 Download Past Papers Free
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 bg-blue-800/50 text-white font-bold rounded-xl hover:bg-blue-800/70 border border-blue-400/30 active:scale-95 transition-all text-lg"
          >
            Create Free Account →
          </Link>
        </div>

        <p className="text-blue-200 text-sm mt-8">
          Join thousands of IMAT students preparing smarter — not harder.
        </p>
      </div>
    </section>
  );
}
