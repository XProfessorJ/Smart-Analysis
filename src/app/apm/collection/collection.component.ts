import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenav } from '@angular/material/sidenav';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SearchComponent } from '../../component';
import { CollectionService } from './collection.service';

@Component({
  selector: 'apm-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  displayedColumns: string[] = [
    'url',
    'method',
    'duration',
    'decoded_body_size',
    'options',
    'call_url',
    'create_time'
  ];
  dataSource: any = new MatTableDataSource([]);

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  devicesDataSource = [];
  eventDataSource = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSidenav, { static: true }) sidenav: MatSidenav;
  @ViewChild(SearchComponent, { static: true }) search: SearchComponent;

  body_size = 0;
  count = 0;
  duration = '0';

  // chart
  dataChart: any = [];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private service: CollectionService, private datePipe: DatePipe) { }

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
          this.resultsLength = 40;
          return data.data.datalist;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.dataSource = data;

        data.map(d => {
          this.dataChart.push({
            name: this.datePipe.transform(d.create_time, 'yyyy-MM-dd hh:mm:ss'),
            value: d.duration
          });
        });
      });

    this.service.getCount().subscribe(res => {
      this.body_size = res.data.body_size;
      this.count = res.data.count;
      this.duration = parseFloat(res.data.duration).toFixed(2);
    });
  }

  onRowClicked(row) {
    this.sidenav.open();

    this.eventDataSource = [
      {
        name: 'AJAX??????',
        value: row.call_url
      },
      {
        name: '????????????',
        value: row.duration
      },
      {
        name: '????????????',
        value: row.method
      },
      {
        name: '????????????',
        value: row.options
      },
      {
        name: '????????????',
        value: row.speed_type
      },
      {
        name: 'body??????',
        value: row.decoded_body_size
      },
      {
        name: '??????URL',
        value: row.url
      },
      {
        name: '??????URL',
        value: row.full_url
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

  onSearchTriggered(event) { }
}
