import { Component, OnInit, Input } from '@angular/core';

declare var $: any;
@Component({
  selector: 'right-for-me',
  templateUrl: './right-for-me-layout.html',
})

export class RightForMeComponent implements OnInit {
  @Input() rightForMeData = {};
  constructor() {
    // alert("rightForMeData----->"+JSON.stringify(this.rightForMeData));

  }
  ngOnInit() {
  }
}
