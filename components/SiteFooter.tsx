import Link from "next/link";
import { site } from "@/lib/site";
import Logo from "./Logo";

export default function SiteFooter() {
  const year = 2026;
  return (
    <footer id="contact" className="border-t border-[#20385f] bg-[#050b18] text-[#f1f6ff]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo inverse />
            <p className="mt-4 text-sm leading-6 text-[#a8bad7]">{site.description}</p>
            <a
              href={site.whatsappCatalogUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-bold text-white"
            >
              تصفح كتالوج واتساب
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="mb-3 font-semibold text-white">روابط المتجر</h4>
              <ul className="space-y-2 text-[#a8bad7]">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-[#93c5fd]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-white">تواصل</h4>
              <ul className="space-y-2 text-[#a8bad7]">
                <li>
                  <a
                    href={"https://wa.me/" + site.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#93c5fd]"
                  >
                    واتساب
                  </a>
                </li>
                <li>
                  <a
                    href={site.whatsappCatalogUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#93c5fd]"
                  >
                    كتالوج المنتجات
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[#20385f] pt-6 text-xs text-[#a8bad7] sm:flex-row">
          <p>© {year} {site.nameEn}. جميع الحقوق محفوظة.</p>
          <p className="rounded-full border border-[#20385f] bg-[#0b1630] px-3 py-1 font-medium text-[#93c5fd]">
            كمبيوتر · تجميعات · شاشات وقطع
          </p>
        </div>
      </div>
    </footer>
  );
}
