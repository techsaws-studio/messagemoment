import { DrawerProvider } from "@/contexts/drawer-context";
import { SidebarProvider } from "@/components/ui/sidebar";

import Header from "@/layouts/header";
import Sidebar from "@/layouts/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DrawerProvider>
        <Sidebar />
        <main className="w-full">
          <Header />
          {children}
        </main>
      </DrawerProvider>
    </SidebarProvider>
  );
}
