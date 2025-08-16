"use client";
import React, { useState, useEffect } from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ChartData = {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
};

export default function StatisticsChart() {
  const [chartData, setChartData] = useState<ChartData>({
    categories: [],
    series: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/statistics/work-requests');
        const result = await response.json();
        
        if (result.success && result.data) {
          setChartData(result.data);
        } else {
          setError(result.message || "Erreur lors du chargement des données");
        }
      } catch (err) {
        setError("Erreur lors du chargement des statistiques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  const options: ApexOptions = {
    legend: {
      show: true, // Show legend for breakdown types
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"], // Define colors for different breakdown types
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "smooth", // Smooth curve for better visualization
      width: [3, 3, 3], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.3,
        opacityTo: 0.1,
      },
    },
    markers: {
      size: 4, // Show marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 8, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      shared: true,
      intersect: false,
      y: {
        formatter: function (val: number) {
          return val + " pannes";
        },
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: chartData.categories,
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      title: {
        text: "Période",
        style: {
          fontSize: "12px",
          fontWeight: "600",
          color: "#6B7280",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
        formatter: function (val: number) {
          return Math.floor(val).toString();
        },
      },
      title: {
        text: "Nombre de pannes",
        style: {
          fontSize: "12px",
          fontWeight: "600",
          color: "#6B7280",
        },
      },
      min: 0,
    },
  };

  // Affichage conditionnel en cas de chargement ou d'erreur
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Chargement des statistiques...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 dark:text-red-400">Erreur: {error}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistiques des Pannes
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Évolution du nombre de demandes d'intervention par type de panne
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={chartData.series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
