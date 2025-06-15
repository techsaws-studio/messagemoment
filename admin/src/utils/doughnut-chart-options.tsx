import { ChartOptions } from "chart.js";

export const DoughnutChart01Options = (): ChartOptions<"doughnut"> => {
  return {
    cutout: "85%",
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
  };
};
