import React from "react";

import { Separator } from "@/components/ui/separator";
import SettingsPanel from "@/components/roots/settings/settings-panel";

const SettingsPage = () => {
  return (
    <main className="h-full page-layout-standard section-margin-standard">
      <div className="w-full flex flex-col gap-4">
        {/* SECTION HEADING */}
        <div className="flex flex-col gap-1">
          <h1 className="font-inter lg:text-[32px] lg:leading-[40px] md:text-[28px] md:leading-[36px] text-[24px] leading-[32px] tracking-wide text-heading-color font-semibold">
            General Settings
          </h1>
          <p className="lg:text-[18px] md:text-[16px] text-[14px] lg:leading-[22px] md:leading-[20px] leading-[18px]">
            Customize unit it matches to your workflow
          </p>
        </div>

        <Separator />
      </div>

      {/* SETTINGS PANEL */}
      <SettingsPanel />
    </main>
  );
};

export default SettingsPage;
