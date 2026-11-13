// إعدادات هوية ومتجر الشبراوي ستور — تُستخدم في الواجهة والطلبات.
export const site = {
  name: "الشبراوي ستور",
  nameEn: "EL-Shabrawey Store",
  tagline: "كل تجهيزات الـPC في مكان واحد بالسعر اللي يناسبك",
  homepageHeadline: "ابني جهازك بثقة",
  description:
    "أجهزة كمبيوتر وتجميعات وشاشات وقطع وإكسسوارات PC. راجع السعر والحالة والضمان وتفاصيل التوصيل لكل منتج.",
  nav: [
    { label: "الرئيسية", href: "/" },
    { label: "المنتجات", href: "/store" },
    { label: "تتبّع طلب", href: "/track" },
    { label: "الشحن والضمان", href: "/policy" },
    { label: "تواصل معنا", href: "/#contact" },
  ],
  whatsapp: "201154865050",
  whatsappCatalogUrl: "https://wa.me/c/201154865050",
  payment: {
    demoMode: true,
    wallets: [
      { method: "vodafone_cash", label: "فودافون كاش", value: "00000000000", kind: "رقم المحفظة" },
      { method: "etisalat_cash", label: "اتصالات كاش", value: "00000000000", kind: "رقم المحفظة" },
      { method: "orange_cash", label: "أورنج كاش", value: "00000000000", kind: "رقم المحفظة" },
      { method: "instapay", label: "إنستاباي", value: "DEMO-NOT-REAL", kind: "عنوان الدفع" },
    ],
    note: "بعد التحويل ارفع صورة الإيصال. سيتم مراجعة الدفع يدويًا قبل تأكيد الطلب.",
  },
  shipping: {
    flatCents: 10000,
    freeAboveCents: null,
    etaText:
      "التوصيل غالبًا حوالي 100 جنيه، وقد تختلف التكلفة والمدة حسب المنتج والمنطقة.",
  },
  returns: {
    policyText:
      "تختلف شروط الاستبدال والاسترجاع حسب المنتج وحالته. تواصل معنا قبل إتمام الطلب لمعرفة الشروط الخاصة به.",
  },
} as const;

/** تقدير مبدئي لشحن المنتجات الملموسة؛ يُؤكّد المبلغ قبل إتمام التوصيل. */
export function shippingCostCents(
  subtotalCents: number,
  hasPhysical: boolean
): number {
  void subtotalCents;
  if (!hasPhysical) return 0;
  return site.shipping.flatCents;
}
