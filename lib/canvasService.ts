import { supabase } from './supabase';
import type { Annotation, AnnotationLayer, CanvasHistory, AnnotationData, ViewAngle } from '../types/canvasTypes';

export const canvasService = {
  async createLayer(evaluationId: string, name: string = 'Nova Camada'): Promise<AnnotationLayer | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: existingLayers } = await supabase
      .from('annotation_layers')
      .select('order')
      .eq('evaluation_id', evaluationId)
      .order('order', { ascending: false })
      .limit(1);

    const nextOrder = existingLayers && existingLayers.length > 0 ? existingLayers[0].order + 1 : 0;

    const { data, error } = await supabase
      .from('annotation_layers')
      .insert({
        evaluation_id: evaluationId,
        user_id: user.id,
        name,
        order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating layer:', error);
      return null;
    }

    return data;
  },

  async getLayers(evaluationId: string): Promise<AnnotationLayer[]> {
    const { data, error } = await supabase
      .from('annotation_layers')
      .select('*')
      .eq('evaluation_id', evaluationId)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching layers:', error);
      return [];
    }

    return data || [];
  },

  async updateLayer(layerId: string, updates: Partial<AnnotationLayer>): Promise<boolean> {
    const { error } = await supabase
      .from('annotation_layers')
      .update(updates)
      .eq('id', layerId);

    if (error) {
      console.error('Error updating layer:', error);
      return false;
    }

    return true;
  },

  async deleteLayer(layerId: string): Promise<boolean> {
    const { error } = await supabase
      .from('annotation_layers')
      .delete()
      .eq('id', layerId);

    if (error) {
      console.error('Error deleting layer:', error);
      return false;
    }

    return true;
  },

  async createAnnotation(
    layerId: string,
    evaluationId: string,
    type: string,
    data: AnnotationData,
    color: string,
    thickness: number,
    opacity: number,
    viewAngle: ViewAngle
  ): Promise<Annotation | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: annotation, error } = await supabase
      .from('annotations')
      .insert({
        layer_id: layerId,
        evaluation_id: evaluationId,
        user_id: user.id,
        type,
        data,
        color,
        thickness,
        opacity,
        view_angle: viewAngle,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating annotation:', error);
      return null;
    }

    return annotation;
  },

  async getAnnotations(evaluationId: string, viewAngle?: ViewAngle): Promise<Annotation[]> {
    let query = supabase
      .from('annotations')
      .select('*')
      .eq('evaluation_id', evaluationId);

    if (viewAngle) {
      query = query.eq('view_angle', viewAngle);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching annotations:', error);
      return [];
    }

    return data || [];
  },

  async updateAnnotation(annotationId: string, updates: Partial<Annotation>): Promise<boolean> {
    const { error } = await supabase
      .from('annotations')
      .update(updates)
      .eq('id', annotationId);

    if (error) {
      console.error('Error updating annotation:', error);
      return false;
    }

    return true;
  },

  async deleteAnnotation(annotationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('annotations')
      .delete()
      .eq('id', annotationId);

    if (error) {
      console.error('Error deleting annotation:', error);
      return false;
    }

    return true;
  },

  async addToHistory(
    evaluationId: string,
    actionType: 'create' | 'update' | 'delete',
    entityType: 'annotation' | 'layer',
    entityId: string,
    beforeState: any,
    afterState: any
  ): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('canvas_history')
      .insert({
        evaluation_id: evaluationId,
        user_id: user.id,
        action_type: actionType,
        entity_type: entityType,
        entity_id: entityId,
        before_state: beforeState,
        after_state: afterState,
      });

    if (error) {
      console.error('Error adding to history:', error);
      return false;
    }

    return true;
  },

  async getHistory(evaluationId: string, limit: number = 50): Promise<CanvasHistory[]> {
    const { data, error } = await supabase
      .from('canvas_history')
      .select('*')
      .eq('evaluation_id', evaluationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching history:', error);
      return [];
    }

    return data || [];
  },
};
