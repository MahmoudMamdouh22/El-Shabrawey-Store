"use client";

import { useState } from "react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  return (
    <button type="button" onClick={copy} className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-brand-300 hover:bg-brand-600/10" aria-label="نسخ بيانات الدفع">
      {copied ? "تم النسخ ✓" : "نسخ"}
    </button>
  );
}
