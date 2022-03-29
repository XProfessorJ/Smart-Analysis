import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatsComponent } from './chats.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'chat', component: ChatsComponent },
  { path: 'search', component: SearchComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {}
