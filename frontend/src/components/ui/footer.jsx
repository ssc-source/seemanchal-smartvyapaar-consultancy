import Link from "next/link";
import Image from "next/image";
import { contentAdapter } from "@/lib/contentAdapter";
import { siteConfig } from "../../../config/site";
import {
  MessageCircle,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export async function Footer() {
  const settings = await contentAdapter.resolveSettings();
  const contactData = await contentAdapter.resolveContact();
  const brandName = settings?.shortName || settings?.name || "SSC";

  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-10 text-slate-700">
      <div className="mx-auto max-w-6xl">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3 md:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <Image
                  src="/assets/Logo.png"
                  alt={brandName}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                />
              </div>

              <div className="flex flex-col leading-tight text-left">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Seemanchal
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {siteConfig.name}
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              {contactData.footer.description}
            </p>

            <div className="mt-4 flex items-center gap-2">
              {[
                { href: settings.links.twitter, icon: MessageCircle },
                { href: settings.links.facebook, icon: ExternalLink },
                { href: settings.links.linkedin, icon: Globe },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-all hover:border-brand-accent hover:text-brand-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-900">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {contactData.footer.quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-900">
              Contact
            </h4>

            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start justify-center gap-2 md:justify-start">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                <span className="max-w-xs leading-relaxed">
                  {siteConfig.contact.address}
                </span>
              </li>

              <li className="flex items-center justify-center gap-2 md:justify-start">
                <Phone className="h-4 w-4 shrink-0 text-brand-accent" />
                <span>{siteConfig.contact.phone}</span>
              </li>

              <li className="flex items-center justify-center gap-2 md:justify-start">
                <Mail className="h-4 w-4 shrink-0 text-brand-accent" />
                <span>{siteConfig.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-slate-200 pt-5 text-center text-xs text-slate-500 md:flex-row md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {contactData.footer.legal.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="font-medium transition-colors hover:text-brand-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}