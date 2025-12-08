export type ToolType = 'pointer' | 'line' | 'circle' | 'arrow' | 'measurement' | 'text' | 'freehand' | 'eraser';

export type AnnotationType = 'line' | 'circle' | 'arrow' | 'text' | 'freehand' | 'measurement' | 'eraser';

export type ViewAngle = 'frontal' | 'perfil-esquerdo' | 'perfil-direito' | 'superior' | 'inferior';

export interface Point {
  x: number;
  y: number;
}

export interface LineData {
  start: Point;
  end: Point;
}

export interface CircleData {
  center: Point;
  radiusX: number;
  radiusY: number;
}

export interface ArrowData {
  start: Point;
  end: Point;
}

export interface TextData {
  position: Point;
  text: string;
  fontSize: number;
}

export interface FreehandData {
  points: Point[];
}

export interface MeasurementData {
  start: Point;
  end: Point;
  distance: number;
}

export type AnnotationData = LineData | CircleData | ArrowData | TextData | FreehandData | MeasurementData;

export interface Annotation {
  id: string;
  layer_id: string;
  evaluation_id: string;
  user_id: string;
  type: AnnotationType;
  data: AnnotationData;
  color: string;
  thickness: number;
  opacity: number;
  view_angle: ViewAngle;
  created_at: string;
  updated_at: string;
}

export interface AnnotationLayer {
  id: string;
  evaluation_id: string;
  user_id: string;
  name: string;
  order: number;
  visible: boolean;
  locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface CanvasHistory {
  id: string;
  evaluation_id: string;
  user_id: string;
  action_type: 'create' | 'update' | 'delete';
  entity_type: 'annotation' | 'layer';
  entity_id: string;
  before_state: any;
  after_state: any;
  created_at: string;
}

export interface ToolProperties {
  color: string;
  thickness: number;
  opacity: number;
}

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  selectedTool: ToolType;
  toolProperties: ToolProperties;
  activeLayerId: string | null;
  currentViewAngle: ViewAngle;
}

export interface ImageView {
  angle: ViewAngle;
  url: string;
  label: string;
}

export const SURGICAL_BLUE = '#0066FF';
export const ARTERIAL_RED = '#FF0000';
export const CLINICAL_GREEN = '#00CC00';
export const DARK_GRAY = '#333333';

export const DEFAULT_COLORS = [
  { name: 'Azul Cirúrgico', value: SURGICAL_BLUE },
  { name: 'Vermelho Arterial', value: ARTERIAL_RED },
  { name: 'Verde', value: CLINICAL_GREEN },
  { name: 'Cinza Escuro', value: DARK_GRAY },
];

export const THICKNESS_OPTIONS = [
  { label: 'Fina', value: 1 },
  { label: 'Média', value: 2 },
  { label: 'Grossa', value: 4 },
];
