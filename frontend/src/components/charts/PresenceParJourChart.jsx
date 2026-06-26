import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function PresenceParJourChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: 'Présents',
        data: data.map((d) => d.presents),
        borderColor: '#1F9D55',
        backgroundColor: '#1F9D55',
        tension: 0.35
      },
      {
        label: 'Absents',
        data: data.map((d) => d.absents),
        borderColor: '#D64545',
        backgroundColor: '#D64545',
        tension: 0.35
      }
    ]
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true } }
      }}
    />
  );
}
