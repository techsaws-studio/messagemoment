"use client";

import React from "react";

import { useDrawer } from "@/contexts/drawer-context";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import DashboardSearchbar from "@/components/roots/layouts/dashboard-searchbar";
import DashboardProfileMenu from "@/components/roots/layouts/dashboard-profile-menu";
import DashboardInboxMenu from "@/components/roots/layouts/dashboard-inbox-menu";
import DashboardNotificationMenu from "@/components/roots/layouts/dashboard-notification-menu";

import { Menu } from "lucide-react";

const Header = () => {
  const { open } = useSidebar();
  const { openDrawer } = useDrawer();

  return (
    <header className="bg-white h-[85px] w-full header-box-shadow sticky top-0 z-50">
      <div className="layout-standard h-full flex items-center justify-between">
        {/* HEADER LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* LARGE SCREENS SIDEBAR BUTTON */}
          {!open && <SidebarTrigger className="lg:block hidden" />}

          {/* SMALL & MIDDLE SCREENS SIDEBAR BUTTON */}
          <Menu className="h-[20px] w-[20px] lg:hidden" onClick={openDrawer} />

          {/* COMPONENT SEARCH BAR */}
          <DashboardSearchbar />
        </div>

        {/* HEADER RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* DASHBOARD INBOX MENU */}
          <DashboardInboxMenu />

          {/* DASHBOARD NOTIFICATION MENU */}
          <DashboardNotificationMenu />

          {/* DASHBOARD PROFILE MENU */}
          <DashboardProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
