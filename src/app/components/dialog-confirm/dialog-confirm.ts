import {ChangeDetectionStrategy, Component, Inject, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { messageConfirm } from '../../interfaces/common';

@Component({
  selector: 'app-dialog-confirm',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog-confirm.html',
  styleUrl: './dialog-confirm.scss',
})
export class DialogConfirm {
  // readonly dialog = inject(MatDialog);

  constructor(private dialogRef: MatDialogRef<DialogConfirm>, @Inject(MAT_DIALOG_DATA) public data: messageConfirm) {}

  close() {
    this.dialogRef.close();
  }
}
