import { Component, OnInit, Input } from '@angular/core';

declare var $: any;
@Component({
  selector: 'about-this-career',
  templateUrl: './abt-this.layout.html',
})

export class AboutThisComponent implements OnInit {

  @Input() aboutJsonValue = [];

  constructor() {

  }
  ngOnInit() {

  }
}