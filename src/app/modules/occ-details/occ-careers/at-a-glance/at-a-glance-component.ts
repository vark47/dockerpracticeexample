import { Component, OnInit, ViewChild, ElementRef, Renderer, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { Utilities } from '../../../../shared/utilities.class';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { clusterDetails } from '../../../assessments/shared/constants/assessments-constants';


declare var $: any;
@Component({
  selector: 'at-a-glance',
  templateUrl: './at-a-glance-layout.html',
})

export class AtAGlanceComponent implements OnInit {
  @Input() jsonValue = [];
  browserDom: BrowserDomAdapter;
  // currentRate = 2;
  utilities;
  opportunityRange;
  amt;
  salamt;
  parentClusterIcon;
  parentClusterName;
  parentClusterId;
  parentClusterColor;
  salRatingName;
  rate;
  description;
  eduBar = -1;
  joblength = [];
  chartValue = -1;
  worklength = [];
  eduName;
  classChart = -1;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private utils: Utilities, private apiJson: ApiCallClass,
    private el: ElementRef, private renderer: Renderer, private serverApi: ServerApi) {
    this.utilities = utils;
    this.browserDom = new BrowserDomAdapter();
    // alert("at-a-glance constructor");

  }
  ngOnInit() {

    if (this.jsonValue.length != 0) {
      this.onGlanceStart();
    }

  }
  onGlanceStart() {
    try {
      var ref = this;
      if (this.jsonValue.length != 0) {
        // educationLevel is to display "Education & Training" level
        ref.educationLevel(ref.jsonValue[0].sectionResults);
        // display rating of Employment Opportunities like amount,range.etc..,
        ref.opportunityRange = ref.jsonValue[1].sectionResults.rating;
        ref.amt = ref.jsonValue[1].sectionResults.amount;
        ref.empRating(ref.jsonValue[1].sectionResults.rating)
        //display cluster name of that current occupation
        ref.parentClusterName = ref.jsonValue[2].sectionResults.linkTitle;
        //displays the salary
        ref.salRatingName = ref.jsonValue[3].sectionResults.rating;
        ref.salamt = ref.jsonValue[3].sectionResults.amount;
        ref.markSalary(ref.jsonValue[3].sectionResults.rating);
        //description about occupation
        ref.description = ref.jsonValue[4].sectionResults;
        //TopJobTasks and TopWorkSetting
        ref.joblength = ref.jsonValue[5].sectionResults;
        ref.worklength = ref.jsonValue[6].sectionResults;
      }
      //check and display details about cluster like its color,name,icon
      clusterDetails.forEach(function (obj, inx) {
        if (ref.parentClusterName == obj.clusterName) {
          ref.parentClusterIcon = obj.clusterIconValue;
          ref.parentClusterId = obj.clusterId;
          ref.parentClusterColor = obj.clusterBgColor;
        }
      });
      ref.utils.sessionStorageSet("clusterIcon", ref.parentClusterIcon);
      // }           
      //  }  
      // alert("parentClusterName--->"+ref.parentClusterName);  
      ref.utils.hideLoading();
      // }.bind(this),25000);
    }
    catch (e) {
      alert("at a glance init exception:" + e.message);
    }
  }
  empRating(ratingRes) {
    if (ratingRes == "Above Average") {
      this.chartValue = 3;
    }
    else if (ratingRes == "Average") {
      this.chartValue = 2
    }
    else if (ratingRes == "Below Average") {
      this.chartValue = 1;
    }
    else if (ratingRes == "Declining") {
      this.chartValue = 0;
    }
  }
  educationLevel(eduResult) {
    var eduClass = document.getElementsByClassName('eduBar');
    this.eduName = eduResult;
    if (eduResult == "A Few Hours to 3 Months") {
      this.eduBar = 0;
    }
    else if (eduResult == "4 Months to 1 Year") {
      this.eduBar = 1;
    }
    else if (eduResult == "2 to 3 Years") {
      this.eduBar = 2;
    }
    else if (eduResult == "4 Years") {
      this.eduBar = 3;
    }
    else if (eduResult == "5 or More Years") {
      this.eduBar = 4;
    }
  }
  markSalary(rateSal) {
    // rateSal = "Average";
    // var salClass = document.getElementsByClassName('activeChartClass');    
    if (rateSal == "Above Average") {
      this.classChart = 2;
    }
    else if (rateSal == "Average") {
      this.classChart = 1;

    }
    else if (rateSal == "Below Average") {
      this.classChart = 0;

    }
  }
  WorkplaceRedirect() {
    //this.glanceCluster.ngOnInit();
    this.utils.showLoading();
    //navigate to the parent cluster
    this.router.navigate(['../occCluster'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        clusId: this.parentClusterId,
        clusName: this.parentClusterName, clusIcon: this.parentClusterIcon,
        clusColor: this.parentClusterColor
      }
    });
  }
}