import React from "react";

import { RealTimeMapActivitiesProps } from "@/interfaces/dashboard-page-interfaces";

import { RealTimeMapActivityData } from "@/constants/dashboard-page-data";

import { Progress } from "@/components/ui/progress";
import RealTimeMap from "@/components/partials/real-time-map";

const RealTimeMapActivities = ({ selectedTab }: RealTimeMapActivitiesProps) => {


  const totalSessions = RealTimeMapActivityData.reduce(
    (sum, data) => sum + data.session,
    0
  );

  return (
    <>
      {/* REAL TIME MAP */}
      <div className="lg:w-[66.66666667%] md:w-[55%] w-full h-full">
        {selectedTab === "sessions" ? (
          <RealTimeMap MapData={RealTimeMapActivityData} />
        ) : null}
      </div>

      {/* REAL TIME MAP STATS */}
      <div className="lg:w-[calc(100%-66.66666667%)] md:w-[calc(100%-55%)] w-full md:h-full h-[400px] flex flex-col gap-4 py-4 overflow-y-auto">
        {selectedTab === "sessions" ? (
          <>
            {RealTimeMapActivityData.map((data, index) => {
              const percentage = ((data.session / totalSessions) * 100).toFixed(
                2
              );

              const getIndicatorColor = (percentage: number) => {
                if (percentage < 20) return "bg-red-500";
                if (percentage < 50) return "bg-yellow-500";
                if (percentage < 80) return "bg-blue-500";
                return "bg-green-500";
              };

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const indicatorColor = getIndicatorColor(parseFloat(percentage));

              return (
                <div key={index} className="flex items-center gap-4 px-8">
                  <span
                    className={`fi fi-${data.countryCode.toLowerCase()} !w-[25px] !h-[25px] rounded-full flag-shadow !bg-cover bg-[50%_50%]`}
                  />

                  <div className="w-[calc(100%-40px)]">
                    <p className="font-inter text-heading-color text-[0.875rem] font-medium">
                      {data.countryName}
                    </p>
                    <div className="flex items-center gap-3">
                      <Progress
                        value={parseFloat(percentage)}
                        className="h-[7px] bg-[#e9ecef]"
                        indicatorClassName="bg-[#FF5722] rounded-[50rem]"
                      />
                      <p className="text-[0.75rem]">{percentage}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : null}
      </div>
    </>
  );
};

export default RealTimeMapActivities;
