import React from 'react';
import { ImageView, ViewAngle } from '../../types/canvasTypes';

interface ThumbnailsBarProps {
  views: ImageView[];
  currentViewAngle: ViewAngle;
  onViewChange: (angle: ViewAngle) => void;
}

export const ThumbnailsBar: React.FC<ThumbnailsBarProps> = ({ views, currentViewAngle, onViewChange }) => {
  if (views.length === 0) return null;

  return (
    <div className="h-32 bg-slate-50 border-t border-slate-200 p-4 flex justify-center gap-4 overflow-x-auto shrink-0">
      {views.map((view) => (
        <div key={view.angle} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => onViewChange(view.angle)}>
          <div
            className={`w-20 h-20 bg-cover bg-center border-2 transition-all shadow-sm ${
              currentViewAngle === view.angle
                ? 'border-[#0066FF] ring-2 ring-[#0066FF]/30 shadow-md scale-105'
                : 'border-slate-300 hover:border-slate-400 group-hover:scale-105'
            }`}
            style={{ backgroundImage: `url("${view.url}")` }}
          />
          <span
            className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
              currentViewAngle === view.angle ? 'text-[#0066FF] font-bold' : 'text-slate-500 group-hover:text-slate-700'
            }`}
          >
            {view.label}
          </span>
        </div>
      ))}
    </div>
  );
};
