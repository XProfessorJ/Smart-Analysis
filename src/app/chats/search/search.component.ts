import { AfterViewInit, Component, OnInit, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "src/api.service";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { LineChartDataModel } from "./data.line";
import { single } from "./data.pie";
export interface PeriodicElement {
  // name: string;
  // position: number;
  // weight: number;
  // symbol: string;
  executeRate: string;
  failedTestCases: number;
  fixVersion: string;
  oppmId: string;
  passRate: string;
  passedTestCases: number;
  reporter: string;
  summary: string;
  totalTestCases: number;
  userStoryId: string;
  userStoryStatus: string;
}

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
export interface DialogData {
  animal: string;
  name: string;
  task: Task;
  allComplete: boolean;
}

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "oppmId",
    "userStoryId",
    "userStoryStatus",
    "summary",
    "reporter",
    "fixVersion",
    "totalTestCases",
    "passedTestCases",
    "failedTestCases",
    "executeRate",
    "passRate",
  ];
  dataSource;
  multi: any;
  view: any[] = [1000, 500];
  viewPie: any[] = [400, 400];
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  legendPosition: string = "below";
  showXAxisLabel: boolean = true;
  yAxisLabel: string = "US";
  showYAxisLabel: boolean = true;
  xAxisLabel = "Excuetion Rate and Pass Rate";

  colorScheme = {
    domain: ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"],
  };

  colorSchemePie = {
    domain: ["#5AA454", "#E44D25", "#CFC0BB", "#7aa3e5", "#a8385d", "#aae3f5"],
  };

  schemeType: string = "linear";

  animal: string;
  name: string;
  constructor(public dialog: MatDialog, public apiService: ApiService) {}
  private profileForm = new FormGroup({
    userStory: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
    ]),
    system: new FormControl("", [Validators.required]),
    param: new FormControl("", [Validators.required]),
    number: new FormControl(""),
    // disableResult1: new FormControl(""),
    // disableResult2: new FormControl(""),
    // result1: new FormControl(""),
    // result2: new FormControl(""),
  });
  outputSelect1 = new FormControl(false);
  outputSelect2 = new FormControl(false);
  allComplete: boolean = false;

  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  onSubmit() {
    this.apiService
      .queryStatus(this.profileForm.value)
      .subscribe((res: any) => {
        this.dataSource = new ExampleDataSource(res.data.userStoryStatus);
        this.multi = new LineChartDataModel(res.data).data;
        Object.assign(this, { single });
      });
  }
  task: Task = {
    name: "Indeterminate",
    completed: false,
    color: "primary",
    subtasks: [
      { name: "Primary", completed: false, color: "primary" },
      { name: "Accent", completed: false, color: "accent" },
      { name: "Warn", completed: false, color: "warn" },
    ],
  };

  updateAllComplete() {
    this.allComplete =
      this.task.subtasks != null &&
      this.task.subtasks.every((t) => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return (
      this.task.subtasks.filter((t) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t) => (t.completed = completed));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "40rem",
      data: {
        name: "Jimmy",
        animal: "Fox",
        task: this.task,
        allComplete: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }
  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }
}

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "dialog-overview-example-dialog.html",
})
export class DialogOverviewExampleDialog {
  tempdata: Task;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.tempdata = data.task;
  }
  updateAllComplete() {
    this.data.allComplete =
      this.data.task.subtasks != null &&
      this.data.task.subtasks.every((t) => t.completed);
  }

  someComplete(): boolean {
    if (this.data.task.subtasks == null) {
      return false;
    }
    return (
      this.data.task.subtasks.filter((t) => t.completed).length > 0 &&
      !this.data.allComplete
    );
  }

  setAll(completed: boolean) {
    this.data.allComplete = completed;
    if (this.data.task.subtasks == null) {
      return;
    }
    this.data.task.subtasks.forEach((t) => (t.completed = completed));
  }
}

export class ExampleDataSource extends DataSource<PeriodicElement> {
  data;
  constructor(data) {
    super();
    this.data = new BehaviorSubject<PeriodicElement[]>(data);
  }
  connect(): Observable<PeriodicElement[]> {
    return this.data;
  }
  disconnect() {}
}
