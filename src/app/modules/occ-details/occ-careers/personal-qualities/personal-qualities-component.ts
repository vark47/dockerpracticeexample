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
  selector: 'personal-qualities',
  templateUrl: './personal-qualities-layout.html',
})

export class PersonalQualitiesComponent implements OnInit {
  @Input() personal_qualResult = [];
  utilities;
  per_quaResult = [];
  heading = [];
  intrest_Val = [];
  headerText = [];
  valuesHeader = [];
  work_imp = [];
  // itemsInterests = [];
  existVal = [];
 
    ipresultArr=[];
  asessmentAttended = false;
  constructor(private router: Router, private utils: Utilities, private apiJson: ApiCallClass,
    private activatedRoute: ActivatedRoute, private el: ElementRef, private renderer: Renderer, private serverApi: ServerApi) {
    this.utilities = utils;
  }
  ngOnInit() {
  }
  personal_QualitiesStart() {
    //  alert()
    for (let i = 0; i < this.personal_qualResult.length; i++) {
      if (this.personal_qualResult[i].sectionName == "Interests") {
        // alert(this.personal_qualResult[i].sectionResult);
        // this.header.push(this.personal_qualResult[i].sectionResults);
        this.valuesHeader.push(this.personal_qualResult[i].sectionResults);
        // alert(this.personal_qualResult[i].sectionResults.header);
        //   alert(JSON.stringify("Interests in "+ JSON.stringify(this.per_quaResult[i].sectionResults)));
        this.heading.push(this.personal_qualResult[i].sectionName);
        //  this.interestView(this.per_quaResult[i].sectionResults);

      }
      else if (this.personal_qualResult[i].sectionName == "TopInterests") {
        this.asessmentAttended = true;
        let ipresult=[];
        if (this.personal_qualResult[i].sectionResults.length != 0) {
          ipresult =this.personal_qualResult[i].sectionResults.interests;
        for (let i = 0; i < ipresult.length; i++) {
            this.ipresultArr.push({"interest":ipresult[i].interest.toLowerCase(),"score":ipresult[i].score});
        }
          for (let k = 0; k < (this.personal_qualResult[i].sectionResults.interests.length - 4); k++) {
            //alert("k----------"+k+"---------"+this.personal_qualResult[i].sectionResults.interests[k]);
            this.intrest_Val.push(this.personal_qualResult[i].sectionResults.interests[k]);
          }

          this.headerText.push(this.personal_qualResult[i].sectionResults.text);
        }
        this.existVal.push(this.personal_qualResult[i].sectionResults.taken);
        //  alert(JSON.stringify("Top Interests "+JSON.stringify(this.per_quaResult[i].sectionResults)));

        // this.topInterestView(this.per_quaResult[i].sectionResults);
      }
      else if (this.personal_qualResult[i].sectionName == "TopValues") {
        this.asessmentAttended = true;
        if (this.personal_qualResult[i].sectionResults.length != 0) {
          for (let k = 0; k < (this.personal_qualResult[i].sectionResults.values.length - 4); k++) {
            this.work_imp.push(this.personal_qualResult[i].sectionResults.values[k]);
          }

          this.headerText.push(this.personal_qualResult[i].sectionResults.text);
        }
        this.existVal.push(this.personal_qualResult[i].sectionResults.taken);
        //   alert(JSON.stringify("Top vALUES "+JSON.stringify(this.per_quaResult[i].sectionResults)));
        // this.topValuesView(this.per_quaResult[i].sectionResults);
      }
      else if (this.personal_qualResult[i].sectionName == "Values") {
        this.valuesHeader.push(this.personal_qualResult[i].sectionResults);
        // this.items.push(this.personal_qualResult[i].sectionResults.items);
        //  alert(JSON.stringify("Values  "+ JSON.stringify(this.per_quaResult[i].sectionResults)));
        // this.valuesView(this.per_quaResult[i].sectionResults);
        this.heading.push(this.personal_qualResult[i].sectionName);
      }
    }
  //alert("intrest_Val------------>"+JSON.stringify(this.intrest_Val));
  }
  backAssessment(name) {
    // this.utils.backNavigation(assment);
    // console.log("hgfghfgf--->"+this.utils.sessionStorageGet("module"));
    if (name == 'ip') {
      this.router.navigate(['../../../assessment/interestProfilerSf/intro'], { relativeTo: this.activatedRoute });
    }
    else if (name == 'WIL') {
      // this.router.navigate(['../result'], { relativeTo: this.activatedRoute});    
    }
  }

  callIpResult(assessment, interest) {
    
    if (assessment == 'IP') {
      
       // alert("ipresultArr--->"+JSON.stringify(ipresultArr));
       this.utils.sessionStorageSet("ipsfInterest", interest.toLowerCase());
      this.utils.sessionStorageSet("resultIP", JSON.stringify(this.ipresultArr));
      this.router.navigate(['../../../assessment/interestProfilerSf/occlist'], { relativeTo: this.activatedRoute });
    }
    else if (assessment == 'WIL') {
      // this.router.navigate(['../result'], { relativeTo: this.activatedRoute});    
    }
  }
}