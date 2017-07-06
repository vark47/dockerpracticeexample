import { Component, OnInit, ViewChild, ElementRef, Input, Renderer } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { Utilities } from '../../../../shared/utilities.class';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

import { ServerApi } from '../../../../shared/app.apicall.service';

declare var $: any;
@Component({
  selector: 'pathways',
  templateUrl: './pathways-layout.html',
})

export class PathwaysComponent implements OnInit {
  filter;
  showId = false;
  highlightedDiv: number;

  @Input('pathwaysData') pathwaysData = { 'Pathways': [] };
  dom: BrowserDomAdapter;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    //this.pathwaysData['Pathways'];
  }
  ngOnInit() {
  }
  methodfilter(valfil, indexval, newValue: number) {
    this.filter = valfil;
    this.showId = indexval;
    if (this.highlightedDiv === newValue) {
      this.highlightedDiv = 0;
    }
    else {
      this.highlightedDiv = newValue;
    }

  }
  CallOccDetailCareer(id, name) {
    let twoDigit = id.toString().substr(0, 2);
    if (twoDigit == 14) {
      this.router.navigate(['../occEmergCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name } });
    }
    else {
      this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name } });
    }
    // this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name } });
  }
}
