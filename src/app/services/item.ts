import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { promises } from 'dns';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { item } from '../interfaces/common';
import { Supabase } from './supabase';
import { createClient, PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { Messages } from './messages';
import { PostgrestBuilder, PostgrestFilterBuilder } from '@supabase/postgrest-js';

@Injectable({
  providedIn: 'root',
})
export class Item {
  private supabase: SupabaseClient;
  private _assetsFromDB: item[] = [];

  get assetsFromDB(): item[] {
    return this._assetsFromDB;
  }

  set assetsFromDB(value: item[]) {
    this._assetsFromDB = value;
  }

  private baseUrl = `${environment.apiUrl}/assets`;
  listParents: any[] = [];

  private updateSubject = new BehaviorSubject<any>(null);
  update$ = this.updateSubject.asObservable();

  constructor(private _Messages: Messages) {
    const supabaseUrl = 'https://lrrupkzavchttofntfpl.supabase.co';
    const supabaseKey = 'sb_publishable_fdT0ZCZVQ98wbwTpOXz1dQ_ScvYLW6I'; // Puedes usar anon key para front
    this.supabase = createClient(supabaseUrl, supabaseKey);

    if (!this.listParents.length) {
      this.getListParents();
    }

    this.update$.subscribe(updated => {
      if (updated) {
        this.getListParents();
      }
    });
  }

  private getListParents() {
    this.getParents().then((res: any) => {
      this.listParents = res;
    });
  }

  private async getParents() {
    const { data, error } = await this.supabase.from('assets').select('*').eq('type', 'contenedor');

    if (error) {
      console.error('Error cargando padres', error);
      this.assetsFromDB = [];
      throw error;
    }

    return data;
  }

  private buildTree(list: item[], parentid = 0): item[] {

  return list
    .filter(item => item.parentid === parentid && item.stateactive)
    .sort((a, b) => {

      // const aHas = a.sortPersonalizado != null;
      // const bHas = b.sortPersonalizado != null;

      // ambos tienen sortPersonalizado
      // if (aHas && bHas) {
      //   return a.sortPersonalizado - b.sortPersonalizado;
      // }

      // solo uno tiene -> ese va primero
      // if (aHas) return -1;
      // if (bHas) return 1;

      // ninguno tiene -> ordenar por nombre
      return a.name.localeCompare(b.name);
    })
    .map(item => ({
      ...item,
      children: this.buildTree(list, item.id),
    }));
}

  async loadAssets(): Promise<void> {
    const data: item[] = await this.runQuery(
      this.supabase
        .from('assets')
        .select('*')
    );

    this.assetsFromDB = data.map(item => {
      return {
        ...item, stateactive: item.stateactive
      }
    }) || [];
  }

  async getAll(): Promise<item[]> {
    await this.loadAssets();
    return this.buildTree(this.assetsFromDB);
  }

  async getById(id: number): Promise<item | null> {
    const data: item = await this.runQuery(
      this.supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .single()
    );

    return data;
  }

  async create(asset: Partial<item>): Promise<item | null> {
    const { id, children, ...assetsNoId } = asset;

    const data: item = await this.runQuery(
      this.supabase
        .from('assets')
        .insert([{ ...assetsNoId, stateactive: true, }])
        .select()
        .single()
    );

    this.updateSubject.next(data);
    return data!;
  }

  async update(asset: Partial<item>): Promise<item | null> {
    const {children, id, ...assetWithoutChildren} = asset;

    const data: item = await this.runQuery(
      this.supabase
        .from('assets')
        .update(assetWithoutChildren)
        .eq('id', id)
        .select()
        .single()
    );

    // Actualizar en cache local
    this.updateSubject.next(data);
    return data!;
  }

  async masiveUpdate(asset: Partial<item>, newParentId: number): Promise<item[] | null> {
    const data: item[] = await this.runQuery(
      this.supabase
        .from('assets')
        .update({ parentid: newParentId })
        .eq('parentid', asset.id)
        .select()
    );

    // Actualizar en cache local
    this.updateSubject.next(data);
    return data!;
  }

  async remove(id: number): Promise<item | null> {
    try {
      const data: item = await this.runQuery(
        this.supabase.
          from('assets')
          .update({ stateactive: false })
          .eq('id', id)
          .select()
          .single()
      );
      
      // Actualizar en cache local
      this.updateSubject.next(data);
      return data!;
    } catch (error) {
      throw error;
    }
  }

  async runQuery(query: any) {
    try {
      const { data, error } = await query;

      if (error) {
        this._Messages.openSnackBar(`Error ${error.message}`, "Entendido", "error");
        throw error;
      }

      return data;
    } catch (err: any) {
      this._Messages.openSnackBar(`Error ${err.message}`, "Entendido", "error");
      console.error(err);
      throw err;
    }
  }







  // getAll(): Observable<any> {
  //   this._Supabase.getAssets()
  //   return this.http.get(this.baseUrl);
  // }

  // getParents(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/listParents`);
  // } 

  // updateItem(node: item): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${node.id}`, node)
  //     .pipe(
  //       tap(res => {
  //         this.updateSubject.next(res);
  //       })
  //     );    
  // }

  // createItem(node: Omit<item, 'id'>): Observable<any> {
  //     return this.http.post(`${this.baseUrl}`, node)
  //     .pipe(
  //       tap(res => {
  //         this.updateSubject.next(res);
  //       })
  //     );  
  // }

  // deleteItem(node: item): Observable<any> {
  //     return this.http.delete(`${this.baseUrl}/${node.id}`)
  //     .pipe(
  //       tap(res => {
  //         this.updateSubject.next(res);
  //       })
  //     );  
  // }
}
