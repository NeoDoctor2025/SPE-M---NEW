import React from 'react';
import { ToolProperties, DEFAULT_COLORS, THICKNESS_OPTIONS } from '../../types/canvasTypes';

interface ToolPropertiesPanelProps {
  properties: ToolProperties;
  onPropertiesChange: (properties: ToolProperties) => void;
  visible: boolean;
}

export const ToolPropertiesPanel: React.FC<ToolPropertiesPanelProps> = ({
  properties,
  onPropertiesChange,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute top-16 left-16 bg-white border border-slate-200 shadow-lg p-4 w-64 z-10">
      <h3 className="font-mono text-xs uppercase tracking-wider text-slate-700 mb-4">Propriedades da Ferramenta</h3>

      <div className="space-y-4">
        <div>
          <label className="font-sans text-sm text-slate-700 mb-2 block">Cor</label>
          <div className="flex gap-2">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => onPropertiesChange({ ...properties, color: color.value })}
                className={`w-10 h-10 rounded-sm border-2 transition-all ${
                  properties.color === color.value
                    ? 'border-slate-900 scale-110 shadow-md'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <div className="mt-2">
            <input
              type="color"
              value={properties.color}
              onChange={(e) => onPropertiesChange({ ...properties, color: e.target.value })}
              className="w-full h-8 rounded-sm border border-slate-200 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="font-sans text-sm text-slate-700 mb-2 block">
            Espessura: {properties.thickness}px
          </label>
          <div className="flex gap-2 mb-2">
            {THICKNESS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onPropertiesChange({ ...properties, thickness: option.value })}
                className={`flex-1 py-2 border rounded text-xs font-mono uppercase transition-colors ${
                  properties.thickness === option.value
                    ? 'border-[#0066FF] bg-[#0066FF]/10 text-[#0066FF]'
                    : 'border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={properties.thickness}
            onChange={(e) => onPropertiesChange({ ...properties, thickness: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="mt-2 h-2 rounded-full bg-slate-200 flex items-center">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(properties.thickness / 10) * 100}%`,
                backgroundColor: properties.color,
              }}
            />
          </div>
        </div>

        <div>
          <label className="font-sans text-sm text-slate-700 mb-2 block">
            Opacidade: {Math.round(properties.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={properties.opacity}
            onChange={(e) => onPropertiesChange({ ...properties, opacity: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="mt-2 h-8 rounded-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZGRkIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNkZGQiLz48L3N2Zz4=')] opacity-30"></div>
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: properties.color,
                opacity: properties.opacity,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
