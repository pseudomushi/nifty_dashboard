import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface NiftyChartProps {
  labels: string[];
  data: number[];
  title?: string;
}

export default function NiftyChart({ labels, data, title = "Nifty 50 Price Movement" }: NiftyChartProps) {
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Nifty 50",
          data,
          borderColor: "rgb(59, 130, 246)", // Blue
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          borderWidth: 2,
        },
      ],
    }),
    [labels, data]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { size: 12, weight: "normal" as const },
          color: "rgb(107, 114, 128)",
          padding: 15,
        },
      },
      title: {
        display: true,
        text: title,
        font: { size: 16, weight: "bold" as const },
        color: "rgb(31, 41, 55)",
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 12, weight: "bold" as const },
        bodyFont: { size: 11 },
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `Nifty 50: ${context.parsed.y.toFixed(2)}`;
          },
        },
      } as any,
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          font: { size: 11 },
          color: "rgb(107, 114, 128)",
          callback: function (value: any) {
            return value.toFixed(0);
          },
        },
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          font: { size: 11 },
          color: "rgb(107, 114, 128)",
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md p-6">
      <Line data={chartData} options={options} height={300} />
    </div>
  );
}
