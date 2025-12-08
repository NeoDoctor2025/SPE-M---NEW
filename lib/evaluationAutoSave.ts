import { supabase } from './supabase';
import { EvaluationStepData } from '../types/evaluationTypes';

export interface EvaluationDraft {
  id: string;
  patient_id: string;
  name: string;
  date: string;
  status: 'Draft' | 'Completed';
  type: string;
  current_step: number;
  step1_data?: any;
  step2_data?: any;
  step3_data?: any;
  step4_data?: any;
  step5_data?: any;
  step6_data?: any;
  step7_data?: any;
  step8_data?: any;
  photos?: Array<{ step: number; url: string; uploaded_at: string }>;
}

export const evaluationAutoSave = {
  async createDraft(patientId: string, patientName: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('evaluations')
        .insert({
          user_id: user.id,
          patient_id: patientId,
          name: 'Avaliação Facial em Progresso',
          date: new Date().toISOString().split('T')[0],
          status: 'Draft',
          type: 'Dermatology',
          current_step: 1,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating draft:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error creating draft:', error);
      return null;
    }
  },

  async loadDraft(patientId: string): Promise<EvaluationDraft | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('patient_id', patientId)
        .eq('status', 'Draft')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) {
        console.error('Error loading draft:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  },

  async saveStep(
    evaluationId: string,
    step: number,
    data: any
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('evaluations')
        .update({
          [`step${step}_data`]: data,
          current_step: step,
        })
        .eq('id', evaluationId);

      if (error) {
        console.error('Error saving step:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving step:', error);
      return false;
    }
  },

  async finalize(
    evaluationId: string,
    score: number,
    allSteps: EvaluationStepData
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('evaluations')
        .update({
          name: 'Avaliação Facial Completa',
          status: 'Completed',
          score: score,
          step1_data: allSteps.step1,
          step2_data: allSteps.step2,
          step3_data: allSteps.step3,
          step4_data: allSteps.step4,
          step5_data: allSteps.step5,
          step6_data: allSteps.step6,
          step7_data: allSteps.step7,
          step8_data: allSteps.step8,
          current_step: 8,
        })
        .eq('id', evaluationId);

      if (error) {
        console.error('Error finalizing evaluation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error finalizing evaluation:', error);
      return false;
    }
  },

  async addPhoto(
    evaluationId: string,
    step: number,
    photoUrl: string
  ): Promise<boolean> {
    try {
      const { data: evaluation, error: fetchError } = await supabase
        .from('evaluations')
        .select('photos')
        .eq('id', evaluationId)
        .single();

      if (fetchError) {
        console.error('Error fetching evaluation:', fetchError);
        return false;
      }

      const photos = evaluation.photos || [];
      photos.push({
        step,
        url: photoUrl,
        uploaded_at: new Date().toISOString(),
      });

      const { error: updateError } = await supabase
        .from('evaluations')
        .update({ photos })
        .eq('id', evaluationId);

      if (updateError) {
        console.error('Error adding photo:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding photo:', error);
      return false;
    }
  },

  async uploadPhoto(
    file: File,
    userId: string,
    evaluationId: string
  ): Promise<string | null> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `${userId}/${evaluationId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('evaluation-photos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('evaluation-photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  },

  async deleteDraft(evaluationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('evaluations')
        .delete()
        .eq('id', evaluationId);

      if (error) {
        console.error('Error deleting draft:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      return false;
    }
  },
};
