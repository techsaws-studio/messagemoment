import React from "react";

import { MessageMomentStatsCardsData } from "@/constants/dashboard-page-data";

import { Card, CardContent } from "@/components/ui/card";

const MessageMomentStatsCards = () => {
  return (
    <section className="w-full grid xl:grid-cols-5 sm:grid-cols-4 grid-cols-1 gap-4">
      {MessageMomentStatsCardsData.map((data) => (
        <Card
          key={data.stats}
          className={`w-full lg:h-[130px] h-[180px] cursor-pointer rounded-[0.75rem] card-box-showdow-02 !animation-standard flex-center ${
            data.stats === 1
              ? "lg:col-span-1 sm:col-span-2 col-span-1"
              : data.stats === 2
              ? "xl:col-span-1 sm:col-span-2 col-span-1"
              : data.stats === 3
              ? "lg:col-span-1 sm:col-span-4 col-span-1"
              : data.stats === 4
              ? "xl:col-span-1 sm:col-span-2 col-span-1"
              : data.stats === 5
              ? "xl:col-span-1 sm:col-span-2 col-span-1"
              : ""
          }`}
        >
          <CardContent
            className={`flex items-center justify-center gap-4 p-0 ${
              data.stats === 1
                ? "md:flex-row flex-col md:text-start text-center"
                : data.stats === 2
                ? "md:flex-row flex-col md:text-start text-center"
                : data.stats === 3
                ? "sm:flex-row flex-col sm:text-start text-center"
                : data.stats === 4
                ? "md:flex-row flex-col md:text-start text-center"
                : data.stats === 5
                ? "md:flex-row flex-col md:text-start text-center"
                : ""
            }`}
          >
            <div
              className={`w-[3rem] h-[3rem] rounded-[0.5rem] flex-center text-white`}
              style={{ backgroundColor: data.bgColor }}
            >
              {data.icon}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-inter font-medium text-heading-color text-[16px] leading-[20px]">
                {data.title}
              </h1>
              <p className="text-[16px] leading-[20px] font-semibold">
                {data.detail}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default MessageMomentStatsCards;
