"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Inbox } from "lucide-react";

const DashboardInboxMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer hover:bg-hovered-color p-2 hover:rounded-full animation-standard">
        <Badge className="bg-[#ebf3fe] text-[#0069F7] absolute top-[14px] -translate-x-[2px] rounded-[50rem] z-[1]">
          12
        </Badge>
        <Inbox className="relative" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white w-[320px] h-[220px] flex flex-col justify-between -translate-x-[10px]">
        <div className="flex flex-col h-[70px]">
          <DropdownMenuLabel className="font-inter text-[18px] text-heading-color font-semibold">
            Inbox
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
        </div>

        <div className="flex flex-col h-[40px]">
          <DropdownMenuSeparator className="bg-border" />
          <div className="h-full flex items-center justify-end gap-4 px-4">
            <p className="text-[12px] text-primary-theme cursor-pointer hover:underline font-inter">
              View All
            </p>
            <p className="text-[12px] text-primary-theme cursor-pointer hover:underline font-inter">
              Mark As Read
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardInboxMenu;