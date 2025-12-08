/*
  # Canvas Cirúrgico - Sistema de Anotações

  ## Resumo
  Cria o sistema completo de anotações para o Canvas Cirúrgico, incluindo camadas, 
  anotações individuais e configurações de visualização.

  ## 1. Novas Tabelas
  
  ### `annotation_layers`
  Gerencia as camadas de anotação para cada avaliação
  - `id` (uuid, primary key) - ID único da camada
  - `evaluation_id` (uuid, foreign key) - Referência à avaliação
  - `user_id` (uuid, foreign key) - Proprietário da camada
  - `name` (text) - Nome da camada
  - `order` (integer) - Ordem de profundidade da camada
  - `visible` (boolean) - Se a camada está visível
  - `locked` (boolean) - Se a camada está bloqueada para edição
  - `created_at` (timestamptz) - Data de criação
  - `updated_at` (timestamptz) - Data de atualização
  
  ### `annotations`
  Armazena todas as anotações individuais
  - `id` (uuid, primary key) - ID único da anotação
  - `layer_id` (uuid, foreign key) - Camada à qual pertence
  - `evaluation_id` (uuid, foreign key) - Avaliação relacionada
  - `user_id` (uuid, foreign key) - Criador da anotação
  - `type` (text) - Tipo: line, circle, arrow, text, freehand, measurement, eraser
  - `data` (jsonb) - Dados da anotação (coordenadas, texto, propriedades)
  - `color` (text) - Cor da anotação (hex)
  - `thickness` (integer) - Espessura da linha
  - `opacity` (numeric) - Opacidade (0-1)
  - `view_angle` (text) - Ângulo de visualização (frontal, perfil, etc)
  - `created_at` (timestamptz) - Data de criação
  - `updated_at` (timestamptz) - Data de atualização

  ### `canvas_history`
  Histórico de ações para desfazer/refazer
  - `id` (uuid, primary key) - ID único do histórico
  - `evaluation_id` (uuid, foreign key) - Avaliação relacionada
  - `user_id` (uuid, foreign key) - Usuário que fez a ação
  - `action_type` (text) - Tipo de ação: create, update, delete
  - `entity_type` (text) - Tipo de entidade: annotation, layer
  - `entity_id` (uuid) - ID da entidade afetada
  - `before_state` (jsonb) - Estado antes da ação
  - `after_state` (jsonb) - Estado depois da ação
  - `created_at` (timestamptz) - Data da ação
  
  ## 2. Segurança (RLS)
  - Todas as tabelas têm RLS habilitado
  - Usuários autenticados podem gerenciar apenas suas próprias anotações
  - Verificação de propriedade através de user_id

  ## 3. Índices
  - Índices em evaluation_id para busca rápida
  - Índices em layer_id para queries eficientes
  - Índice em created_at para ordenação de histórico
*/

-- Create annotation_layers table
CREATE TABLE IF NOT EXISTS annotation_layers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id uuid NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Nova Camada',
  "order" integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  locked boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create annotations table
CREATE TABLE IF NOT EXISTS annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id uuid NOT NULL REFERENCES annotation_layers(id) ON DELETE CASCADE,
  evaluation_id uuid NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('line', 'circle', 'arrow', 'text', 'freehand', 'measurement', 'eraser')),
  data jsonb NOT NULL DEFAULT '{}',
  color text NOT NULL DEFAULT '#0066FF',
  thickness integer NOT NULL DEFAULT 2,
  opacity numeric NOT NULL DEFAULT 1.0 CHECK (opacity >= 0 AND opacity <= 1),
  view_angle text NOT NULL DEFAULT 'frontal',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create canvas_history table
CREATE TABLE IF NOT EXISTS canvas_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id uuid NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('create', 'update', 'delete')),
  entity_type text NOT NULL CHECK (entity_type IN ('annotation', 'layer')),
  entity_id uuid NOT NULL,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_annotation_layers_evaluation ON annotation_layers(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_annotation_layers_user ON annotation_layers(user_id);
CREATE INDEX IF NOT EXISTS idx_annotations_layer ON annotations(layer_id);
CREATE INDEX IF NOT EXISTS idx_annotations_evaluation ON annotations(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_annotations_user ON annotations(user_id);
CREATE INDEX IF NOT EXISTS idx_canvas_history_evaluation ON canvas_history(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_canvas_history_created ON canvas_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE annotation_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for annotation_layers
CREATE POLICY "Users can view own annotation layers"
  ON annotation_layers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own annotation layers"
  ON annotation_layers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own annotation layers"
  ON annotation_layers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own annotation layers"
  ON annotation_layers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for annotations
CREATE POLICY "Users can view own annotations"
  ON annotations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own annotations"
  ON annotations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own annotations"
  ON annotations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own annotations"
  ON annotations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for canvas_history
CREATE POLICY "Users can view own canvas history"
  ON canvas_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create canvas history entries"
  ON canvas_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_annotation_layers_updated_at ON annotation_layers;
CREATE TRIGGER update_annotation_layers_updated_at
  BEFORE UPDATE ON annotation_layers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_annotations_updated_at ON annotations;
CREATE TRIGGER update_annotations_updated_at
  BEFORE UPDATE ON annotations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();