"use client";

// react
import { useState } from "react";
// components
import NavbarComponent from "@/lib/components/layout/NavbarComponent";
import SidebarComponent from "@/lib/components/layout/SidebarComponents";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  return (
    <main className="w-full max-w-full h-screen max-h-screen flex flex-col">
      <NavbarComponent burgerOnClick={() => setShowSidebar(!showSidebar)} />

      <div className="flex flex-1 pt-3 bg-budiluhur-700 overflow-auto">
        <SidebarComponent showSidebar={showSidebar} />

        <div className="h-full max-h-full flex-1 bg-budiluhur-600 rounded-t-md overflow-auto">
          {children}
        </div>
      </div>
    </main>
  );
}
