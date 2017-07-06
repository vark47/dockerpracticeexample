
/** Angular imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomDate } from './customPipes';
import { HttpModule } from '@angular/http';
import { SearchPipe,WithParentPipe,ChildLengthPipe } from './filter-searchpipe';
@NgModule({
  imports: [CommonModule],
  declarations: [CustomDate,SearchPipe,WithParentPipe,ChildLengthPipe],
  exports: [CustomDate,
    CommonModule, FormsModule, HttpModule,SearchPipe,WithParentPipe,ChildLengthPipe ]
})
export class SharedModule { }