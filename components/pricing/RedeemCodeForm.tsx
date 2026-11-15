"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RedeemCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "fail">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("busy");
    setMessage("");

    try {
      const response = await fetch("/api/access/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("fail");
        setMessage(data.error ?? "That code could not be used.");
        return;
      }

      setStatus("ok");
      setMessage(data.message ?? "You're in.");
      setCode("");
      router.refresh(); // re-read access from the server so the page reflects it
    } catch {
      setStatus("fail");
      setMessage("Something went wrong. Try again in a moment.");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
      <input
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="IMAT-XXXX-XXXX"
        autoComplete="off"
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-mono uppercase tracking-wider text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={status === "busy" || code.trim().length < 6}
        className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
      >
        {status === "busy" ? "Checking…" : "Redeem code"}
      </button>
      {message && (
        <p
          className={`self-center text-sm font-medium ${
            status === "ok" ? "text-green-700" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
