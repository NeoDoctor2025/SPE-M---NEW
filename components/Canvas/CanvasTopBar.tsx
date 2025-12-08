import React from 'react';
import { Link } from 'react-router-dom';
import { RoutePath } from '../../types';

interface CanvasTopBarProps {
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onTogglePan: () => void;
  onClearCanvas: () => void;
  onSave: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isPanning: boolean;
  zoom: number;
  saving: boolean;
}

export const CanvasTopBar: React.FC<CanvasTopBarProps> = ({
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onTogglePan,
  onClearCanvas,
  onSave,
  onExport,
  canUndo,
  canRedo,
  isPanning,
  zoom,
  saving,
}) => {
  return (
    <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#0066FF]/30 flex items-center justify-center text-[#0066FF]">
            <span className="material-symbols-outlined text-2xl">health_and_safety</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-serif text-xl leading-none text-slate-900">SPE-M</h2>
            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">Canvas Cirúrgico</span>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#0066FF] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Desfazer (Ctrl+Z)"
          >
            <span className="material-symbols-outlined text-xl">undo</span>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#0066FF] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Refazer (Ctrl+Y)"
          >
            <span className="material-symbols-outlined text-xl">redo</span>
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1"></div>

          <button
            onClick={onZoomOut}
            disabled={zoom <= 0.25}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#0066FF] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-xl">zoom_out</span>
          </button>
          <span className="font-mono text-xs text-slate-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={onZoomIn}
            disabled={zoom >= 4}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#0066FF] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-xl">zoom_in</span>
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1"></div>

          <button
            onClick={onTogglePan}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${
              isPanning ? 'text-[#0066FF] bg-slate-100' : 'text-slate-600 hover:text-[#0066FF] hover:bg-slate-50'
            }`}
            title="Mover Canvas"
          >
            <span className="material-symbols-outlined text-xl">pan_tool</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onClearCanvas}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 font-mono text-xs uppercase tracking-wide transition-colors"
        >
          <span className="material-symbols-outlined text-base">delete</span>
          Limpar Tela
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 font-mono text-xs uppercase tracking-wide transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">{saving ? 'progress_activity' : 'save'}</span>
          {saving ? 'Salvando...' : 'Salvar Anotações'}
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-5 py-2 bg-[#0066FF] text-white hover:bg-[#0052CC] font-mono text-xs uppercase tracking-wide transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-base">cloud_upload</span>
          Exportar Imagem
        </button>

        <div className="w-px h-8 bg-slate-200 mx-1"></div>

        <Link
          to={RoutePath.DASHBOARD}
          className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-sm transition-colors"
          title="Fechar"
        >
          <span className="material-symbols-outlined">close</span>
        </Link>
      </div>
    </header>
  );
};
