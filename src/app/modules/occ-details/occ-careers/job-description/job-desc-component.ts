import { Component, OnInit, ViewChild, ElementRef, Renderer, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { Utilities } from '../../../../shared/utilities.class';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';


declare var $: any;
@Component({
  selector: 'job-description',
  templateUrl: './job-desc-layout.html',
})

export class JobDescriptionComponent implements OnInit {
  @Input() job_descResult = [];
  filter = 1;
  utilities;
  heading = [];
  paraname;
  header2html;
  header3html;
  header4html;
  header5html;
  constructor(private router: Router, private utils: Utilities, private apiJson: ApiCallClass,
    private el: ElementRef, private renderer: Renderer, private serverApi: ServerApi) {
    this.utilities = utils;
  }
  ngOnInit() {
  }
  jobDescriptionStart() {
    // alert("JD"+JSON.stringify(this.job_descResult));
    // for (let i = 0; i < this.job_descResult.length; i++) {
    // if (this.job_descResult[i].sectionName == "Overview") {
    this.heading.push(this.job_descResult[0].sectionName);
    this.paraname = (this.job_descResult[0].sectionResults);
    // }
    // else if (this.job_descResult[i].sectionName == "PhysicalDemands") {
    this.heading.push(this.job_descResult[1].sectionName);
    this.header2html = (this.job_descResult[1].sectionResults);
    // alert(JSON.stringify(this.job_descResult[1].sectionResults));
    // }
    // else if (this.job_descResult[i].sectionName == "SkillsAbilities") {
    this.heading.push(this.job_descResult[2].sectionName);
    this.header3html = (this.job_descResult[2].sectionResults);
    //alert(JSON.stringify(this.job_descResult[2].sectionResults));
    // }
    // else if (this.job_descResult[i].sectionName == "TaskList") {
    this.heading.push(this.job_descResult[3].sectionName);
    this.header4html = (this.job_descResult[3].sectionResults);
    // alert(JSON.stringify(this.job_descResult[3].sectionResults));
    // }
    // else if (this.job_descResult[i].sectionName == "WorkingConditions") {
    this.heading.push(this.job_descResult[4].sectionName);
    this.header5html = (this.job_descResult[4].sectionResults);
    //alert(JSON.stringify(this.job_descResult[4].sectionResults));
    // }
    // }
    this.utils.hideLoading();
    //   } else {
    //     alert("error occured");
    //   }

    // }, this.utilities.handleError);

  }
  methodfilter(valfil) {
    this.filter = valfil;
  }
}