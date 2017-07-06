import { Component, Input, Output, EventEmitter } from '@angular/core';

import { RouterModule, Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'PLP-nav-header',
  templateUrl: './PLP-nav-header.layout.html',
})
export class PLPNavHeaderComponent {

  @Input('header') header = { previousSec: "", nextSec: "", nextSecLink: "", previousSecLink: "" };
  @Input('report-status') report = "";
  @Output() changeInrView = new EventEmitter();

  constructor(private activeRoute: ActivatedRoute, private router: Router) {
  }

  loadPrevious(previous) {
    // alert("PLP nav header is:" + JSON.stringify(this.header));
    if (previous != undefined) {
      this.changeInrView.emit(this.header.previousSec);
      this.router.navigate([this.header.previousSecLink], { relativeTo: this.activeRoute });
    }
  }

  loadNext(next) {
    // alert("PLP nav header is:" + JSON.stringify(this.header));
    if (next != undefined) {
      this.changeInrView.emit(this.header.nextSec);
      this.router.navigate([this.header.nextSecLink], { relativeTo: this.activeRoute });
    }
  }
}
