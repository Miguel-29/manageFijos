import {  inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComp } from '../components/dialog/dialog';
import { objDialogInto, messageConfirm } from '../interfaces/common';
import { DialogConfirm } from '../components/dialog-confirm/dialog-confirm';

@Injectable({
  providedIn: 'root',
})
export class Dialog {
  private dialog = inject(MatDialog);

  open(objDialogInto: objDialogInto) {    
    return this.dialog.open(DialogComp, {
      width: '400px',
      data: objDialogInto,
      disableClose: true
    }).afterClosed();
  }

  confirm(objDialogInto: messageConfirm) {  
    console.log(objDialogInto);
      
    return this.dialog.open(DialogConfirm, {
      width: '400px',
      data: objDialogInto,
      disableClose: true
    }).afterClosed();
  }
}
