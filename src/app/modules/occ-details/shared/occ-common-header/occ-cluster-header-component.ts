import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { Utilities } from '../../../../shared/utilities.class';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { AtAGlanceClusterComponent } from '../../occ-clusters/at-a-glance/at-a-glance.component';
import { RightForMeComponent } from '../../occ-clusters/right-for-me/right-for-me-component';
import { EducationComponent } from '../../occ-clusters/education/education.component';
import { PathwaysComponent } from '../../occ-clusters/pathways/pathways.component';
import { RelatedCareerClusterComponent } from '../../occ-clusters/related-careers/related-careers.component';

import { Observable } from 'rxjs/Observable';
declare var $: any;
@Component({
  selector: 'occ-cluster-header',
  templateUrl: './occ-cluster-layout.html',
  styles: [`
  .star {
font-size:20px;
    line-height: 30px;
     padding:0 5px;
  }
  .filled {
    color: #fff  ;
  }
`]

})

export class OccClusterHeaderComponent implements OnInit {
  @ViewChild(AtAGlanceClusterComponent) private pageClusterGlance: AtAGlanceClusterComponent;
  cciScore = 'false';
  paraValtrue;
  paraValfalse;
  getAtAGlanceData;
  imgHeaderScrCluster;
  videoSrcCluster = [];
  currentRate;
  opportunityHead;
  value = "At a Glance";
  header;
  salaryHead;
  opportunitiesNames = {};
  salariesNames = {};
  clusterData = {};
  refGlance = {};
  starRes;
  refRightForMe = { 'Skills': [] };
  refeducation = { 'RelatedPrograms': {} };
  refpathway = { 'Pathways': [] };
  refrelatedcareer = { 'RelatedCareers': {} };
  clusterID = "";
  clusterName = "";
  showColorUp = -1;
  clusterIcon = "";
  clusterColor = "";
  accountID = "";
  backAssessmentValue = true;
  clusterValue = {
    buttons: []
  }
  tabsValue = {
    tabs: []
  }
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private ratingConfig: NgbRatingConfig,
    private apiJson: ApiCallClass, private utils: Utilities,
    private serverApi: ServerApi, private elementRef: ElementRef) {
    this.ratingConfig.max = 1;
    let rtArr = this.router.url.split('/');
    for (let i = 0; i < rtArr.length; i++) {
      if (rtArr[i] == 'occupations') {
        this.backAssessmentValue = false;
        break;
      }
      else {
        this.backAssessmentValue = true;
      }
    }
  }


  ngOnInit() {
    this.utils.showLoading();

    this.activatedRoute.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.clusterID = params['clusId'];
      this.clusterName = params['clusName'];
      this.clusterIcon = params['clusIcon'];
      this.clusterColor = params['clusColor'];
    });
    this.accountID = this.utils.getAccountId();
    this.getRating();
    let clusterInfo = {};
    clusterInfo = {
      input_data: [
        {
          "param_type": "path",
          "params": ["cluster", this.clusterID, this.accountID]
        },
        {
          "param_type": "query",
          "params": { "sections": "all", "lang": "en", "stateAbbr": "IC" }
        },
        {
          "param_type": "body",
          "params": {

          }
        }
      ]
    };
    /**Hear we get the data from the server for pageCluster */
    this.apiJson.method = "GET";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    this.apiJson.endUrl = "pages";
    this.apiJson.data = JSON.stringify(clusterInfo);

    this.serverApi.callApi([this.apiJson]).subscribe((res) => {
      /**The below call is for assigning the data to the pageCluster*/

      if (res[0].Success + "" == "true") {

        this.pageClusterData(res[0].Result);
        for (let i = 0; i < res[0].Result.length; i++) {

          if (res[0].Result[i].sectionName === 'UserRating') {
            this.currentRate = res[0].Result[i].sectionResults;

          }
          else if (res[0].Result[i].sectionName === 'Image') {
            this.imgHeaderScrCluster = res[0].Result[i].sectionResults;

          }
          else if (res[0].Result[i].sectionName === 'Video') {
            this.videoSrcCluster = res[0].Result[i].sectionResults;
          }
        }

      }
    }, this.utils.handleError);


  }

  getRating() {

    this.apiJson.method = "GET";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    let getThumbsResult = {
      input_data: [
        {
          "param_type": "path",
          "params": [this.accountID, "ratings", this.clusterID]
        },
        {
          "param_type": "query",
          "params": { "lang": "en", "stateAbbr": "IC" }
        }

      ]
    }
    let user = JSON.stringify(getThumbsResult);
    this.apiJson.endUrl = "users";
    this.apiJson.data = user;
    this.serverApi.callApi([this.apiJson]).subscribe((res) => {
      if (res[0].Success + "" == "true") {
        //  alert("result success-->" );
        if (res[0].Result == "1") {
          // alert("thumbsup ");
          this.showColorUp = 1;
        }
        else if (res[0].Result == "0") {
          // alert("down");
          this.showColorUp = 0;
        }
        else {
          // alert("none");
          this.showColorUp = -1;
        }
        this.getText();
      }
    }, this.utils.handleError);

  }

  getUnFill(thumbVal) {
    if (thumbVal == 'up' && (this.showColorUp != 1)) {
      this.showColorUp = 1;
    }

    else if (thumbVal == 'down' && (this.showColorUp != 0)) {
      this.showColorUp = 0;
    }
    else {
      this.showColorUp = -1;
    }

  }
  resultPost() {
    setTimeout(function () {
      // alert("post result clicked");

      this.apiJson.method = "POST";
      this.apiJson.sessionID = this.shared.getAuthKey();
      this.apiJson.moduleName = "Occ/v1/";
      let starResult = {
        input_data: [
          {
            "param_type": "path",
            "params": [this.accountID, "ratings", this.clusterID, this.currentRate]
          },
          {
            "param_type": "query",
            "params": { "lang": "en", "stateAbbr": "IC" }
          }

        ]
      }
      let user = JSON.stringify(starResult);
      this.apiJson.endUrl = "users";
      this.apiJson.data = user;
      this.serverApi.callApi([this.apiJson]).subscribe((res) => {
        if (res.Result + "" == "true") {
          this.starRes = this.showColorUp;
          //   alert("result success-->" + this.starRes);
         

        }
        
      }, this.utils.handleError);
    }.bind(this));
  }
  getText() {
    //alert("method get call");
    this.apiJson.method = "GET";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    let pageClusterText = {};
    pageClusterText = {
      input_data: [
        {
          "param_type": "path",
          "params": ["cluster", "text", this.accountID]
        },
        {
          "param_type": "query",
          "params": { "lang": "en", "stateAbbr": "IC" }
        },
        {
          "param_type": "body",
          "params": {

          }
        }
      ]
    }
    let user = JSON.stringify(pageClusterText);
    //  alert(JSON.stringify(pageClusterText));
    this.apiJson.endUrl = "pages";
    this.apiJson.data = user;
    this.serverApi.callApi([this.apiJson]).subscribe((res) => {
      // alert("result success" + JSON.stringify(res));
      if (res[0].Success + "" == "true") {
        // alert("result 123success-->" + JSON.stringify(res[0].Result));

        for (let i = 0; i < res[0].Result.buttons.length; i++) {
          this.clusterValue.buttons[res[0].Result.buttons[i].button] = res[0].Result.buttons[i].title;

        }
        for (let j = 0; j < res[0].Result.tabs.length; j++) {
          this.tabsValue.tabs[res[0].Result.tabs[j].seq] = res[0].Result.tabs[j].title;
        }
        for (let k = 0; k < res[0].Result.sections.length; k++) {

          if (res[0].Result.sections[k].section == "EmploymentOutlook") {

            this.refRightForMe['EmploymentOutlookSection'] = res[0].Result.sections[k].title;

          }
          else if (res[0].Result.sections[k].section == "Overview") {
            this.refRightForMe['OverviewSection'] = res[0].Result.sections[k].title;
          }
          else if (res[0].Result.sections[k].section == "Skills") {
            this.refRightForMe['SkillsSection'] = res[0].Result.sections[k].title;
          }
          else if (res[0].Result.sections[k].section == "HelpfulHSCourses") {

            this.refeducation['HelpfulHSCoursesSection'] = res[0].Result.sections[k].title;

          }
          else if (res[0].Result.sections[k].section == "RelatedPrograms") {

            this.refeducation['RelatedProgramsSection'] = res[0].Result.sections[k].title;

          }
          else if (res[0].Result.sections[k].section == "TopOpportunities") {
            this.refGlance['TopOpportunitiesSection'] = res[0].Result.sections[k].title;

          }
          else if (res[0].Result.sections[k].section == "TopSalaries") {
            this.refGlance['TopSalariesSection'] = res[0].Result.sections[k].title;
          }

        }
      }
      this.utils.hideLoading();
    }, this.utils.handleError);
  }
  dropDownVal(name) {
    //  alert(name);
    this.value = name;
  }
  /** This function is for getting the data for the server for particular sectionnames */
  pageClusterData(res) {
    this.refGlance['iconName'] = this.clusterIcon;
    this.refGlance['clusterColor'] = this.clusterColor;
    //alert("clusterIcon---->"+this.clusterIcon);
    this.refrelatedcareer['clusterIcon'] = this.clusterIcon;
    this.refrelatedcareer['clusterColor'] = this.clusterColor;
    for (let i = 0; i < res.length; i++) {

      if (res[i].sectionName == "CCIScore") {
        this.refGlance['CCIScore'] = res[i].sectionResults.text;
        this.refGlance['CCIScoreresult'] = res[i].sectionResults.taken;
      }
      else if (res[i].sectionName == "ShortDescription") {
        this.refGlance['ShortDescription'] = res[i].sectionResults;
      }
      else if (res[i].sectionName == "TopOpportunities") {
        this.refGlance['TopOpportunities'] = res[i].sectionResults;

      }
      else if (res[i].sectionName == "TopSalaries") {
        this.refGlance['TopSalaries'] = res[i].sectionResults;

      }

      else if (res[i].sectionName == "EmploymentOutlook") {
        this.refRightForMe['EmploymentOutlook'] = res[i].sectionResults;

      }
      else if (res[i].sectionName == "Overview") {
        this.refRightForMe['Overview'] = res[i].sectionResults;

      }
      else if (res[i].sectionName == "Skills") {
        this.refRightForMe['Skills'] = res[i].sectionResults;
        this.refRightForMe['SkillsIntro'] = res[i].sectionResults.intro;

      }
      else if (res[i].sectionName == "HelpfulHSCourses") {
        this.refeducation['HelpfulHSCourses'] = res[i].sectionResults;

      }
      else if (res[i].sectionName == "RelatedPrograms") {
        this.refeducation['RelatedPrograms'] = res[i].sectionResults;

        this.refeducation['RelatedProgramsIntro'] = res[i].sectionResults.intro;
      }
      else if (res[i].sectionName == "Pathways") {
        this.refpathway['Pathways'] = res[i].sectionResults;
      }
      else if (res[i].sectionName == "RelatedCareers") {
        this.refrelatedcareer['RelatedCareers'] = res[i].sectionResults;
        this.refrelatedcareer['RelatedCareersIntro'] = res[i].sectionResults.intro;
        
      }
      this.pageClusterGlance.ngOnInit();
    }
  }
  /** This function is for posting the data when user gives the StarRating */
  starPost() {

    setTimeout(function () {

      this.apiJson.method = "POST";
      this.apiJson.sessionID = this.shared.getAuthKey();
      this.apiJson.moduleName = "Occ/v1/";
      let starResult = {
        input_data: [
          {
            "param_type": "path",
            "params": [this.accountID, "ratings", this.clusterID, this.currentRate]
          },
          {
            "param_type": "query",
            "params": { "lang": "en", "stateAbbr": "IC" }
          }
        ]
      }
      let user = JSON.stringify(starResult);
      this.apiJson.endUrl = "users";
      this.apiJson.data = user;
      this.serverApi.callApi([this.apiJson]).subscribe((res) => {
        if (res.Result + "" == "true") {
          this.starRes = this.currentRate;
         
        }
        else {
      
        }
      }, this.utils.handleError);
    }.bind(this));
  }
  /** This function is for saving the data as favorites */
  savePost() {
    this.apiJson.method = "POST";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    let saveResult = {
      input_data: [
        {
          "param_type": "path",
          "params": [this.accountID, "favorites", this.clusterID]
        },
        {
          "param_type": "query",
          "params": { "lang": "en", "stateAbbr": "IC" }
        }

      ]
    }
    let user = JSON.stringify(saveResult);

    this.apiJson.endUrl = "users";
    this.apiJson.data = user;
    this.serverApi.callApi([this.apiJson]).subscribe((res) => {

     
    }, this.utils.handleError);

  }
  CareerList(check) {
    this.utils.showLoading();
    this.router.navigate(['../occIndex'], { relativeTo: this.activatedRoute, queryParams: { chk: check } });
  }
  backAssessment() {
    // this.utils.backNavigation(assment);
    this.router.navigate(['../result'], { relativeTo: this.activatedRoute });
  }
}
