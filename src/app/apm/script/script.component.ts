import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenav } from '@angular/material/sidenav';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SearchComponent } from '../../component';
import { ScriptService } from './script.service';

@Component({
  selector: 'apm-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.scss']
})
export class ScriptComponent implements OnInit {
  displayedColumns: string[] = [
    'resource_url',
    'category',
    'fullurl',
    'line',
    'col',
    'method',
    'msg',
    'create_time'
  ];

  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel(true, []);

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  devicesDataSource = [];
  eventDataSource = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSidenav, { static: true }) sidenav: MatSidenav;
  @ViewChild(SearchComponent, { static: true }) search: SearchComponent;

  constructor(private service: ScriptService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.search.onSearch.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.search.onSearch, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(search => {
          return this.service.getList(this.paginator.pageIndex, search);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.data.totalNum;
          return data.data.datalist;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.dataSource = data));
  }

  //
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onRowClicked(row) {
    this.selection.toggle(row);
    this.sidenav.open();

    this.eventDataSource = [
      {
        name: '????????????',
        value: row.resource_url
      },
      {
        name: '????????????',
        value: row.line
      },
      {
        name: '????????????',
        value: row.col
      },
      {
        name: '????????????',
        value: row.msg
      },
      {
        name: '????????????',
        value: row.category
      },
      {
        name: '????????????',
        value: this.datePipe.transform(row.create_time, 'yyyy-MM-dd hh:mm:ss')
      }
    ];

    this.devicesDataSource = [
      {
        name: 'IP??????',
        value: ''
      },
      {
        name: '????????????',
        value: ''
      },
      {
        name: '?????????',
        value: ''
      },
      {
        name: '????????????',
        value: ''
      },
      {
        name: 'language',
        value: ''
      },
      {
        name: 'userAgent',
        value: ''
      }
    ];
  }
}
