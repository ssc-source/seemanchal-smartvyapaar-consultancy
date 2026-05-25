// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";


// import {
//   Home,
//   Briefcase,
//   FolderKanban,
//   Info,
//   Users,
//   Newspaper,
//   BadgeCent,
// } from "lucide-react";

// const navItems = [
//   { label: "Home", href: "/", icon: Home },
//   { label: "Services", href: "/services", icon: Briefcase },
//   { label: "Projects", href: "/projects", icon: FolderKanban },
//   { label: "About", href: "/about", icon: Info },
//   { label: "Community", href: "/community", icon: Users },
//   { label: "Blog", href: "/blog", icon: Newspaper },
//   { label: "Career", href: "/career", icon: BadgeCent },
// ];

// export function MobileBottomNav() {

//   const pathname = usePathname();

//   return (
//     <div className="fixed inset-x-0 bottom-3 z-50 flex justify-center md:hidden px-3">
//       <div
//         className="
//           w-full max-w-md
//           rounded-3xl
//           border border-amber-500
//           bg-white/90
//           backdrop-blur-2xl
//           shadow-[0_10px_40px_rgba(15,23,42,0.12)]
//           overflow-hidden
//         "
//       >
//         <nav 
//           className="
//             flex items-center gap-1
//             overflow-x-auto
//             scrollbar-hide
//             px-2 py-2
//             scroll-smooth
//             snap-x snap-mandatory
//           "
//         >
//           {navItems.map((item) => {
//             const Icon = item.icon;

//             const isActive =
//               item.href === "/"
//                 ? pathname === "/"
//                 : pathname.startsWith(item.href);

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`
//                   snap-center
//                   shrink-0
//                   min-w-[72px]
//                   flex flex-col items-center justify-center
//                   rounded-2xl
//                   px-3 py-2
//                   transition-all duration-300
//                   ${
//                     isActive
//                       ? "bg-blue-600 text-white shadow-lg"
//                       : "text-slate-500 hover:bg-slate-100"
//                   }
//                 `}
//               >
//                 <Icon className="h-4 w-4 mb-1" />

//                 <span className="text-[10px] font-medium whitespace-nowrap">
//                   {item.label}
//                 </span>
//               </Link>
//             );
//           })}
//         </nav>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Briefcase,
  FolderKanban,
  Info,
  Users,
  Newspaper,
  BadgeCent,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "About", href: "/about", icon: Info },
  { label: "Community", href: "/community", icon: Users },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "Career", href: "/career", icon: BadgeCent },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 md:hidden">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-amber-500 bg-white/90 backdrop-blur-2xl shadow-[0_10px_40px_rgba(15,23,42,0.12)]">
        
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-2 py-2 scroll-smooth snap-x snap-mandatory">
          
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={
                  isActive
                    ? "snap-center shrink-0 min-w-[72px] flex flex-col items-center justify-center rounded-2xl px-3 py-2 transition-all duration-300 bg-blue-600 text-white shadow-lg"
                    : "snap-center shrink-0 min-w-[72px] flex flex-col items-center justify-center rounded-2xl px-3 py-2 transition-all duration-300 text-slate-500 hover:bg-slate-100"
                }
              >
                <Icon className="mb-1 h-4 w-4" />

                <span className="whitespace-nowrap text-[10px] font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}