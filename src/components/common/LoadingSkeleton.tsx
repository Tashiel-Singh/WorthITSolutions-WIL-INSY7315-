/**
 * Accessible Skeleton Loading Screens for Smooth Content Ingestion
 */
import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse" aria-busy="true" aria-label="Loading metrics">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-8 bg-slate-200 rounded w-2/3"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse" aria-busy="true" aria-label="Loading data table">
      <div className="p-4 border-b border-slate-200 flex justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-2/5"></div>
              <div className="h-3 bg-slate-100 rounded w-1/4"></div>
            </div>
            <div className="h-6 bg-slate-100 rounded w-16"></div>
            <div className="h-8 bg-slate-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
