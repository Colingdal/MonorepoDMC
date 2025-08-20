/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DoughnutChart = ({ telemetryData }) => {
  const doughnutChartRef = useRef(null);
  const doughnutChartInstance = useRef(null);

  useEffect(() => {
    if (doughnutChartInstance.current) {
      doughnutChartInstance.current.destroy();
    }

    const doughnutCtx = doughnutChartRef.current.getContext("2d");

    const convertTelemetryToChartData = (telemetry) => {
      const labels = Object.keys(telemetry);
      const data = Object.values(telemetry).map((value) =>
        typeof value === "object" ? 0 : parseFloat(value) || 0
      );

      return {
        labels: labels,
        datasets: [
          {
            label: "Telemetry Data",
            data: data,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#C9CBCF",
              "#E7E9ED",
              "#8BC34A",
              "#FFC107",
              "#795548",
              "#009688",
            ],
            borderColor: "rgba(255,255,255,0.8)",
            borderWidth: 2,
          },
        ],
      };
    };

    const chartData = convertTelemetryToChartData(telemetryData);

    doughnutChartInstance.current = new Chart(doughnutCtx, {
      type: "doughnut", 
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
      },
    });

    return () => {
      if (doughnutChartInstance.current) {
        doughnutChartInstance.current.destroy();
      }
    };
  }, [telemetryData]);

  return (
    <div>
      <canvas ref={doughnutChartRef} />
    </div>
  );
};

export default DoughnutChart;
