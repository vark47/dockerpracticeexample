import { Component, OnInit, Input } from '@angular/core';

declare var $: any;
@Component({
  selector: 'edu-and-training-emerg',
  templateUrl: './edu-and-training-layout.html',
})

export class EduTrainingEmergComponent implements OnInit {
  @Input() educationTraining = [];
  filter = 1;

  constructor() {

  }
  ngOnInit() {
  }
  methodfilter(valfil) {
    this.filter = valfil;

  }
}