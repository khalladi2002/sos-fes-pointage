import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'sos-dark', suffix = '' }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">{title}</p>
        <p className={`text-2xl font-bold mt-1 text-${color}`}>
          {value}
          {suffix}
        </p>
      </div>
      {Icon && (
        <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: 'rgba(11,61,102,0.08)' }}>
          <Icon size={26} className="text-sos-dark" />
        </div>
      )}
    </div>
  );
}
