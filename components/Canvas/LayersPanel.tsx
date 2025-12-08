import React, { useState } from 'react';
import { AnnotationLayer } from '../../types/canvasTypes';

interface LayersPanelProps {
  layers: AnnotationLayer[];
  activeLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerAdd: () => void;
  onLayerDelete: (layerId: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerToggleLock: (layerId: string) => void;
  onLayerRename: (layerId: string, name: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  activeLayerId,
  onLayerSelect,
  onLayerAdd,
  onLayerDelete,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerRename,
}) => {
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartRename = (layer: AnnotationLayer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
  };

  const handleConfirmRename = (layerId: string) => {
    if (editingName.trim()) {
      onLayerRename(layerId, editingName.trim());
    }
    setEditingLayerId(null);
  };

  const handleCancelRename = () => {
    setEditingLayerId(null);
    setEditingName('');
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-mono text-xs uppercase tracking-wider text-slate-900">Camadas de Anotação</h3>
        <button
          onClick={onLayerAdd}
          className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-[#0066FF] transition-colors"
          title="Adicionar Camada"
        >
          <span className="material-symbols-outlined text-xl">add</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {layers.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 block">layers</span>
            <p className="font-sans text-sm">Nenhuma camada criada</p>
            <p className="font-mono text-xs mt-1">Clique em + para adicionar</p>
          </div>
        ) : (
          layers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => onLayerSelect(layer.id)}
              className={`flex items-center justify-between p-3 rounded-sm border cursor-pointer transition-all ${
                activeLayerId === layer.id
                  ? 'border-[#0066FF] bg-[#0066FF]/5'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
                  title="Arrastar para reordenar"
                >
                  <span className="material-symbols-outlined text-base">drag_indicator</span>
                </button>

                {editingLayerId === layer.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleConfirmRename(layer.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleConfirmRename(layer.id);
                      } else if (e.key === 'Escape') {
                        handleCancelRename();
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-white border border-[#0066FF] px-2 py-1 text-sm font-sans text-slate-900 focus:outline-none rounded"
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleStartRename(layer);
                    }}
                    className="flex-1 font-sans text-sm font-medium text-slate-900 truncate"
                    title={layer.name}
                  >
                    {layer.name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerToggleVisibility(layer.id);
                  }}
                  className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                    layer.visible ? 'text-slate-600' : 'text-slate-300'
                  }`}
                  title={layer.visible ? 'Ocultar' : 'Mostrar'}
                >
                  <span className="material-symbols-outlined text-base">
                    {layer.visible ? 'visibility' : 'visibility_off'}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerToggleLock(layer.id);
                  }}
                  className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                    layer.locked ? 'text-[#0066FF]' : 'text-slate-400'
                  }`}
                  title={layer.locked ? 'Desbloquear' : 'Bloquear'}
                >
                  <span className="material-symbols-outlined text-base">
                    {layer.locked ? 'lock' : 'lock_open'}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Excluir a camada "${layer.name}"?`)) {
                      onLayerDelete(layer.id);
                    }
                  }}
                  className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                  title="Excluir"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
          {layers.length} {layers.length === 1 ? 'camada' : 'camadas'}
        </p>
      </div>
    </aside>
  );
};
