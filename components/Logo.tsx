import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export default function Logo({ className = "", inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <Link
      dir="rtl"
      href="/"
      aria-label={site.name + " — الصفحة الرئيسية"}
      className={"flex shrink-0 items-center gap-2.5 " + className}
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0b1d41] p-1.5 shadow-sm">
        <Image
          src="/brand/el-shabrawey-mark.png"
          alt=""
          width={40}
          height={40}
          priority
          className="h-full w-full object-contain"
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`text-sm font-extrabold sm:text-base ${inverse ? "text-white" : "text-fg"}`}>{site.name}</span>
        <span dir="ltr" className={`hidden text-[10px] font-semibold tracking-wide sm:block sm:text-[11px] ${inverse ? "text-[#a8bad7]" : "text-muted"}`}>
          {site.nameEn}
        </span>
      </span>
    </Link>
  );
}
