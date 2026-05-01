import Link from "next/link";
import Image from "next/image";
import { contentAdapter } from "@/lib/contentAdapter";
import { siteConfig } from "../../../config/site";
import { CTA } from "./cta";

export async function Header() {
  const settings = await contentAdapter.resolveSettings();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/Logo.png"
            alt={settings?.shortName || settings?.name || "SSC"}
            width={40}
            height={40}
            priority
            className="rounded-full object-cover"
          />
          <span className="hidden text-xl font-bold tracking-tight text-slate-900 md:inline-block">
            {siteConfig.name || settings?.name}
          </span>
          {/* for mobile view */}
          <span className="inline-block text-xl font-bold tracking-tight text-slate-900 md:hidden">
            {siteConfig.shortName || settings?.shortName || settings?.name || "SSC"}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/services"
            className="text-slate-600 transition-colors hover:text-brand-accent"
          >
            Services
          </Link>
          <Link
            href="/projects"
            className="text-slate-600 transition-colors hover:text-brand-accent"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="text-slate-600 transition-colors hover:text-brand-accent"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <CTA label="Get in Touch" href="/contact" size="sm" icon={false} />
        </div>
      </div>
    </header>
  );
}