import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
} from "chart.js";
import { purplelight, purple,orange } from "../../constants/color";
import { getLast7Days } from "../../lib/features";

// import { Category } from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  Filler,
  ArcElement,
  Legend,
  Tooltip,
  LinearScale,
  PointElement,
  LineElement
);

const labels = getLast7Days();
const lineChartoptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Revenue",
        fill: true,
        backgroundColor: purplelight,
        borderColor: purple,
      },
    ],
  };
  return <Line data={data} options={lineChartoptions} />;
};


const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  cutout:120
}

const DoughnutChart = ({value=[],labels=[]}) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Total Chat Vs Group Chats",
        fill: true,
        backgroundColor: [purplelight,orange],
        borderColor: [purple,orange],
        offset:21
      },
    ],
  };
  return <Doughnut style={{zIndex:10}} data={data} options={doughnutChartOptions} />;
};

export { LineChart, DoughnutChart };
