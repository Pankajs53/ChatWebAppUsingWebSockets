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

const lineChartoptions={
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false,
        },
    }, 
}

const LineChart = () => {
  const data = {
    labels: ["Jan", "Feb", "March", "April"],
    datasets: [1, 2, 3, 4],
  };
  return <Line data={data} options={lineChartoptions} />;
};

const DoughnutChart = () => {
  return <div>New Chomu</div>;
};

export { LineChart, DoughnutChart };
