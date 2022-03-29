import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "../../@stbui/shared/shared.module";

import { ChatsService } from "./chats.service";
// import { ChatsFirebase } from './chats.firebase';
import { ChatsComponent } from "./chats.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { ChatComponent } from "./chat/chat.component";
import { NoticeComponent } from "./notice/notice.component";
import { ChatRoutingModule } from "./chats.routing";
import {
  DialogOverviewExampleDialog,
  SearchComponent,
} from "./search/search.component";
import {  ReactiveFormsModule } from "@angular/forms";
import { CdkTableModule } from "@angular/cdk/table";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@NgModule({
  imports: [
    SharedModule,
    ChatRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CdkTableModule,
    NgxChartsModule
  ],
  declarations: [
    ChatsComponent,
    ContactsComponent,
    ChatComponent,
    NoticeComponent,
    SearchComponent,
    DialogOverviewExampleDialog,
  ],
  entryComponents: [NoticeComponent],
  providers: [
    // ChatsFirebase,
    ChatsService,
  ],
})
export class ChatsModule {}
