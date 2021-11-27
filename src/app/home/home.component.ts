import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EditDialogComponent } from '../dialog/edit-dialog/edit-dialog.component';
import { IAdmin } from '../interface/i-admin';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  public displayColumns: string[] = ['select', 'name', 'email', 'role', 'action'];

  public constructor(private dataService: DataService, public dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) { }
  public data: any;
  public selection = new SelectionModel<IAdmin>(true, []);
  public dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public ngOnInit(): void {
    this.dataService.getAdminData().subscribe(res => {
      this.data = res.body;
      this.dataSource = new MatTableDataSource<IAdmin>(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  public masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  public checkboxLabel(row?: IAdmin): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  public deleteRow(id: string) {
    console.log(id);
    const index = this.dataSource.filteredData.findIndex((el: any) => el.id === id)
    if (index > -1) {
      this.dataSource.filteredData.splice(index, 1);
    }
    this.dataSource._updateChangeSubscription();
  }

  public applyFilter(event: any) {
    let filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public editRow(id: string) {
    var selectedRecord = this.dataSource.filteredData.filter((x: any) => x.id === id)
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '600px',
      data: { message: "Edit Selected Row", rowData: selectedRecord }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event) {
      }
    });
  }

  public OnDeleteClick(selection: any) {
    for (let j = 0; j < selection.length; j++) {
      const index = this.dataSource.filteredData.findIndex((el: any) => el.id === selection[j].id)
      if (index > -1) {
        this.dataSource.filteredData.splice(index, 1);
      }
    }
    this.selection.clear();
    this.dataSource._updateChangeSubscription();

  }

  public enableButton() {
    if (this.selection.selected.length !== 0) {
      return false;
    }
    else {
      return true
    }
  }

  public announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}


