export default function ProductSearch({
  value = "",
  variant = "page",
}: {
  value?: string;
  variant?: "header" | "page";
}) {
  const compact = variant === "header";
  return (
    <form
      action="/store"
      method="get"
      role="search"
      dir={compact ? "ltr" : "rtl"}
      className={`flex items-center gap-2 rounded-xl border border-line bg-surface shadow-sm transition-colors focus-within:border-brand-500 ${compact ? "w-[clamp(165px,14vw,210px)] max-w-none px-2 py-1" : "mx-auto w-full max-w-3xl px-3 py-2.5"}`}
    >
      <label htmlFor={`product-search-${variant}`} className="sr-only">ابحث عن منتج</label>
      {compact && (
        <button
          type="submit"
          aria-label="بحث"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white transition-opacity hover:opacity-90"
        >
          <SearchIcon />
        </button>
      )}
      <input
        id={`product-search-${variant}`}
        type="search"
        name="q"
        defaultValue={value}
        placeholder="ابحث عن منتج أو موديل…"
        autoComplete="off"
        dir="rtl"
        className={`min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-muted ${compact ? "px-1.5 py-1 text-xs" : "px-2 py-2"}`}
      />
      {!compact && (
        <button
          type="submit"
          aria-label="بحث"
          className="grid h-10 w-12 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white transition-opacity hover:opacity-90"
        >
          <SearchIcon />
        </button>
      )}
    </form>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}
