import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoughnutChart01 } from "@/components/partials/doughnut-charts";

const ReturnedVisitorsCard = () => {
  return (
    <Card
      id="ReturnedVisitorsSection"
      className="w-full !rounded-[0.5rem] !card-box-shadow col-span-1"
    >
      <CardHeader className="py-6 border-b border-border">
        {/* CARD HEADING */}
        <CardTitle className="font-inter font-medium text-heading-color text-[16px] leading-[18px]">
          Returned Visitors
        </CardTitle>
      </CardHeader>

      {/* RETURNED VISITORS DOUGHNUT CHART */}
      <CardContent className="pb-[5rem] h-full flex-center mx-auto">
        <DoughnutChart01
          label="Returning Visitors"
          percentage={82}
          backgroundColor={["#FAC858", "#f2f2f2"]}
        />
      </CardContent>
    </Card>
  );
};

export default ReturnedVisitorsCard;
