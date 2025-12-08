import React from 'react';
import { ToolType } from '../../types/canvasTypes';

interface CanvasToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
}

interface Tool {
  id: ToolType;
  icon: string;
  label: string;
}

const TOOLS: Tool[] = [
  { id: 'pointer', icon: 'arrow_selector_tool', label: 'Cursor/Seleção' },
  { id: 'line', icon: 'remove', label: 'Linha' },
  { id: 'circle', icon: 'circle', label: 'Círculo/Oval' },
  { id: 'arrow', icon: 'arrow_forward', label: 'Seta' },
  { id: 'measurement', icon: 'straighten', label: 'Régua/Medição' },
  { id: 'text', icon: 'text_fields', label: 'Texto' },
  { id: 'freehand', icon: 'edit', label: 'Caneta/Desenho Livre' },
  { id: 'eraser', icon: 'ink_eraser', label: 'Borracha' },
];

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ selectedTool, onToolSelect }) => {
  return (
    <aside className="w-16 border-r border-slate-200 flex flex-col items-center py-4 gap-2 bg-white">
      {TOOLS.map((tool, index) => (
        <React.Fragment key={tool.id}>
          <button
            onClick={() => onToolSelect(tool.id)}
            className={`w-11 h-11 flex items-center justify-center rounded-sm transition-all ${
              selectedTool === tool.id
                ? 'text-[#0066FF] bg-[#0066FF]/10 border border-[#0066FF]/50 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-[#0066FF]'
            }`}
            title={tool.label}
          >
            <span className="material-symbols-outlined text-xl">{tool.icon}</span>
          </button>
          {(index === 0 || index === 4) && (
            <div className="w-8 h-px bg-slate-200 my-1"></div>
          )}
        </React.Fragment>
      ))}
    </aside>
  );
};
