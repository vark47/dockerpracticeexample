import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Utilities } from '../../../../shared/utilities.class';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { SnackBar } from '../../../../shared/shared-modal-component'
@Component({
  selector: 'occ-emerg-header',
  templateUrl: './emergCareers-layout.html',
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

export class OccEmergHeaderComponent implements OnInit {
  emergingJsonValue = []
  emergingAbout = [];
  emergingEducation = [];
  resVal;
  value = "About this Career";
  currentRate;
  imgHeaderScr;
  showColorUp = -1;
  videoSrc;
  starRating;
  emergingValue = {
    buttons: []
  }
  tabsValue = {
    tabs: []
  }
  occID = "";
  occName = "";
  clusterIcon="";
  clusterColor="";
  accountId;
  @ViewChild(SnackBar) private snackbar: SnackBar;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, 
  private utils: Utilities, private ratingConfig: NgbRatingConfig,
   
    private apiJson: ApiCallClass, private serverApi: ServerApi) {
    this.ratingConfig.max = 1;
    this.activatedRoute.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.occID = params['occid'];
      this.occName = params['occname'];
       this.clusterIcon = params['clusIcon'];
      this.clusterColor = params['clusColor'];
    });
  // alert(this.clusterIcon+"------"+this.clusterColor);
  }
  ngOnInit() {
    this.utils.showLoading();
    this.accountId = this.utils.getAccountId();
    //  console.log("comming to emergCareers-header");
    this.apiJson.method = "GET";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    let pageEmerging = {};
    pageEmerging = {
      input_data: [
        {
          "param_type": "path",
          "params": ["emerging", this.occID, this.accountId]
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
    }
    let user = JSON.stringify(pageEmerging);

    this.apiJson.endUrl = "pages";
    this.apiJson.data = user;

    this.serverApi.callApi([this.apiJson]).subscribe((res) => {
      if (res[0].Success + "" == "true") {
        this.getResult(res[0].Result);
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
      }
    }, this.utils.handleError);

    this.getText();
    this.getRating();
  }
  dropDownVal(name) {
    //  alert(name);
    this.value = name;
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
  savePost() {
    //alert("post result clicked");

    //alert("Var star is " + this.currentRate);
    this.apiJson.method = "POST";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    let saveResult = {
      input_data: [
        {
          "param_type": "path",
          "params": [this.accountId, "favorites", this.occID]
        },
        {
          "param_type": "query",
          "params": { "lang": "en", "stateAbbr": "IC" }
        }

      ]
    }
    let user = JSON.stringify(saveResult);
    // alert(JSON.stringify(starResult));
    this.apiJson.endUrl = "users";
    this.apiJson.data = user;
    this.serverApi.callApi([this.apiJson]).subscribe((res) => {
      // alert("result success" + JSON.stringify(res));
      if (res.Result + "" == "true") {
        this.snackbar.myFunction("emergCareers saved");

      
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
          "params": [this.accountId, "ratings", this.occID]
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
      }
    }, this.utils.handleError);

  }

  getText() {
    //alert("method get call");
    this.apiJson.method = "GET";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    let pageEmergingText = {};
    pageEmergingText = {
      input_data: [
        {
          "param_type": "path",
          "params": ["emerging", "text", this.accountId]
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
    let user = JSON.stringify(pageEmergingText);
    //alert(JSON.stringify(pageEmergingText));
    this.apiJson.endUrl = "pages";
    this.apiJson.data = user;
    this.serverApi.callApi([this.apiJson]).subscribe((res) => {
      //  alert("result success" + JSON.stringify(res));
      if (res[0].Success + "" == "true") {
        //  alert("result 123success-->" + JSON.stringify(res[0].Result));

        for (let i = 0; i < res[0].Result.buttons.length; i++) {
          this.emergingValue.buttons[res[0].Result.buttons[i].button] = res[0].Result.buttons[i].title;
        }

        for (let k = 0; k < res[0].Result.tabs.length; k++) {
          this.tabsValue.tabs[res[0].Result.tabs[k].seq] = res[0].Result.tabs[k].title;
        }

        for (let l = 0; l < res[0].Result.sections.length; l++) {

          if (res[0].Result.sections[l].section == "HelpfulHSCourses") {
            this.emergingEducation['HelpfulHSCoursesSection'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section == "Preparation") {
            this.emergingEducation['PreparationSection'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "RelatedPrograms") {
            this.emergingEducation['RelatedProgramsSection'] = res[0].Result.sections[l].title;
          }
          else if (res[0].Result.sections[l].section == "LicensingCert") {
            this.emergingEducation['LicensingCertSection'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section == "Overview") {

            this.emergingAbout['OverviewSection'] = res[0].Result.sections[l].title;

          }
          else if (res[0].Result.sections[l].section == "ThingsToKnow") {
            this.emergingAbout['ThingsToKnowSection'] = res[0].Result.sections[l].title;
          }


          else if (res[0].Result.sections[l].section == "StarRating") {
            this.starRating = res[0].Result.sections[l].title;
          }
        }
      }

    }, this.utils.handleError);

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
            "params": [this.accountId, "ratings", this.occID, this.currentRate]
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
        else {
         
        }
      }, this.utils.handleError);
    }.bind(this));
  }

  getResult(result) {
      this.emergingJsonValue['clusIcon'] = this.clusterIcon;
      this.emergingJsonValue['clusColor'] = this.clusterColor;
    for (let i = 0; i < result.length; i++) {
      if (result[i].sectionName == "Overview") {
        // this.emergingAbout.push(result[i]);
        this.emergingAbout['Overview'] = result[i].sectionResults;

      }
      else if (result[i].sectionName == "ThingsToKnow") {
        this.emergingAbout['ThingsToKnow'] = result[i].sectionResults;

        //   alert(JSON.stringify(this.emergingAbout['ThingsToKnow']));
      }

      else if (result[i].sectionName == "Preparation") {

        this.emergingEducation['Preparation'] = result[i].sectionResults;

      }
      else if (result[i].sectionName == "HelpfulHSCourses") {
        this.emergingEducation['HelpfulHSCourses'] = result[i].sectionResults;


      }
      else if (result[i].sectionName == "LicensingCert") {
        this.emergingEducation['LicensingCert'] = result[i].sectionResults;
        this.emergingEducation['LicensingCertLength'] = result[i].sectionResults.length;
      }
      else if (result[i].sectionName == "RelatedPrograms") {
        this.emergingEducation['RelatedPrograms'] = result[i].sectionResults;

        this.emergingEducation['RelatedProgramsIntro'] = result[i].sectionResults.intro;
        //  alert(JSON.stringify(this.emergingEducation['RelatedPrograms']));
      }
      else if (result[i].sectionName == "RelatedCareers") {
        this.emergingJsonValue['RelatedCareers'] = result[i].sectionResults;
        //alert(JSON.stringify(this.emergingJsonValue['RelatedCareers']));
        this.emergingJsonValue['RelatedCareersIntro'] = result[i].sectionResults.intro;
        let length = result[i].sectionResults.lists.length;

        for (let j = 0; j < length; j++) {
          if (result[i].sectionResults.lists[j].header == "Careers") {
            this.emergingJsonValue['CareersHeader'] = result[i].sectionResults.lists[j].header;
            this.emergingJsonValue['Careerslinks'] = result[i].sectionResults.lists[j].links;
          }
          else if (result[i].sectionResults.lists[j].header == "Career Cluster") {
            this.emergingJsonValue['ClustersHeader'] = result[i].sectionResults.lists[j].header;
            this.emergingJsonValue['Clusterslinks'] = result[i].sectionResults.lists[j].links;
          }
          else if (result[i].sectionResults.lists[j].header == "Military Careers") {
            this.emergingJsonValue['MilitaryHeader'] = result[i].sectionResults.lists[j].header;
            this.emergingJsonValue['Militarylinks'] = result[i].sectionResults.lists[j].links;
          }

        }
      }
    }
    this.utils.hideLoading();
  }

  CareerList(check) {
    this.utils.showLoading();
    this.router.navigate(['../occIndex'], { relativeTo: this.activatedRoute, queryParams: { chk: check } });
  }
}

