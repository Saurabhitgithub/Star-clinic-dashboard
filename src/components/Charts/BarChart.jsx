import React from "react";
import Chart from "react-apexcharts";

export const BarChart = ({ labels, data }) => {
  const options = {
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    xaxis: {
      categories: [...labels],
      labels: {
        style: {
          fontFamily: "Instrument-Bold",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Active Doctor",
        style: {
          fontFamily: "Instrument-Bold",
          fontSize: "10px",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#FD5E10", "#4F46E5", "#818CF8"],
  };

  const series = [
    {
      name: "Series 1",
      data: [...data],
    },
  ];

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
