import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccess } from "@/lib/entitlement";
import RedeemCodeForm from "@/components/pricing/RedeemCodeForm";

export const metadata = { title: "Pricing — IMAT Prep" };

// Only what the running code actually delivers. When a feature ships, it earns its
// way onto this page; until then it is not advertised.
const INCLUDED = [
  "Unlimited practice questions, filtered by section and difficulty",
  "Full-length 60-question simulators on the real 100-minute clock",
  "Official IMAT marking: +1.5 correct, −0.4 wrong, 0 blank, out of 90",
  "Worked solutions on every question we hold a source for",
  "Past papers marked premium, downloadable",
];

function formatDate(value: Date | null): string {
  if (!value) return "lifetime";
  return value.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const access = session?.user?.id ? await getAccess(session.user.id) : null;
  const contactEmail = process.env.CONTACT_EMAIL;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200 px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Pricing</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          One exam season, one payment. No renewals you have to remember to cancel, and
          nothing is promised here that the platform doesn't do today.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Plan
            name="Season pass"
            price="€79"
            note="one payment, valid 12 months"
            highlight
            cta={contactEmail ? <BuyLink email={contactEmail} plan="Season pass" /> : <ComingSoon />}
          />
          <Plan
            name="Lifetime"
            price="€149"
            note="one payment, every season after it"
            cta={contactEmail ? <BuyLink email={contactEmail} plan="Lifetime" /> : <ComingSoon />}
          />
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What a paid account gets you
          </h2>
          <ul className="space-y-2">
            {INCLUDED.map((line) => (
              <li key={line} className="flex gap-3 text-gray-600">
                <span className="text-green-600 font-bold">✓</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-gray-500">
            Free accounts keep the past papers and 10 practice questions a day — forever,
            no card, no trial clock.
          </p>
        </div>

        {/* ── Access & redemption ─────────────────────────────────────────── */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Already have an access code?
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Codes are issued when payment is confirmed, and by partner agencies and
            classrooms. Redeeming one extends your access from the day it ends.
          </p>

          {access && (
            <p className="mb-4 inline-block bg-green-50 border border-green-200 text-green-800 text-sm font-medium px-4 py-2 rounded-lg">
              Active: {access.plan} until {formatDate(access.expiresAt)}
            </p>
          )}

          {!session?.user ? (
            <p className="text-sm text-gray-600">
              <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                Sign in
              </Link>{" "}
              or{" "}
              <Link href="/register" className="font-semibold text-blue-600 hover:underline">
                create an account
              </Link>{" "}
              first — a code attaches to your account, not to a browser.
            </p>
          ) : (
            <RedeemCodeForm />
          )}
        </div>
      </section>
    </main>
  );
}

function Plan({
  name,
  price,
  note,
  highlight,
  cta,
}: {
  name: string;
  price: string;
  note: string;
  highlight?: boolean;
  cta: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl p-6 flex flex-col justify-between ${
        highlight
          ? "bg-white border-2 border-blue-600 shadow-sm"
          : "bg-white border border-gray-200"
      }`}
    >
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {name}
        </h3>
        <p className="mt-2 text-4xl font-bold text-gray-900">{price}</p>
        <p className="mt-1 text-sm text-gray-500">{note}</p>
      </div>
      <div className="mt-6">{cta}</div>
    </div>
  );
}

function BuyLink({ email, plan }: { email: string; plan: string }) {
  const subject = encodeURIComponent(`${plan} — IMAT Prep`);
  return (
    <a
      href={`mailto:${email}?subject=${subject}`}
      className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      Buy — we'll send payment details
    </a>
  );
}

function ComingSoon() {
  return (
    <p className="text-center text-sm text-gray-500 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
      Payment options are being set up. Access codes still work below.
    </p>
  );
}
