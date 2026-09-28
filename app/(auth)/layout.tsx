import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple top bar */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <Link href="/" className="flex items-center gap-2 w-fit font-bold text-lg text-blue-600">
          🎓 <span>IMAT Prep</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 py-6">
        © {new Date().getFullYear()} IMAT Prep. All rights reserved.
      </div>
    </div>
  );
}
