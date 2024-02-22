import { Component, OnInit, ViewChild } from '@angular/core';

import { CountriesService } from '../../services/countries.service';
import { Country } from '../../models/country.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.css'],
})
export class CountriesListComponent {

  country_DATA: Country[] = [];
  displayedColumns = ['name', 'capital', 'currency', 'emoji', 'phone', 'actions'];
  dataSource = new MatTableDataSource<Country>();

  index: number | any;
  id: number | any;
  //exampleDatabase: DataService | null;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  constructor(private countriesService: CountriesService, public dialogService: MatDialog,) { }
  ngOnInit(): void {
    this.pageLoad();
    this.dataSource.sort = this.sort;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  pageLoad(): void {
      
    this.countriesService.getCountries().subscribe(data => {      
      this.country_DATA = data;
      this.dataSource.data = this.country_DATA;
    }, (err => {
         console.log(err);
    }));
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  openAddDialog() {
    const dialogRef = this.dialogService.open(AddDialogComponent, {
      data: { issue: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
        this.refreshTable();
     
    });
  }

  startEdit(i: number, name: string, capital: string, currency: string, emoji: string, phone: string) {

    
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialogService.open(EditDialogComponent, {
      data: { id: i, name: name, capital: capital, currency: currency, emoji: emoji, phone: phone }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshTable();
    });
  }

  deleteItem(i: number,name: string) {
    this.index = i;
    const dialogRef = this.dialogService.open(DeleteDialogComponent, {
      data: { id: i, name: name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.countriesService.dataChange.value.findIndex(x => x.name === name);
        // for delete we use splice in order to remove single object from DataService
        this.countriesService.dataChange.value.splice(foundIndex, 1);
        //this.refreshTable();
      }
      this.refreshTable();
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

}

