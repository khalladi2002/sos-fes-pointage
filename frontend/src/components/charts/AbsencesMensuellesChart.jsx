import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AbsencesMensuellesChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.mois),
    datasets: [
      {
        label: 'Absences',
        data: data.map((d) => d.absences),
        backgroundColor: '#D64545'
      }
    ]
  };

  return <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />;
}
