import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function PresenceParSecteurChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.secteur),
    datasets: [
      {
        label: 'Présents',
        data: data.map((d) => d.presents),
        backgroundColor: '#0B3D66'
      },
      {
        label: 'Total agents',
        data: data.map((d) => d.totalAgents),
        backgroundColor: '#9CB4C7'
      }
    ]
  };

  return (
    <Bar
      data={chartData}
      options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
    />
  );
}
