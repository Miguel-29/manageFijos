import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { Item } from '../../services/item';
import { objDialogInto } from '../../interfaces/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Dialog } from '../../services/dialog';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-dialog',
  imports: [FormsModule, MatSelectModule, MatButtonModule, MatIconModule, MatDialogModule, MatLabel, MatFormField, ReactiveFormsModule, MatInputModule, CommonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class DialogComp {
  form: FormGroup;
  formCopyPaste: FormGroup;
  listParents: any[] = [];
  listTypes: string[] = ['contenedor', 'item'];
  loading: boolean = false;
   searchParent = '';
  filteredParents = [...this.listParents];

  constructor(
    private _itemService: Item,
    @Inject(MAT_DIALOG_DATA) public data: objDialogInto,
    private dialogRef: MatDialogRef<DialogComp>,
    private fb: FormBuilder,
    private _dialogService: Dialog,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: [data.node.name || "", [Validators.required]],
      description: [data.node.description || "", [Validators.required]],
      parentid: [data.node.parentid || 0],
      tags: [data.node.tags || 0, [Validators.required]],
      type: [data.node.type, [Validators.required, this.notAssignedValidator()]],
    });
    this.formCopyPaste = this.fb.group({
      parentid: [data.node.id],
    });
    this.listParents = this._itemService.listParents;
    this.filteredParents = this.listParents;
  }

  notAssignedValidator(): Validators {
    return (control: any): any => {
      const value = control.value;
      return value !== this.data.node.type && this.data.node.children.length ? { hasChildren: true } : null;
    };
  }

  close(res: any) {
    this.loading = false;
    this.dialogRef.close(res);
  }

  submit = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    // if(this.data.node.parentid !== this.form.value.parentid && this.data.node.children.length) {
    //   console.error("error diferente");
    //   return
    // }

    this.form.value.tags = Array.isArray(this.form.value.tags)
      ? this.form.value.tags
      : this.form.value.tags.split(',').map((v: string) => v.trim());


    let node = this.data.node;

    node = { ...node, ...this.form.value };

    if (this.data.createMethod) {
      this._itemService.create(node).then(res => this.close(res)).catch((err) => {
        this.loading = false;
        this.cdr.detectChanges();
      });
    } else this._itemService.update(node).then((res) => this.close(res)).catch((err) => {
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  submitCopyPaste() {
    if (this.formCopyPaste.invalid) {
      this.formCopyPaste.markAllAsTouched();
      return;
    }

    this.loading = true;

    this._itemService.masiveUpdate(this.data.node, this.formCopyPaste.value.parentid).then((res) => this.close(res)).catch((err) => {
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

 

  filterParents() {
    const term = this.searchParent.toLowerCase();

    this.filteredParents = this.listParents.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }
}