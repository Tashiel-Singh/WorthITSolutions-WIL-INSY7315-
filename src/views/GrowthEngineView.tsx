import React from 'react';
import { GrowthDashboard } from '../components/growth/GrowthDashboard';

export const GrowthEngineView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <GrowthDashboard />
    </div>
  );
};

export default GrowthEngineView;

