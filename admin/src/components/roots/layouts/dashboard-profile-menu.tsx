import React from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { ChevronDown } from "lucide-react";

const DashboardProfileMenu = () => {
  const router = useRouter();

  const HandleSettings = () => {
    router.push("/settings");
  };

  const HandleLogoOut = () => {
    router.push("/");
  };

  return (
    <>
      <Avatar className="w-[50px] h-[50px]">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>MM</AvatarFallback>
      </Avatar>

      <Separator orientation="vertical" className="h-[43px]" />

      <h1 className="text-heading-color text-[20px] leading-[20px] font-semibold md:block hidden">
        John Doe
      </h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ChevronDown
            size={25}
            className="text-heading-color cursor-pointer md:-translate-x-2 -translate-x-1"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 bg-white font-inter animation-standard p-2 py-4"
        >
          <DropdownMenuItem className="bg-white hover:bg-secondary-theme py-2 cursor-pointer text-heading-color hover:text-theme-heading-color">
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={HandleSettings}
            className="bg-white hover:bg-secondary-theme py-2 cursor-pointer text-heading-color hover:text-theme-heading-color"
          >
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={HandleLogoOut}
            className="bg-white hover:bg-secondary-theme py-2 cursor-pointer text-heading-color hover:text-theme-heading-color"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DashboardProfileMenu;
