"use client";

import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import LargeScreensSidebar from "./large-screens-sidebar";
import SmallScreensSidebar from "./small-screens-sidebar";

const Sidebar = () => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <>{isLargeScreen ? <LargeScreensSidebar /> : <SmallScreensSidebar />}</>
  );
};

export default Sidebar;
