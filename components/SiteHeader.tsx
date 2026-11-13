import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Logo from "./Logo";
import CartButton from "./CartButton";
import ThemeToggle from "./ThemeToggle";
import { PRODUCT_CATEGORIES } from "@/lib/categories";
import ProductSearch from "@/components/ProductSearch";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur">
      <div dir="ltr" className="mx-auto grid min-h-[72px] max-w-[1440px] grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1fr)] items-center gap-1 px-2 sm:gap-3 sm:px-5">
        {/* الطرف الأيسر: الدخول، ثم السلة والوضع */}
        <div className="flex min-w-0 items-center justify-start gap-1 sm:gap-3">
          <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-1.5 rounded-xl bg-brand-gradient px-2 py-2 text-xs font-bold text-white shadow-lg shadow-brand-600/25 transition-opacity hover:opacity-95 sm:gap-2 sm:px-4 sm:text-sm"
            >
              <UserIcon />
              <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
              <span className="sm:hidden">حسابي</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl bg-brand-gradient px-2 py-2 text-xs font-bold text-white shadow-lg shadow-brand-600/25 transition-opacity hover:opacity-95 sm:gap-2 sm:px-4 sm:text-sm"
            >
              <UserIcon />
              <span className="hidden sm:inline">دخول / حساب جديد</span>
              <span className="sm:hidden">دخول</span>
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="hidden items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-2 sm:flex"
            >
              <GridIcon />
              لوحة التحكم
            </Link>
          )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <CartButton />
            <div className="hidden xl:block">
              <ProductSearch variant="header" />
            </div>
            <details className="group relative xl:hidden">
              <summary aria-label="فتح البحث" className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-line bg-surface text-fg [&::-webkit-details-marker]:hidden">
                <SearchGlyph />
              </summary>
              <div className="absolute left-0 top-full z-50 mt-2 w-[min(88vw,340px)] rounded-xl border border-line bg-surface p-2 shadow-2xl shadow-black/30">
                <ProductSearch />
              </div>
            </details>
          </div>
        </div>

        {/* روابط الصفحات في منتصف الهيدر */}
        <nav dir="rtl" aria-label="التنقل الرئيسي" className="hidden translate-x-24 items-center justify-center gap-1.5 text-sm xl:flex">
            <Link href="/" className="whitespace-nowrap rounded-xl px-3 py-2 font-semibold text-muted transition-colors hover:bg-surface hover:text-fg">
              الرئيسية
            </Link>

            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 whitespace-nowrap rounded-xl border border-line bg-surface px-3 py-2 font-semibold text-fg [&::-webkit-details-marker]:hidden">
                المنتجات
                <ChevronDown />
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(90vw,560px)] rounded-2xl border border-line bg-surface p-4 shadow-2xl shadow-black/30 group-open:block">
                <Link href="/store" className="mb-3 block rounded-xl bg-brand-600/10 px-4 py-3 font-bold text-brand-300 hover:bg-brand-600/15">
                  كل المنتجات
                </Link>
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                  {PRODUCT_CATEGORIES.map((category) => (
                    <Link key={category.slug} href={`/store/${category.slug}`} className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg">
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>
            </details>

            <Link href="/track" className="whitespace-nowrap rounded-xl px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-fg">
              تتبّع الطلب
            </Link>
            <Link href="/policy" className="whitespace-nowrap rounded-xl px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-fg">
              الشحن والضمان
            </Link>
            <Link href="/#contact" className="whitespace-nowrap rounded-xl px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-fg">
              تواصل معنا
            </Link>
        </nav>

        <div className="flex items-center justify-center xl:hidden">
          <details className="group relative">
            <summary aria-label="فتح قائمة التنقل" className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-line bg-surface text-fg [&::-webkit-details-marker]:hidden">
              <MenuIcon />
            </summary>
            <nav dir="rtl" aria-label="التنقل الرئيسي" className="absolute right-1/2 top-full z-50 mt-2 max-h-[75vh] w-[min(90vw,360px)] translate-x-1/2 overflow-y-auto rounded-2xl border border-line bg-surface p-3 shadow-2xl shadow-black/30">
              <Link href="/" className="block rounded-lg px-3 py-2.5 font-semibold text-fg hover:bg-surface-2">الرئيسية</Link>
              <details className="mt-1">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 font-semibold text-fg hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                  المنتجات <ChevronDown />
                </summary>
                <div className="me-3 border-e border-line pe-2">
                  <Link href="/store" className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-300 hover:bg-surface-2">كل المنتجات</Link>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <Link key={category.slug} href={`/store/${category.slug}`} className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-fg">
                      {category.label}
                    </Link>
                  ))}
                </div>
              </details>
              <Link href="/track" className="block rounded-lg px-3 py-2.5 text-fg hover:bg-surface-2">تتبّع الطلب</Link>
              <Link href="/policy" className="block rounded-lg px-3 py-2.5 text-fg hover:bg-surface-2">الشحن والضمان</Link>
              <Link href="/#contact" className="block rounded-lg px-3 py-2.5 text-fg hover:bg-surface-2">تواصل معنا</Link>
            </nav>
          </details>
        </div>

        {/* الشعار في أقصى اليمين */}
        <div className="flex min-w-0 justify-end">
          <Logo />
        </div>
      </div>
    </header>
  );
}

function SearchGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function ChevronDown() {
  return <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>;
}

function MenuIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
