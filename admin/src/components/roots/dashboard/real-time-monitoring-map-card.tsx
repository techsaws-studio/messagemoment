"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RealTimeMapActivities from "./real-time-map-activities";

const RealTimeMonitoringMapCard = () => {
  const [selectedTab, setSelectedTab] = useState("sessions");

  return (
    <Card
      id="RealTimeMonitoringMapSection"
      className="w-full !rounded-[0.5rem] !card-box-shadow"
    >
      <CardHeader className="md:py-3 py-6 border-b border-border flex md:flex-row flex-col max-md:gap-4 items-center md:justify-between">
        {/* CARD HEADING */}
        <CardTitle className="font-inter font-medium text-heading-color text-[16px] leading-[18px]">
          Real Time Global Activity
        </CardTitle>

        {/* FILTER BUTTON */}
        <div className="flex max-sm:w-full font-inter font-medium">
          <Button
            onClick={() => setSelectedTab("sessions")}
            className={`h-[40px] sm:w-[135px] w-full rounded-[6px_0_0_6px] border text-[14px] card-filter-button-box-shadow ${
              selectedTab === "sessions"
                ? "bg-selected-color text-theme-heading-color"
                : "bg-white hover:bg-general-hover text-heading-color"
            }`}
          >
            Sessions
          </Button>
          <Button
            onClick={() => setSelectedTab("users")}
            className={`h-[40px] sm:w-[135px] w-full rounded-[0_6px_6px_0] border text-[14px] card-filter-button-box-shadow ${
              selectedTab === "users"
                ? "bg-selected-color text-theme-heading-color"
                : "bg-white hover:bg-general-hover text-heading-color"
            }`}
          >
            Users
          </Button>
        </div>
      </CardHeader>

      {/* REAL TIME MAP ACTIVITIES & STATS */}
      <CardContent className="max-lg:py-5 max-lg:px-1 md:h-[550px] h-[700px] flex md:gap-0 gap-6 md:flex-row flex-col">
        <RealTimeMapActivities selectedTab={selectedTab} />
      </CardContent>
    </Card>
  );
};

export default RealTimeMonitoringMapCard;
