import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { CoreModule } from "../@stbui/core";
import { AdminModule } from "../@stbui/admin";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { HttpClientModule } from "@angular/common/http";
import { CdkTableModule } from "@angular/cdk/table";
import { FormsModule } from "@angular/forms";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AdminModule,
    CdkTableModule,
    FormsModule,
    NgxChartsModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
