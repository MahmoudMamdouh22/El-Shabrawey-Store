import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "سياسة الشحن والضمان والاستبدال",
  description: "تفاصيل التوصيل والضمان والاستبدال في الشبراوي ستور.",
};

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-fg">
        <span>{icon}</span> {title}
      </h2>
      <div className="space-y-2 text-sm leading-7 text-muted">{children}</div>
    </section>
  );
}

export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-brand-300">الرئيسية</Link>
        <span>/</span>
        <span className="text-fg">الشحن والضمان</span>
      </nav>

      <h1 className="text-2xl font-extrabold text-fg sm:text-3xl">
        الشحن والضمان والاستبدال
      </h1>
      <p className="mt-2 text-muted">
        تختلف التفاصيل حسب المنتج ومكان التوصيل؛ راجعها أو اسألنا قبل تأكيد الطلب.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <Section icon="🚚" title="التوصيل">
          <p>{site.shipping.etaText}</p>
          <p>يتم تأكيد تكلفة وموعد التوصيل معك قبل إرسال الطلب.</p>
        </Section>

        <Section icon="🛡️" title="الضمان">
          <p>
            مدة الضمان وشروطه تختلف حسب المنتج، وتظهر مع مواصفاته قبل الشراء.
            بعض القطع الكبيرة، مثل كروت الشاشة، يكون ضمانها غالبًا ثلاثة أشهر.
          </p>
        </Section>

        <Section icon="↩️" title="الاستبدال والاسترجاع">
          <p>{site.returns.policyText}</p>
          <p>
            اتفق على الحالة والشروط الخاصة بالمنتج مع المتجر قبل إتمام الطلب.
          </p>
        </Section>

        <Section icon="📞" title="تواصل معنا">
          <p>
            للاستفسار عن منتج أو رسوم التوصيل أو شروط الضمان والاستبدال، تواصل معنا على{" "}
            <a
              href={"https://wa.me/" + site.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-300 hover:underline"
            >
              واتساب
            </a>
            ، أو{" "}
            <a
              href={site.whatsappCatalogUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-300 hover:underline"
            >
              افتح كتالوج المنتجات
            </a>
            . ولو عندك طلب قائم، أدخل رقمه في{" "}
            <Link href="/track" className="font-semibold text-brand-300 hover:underline">
              صفحة تتبّع الطلب
            </Link>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
