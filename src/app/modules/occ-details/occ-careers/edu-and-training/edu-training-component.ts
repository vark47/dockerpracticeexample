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
  selector: 'edu-and-traninig',
  templateUrl: './edu-training.layout.html',
})

export class EduTrainingComponent implements OnInit {
  @Input() edu_trainResult = [];
  filter = 9;
  utilities;
  eduHeading = [];
  paraname;
  testRes;
  edu_TrainDesc3;
  edu_TrainDesc4 = "";
  abilityRes = [];
  LicenCertificate;
  constructor(private router: Router, private utils: Utilities, private apiJson: ApiCallClass,
    private el: ElementRef, private renderer: Renderer, private serverApi: ServerApi) {
    this.utilities = utils;
  }
  ngOnInit() {
  }
  edu_trainingStart() {
    // for (let i = 0; i < this.edu_trainResult.length; i++) {

    //contain helpful High School Courses data
    this.eduHeading.push(this.edu_trainResult[0].sectionName);
    this.paraname = this.edu_trainResult[0].sectionResults;
    // }
    //contain Knowledge data
    this.eduHeading.push(this.edu_trainResult[1].sectionName);
    this.testRes = (this.edu_trainResult[1].sectionResults);
    // }

    //contain LicensingCert data
    this.eduHeading.push(this.edu_trainResult[2].sectionName);
    this.edu_TrainDesc3 = this.edu_trainResult[2].sectionResults;
    this.LicenCertificate = this.edu_TrainDesc3.length;
    // }

    //contain Preparation data
    this.eduHeading.push(this.edu_trainResult[3].sectionName);
    this.edu_TrainDesc4 = (this.edu_trainResult[3].sectionResults);
    // }

    //contain RelatedPrograms data
    this.eduHeading.push(this.edu_trainResult[4].sectionName);
    this.abilityRes.push(this.edu_trainResult[4].sectionResults);
    // }

    // }

  }
  methodfilter(valfil) {
    this.filter = valfil;

  }
}