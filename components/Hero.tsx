import Link from "next/link";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/30 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:32px_32px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-brand-300">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          أجهزة كمبيوتر · تجميعات · قطع وإكسسوارات
        </span>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight text-fg sm:text-6xl">
          كل تجهيزات الـPC في مكان واحد
          <span className="mt-2 block text-gradient">بالسعر اللي يناسبك</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          {site.homepageHeadline} — أجهزة كاملة، شاشات، قطع وإكسسوارات، مع تفاصيل السعر والحالة والضمان والتوصيل لكل منتج.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/store"
            className="w-full rounded-xl bg-brand-gradient px-8 py-3.5 text-center font-bold text-white shadow-lg shadow-brand-600/30 transition-opacity hover:opacity-95 sm:w-auto"
          >
            استكشف المنتجات
          </Link>
          <a
            href={site.whatsappCatalogUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-xl border border-line bg-surface px-8 py-3.5 text-center font-semibold text-fg transition-colors hover:bg-surface-2 sm:w-auto"
          >
            كتالوج واتساب
          </a>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 text-sm text-muted sm:grid-cols-3">
          <TrustPoint text="أجهزة وقطع للـPC والجيمينج" />
          <TrustPoint text="شاشات جديدة ومستعملة" />
          <TrustPoint text="الضمان والتوصيل حسب المنتج" />
        </div>
      </div>
    </section>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface/80 px-4 py-3">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-400"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span>{text}</span>
    </div>
  );
}
