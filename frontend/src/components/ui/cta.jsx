import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CTA({ label, href, variant = "primary", size = "default", className, icon = true }) {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-slate-800 shadow-md hover:shadow-lg shadow-slate-900/10",
    secondary: "bg-brand-accent text-white hover:bg-blue-600 shadow-md hover:shadow-xl shadow-brand-accent/20",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-brand-accent hover:bg-brand-accent/5 hover:text-brand-accent",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-brand-accent",
    "primary-on-dark": "bg-white text-brand-primary hover:bg-slate-100 shadow-md hover:shadow-lg",
  };

  const sizes = {
    default: "h-11 py-2 px-6 rounded-full",
    sm: "h-9 px-4 rounded-full text-sm",
    lg: "h-14 px-8 rounded-full text-lg tracking-tight",
  };

  const normalizedHref = typeof href === 'string' ? href.trim() : '';
  const isExternalLink = /^(https?:\/\/|\/\/|www\.)/i.test(normalizedHref);
  const linkClasses = cn(baseStyles, variants[variant], sizes[size], className);

  if (isExternalLink) {
    return (
      <a
        href={normalizedHref}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClasses}
      >
        {label}
        {icon && <ArrowRight className="ml-2 h-4 w-4" />}
      </a>
    );
  }

  return (
    <Link href={normalizedHref || '/'} className={linkClasses}>
      {label}
      {icon && <ArrowRight className="ml-2 h-4 w-4" />}
    </Link>
  );
}
