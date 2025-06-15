"use client";

import React from "react";
import { useTheme } from "next-themes";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SettingsPanel = () => {
  const { setTheme } = useTheme();

  return (
    <Card className="w-full !rounded-[0.5rem] !card-box-shadow">
      <CardHeader className="flex items-center flex-row justify-end gap-4 px-8 py-4 border-b border-border">
        <Button className="font-inter font-bold tracking-wider h-[55px] sm:w-[160px] w-full rounded-[6px] border-2 text-[14px] bg-white text-heading-color card-filter-button-box-shadow hover:bg-general-hover">
          Cancel
        </Button>
        <Button className="font-inter font-bold tracking-wider h-[55px] sm:w-[160px] w-full rounded-[6px] text-[14px] bg-primary-theme text-theme-heading-color card-filter-button-box-shadow hover:bg-primary-theme-hover">
          Save
        </Button>
      </CardHeader>

      <CardContent className="py-5 flex gap-5">
        <p
          className="cursor-pointer hover:underline text-[20px] dark:text-primary-theme text-secondary-theme"
          onClick={() => setTheme("dark")}
        >
          Dark
        </p>
        <p
          onClick={() => setTheme("light")}
          className="cursor-pointer hover:underline text-[20px] text-primary-theme dark:text-secondary-theme"
        >
          Light
        </p>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
