import { Header } from "./header";
import { Footer } from "./footer";
import { MobileBottomNavClient } from "./mobile-bottom-nav";
import AppShellClient from "./app-shell-client";

export async function AppShell({ children }) {
  // Server Component - passes async components like Header and Footer as props
  
  return (
    <AppShellClient
      header={<Header />}
      footer={<Footer />}
      mobileNav={<MobileBottomNavClient />}
    >
      {children}
    </AppShellClient>
  );
}
