import { Injectable } from '@angular/core';
import { from, Observable, of, tap } from 'rxjs';
import { Item } from './item';
import { item } from '../interfaces/common';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, item[]>();

  constructor(
    private _itemService: Item
  ) {}

  getAssets(): Observable<item[]> {
    let data = this.getCache() || this.getLocalStorage();

    if (data) return of(data);

    return from(this._itemService.getAll()).pipe(
      tap(res => {
        this.cache.set('assets', res);
        localStorage.setItem('assets', JSON.stringify(res));
      })
    );
  }

  getCache(): item[] | null {
    const key = 'assets';

    return this.cache.get(key) || null;
  }

  getLocalStorage(): item[] | null {
    const stored = localStorage.getItem('assets');
    
    return stored ? JSON.parse(stored) : null;
  }
}
