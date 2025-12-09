import React, { useState, useRef, useEffect, useCallback } from 'react';
import { canvasService } from '../../lib/canvasService';
import { useToast } from '../../lib/toast';
import type {
  ToolType,
  AnnotationLayer,
  Annotation,
  ToolProperties,
  Point,
  ViewAngle,
} from '../../types/canvasTypes';

interface IntegratedCanvasProps {
  evaluationId: string;
  stepNumber: number;
  viewAngle: ViewAngle;
  imageUrl?: string;
  onAnnotationsChange?: (count: number) => void;
}

export const IntegratedCanvas: React.FC<IntegratedCanvasProps> = ({
  evaluationId,
  stepNumber,
  viewAngle,
  imageUrl,
  onAnnotationsChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const [selectedTool, setSelectedTool] = useState<ToolType>('freehand');
  const [toolProperties, setToolProperties] = useState<ToolProperties>({
    color: '#0066FF',
    thickness: 2,
    opacity: 1,
  });
  const [layers, setLayers] = useState<AnnotationLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImage(img);
        setLoading(false);
      };
      img.onerror = () => {
        setLoading(false);
      };
      img.src = imageUrl;
    } else {
      setLoading(false);
    }
  }, [imageUrl]);

  const loadLayers = useCallback(async () => {
    const loadedLayers = await canvasService.getLayers(evaluationId);
    setLayers(loadedLayers);

    if (loadedLayers.length === 0) {
      const defaultLayer = await canvasService.createLayer(evaluationId, 'Camada 1');
      if (defaultLayer) {
        setLayers([defaultLayer]);
        setActiveLayerId(defaultLayer.id);
      }
    } else if (!activeLayerId) {
      setActiveLayerId(loadedLayers[0].id);
    }
  }, [evaluationId, activeLayerId]);

  const loadAnnotations = useCallback(async () => {
    const loadedAnnotations = await canvasService.getAnnotations(evaluationId, viewAngle);
    setAnnotations(loadedAnnotations);
    onAnnotationsChange?.(loadedAnnotations.length);
  }, [evaluationId, viewAngle, onAnnotationsChange]);

  const renderCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (image) {
      canvas.width = image.width;
      canvas.height = image.height;
    } else {
      canvas.width = 800;
      canvas.height = 600;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (image) {
      ctx.drawImage(image, 0, 0);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#64748b';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Nenhuma imagem carregada', canvas.width / 2, canvas.height / 2);
    }

    const visibleLayers = layers.filter((l) => l.visible).map((l) => l.id);
    const visibleAnnotations = annotations.filter(
      (a) => visibleLayers.includes(a.layer_id) && a.view_angle === viewAngle
    );

    visibleAnnotations.forEach((annotation) => {
      drawAnnotation(ctx, annotation);
    });
  }, [image, annotations, layers, viewAngle]);

  useEffect(() => {
    loadLayers();
    loadAnnotations();
  }, [loadLayers, loadAnnotations]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const drawAnnotation = useCallback((ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    ctx.save();
    ctx.strokeStyle = annotation.color;
    ctx.fillStyle = annotation.color;
    ctx.lineWidth = annotation.thickness;
    ctx.globalAlpha = annotation.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (annotation.type) {
      case 'line': {
        const data = annotation.data as any;
        ctx.beginPath();
        ctx.moveTo(data.start.x, data.start.y);
        ctx.lineTo(data.end.x, data.end.y);
        ctx.stroke();
        break;
      }
      case 'arrow': {
        const data = annotation.data as any;
        const headLength = 15;
        const angle = Math.atan2(data.end.y - data.start.y, data.end.x - data.start.x);

        ctx.beginPath();
        ctx.moveTo(data.start.x, data.start.y);
        ctx.lineTo(data.end.x, data.end.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(data.end.x, data.end.y);
        ctx.lineTo(
          data.end.x - headLength * Math.cos(angle - Math.PI / 6),
          data.end.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(data.end.x, data.end.y);
        ctx.lineTo(
          data.end.x - headLength * Math.cos(angle + Math.PI / 6),
          data.end.y - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        break;
      }
      case 'freehand': {
        const data = annotation.data as any;
        if (data.points && data.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(data.points[0].x, data.points[0].y);
          for (let i = 1; i < data.points.length; i++) {
            ctx.lineTo(data.points[i].x, data.points[i].y);
          }
          ctx.stroke();
        }
        break;
      }
    }

    ctx.restore();
  }, []);

  const getCanvasPoint = (e: React.MouseEvent): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e);

    if (!activeLayerId) {
      showToast('Selecione uma camada primeiro', 'warning');
      return;
    }

    const activeLayer = layers.find((l) => l.id === activeLayerId);
    if (activeLayer?.locked) {
      showToast('Esta camada está bloqueada', 'warning');
      return;
    }

    setIsDrawing(true);
    setStartPoint(point);

    if (selectedTool === 'freehand') {
      setCurrentPath([point]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;

    const point = getCanvasPoint(e);

    if (selectedTool === 'freehand') {
      setCurrentPath((prev) => [...prev, point]);
      renderCanvas();

      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && currentPath.length > 0) {
        ctx.strokeStyle = toolProperties.color;
        ctx.lineWidth = toolProperties.thickness;
        ctx.globalAlpha = toolProperties.opacity;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(currentPath[currentPath.length - 1].x, currentPath[currentPath.length - 1].y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = async (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint || !activeLayerId) {
      setIsDrawing(false);
      return;
    }

    const point = getCanvasPoint(e);
    let annotationData: any = null;

    switch (selectedTool) {
      case 'line':
        annotationData = { start: startPoint, end: point };
        break;
      case 'arrow':
        annotationData = { start: startPoint, end: point };
        break;
      case 'freehand':
        if (currentPath.length > 1) {
          annotationData = { points: currentPath };
        }
        break;
    }

    if (annotationData) {
      const annotation = await canvasService.createAnnotation(
        activeLayerId,
        evaluationId,
        selectedTool,
        annotationData,
        toolProperties.color,
        toolProperties.thickness,
        toolProperties.opacity,
        viewAngle
      );

      if (annotation) {
        const newAnnotations = [...annotations, annotation];
        setAnnotations(newAnnotations);
        onAnnotationsChange?.(newAnnotations.length);
      }
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPath([]);
  };

  const handleClear = async () => {
    const stepAnnotations = annotations.filter((a) => a.view_angle === viewAngle);

    for (const annotation of stepAnnotations) {
      await canvasService.deleteAnnotation(annotation.id);
    }

    const remainingAnnotations = annotations.filter((a) => a.view_angle !== viewAngle);
    setAnnotations(remainingAnnotations);
    onAnnotationsChange?.(remainingAnnotations.length);
    showToast('Anotações limpas', 'success');
  };

  const handleUndo = async () => {
    const stepAnnotations = annotations.filter((a) => a.view_angle === viewAngle);
    if (stepAnnotations.length === 0) return;

    const lastAnnotation = stepAnnotations[stepAnnotations.length - 1];
    await canvasService.deleteAnnotation(lastAnnotation.id);

    const newAnnotations = annotations.filter((a) => a.id !== lastAnnotation.id);
    setAnnotations(newAnnotations);
    onAnnotationsChange?.(newAnnotations.length);
  };

  const colors = [
    { name: 'Azul Cirúrgico', value: '#0066FF' },
    { name: 'Vermelho', value: '#FF0000' },
    { name: 'Verde', value: '#00CC00' },
  ];

  const thickness = [
    { label: 'Fina', value: 1 },
    { label: 'Média', value: 2 },
    { label: 'Grossa', value: 4 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <span className="material-symbols-outlined text-3xl text-white/40 animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800">
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-white/60">draw</span>
          <span className="font-mono text-xs uppercase tracking-wider text-white/80">
            Canvas Integrado
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            className="p-1.5 hover:bg-slate-800 transition-colors group"
            title="Desfazer"
          >
            <span className="material-symbols-outlined text-sm text-white/60 group-hover:text-white">
              undo
            </span>
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 hover:bg-slate-800 transition-colors group"
            title="Limpar"
          >
            <span className="material-symbols-outlined text-sm text-white/60 group-hover:text-white">
              delete
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
          <button
            onClick={() => setSelectedTool('freehand')}
            className={`p-2 transition-colors ${
              selectedTool === 'freehand'
                ? 'bg-primary text-white'
                : 'text-white/60 hover:bg-slate-800 hover:text-white'
            }`}
            title="Caneta"
          >
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
          <button
            onClick={() => setSelectedTool('line')}
            className={`p-2 transition-colors ${
              selectedTool === 'line'
                ? 'bg-primary text-white'
                : 'text-white/60 hover:bg-slate-800 hover:text-white'
            }`}
            title="Linha"
          >
            <span className="material-symbols-outlined text-base">show_chart</span>
          </button>
          <button
            onClick={() => setSelectedTool('arrow')}
            className={`p-2 transition-colors ${
              selectedTool === 'arrow'
                ? 'bg-primary text-white'
                : 'text-white/60 hover:bg-slate-800 hover:text-white'
            }`}
            title="Seta"
          >
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setToolProperties({ ...toolProperties, color: color.value })}
              className={`w-6 h-6 rounded-sm border-2 transition-all ${
                toolProperties.color === color.value
                  ? 'border-white scale-110'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          {thickness.map((t) => (
            <button
              key={t.value}
              onClick={() => setToolProperties({ ...toolProperties, thickness: t.value })}
              className={`px-2 py-1 font-mono text-[10px] uppercase transition-colors ${
                toolProperties.thickness === t.value
                  ? 'bg-primary text-white'
                  : 'text-white/60 hover:bg-slate-800 hover:text-white'
              }`}
              title={t.label}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 overflow-auto cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <canvas ref={canvasRef} className="max-w-full max-h-full shadow-xl" />
      </div>

      <div className="p-2 border-t border-slate-800 bg-slate-950/50">
        <p className="font-mono text-[10px] text-white/40 text-center">
          {annotations.filter((a) => a.view_angle === viewAngle).length} anotações nesta região
        </p>
      </div>
    </div>
  );
};
