import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})

export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: CountriesService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    
    this.dataService.deleteCountry(this.data.name);
  }
}
