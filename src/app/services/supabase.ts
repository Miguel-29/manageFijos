import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://lrrupkzavchttofntfpl.supabase.co';
    const supabaseKey = 'sb_publishable_fdT0ZCZVQ98wbwTpOXz1dQ_ScvYLW6I'; // Puedes usar anon key para front
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Ejemplo: obtener assets
  async getAssets() {
    const { data, error } = await this.supabase
      .from('assets')
      .select('*');
    if (error) {
      console.error('Error al obtener assets:', error);
      return [];
    }
    return data;
  }

  // Ejemplo: insertar asset
  async addAsset(asset: any) {
    const { data, error } = await this.supabase
      .from('assets')
      .insert([asset]);
    if (error) {
      console.error('Error al insertar asset:', error);
      return null;
    }
    return data;
  }
}