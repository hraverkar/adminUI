import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  public dataRow;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataRow = data.rowData[0];
  }

  public dialogForm = new FormGroup({
    email: new FormControl(),
    name: new FormControl(),
    role: new FormControl()
  });

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close({event:false});
  }

  onSave(): void {
    let updateValue = this.dialogForm.value;
    this.dialogRef.close({event:true,data:updateValue});
  }
}
