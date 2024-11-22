import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';


interface Column {
  field: string;
  header: string;
}
@Component({
  selector: 'app-smart-table',
  standalone: true,
  imports: [MatTableModule, TableModule, InputTextModule, CommonModule,PaginatorModule ,MultiSelectModule],
  templateUrl: './smart-table.component.html',
  styleUrl: './smart-table.component.css',
  styles: [
    `:host ::ng-deep .p-cell-editing {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }`,
  ],
})

export class SmartTableComponent implements OnInit{


  cols: Column[]=[];
  _selectedColumns: Column[]=[];

  title = 'employee-leave-man';

  cars = [
    { vin: 'A1234', year: 2020, brand: 'Toyota' },
    { vin: 'B5678', year: 2021, brand: 'Honda' },
    { vin: 'C9101', year: 2019, brand: 'Ford' },
    { vin: 'D1121', year: 2022, brand: 'Chevrolet' },
    { vin: 'E3141', year: 2023, brand: 'Tesla' },
  ];

  products = [
    { code: 'P001', name: 'Laptop', quantity: 50, price: 1000,column1: 'Value 1',
      column2: 'Value 2',
      column3: 'Value 3',
      column4: 'Value 4',
      column5: 'Value 5',
      column6: 'Value 6',
      column7: 'Value 7',
      column8: 'Value 8',
      column9: 'Value 9',
      column10: 'Value 10',
      column11: 'Value 11',
      column12: 'Value 12',
      column13: 'Value 13', },
    { code: 'P002', name: 'Mobile Phone', quantity: 200, price: 500,column1: 'Value 1',
      column2: 'Value 2',
      column3: 'Value 3',
      column4: 'Value 4',
      column5: 'Value 5',
      column6: 'Value 6',
      column7: 'Value 7',
      column8: 'Value 8',
      column9: 'Value 9',
      column10: 'Value 10',
      column11: 'Value 11',
      column12: 'Value 12',
      column13: 'Value 13', },
    { code: 'P003', name: 'Tablet', quantity: 100, price: 300 ,column1: 'Value 1',
      column2: 'Value 2',
      column3: 'Value 3',
      column4: 'Value 4',
      column5: 'Value 5',
      column6: 'Value 6',
      column7: 'Value 7',
      column8: 'Value 8',
      column9: 'Value 9',
      column10: 'Value 10',
      column11: 'Value 11',
      column12: 'Value 12',
      column13: 'Value 13'},
    { code: 'P004', name: 'Monitor', quantity: 150, price: 200,column1: 'Value 1',
      column2: 'Value 2',
      column3: 'Value 3',
      column4: 'Value 4',
      column5: 'Value 5',
      column6: 'Value 6',
      column7: 'Value 7',
      column8: 'Value 8',
      column9: 'Value 9',
      column10: 'Value 10',
      column11: 'Value 11',
      column12: 'Value 12',
      column13: 'Value 13', },
    { code: 'P005', name: 'Keyboard', quantity: 300, price: 50 ,column1: 'Value 1',
      column2: 'Value 2',
      column3: 'Value 3',
      column4: 'Value 4',
      column5: 'Value 5',
      column6: 'Value 6',
      column7: 'Value 7',
      column8: 'Value 8',
      column9: 'Value 9',
      column10: 'Value 10',
      column11: 'Value 11',
      column12: 'Value 12',
      column13: 'Value 13',},
    { code: 'P006', name: 'Keyboardd', quantity: 300, price: 50 ,column1: 'Value 1',
      column2: 'Value 2',
      column3: 'Value 3',
      column4: 'Value 4',
      column5: 'Value 5',
      column6: 'Value 6',
      column7: 'Value 7',
      column8: 'Value 8',
      column9: 'Value 9',
      column10: 'Value 10',
      column11: 'Value 11',
      column12: 'Value 12',
      column13: 'Value 13',},
  ];
  ngOnInit() {

    // No need to fetch products, using mock data
    this.cols = [
      { field: 'code', header: 'Personal Registration Number' },
      { field: 'name', header: 'First Name' },
      { field: 'quantity', header: 'Father Name' },
      { field: 'price', header: 'Last Name' },
      { field: 'column1', header: 'اسم الاول' },
      { field: 'column2', header: 'اسم الأب' },
      { field: 'column3', header: 'اسم العائلة' },
      { field: 'column4', header: 'Gender' },
      { field: 'column5', header: 'Age' },
      { field: 'column6', header: 'Nationality' },
      { field: 'column7', header: 'phone' },
      { field: 'column8', header: 'number' },
      { field: 'column9', header: 'Email' },
      { field: 'column10', header: 'Area' },
      { field: 'column11', header: 'Major' },
      { field: 'column12', header: 'Education Level' },
    ];

  this._selectedColumns = this.cols;

  }

  onEdit(event: any) {
    if (!this.isPositiveInteger(event.target.value)) {
      event.stopPropagation();
    }
  }

  isPositiveInteger(val: string): boolean {
    let str = String(val).trim();
    if (!str) {
      return false;
    }



    str = str.replace(/^0+/, '') || '0';
    const n = Math.floor(Number(str));

    return n !== Infinity && String(n) === str && n >= 0;
  }
  paginatedProducts: any[] = [];

  paginate(event: any) {
    const { first, rows } = event;
    this.paginatedProducts = this.products.slice(first, first + rows);
  }
  selectedColumns: string[] = ['code', 'name', 'quantity', 'price', 'column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10', 'column11', 'column12'];

}
