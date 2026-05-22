import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowRight, Clock3 } from "lucide-react";

export const metadata = {
  title: "Blogs | Seemanchal SmartVyapaar Consultancy",
  description:
    "Explore insights, technology trends, startup ideas, SaaS systems, ERP solutions, AI innovations, and digital transformation strategies from SSC.",
};

// TEMP STATIC BLOGS
// Later connect with CMS / backend API
const blogs = [
  {
    slug: "future-of-regional-businesses-with-ai",
    title: "How AI Will Transform Regional Businesses in India",
    excerpt:
      "Discover how AI-powered systems, automation, and smart workflows are reshaping local businesses and institutions across Tier-2 and Tier-3 India.",
    image: "/images/blogs/ai-business.jpg",
    category: "Artificial Intelligence",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    slug: "why-schools-need-modern-erp",
    title: "Why Schools & Institutes Need Modern ERP Systems",
    excerpt:
      "Manual administration slows growth. Learn how modern ERP systems improve operations, communication, fees, attendance, and management efficiency.",
    image: "/images/blogs/school-erp.jpg",
    category: "ERP Solutions",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    slug: "digital-branding-for-restaurants",
    title: "Digital Branding Strategies for Restaurants & Cafes",
    excerpt:
      "From QR ordering systems to social branding and customer engagement — explore how restaurants can scale digitally.",
    image: "/images/blogs/restaurant-branding.jpg",
    category: "Business Growth",
    readTime: "4 min read",
    date: "April 2026",
  },
  {
    slug: "future-of-saas-in-bharat",
    title: "The Future of SaaS Startups in Bharat",
    excerpt:
      "India’s next SaaS revolution is emerging from regional ecosystems. Learn why localized digital infrastructure is the next big opportunity.",
    image: "/images/blogs/saas-bharat.jpg",
    category: "Startups",
    readTime: "7 min read",
    date: "April 2026",
  },
  {
    slug: "importance-of-business-websites",
    title: "Why Every Business Needs a Professional Website",
    excerpt:
      "A modern business website builds trust, authority, leads, and long-term digital visibility for any organization.",
    image: "/images/blogs/business-website.jpg",
    category: "Web Development",
    readTime: "5 min read",
    date: "March 2026",
  },
  {
    slug: "automation-for-small-businesses",
    title: "Automation Systems for Small & Medium Businesses",
    excerpt:
      "Learn how automation can save time, reduce operational costs, and improve customer experience across industries.",
    image: "/images/blogs/automation.jpg",
    category: "Automation",
    readTime: "6 min read",
    date: "March 2026",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen pb-24">

      {/* HERO */}
      <section className="w-full bg-linear-to-b from-slate-50 to-white border-b border-slate-200/70 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 text-brand-accent px-5 py-2 rounded-full text-sm font-semibold mb-6">
            SSC Knowledge Hub
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Insights, Technology & Digital Growth
          </h1>

          <p className="text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Explore modern technology insights, startup ecosystems,
            automation systems, ERP strategies, AI trends, and
            digital transformation ideas designed for Bharat.
          </p>
        </div>
      </section>

      {/* FEATURED BLOG */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* IMAGE */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
            <Image
              src={blogs[0].image}
              alt={blogs[0].title}
              width={900}
              height={700}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* CONTENT */}
          <div>
            <div className="inline-flex items-center rounded-full bg-brand-accent/10 text-brand-accent px-4 py-2 text-sm font-semibold mb-5">
              Featured Article
            </div>

            <h2 className="text-4xl font-bold text-slate-900 leading-tight mb-6">
              {blogs[0].title}
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              {blogs[0].excerpt}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-8">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {blogs[0].date}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {blogs[0].readTime}
              </div>
            </div>

            <Link
              href={`/blog/${blogs[0].slug}`}
              className="inline-flex items-center gap-2 bg-brand-accent text-white px-6 py-4 rounded-2xl font-semibold hover:opacity-90 transition"
            >
              Read Full Article
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Latest Articles
          </h2>

          <p className="text-slate-500 text-lg">
            Discover practical insights, scalable systems,
            SaaS architecture, AI innovations, and modern
            business strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {blogs.slice(1).map((blog, index) => (
            <article
              key={index}
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={700}
                  height={500}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* CONTENT */}
              <div className="p-8">

                <div className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 mb-5">
                  {blog.category}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-brand-accent transition-colors">
                  {blog.title}
                </h3>

                <p className="text-slate-500 leading-relaxed mb-6">
                  {blog.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {blog.date}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {blog.readTime}
                  </div>
                </div>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-2 font-semibold text-brand-accent"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-linear-to-r from-brand-accent to-blue-700 rounded-3xl text-white text-center px-10 py-20 shadow-2xl">

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Want to Build Something Amazing?
          </h2>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            Let’s transform your ideas into scalable digital systems,
            SaaS products, automation platforms, and enterprise solutions.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-brand-accent px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
          >
            Start Your Project
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}