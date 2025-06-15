"use client";

import React, { useMemo } from "react";

import { DoughnutChart01Props } from "@/interfaces/partials-components-interfaces";

import { DoughnutChart01Options } from "@/utils/doughnut-chart-options";

import { Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  Chart as ChartJS,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  ChartDataLabels
);

export const DoughnutChart01 = ({
  percentage,
  label,
  backgroundColor,
}: DoughnutChart01Props) => {
  const chartData = useMemo(
    () => ({
      labels: [label],
      datasets: [
        {
          data: [percentage, 100 - percentage],
          backgroundColor: backgroundColor,
          borderWidth: 0,
        },
      ],
    }),
    [percentage, label, backgroundColor]
  );

  const options = DoughnutChart01Options();

  return (
    <div className="relative mx-auto aspect-square">
      <Doughnut data={chartData} options={options} />

      <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center">
        <span className="text-heading-color lg:text-[16px] text-[14px] lg:leading-[18.9px] leading-[16.9px] font-semibold font-inter">
          {label}
        </span>
        <span className="text-[46px] font-bold">{percentage}%</span>
      </div>
    </div>
  );
};
