import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Dialog } from '../../services/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { Item } from '../../services/item';
import { item } from '../../interfaces/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Supabase } from '../../services/supabase';
import { Messages } from '../../services/messages';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-home',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatExpansionModule,
    CommonModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home {
  online: boolean = true;
  newNode: item = {
    id: 9999,
    description: "",
    name: "",
    children: [],
    parentid: 0,
    tags: [],
    type: "item",
    stateactive: true
  }
  displayedColumns: string[] = ['id', 'name', 'description']
  filterText = '';
  dataSource = new MatTreeNestedDataSource<item>();
  initDataSource: item[] = [];
  treeControl = new NestedTreeControl<any>(node => node.children)
  private dialogService = inject(Dialog);
  hasChild = (_: number, node: any) => !!node.children && node.children.length

  constructor(
    private _itemService: Item,
    private _Messages: Messages,
    private _cacheService: CacheService,
  ) { }

  ngOnInit() {
    this._itemService.update$.subscribe(updated => {
      if (updated) {
        this.getListItems();
      }
    });
    this.getListItems();

    if(window) {
      window.addEventListener('online', () => this.online = true);
      window.addEventListener('offline', () => this.online = false);
    }
  }

  async getListItems(notify = false) {    
    this._cacheService.getAssets().subscribe(res => {
      console.log("cambio", res);
      if(notify) this._Messages.openSnackBar("Articulos recargados", "Entendido", "success");
      this.initDataSource = res;
      this.dataSource.data = res;
    });
  }

  filteredItems(e: any) {
    const filter = e.target.value;
    const filteredTree = this.filterTree(this.initDataSource, filter);

    this.dataSource.data = filteredTree;

    // this.treeControl.expandAll();
  }

  filterTree(nodes: item[], filter: string): item[] {
    if (!filter) {
      return nodes;
    }

    filter = filter.toLowerCase();

    return nodes
      .map(node => {
        const children = node.children
          ? this.filterTree(node.children, filter)
          : [];
        const matches =
          node.name.toLowerCase().includes(filter) ||
          node.tags.some(tag => tag.toLowerCase().includes(filter));
        if (matches || children.length) {
          return {
            // revisar para que tambien de hijos
            ...node,
            children
          };
        }
        return null;
      })
      .filter(Boolean) as item[];
  }

  editContent(e: MouseEvent, node: item, createMethod: boolean) {
    e.stopPropagation();
    this.dialogService.open({ node: node, createMethod: createMethod })
      .subscribe(result => {
        if (result) {
          this._Messages.openSnackBar("Articulo actualizado correctamente", "Entendido", "success");
        }
      });
  }

  copyContent(e: MouseEvent, node: item) {
    e.stopPropagation();
    this.dialogService.confirm({ text: "Seguro de mover items?", title: "Mover articulos" })
      .subscribe(result => {
        if (result) {
          this.dialogService.open({ node: node, formCopyPaste: true })
            .subscribe(result => {
              if (result) {
                this._Messages.openSnackBar("Articulos movidos con exito", "Entendido", "success");
              }
            });
        }
      });

  }

  removeItem(e: MouseEvent, node: item) {
    e.stopPropagation();
    if (node.children.length) {
      this._Messages.openSnackBar("Tiene hijos, primero limpiar el contenedor", "Entendido", "warning");
      return;
    }
    this.dialogService.confirm({ text: "Seguro de elimarlo?", title: "Eliminar articulo" })
      .subscribe(result => {
        if (result) {
          this._itemService.remove(node.id).then(res => {
            if(res) {
              this._Messages.openSnackBar("Articulo eliminado correctamente", "Entendido", "success");
            }
          });
        }
      });
  }

  refreshItems = () => {
    this.initDataSource = [];
    this.dataSource.data = [];
    this.getListItems(true);
  }
}
