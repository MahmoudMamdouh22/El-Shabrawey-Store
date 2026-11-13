"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ProductView } from "@/lib/products";
import type { ProductFormState } from "@/app/actions/admin";
import { PRODUCT_CATEGORIES } from "@/lib/categories";

type Action = (
  prev: ProductFormState,
  formData: FormData
) => Promise<ProductFormState>;

const initial: ProductFormState = {};

export default function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: Action;
  product?: ProductView;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initial);
  const priceEGP = product ? (product.priceCents / 100).toString() : "";
  const compareEGP =
    product?.compareAtCents != null
      ? (product.compareAtCents / 100).toString()
      : "";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="اسم المنتج" name="name" defaultValue={product?.name} required />
        <Field
          label="الرابط (slug) — اختياري"
          name="slug"
          defaultValue={product?.slug}
          placeholder="هيتولّد من الاسم لو سبته فاضي"
        />
        <Field
          label="السعر (ج.م)"
          name="price"
          type="number"
          step="0.01"
          defaultValue={priceEGP}
          required
        />
        <Field
          label="السعر قبل الخصم (اختياري)"
          name="compareAt"
          type="number"
          step="0.01"
          defaultValue={compareEGP}
        />
        <Field
          label="SKU (رمز المنتج الداخلي)"
          name="sku"
          defaultValue={product?.sku ?? ""}
          placeholder="مثال: ESH-GPU-001"
        />
        <Field
          label="كمية المخزون"
          name="stockQuantity"
          type="number"
          step="1"
          min="0"
          defaultValue={product?.stockQuantity?.toString() ?? ""}
          placeholder="أدخل الكمية المتاحة"
        />
        <input type="hidden" name="type" value="physical" />
        <label className="block text-sm text-muted" htmlFor="category">
          القسم
          <select id="category" name="category" defaultValue={product?.category ?? PRODUCT_CATEGORIES[0].slug} required className="mt-1 block w-full rounded-xl border border-line bg-bg px-3 py-2 text-fg">
            {PRODUCT_CATEGORIES.map((category) => <option key={category.slug} value={category.slug}>{category.label}</option>)}
          </select>
        </label>
        <label className="block text-sm text-muted" htmlFor="condition">
          حالة المنتج
          <select id="condition" name="condition" defaultValue={product?.condition ?? "new"} className="mt-1 block w-full rounded-xl border border-line bg-bg px-3 py-2 text-fg">
            <option value="new">جديد</option><option value="used">مستعمل</option><option value="refurbished">مجدد</option>
          </select>
        </label>
          <Field label="الموديل" name="model" defaultValue={product?.model ?? ""} />
        <Field label="الماركة" name="brand" defaultValue={product?.brand ?? ""} placeholder="مثال: ASUS أو Dell" />
        <Field label="الضمان" name="warranty" defaultValue={product?.warranty ?? ""} placeholder="مثال: 3 شهور" />
        <Field label="تفاصيل التوصيل" name="delivery" defaultValue={product?.delivery ?? ""} placeholder="مثال: حوالي 100 جنيه حسب المنطقة" />
          <Field
          label="وصف مختصر (يظهر في الكارت)"
          name="shortDesc"
          defaultValue={product?.shortDesc ?? ""}
        />
      </div>

      <div>
        <label className="block text-sm text-muted" htmlFor="specifications">المواصفات (سطر لكل مواصفة: الاسم: القيمة)</label>
        <textarea id="specifications" name="specifications" rows={5} defaultValue={product?.specifications.map((item) => `${item.label}: ${item.value}`).join("\n")} placeholder={"المعالج: Ryzen 5\nالذاكرة: 16GB DDR4\nالتخزين: 512GB SSD"} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-fg outline-none focus:border-brand-500" />
      </div>

      <div>
        <label className="block text-sm text-muted" htmlFor="description">
          الوصف الكامل
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description}
          className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-fg outline-none focus:border-brand-500"
        />
      </div>

      {/* الصور */}
      <div>
        <label className="block text-sm text-muted" htmlFor="imageUrls">
          روابط الصور (رابط في كل سطر)
        </label>
        <textarea
          id="imageUrls"
          name="imageUrls"
          rows={3}
          defaultValue={product?.images.join("\n")}
          placeholder="/products/example.svg"
          className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-fg outline-none focus:border-brand-500"
        />
        <label className="mt-3 block text-sm text-muted" htmlFor="image">
          أو ارفع صورة (تتضاف للأول)
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="mt-1 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-brand-700"
        />
      </div>

      {/* خيارات */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-fg">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product ? product.featured : false}
            className="h-4 w-4 accent-brand-600"
          />
          مميّز (يظهر في الواجهة)
        </label>
        <label className="flex items-center gap-2 text-sm text-fg">
          <input
            type="checkbox"
            name="active"
            defaultChecked={product ? product.active : true}
            className="h-4 w-4 accent-brand-600"
          />
          معروض للبيع
        </label>
        <label className="flex items-center gap-2 text-sm text-amber-300">
          <input type="checkbox" name="isDemo" defaultChecked={product?.isDemo ?? false} className="h-4 w-4 accent-amber-500" />
          بيانات تجريبية (تظهر عليها شارة تحذير)
        </label>
      </div>

      {state.error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-brand-gradient px-6 py-3 font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
        >
          {isPending ? "بيتحفظ…" : submitLabel}
        </button>
        <Link
          href="/admin/products"
          className="rounded-xl border border-line bg-surface px-6 py-3 font-semibold text-fg transition-colors hover:bg-surface-2"
        >
          إلغاء
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  step,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-muted" htmlFor={name}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        min={min}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-fg outline-none focus:border-brand-500"
      />
    </div>
  );
}
