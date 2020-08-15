import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject, Component } from '@angular/core';

@Component({
    selector: 'confirm-dialog',
    templateUrl: 'confirm-dialog.html',
  })
  export class ConfirmDialog {
  
    constructor(
      public dialogRef: MatDialogRef<ConfirmDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }

  export interface DialogData {
    name: string;
  }