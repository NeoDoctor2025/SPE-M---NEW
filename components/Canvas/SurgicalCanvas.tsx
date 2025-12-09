import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CanvasTopBar } from './CanvasTopBar';
import { CanvasToolbar } from './CanvasToolbar';
import { ToolPropertiesPanel } from './ToolPropertiesPanel';
import { LayersPanel } from './LayersPanel';
import { ThumbnailsBar } from './ThumbnailsBar';
import { useCanvasHistory } from '../../lib/useCanvasHistory';
import { canvasService } from '../../lib/canvasService';
import { useToast } from '../../lib/toast';
import type {
  ToolType,
  AnnotationLayer,
  Annotation,
  ToolProperties,
  Point,
  ImageView,
  ViewAngle,
  SURGICAL_BLUE,
} from '../../types/canvasTypes';

interface SurgicalCanvasProps {
  evaluationId: string;
  imageUrl: string;
  imageViews?: ImageView[];
}

export const SurgicalCanvas: React.FC<SurgicalCanvasProps> = ({ evaluationId, imageUrl, imageViews = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [selectedTool, setSelectedTool] = useState<ToolType>('pointer');
  const [toolProperties, setToolProperties] = useState<ToolProperties>({
    color: '#0066FF',
    thickness: 2,
    opacity: 1,
  });
  const [showProperties, setShowProperties] = useState(false);
  const [layers, setLayers] = useState<AnnotationLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [saving, setSaving] = useState(false);
  const [currentViewAngle, setCurrentViewAngle] = useState<ViewAngle>('frontal');
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const { currentState: historyState, addToHistory, undo, redo, canUndo, canRedo } = useCanvasHistory(annotations);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.src = imageUrl;
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
    const loadedAnnotations = await canvasService.getAnnotations(evaluationId, currentViewAngle);
    setAnnotations(loadedAnnotations);
  }, [evaluationId, currentViewAngle]);

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
      case 'circle': {
        const data = annotation.data as any;
        ctx.beginPath();
        ctx.ellipse(data.center.x, data.center.y, data.radiusX, data.radiusY, 0, 0, 2 * Math.PI);
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
      case 'text': {
        const data = annotation.data as any;
        ctx.font = `${data.fontSize || 16}px sans-serif`;
        ctx.fillText(data.text, data.position.x, data.position.y);
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
      case 'measurement': {
        const data = annotation.data as any;
        ctx.beginPath();
        ctx.moveTo(data.start.x, data.start.y);
        ctx.lineTo(data.end.x, data.end.y);
        ctx.stroke();

        const midX = (data.start.x + data.end.x) / 2;
        const midY = (data.start.y + data.end.y) / 2;
        ctx.font = '14px monospace';
        ctx.fillStyle = '#000';
        ctx.fillText(`${Math.round(data.distance)}px`, midX, midY - 5);
        break;
      }
    }

    ctx.restore();
  }, []);

  const renderCanvas = useCallback(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(panX, panY);

    ctx.drawImage(image, 0, 0);

    const visibleLayers = layers.filter((l) => l.visible).map((l) => l.id);
    const visibleAnnotations = annotations.filter(
      (a) => visibleLayers.includes(a.layer_id) && a.view_angle === currentViewAngle
    );

    visibleAnnotations.forEach((annotation) => {
      drawAnnotation(ctx, annotation);
    });

    ctx.restore();
  }, [image, annotations, layers, zoom, panX, panY, currentViewAngle, drawAnnotation]);

  useEffect(() => {
    loadLayers();
    loadAnnotations();
  }, [evaluationId]);

  useEffect(() => {
    if (imageViews.length > 0 && !imageViews.find((v) => v.angle === currentViewAngle)) {
      setCurrentViewAngle(imageViews[0].angle);
    }
  }, [imageViews]);

  useEffect(() => {
    loadAnnotations();
  }, [currentViewAngle]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleUndo = useCallback(() => {
    const prevState = undo();
    if (prevState) {
      setAnnotations(prevState);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setAnnotations(nextState);
    }
  }, [redo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const getCanvasPoint = (e: React.MouseEvent): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom - panX,
      y: (e.clientY - rect.top) / zoom - panY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e);

    if (isPanning || selectedTool === 'pointer') {
      setIsDrawing(true);
      setStartPoint(point);
      return;
    }

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

    if (isPanning || selectedTool === 'pointer') {
      const dx = point.x - startPoint.x;
      const dy = point.y - startPoint.y;
      setPanX(panX + dx);
      setPanY(panY + dy);
      return;
    }

    if (selectedTool === 'freehand') {
      setCurrentPath((prev) => [...prev, point]);
      renderCanvas();

      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && currentPath.length > 0) {
        ctx.save();
        ctx.scale(zoom, zoom);
        ctx.translate(panX, panY);
        ctx.strokeStyle = toolProperties.color;
        ctx.lineWidth = toolProperties.thickness;
        ctx.globalAlpha = toolProperties.opacity;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(currentPath[currentPath.length - 1].x, currentPath[currentPath.length - 1].y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const handleMouseUp = async (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint || !activeLayerId) {
      setIsDrawing(false);
      return;
    }

    const point = getCanvasPoint(e);

    if (isPanning || selectedTool === 'pointer') {
      setIsDrawing(false);
      return;
    }

    let annotationData: any = null;

    switch (selectedTool) {
      case 'line':
        annotationData = { start: startPoint, end: point };
        break;
      case 'circle': {
        const radiusX = Math.abs(point.x - startPoint.x);
        const radiusY = Math.abs(point.y - startPoint.y);
        annotationData = { center: startPoint, radiusX, radiusY };
        break;
      }
      case 'arrow':
        annotationData = { start: startPoint, end: point };
        break;
      case 'measurement': {
        const distance = Math.sqrt(Math.pow(point.x - startPoint.x, 2) + Math.pow(point.y - startPoint.y, 2));
        annotationData = { start: startPoint, end: point, distance };
        break;
      }
      case 'text': {
        const text = prompt('Digite o texto:');
        if (text) {
          annotationData = { position: startPoint, text, fontSize: 16 };
        }
        break;
      }
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
        currentViewAngle
      );

      if (annotation) {
        setAnnotations((prev) => [...prev, annotation]);
        addToHistory([...annotations, annotation]);
      }
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPath([]);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.25));
  const handleTogglePan = () => setIsPanning((prev) => !prev);

  const handleClearCanvas = async () => {
    if (!confirm('Tem certeza que deseja limpar todas as anotações?')) return;

    for (const annotation of annotations) {
      await canvasService.deleteAnnotation(annotation.id);
    }

    setAnnotations([]);
    addToHistory([]);
    showToast('Canvas limpo com sucesso', 'success');
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    showToast('Anotações salvas com sucesso', 'success');
    setSaving(false);
  };

  const handleExport = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `canvas-${evaluationId}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();

    showToast('Imagem exportada com sucesso', 'success');
  };

  const handleToolSelect = (tool: ToolType) => {
    setSelectedTool(tool);
    setShowProperties(tool !== 'pointer' && tool !== 'eraser');
    if (tool !== 'pointer') {
      setIsPanning(false);
    }
  };

  const handleLayerAdd = async () => {
    const layer = await canvasService.createLayer(evaluationId, `Camada ${layers.length + 1}`);
    if (layer) {
      setLayers((prev) => [...prev, layer]);
      setActiveLayerId(layer.id);
    }
  };

  const handleLayerDelete = async (layerId: string) => {
    const deletedAnnotations = annotations.filter((a) => a.layer_id === layerId);
    for (const annotation of deletedAnnotations) {
      await canvasService.deleteAnnotation(annotation.id);
    }

    await canvasService.deleteLayer(layerId);

    const remainingLayers = layers.filter((l) => l.id !== layerId);
    setLayers(remainingLayers);
    setAnnotations((prev) => prev.filter((a) => a.layer_id !== layerId));

    if (activeLayerId === layerId) {
      setActiveLayerId(remainingLayers[0]?.id || null);
    }
  };

  const handleLayerToggleVisibility = async (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;

    await canvasService.updateLayer(layerId, { visible: !layer.visible });
    setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l)));
  };

  const handleLayerToggleLock = async (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;

    await canvasService.updateLayer(layerId, { locked: !layer.locked });
    setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, locked: !l.locked } : l)));
  };

  const handleLayerRename = async (layerId: string, name: string) => {
    await canvasService.updateLayer(layerId, { name });
    setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, name } : l)));
  };

  const allViews: ImageView[] =
    imageViews.length > 0 ? imageViews : [{ angle: 'frontal', url: imageUrl, label: 'Frontal' }];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col font-sans">
      <CanvasTopBar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onTogglePan={handleTogglePan}
        onClearCanvas={handleClearCanvas}
        onSave={handleSave}
        onExport={handleExport}
        canUndo={canUndo}
        canRedo={canRedo}
        isPanning={isPanning}
        zoom={zoom}
        saving={saving}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <CanvasToolbar selectedTool={selectedTool} onToolSelect={handleToolSelect} />

        <ToolPropertiesPanel
          properties={toolProperties}
          onPropertiesChange={setToolProperties}
          visible={showProperties}
        />

        <main className="flex-1 bg-slate-100 relative flex flex-col overflow-hidden">
          <div
            ref={containerRef}
            className="flex-1 flex items-center justify-center p-8 relative cursor-crosshair overflow-auto"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <canvas ref={canvasRef} className="shadow-xl border border-slate-200 bg-white" />
          </div>

          <ThumbnailsBar views={allViews} currentViewAngle={currentViewAngle} onViewChange={setCurrentViewAngle} />
        </main>

        <LayersPanel
          layers={layers}
          activeLayerId={activeLayerId}
          onLayerSelect={setActiveLayerId}
          onLayerAdd={handleLayerAdd}
          onLayerDelete={handleLayerDelete}
          onLayerToggleVisibility={handleLayerToggleVisibility}
          onLayerToggleLock={handleLayerToggleLock}
          onLayerRename={handleLayerRename}
        />
      </div>
    </div>
  );
};
