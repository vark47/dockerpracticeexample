import { Component, OnInit, ViewChild, Renderer, ElementRef, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Utilities } from '../../../../shared/utilities.class';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { AtAGlanceComponent } from '../../occ-careers/at-a-glance/at-a-glance-component';
import { JobDescriptionComponent } from '../../occ-careers/job-description/job-desc-component';
import { EduTrainingComponent } from '../../occ-careers/edu-and-training/edu-training-component';
import { EmpOutlookComponent } from '../../occ-careers/emp-and-outlook/emp-outlook-component';
import { PersonalQualitiesComponent } from '../../occ-careers/personal-qualities/personal-qualities-component';
import { RelatedCareersComponent } from '../../occ-careers/related-careers/related-careers-component';
import { WagesComponent } from '../../occ-careers/wages/wages-component';

declare var $: any;
@Component({
  selector: 'occ-detail-header',
  templateUrl: './occ-career-layout.html',
  styles: [`
   .star {
        font-size:20px;
     line-height: 30px;
      padding:0 5px;
   }
   .filled {
     color: #fff ;
   }
 `]
})

export class OccCareerHeaderComponent implements OnInit {
  @ViewChild(AtAGlanceComponent) private glanceCluster: AtAGlanceComponent;
  @ViewChild(JobDescriptionComponent) private jobDesc: JobDescriptionComponent;
  @ViewChild(EduTrainingComponent) private eduTrain: EduTrainingComponent;
  @ViewChild(EmpOutlookComponent) private empOut: EmpOutlookComponent;
  @ViewChild(PersonalQualitiesComponent) private perQuality: PersonalQualitiesComponent;
  @ViewChild(RelatedCareersComponent) private careerRelated: RelatedCareersComponent;
  @ViewChild(WagesComponent) private wagesVar: WagesComponent;
  currentRate;
  utilities;
  imgHeaderScr;
  showCareerColorUp = -1;
  videoSrc = [];
  resVal = [];
  glanceDataVal = [];
  job_descriptionData = [];
  wagesData = [];
  selectTostVal = "";
  value = "At a Glance";
  emp_outlookData = [];
  emp_outStateData = [];
  edu_traninig = [];
  related_careers = [];
  personalResult = [];
  indexOccId = [];
  indexTitleName = [];
  starRes;
  accId = "";
  occID = "";
  occName = "";
  isSave = { "id": [], "name": [] };
  isSaveTrue = false;
  starRating;
  activeVal = 0;
  careersListValue = {
    buttons: []
  };
  tabsValue = {
    tabs: []
  }
  video;
  asmntname = "";
  backAssessmentValue = true
  constructor(private router: Router, private ratingConfig: NgbRatingConfig,
    private activatedRoute: ActivatedRoute, private utils: Utilities,
    private apiJson: ApiCallClass,
    private el: ElementRef, private renderer: Renderer, private serverApi: ServerApi) {
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
    this.utilities = utils;
    this.ratingConfig.max = 1;
    //alert("coming in constructor");
    this.activatedRoute.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.occID = params['occid'];
      this.occName = params['occname'];
    });
    this.accId = this.utils.getAccountId();
  }
  ngOnInit() {
    // checking whether an ocupation was saved by user or not when coming from another page
    if (this.utils.sessionStorageGet("compareFirst") == "true") {
      if (this.utils.sessionStorageGet("savedValId").length != 0) {
        this.indexOccId.push(this.utils.sessionStorageGet("compareFirstid"));
        this.indexTitleName.push(this.utils.sessionStorageGet("compareFirstname"));
        this.isSave.id.push(this.utils.sessionStorageGet("compareFirstid"));
        this.isSave.name.push(this.utils.sessionStorageGet("compareFirstname"));
      }
    }
    // check whether user saved any occupation or not when reload the page
    if (this.utils.sessionStorageGet("savedVal") != "empty") {
      this.indexOccId.push(this.occID);
      this.indexTitleName.push(this.occName);
      this.isSave.id.push(this.occID);
      this.isSave.name.push(this.occName);
    }
    this.utils.showLoading();
    //calling getCareer method for getting text from api
    this.getCareer();
  }

  getUnFill(thumbVal) {
    //this call is to fill and unfill the thumbs up and down icon
    if (thumbVal == 'up' && (this.showCareerColorUp != 1)) {
      this.showCareerColorUp = 1;
    }

    else if (thumbVal == 'down' && (this.showCareerColorUp != 0)) {
      this.showCareerColorUp = 0;
    }
    else {
      this.showCareerColorUp = -1;
    }

  }
  checkCareer(id, name) {
    //this method is to remove occupation from popup
    let inx1 = -1;
    for (let i = 0; i < this.indexOccId.length; i++) {

      if (id == this.indexOccId[i]) {
        inx1 = i;
      }
    }
    this.indexOccId.splice(inx1, 1);
    this.indexTitleName.splice(inx1, 1);
  }
  CompareOccupations() {
    //used to navigate to compare screen
    try {
      this.router.navigate(['../compare'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          occId: this.indexOccId[0] + "&" + this.indexOccId[1],
          occName: this.indexTitleName[0] + "&" + this.indexTitleName[1]
        }
      });
    }
    catch (e) {
      alert("error--->" + e.message);
    }

  }
  relate(eve) {
    this.utils.showLoading();
    this.occID = eve[0];
    this.occName = eve[1];
    this.accId = this.utils.getAccountId();
    this.getCareer();
  }

  getCareer() {
    //calling getCareer method for getting text from api
    this.apiJson.method = "GET";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";

    let GlancedataText = {};

    GlancedataText = {
      input_data: [
        {
          "param_type": "path",
          "params": ["occ", "text", this.accId]
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
    let user = JSON.stringify(GlancedataText);
    this.apiJson.endUrl = "pages";

    this.apiJson.data = user;

    this.serverApi.callApi([this.apiJson]).subscribe((res) => {

      // Below statement is for testing.
      //this.http.get('/assets/i18n/English.json').map((res: Response) => res.json()).subscribe((res) => {


      if (res[0].Success + "" == "true") {
        //to get all states
        if (res[0].Result.select != null || res[0].Result.select != undefined) {
          let firstChar = JSON.stringify(res[0].Result.select).charAt(0);
          if (firstChar == '{') {
            this.emp_outStateData.push(res[0].Result.select);
          }
          else if (firstChar == '[') {
            this.emp_outStateData = (res[0].Result.select);
          }
        }
        //to get all button text
        for (let i = 0; i < res[0].Result.buttons.length; i++) {

          this.careersListValue.buttons[res[0].Result.buttons[i].button] = res[0].Result.buttons[i].title;
        }
        for (let k = 0; k < res[0].Result.tabs.length; k++) {
          this.tabsValue.tabs[res[0].Result.tabs[k].seq] = res[0].Result.tabs[k].title;

        }
        for (let l = 0; l < res[0].Result.sections.length; l++) {
          if (res[0].Result.sections[l].section == "EducationLevel") {
            this.glanceDataVal['EducationLevel'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section == "OpportunityRating") {
            this.glanceDataVal['OpportunityRating'] = res[0].Result.sections[l].title;
          }

          else if (res[0].Result.sections[l].section == "SalaryRating") {
            this.glanceDataVal['SalaryRating'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "TopJobTasks") {
            this.glanceDataVal['TopJobTasks'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "FindJobs") {
            this.related_careers['FindJobs'] = res[0].Result.sections[l].title;

          }

          else if (res[0].Result.sections[l].section == "Interests") {
            this.personalResult['Interests'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section == "Values") {
            this.personalResult['Values'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "Knowledge") {
            this.edu_traninig['Knowledge'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section == "LicensingCert") {
            this.edu_traninig['LicensingCert'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "Preparation") {
            this.edu_traninig['Preparation'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "RelatedPrograms") {
            this.edu_traninig['RelatedPrograms'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "HelpfulHSCourses") {
            this.edu_traninig['HelpfulHSCourses'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "OutlookInfo") {
            this.emp_outlookData['OutlookInfo'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "TopOpeningLocations") {
            this.emp_outlookData['TopOpeningLocations'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "MajorEmployers") {
            this.emp_outlookData['MajorEmployers'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "TopWorkSetting") {
            this.glanceDataVal['TopWorkSetting'] = res[0].Result.sections[l].title;
          }

          else if (res[0].Result.sections[l].section == "StarRating") {

            this.starRating = res[0].Result.sections[l].title;
          }


          else if (res[0].Result.sections[l].section == "TopSalaryLocations") {
            this.wagesData['TopSalaryLocations'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section === "WageLevels") {
            this.wagesData['WageLevels'] = res[0].Result.sections[l].title;
          }

          else if (res[0].Result.sections[l].section == "Video") {
            this.video = res[0].Result.sections[l].title;
            this.glanceDataVal['video'] = res[0].Result.sections[l].title;
          }


          else if (res[0].Result.sections[l].section == "WorkingConditions") {
            this.job_descriptionData['WorkingConditions'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section == "TaskList") {
            this.job_descriptionData['TaskList'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section == "Overview") {
            this.job_descriptionData['Overview'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section == "SkillsAbilities") {
            this.job_descriptionData['SkillsAbilities'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section == "PhysicalDemands") {
            this.job_descriptionData['PhysicalDemands'] = res[0].Result.sections[l].title;

          }
        }
      }

    }, this.utilities.handleError);
    this.getRating();
    this.careerHeader();
  }
  savePost() {
    //to post the favorites data
    this.apiJson.method = "POST";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    let saveResult = {
      input_data: [
        {
          "param_type": "path",
          "params": [this.accId, "favorites", this.occID]
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
  getRating() {
    // to get the data to show what user selected between thumbs up and down
    this.apiJson.method = "GET";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    let getThumbsResult = {
      input_data: [
        {
          "param_type": "path",
          "params": [this.accId, "ratings", this.occID]
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
        if (res[0].Result == "1") {
          this.showCareerColorUp = 1;
        }
        else if (res[0].Result == "0") {
          // alert("down");
          this.showCareerColorUp = 0;
        }
        else {
          //  alert("none");
          this.showCareerColorUp = -1;
        }

      }
    }, this.utils.handleError);

  }

  dropDownVal(name, num) {
    //for dropdown in mobile
    this.value = name;
    this.activeVal = num;
  }
  careerHeader() {
    //data for header part
    try {
      this.apiJson.method = "GET";
      this.apiJson.sessionID = this.utils.getAuthKey();
      this.apiJson.moduleName = "Occ/v1/";

      let Glancedata = {};

      Glancedata = {
        input_data: [
          {
            "param_type": "path",
            "params": ["occ", this.occID, this.accId]
          },
          {
            "param_type": "query",
            "params": { "sections": "all", "states": "US", "lang": "en", "stateAbbr": "IC" }
          },
          {
            "param_type": "body",
            "params": {

            }
          }
        ]
      }
      let user = JSON.stringify(Glancedata);
      this.apiJson.endUrl = "pages";

      this.apiJson.data = user;
      // alert("before api result");      
      this.serverApi.callApi([this.apiJson]).subscribe((res) => {
        if (res[0].Success + "" == "true") {
          // alert("after result");
          this.getData(res[0].Result);
          for (let i = 0; i < res[0].Result.length; i++) {
            if (res[0].Result[i].sectionName == "UserRating") {
              this.currentRate = res[0].Result[i].sectionResults;
            }
            else if (res[0].Result[i].sectionName == "Image") {
              this.imgHeaderScr = res[0].Result[i].sectionResults;
            }
            else if (res[0].Result[i].sectionName == "Video") {
              this.videoSrc = res[0].Result[i].sectionResults;
            }
          }
        } else {
        //  alert("error occured");
        }

      }, this.utilities.handleError);
    }
    catch (e) {
      alert("error------>" + e.message);
    }
  }
  getData(result) {
    //to get data of each tab
    for (let i = 0; i < result.length; i++) {
      if (result[i].sectionName == "EducationLevel" || result[i].sectionName == "OpportunityRating" || result[i].sectionName == "ParentCluster"
        || result[i].sectionName == "SalaryRating" || result[i].sectionName == "ShortDescription"
        || result[i].sectionName == "TopJobTasks" || result[i].sectionName == "TopWorkSetting") {
        this.glanceDataVal.push(result[i]);
      }
      else if (result[i].sectionName == "Overview" || result[i].sectionName == "PhysicalDemands" || result[i].sectionName == "SkillsAbilities"
        || result[i].sectionName == "TaskList" || result[i].sectionName == "WorkingConditions") {
        let name = [{}];
        name.push(result[i]);
        this.job_descriptionData.push(result[i]);
      }
      else if (result[i].sectionName == "WageInfo" || result[i].sectionName == "WageLevels"
        || result[i].sectionName == "SalaryRating" || result[i].sectionName == "TopSalaryLocations") {
        let name = [{}];
        name.push(result[i]);
        this.wagesData.push(result[i]);
      }
      else if (result[i].sectionName == "MajorEmployers" || result[i].sectionName == "OutlookInfo"
        || result[i].sectionName == "OutlookRatings" || result[i].sectionName == "TopOpeningLocations") {
        let name = [{}];
        name.push(result[i]);
        this.emp_outlookData.push(result[i]);
      }
      else if (result[i].sectionName == "HelpfulHSCourses" || result[i].sectionName == "Knowledge"
        || result[i].sectionName == "LicensingCert" || result[i].sectionName == "Preparation" || result[i].sectionName == "RelatedPrograms") {
        let name = [{}];
        name.push(result[i]);
        this.edu_traninig.push(result[i]);
      }
      else if (result[i].sectionName == "RelatedCareers" || result[i].sectionName == "FindJobs") {
        let name = [{}];
        name.push(result[i]);
        this.related_careers.push(result[i]);
      }
      else {
        let name = [{}];
        name.push(result[i]);
        this.personalResult.push(result[i]);
      }
    }
    this.glanceCluster.onGlanceStart();
    this.jobDesc.jobDescriptionStart();
    this.eduTrain.edu_trainingStart();
    this.empOut.emp_outlookStart();
    this.perQuality.personal_QualitiesStart();
    this.careerRelated.relatedCareerStart();
    this.wagesVar.wagesStart();
  }
  resultPost() {
    //post thumbs up and down to api
    setTimeout(function () {
      this.apiJson.method = "POST";
      this.apiJson.sessionID = this.shared.getAuthKey();
      this.apiJson.moduleName = "Occ/v1/";
      let starResult = {
        input_data: [
          {
            "param_type": "path",
            "params": [this.accId, "ratings", this.occID, this.currentRate]
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

          this.starRes = this.showCareerColorUp;

        }

      }, this.utils.handleError);
    }.bind(this));

  }
  CareerList(check) {
    //navigate to occindex based on whether the occupation saved or not
    this.utils.showLoading();
    if ((this.utils.sessionStorageGet("savedVal") != "true")|| (this.utils.sessionStorageGet("savedValId").length == 0)) {
      this.router.navigate(['../occIndex'], { relativeTo: this.activatedRoute, queryParams: { chk: check } });
    }
    else if ( this.utils.sessionStorageGet("savedVal") == "true"||(this.utils.sessionStorageGet("savedValId").length != 0)) {
      this.router.navigate(['../occIndex'], {
        relativeTo: this.activatedRoute,
        queryParams: { occid: this.utils.sessionStorageGet("savedValId"), occname: this.utils.sessionStorageGet("savedValName"), chk: check }
      });
    }
  }
  cancleOccupation() {
    //when x in pop-up was clicked cancel the changes
    for (let i = 0; i < this.isSave.id.length; i++) {
      this.indexOccId[i] = this.isSave.id[i];
      this.indexTitleName[i] = this.isSave.name[i];
    }
  }
  SaveOccupation() {
    //when save button in pop-up was clicked save the occupation to compare    
    for (let i = 0; i < this.indexOccId.length; i++) {
      this.isSave.id[i] = this.indexOccId[i];
      this.isSave.name[i] = this.indexTitleName[i];
      if (this.indexOccId.length == 1) {
        this.utils.sessionStorageSet("savedValId", this.isSave.id[i]);
        this.utils.sessionStorageSet("savedValName", this.isSave.name[i]);
        this.utils.sessionStorageSet("savedVal", "true");
      }
    }
    if (this.indexOccId.length == 0) {
      this.isSave = { "id": [], "name": [] };
      this.utils.sessionStorageSet("savedValId", []);
      this.utils.sessionStorageSet("savedValName", []);
      this.utils.sessionStorageSet("savedVal", "empty");
    }
    this.isSaveTrue = true;
  }
  backAssessment() {
    //when back assessment data was clicked navigate to respective page
    if (this.utils.sessionStorageGet("module") == 'ip') {
      this.router.navigate(['../occlist'], { relativeTo: this.activatedRoute });
    }
    else {
      this.router.navigate(['../result'], { relativeTo: this.activatedRoute });
    }
  }

}