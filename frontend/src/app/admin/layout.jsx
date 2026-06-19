"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/adminApi";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  LogOut,
  BookOpen,
  Award,
  FileText,
  DollarSign,
  Menu,
  X,
  ChevronDown,
  Search,
  Bell,
  BarChart3,
  UserPlus,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // collapsed state is visual only for tablet screens (show icons only)
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    internships: true,
    users: false,
    assessments: false,
    certificates: false,
    revenue: false,
    crm: false,
    cms: false,
  });

  // Exclude login and auth recovery pages from the admin shell layout
  const authFreePages = ["/admin/login", "/admin/forgot-password"];
  const isAuthFreePage = authFreePages.includes(pathname);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      if (isAuthFreePage) return;

      if (!adminApi.isAuthenticated && !adminApi.token) {
        router.replace("/admin/login");
        return;
      }

      try {
        await adminApi.me();
      } catch {
        if (active) router.replace("/admin/login");
      }
    };

    verifySession();

    return () => {
      active = false;
    };
  }, [isAuthFreePage, router]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      router.push("/admin/login");
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  const pageTitleMap = {
    dashboard: "Dashboard",
    careers: "Applications",
    students: "Students",
    batches: "Batches",
    progress: "Progress Tracking",
    questions: "Question Bank",
    quizzes: "Assessments",
    registrations: "Registrations",
    results: "Results",
    certificates: "Certificates",
    verify: "Certificate Verification",
    templates: "Templates",
    revenue: "Revenue Overview",
    transactions: "Transactions",
    invoices: "Invoices",
    refunds: "Refunds",
    leads: "Leads",
    "future-skills": "Future Skills",
    communication: "Communication Center",
    homepage: "Homepage Sections",
    "content-pages": "Content Pages",
    blogs: "Blog",
    seo: "SEO",
    analytics: "Analytics",
    settings: "Settings",
  };

  const adminSegments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  const currentSegment = adminSegments[adminSegments.length - 1] || "dashboard";
  const pageTitle = pageTitleMap[currentSegment] || pageTitleMap[adminSegments[0]] || "Admin Dashboard";
  const breadcrumbs = ["Admin", ...adminSegments.map((segment) => pageTitleMap[segment] || segment.replace(/-/g, " "))];

  const NavItem = ({ label, href, icon: Icon, hasSubmenu, submenu, section }) => {
    const active = isActive(href);

    if (hasSubmenu) {
      return (
        <div>
          <button
            onClick={() => toggleSection(section)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              expandedSections[section]
                ? "bg-slate-800 text-white"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              <span className={sidebarOpen ? "inline" : "hidden xl:inline"}>{label}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections[section] ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections[section] && (
            <div className="ml-2 mt-1 space-y-1 border-l border-slate-700 pl-2">
              {submenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                  title={item.label}
                >
                  <span className={sidebarOpen ? "inline" : "hidden xl:inline"}>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={href}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          active
            ? "bg-blue-600 text-white"
            : "text-slate-300 hover:text-white hover:bg-slate-800"
        }`}
        title={label}
      >
        <Icon className="h-5 w-5" />
        <span className={sidebarOpen ? "inline" : "hidden xl:inline"}>{label}</span>
      </Link>
    );
  };

  if (!isMounted) return null;

  if (isAuthFreePage) {
    return <>{children}</>;
  }

  const navigationStructure = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Internships",
      icon: Briefcase,
      hasSubmenu: true,
      section: "internships",
      submenu: [
        { label: "Applications", href: "/admin/careers" },
        { label: "Students", href: "/admin/students" },
        { label: "Batches", href: "/admin/batches" },
        { label: "Progress Tracking", href: "/admin/internships/progress" },
      ],
    },
    {
      label: "User Management",
      icon: UserPlus,
      hasSubmenu: true,
      section: "users",
      submenu: [
        { label: "Add User Manually", href: "/admin/users/add-manual" },
        { label: "Import Users", href: "/admin/users/import" },
      ],
    },
    {
      label: "Assessments",
      icon: BookOpen,
      hasSubmenu: true,
      section: "assessments",
      submenu: [
        { label: "Question Bank", href: "/admin/quizzes/questions" },
        { label: "Assessments", href: "/admin/quizzes" },
        { label: "Registrations", href: "/admin/quizzes/registrations" },
        { label: "Results", href: "/admin/quizzes/results" },
      ],
    },
    {
      label: "Certificates",
      icon: Award,
      hasSubmenu: true,
      section: "certificates",
      submenu: [
        { label: "Issued", href: "/admin/certificates" },
        { label: "Verification", href: "/admin/certificates/verify" },
        { label: "Templates", href: "/admin/certificates/templates" },
      ],
    },
    {
      label: "Revenue",
      icon: DollarSign,
      hasSubmenu: true,
      section: "revenue",
      submenu: [
        { label: "Dashboard", href: "/admin/revenue" },
        { label: "Transactions", href: "/admin/revenue/transactions" },
        { label: "Invoices", href: "/admin/revenue/invoices" },
        { label: "Refunds", href: "/admin/revenue/refunds" },
      ],
    },
    {
      label: "CRM",
      icon: Users,
      hasSubmenu: true,
      section: "crm",
      submenu: [
        { label: "Leads", href: "/admin/leads" },
        { label: "Future Skills", href: "/admin/future-skills" },
        { label: "Communication Center", href: "/admin/communication" },
      ],
    },
    {
      label: "CMS",
      icon: FileText,
      hasSubmenu: true,
      section: "cms",
      submenu: [
        { label: "Homepage", href: "/admin/homepage" },
        { label: "Content Pages", href: "/admin/content-pages" },
        { label: "Blog", href: "/admin/blogs" },
        { label: "SEO", href: "/admin/seo" },
      ],
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 right-4 z-50 md:hidden p-2 bg-slate-900 text-white rounded-lg"
        aria-label="Toggle admin navigation"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 bg-slate-900 text-white transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } w-[280px] md:w-20 xl:w-[280px]`}
      >
        <div className="flex h-full flex-col">
          {/* Logo / Branding - sticky */}
          <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800">
            <div className="p-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-white/10 flex items-center justify-center text-white font-bold">SSC</div>
              <div>
                <h1 className="text-lg font-bold text-white">SSC Admin</h1>
                <p className="text-xs text-slate-400 mt-0.5">Management Dashboard • Admin</p>
              </div>
              {/* collapse toggle for tablet */}
              <button
                onClick={() => setMenuCollapsed((s) => !s)}
                className={sidebarOpen ? "ml-auto text-slate-300 hover:text-white inline-flex" : "ml-auto text-slate-300 hover:text-white hidden xl:inline-flex"}
                aria-label="Toggle menu"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation - scrollable */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
            {navigationStructure.map((item, idx) => (
              <div key={idx} className="px-1">
                <NavItem
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  hasSubmenu={item.hasSubmenu}
                  submenu={item.submenu}
                  section={item.section}
                />
              </div>
            ))}
          </nav>

          {/* Profile / Logout - sticky bottom */}
          <div className="sticky bottom-0 z-20 bg-slate-950 border-t border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-white">A</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-300 hover:text-white p-2 rounded"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen ml-0 md:ml-20 xl:ml-[280px] h-screen overflow-y-auto bg-slate-50">
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-8 lg:px-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="text-sm text-slate-500">
                  {breadcrumbs.map((crumb, idx) => (
                    <span key={crumb}>
                      {crumb}
                      {idx < breadcrumbs.length - 1 && " / "}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl font-semibold text-slate-900">{pageTitle}</h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="hidden sm:flex items-center rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search admin..."
                    className="ml-2 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white"
                  aria-label="View notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>
                <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    A
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">Admin User</p>
                    <p className="text-xs text-slate-500">Super Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  );
}
