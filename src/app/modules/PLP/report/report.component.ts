import { Component } from '@angular/core';

import { ReportModel } from './report.model';
import { PersonalInfoComponent } from "../shared/personal-info/personal-info.component";
import { EducationPlansComponent } from "../shared/education-plans/education-plans.component";
import { CareerGoalsComponent } from "../shared/career-goals/career-goals.component";
import { ActionPlanComponent } from "../shared/action-plan-for-year/action-plan.component";
import { CareerAssessmentsComponent } from "../shared/career-assessments/career-assessments.component";
import { CareerClusterComponent } from "../shared/career-cluster/career-cluster.component";
import { CommentsAndSignatureComponent } from "../shared/comments-and-signature/comments-and-signature.component";
import { CoursePlanComponent } from "../shared/course-plan/course-plan.component";
import { EmploymentHistoryComponent } from "../shared/employment-history/employment-history.component";
import { ExperientialLearningComponent } from "../shared/experiential-learning/experiential-learning.component";
import { ExtraActivitiesComponent } from "../shared/extra-activities/extra-activities.component";
import { GraduationRequirementsComponent } from "../shared/graduation-requirements/graduation-requirements.component";
import { OccAndClusterComponent } from "../shared/occ-and-cluster/occ-and-cluster.component";
import { SchoolsOfInterestComponent } from "../shared/schools-of-interest/schools-of-interest.component";
import { StudyOfInterestComponent } from "../shared/study-of-interest/study-of-interest.component";
import { SupportNetworkComponent } from "../shared/support-network/support-network.component";
import { TestScoresComponent } from "../shared/test-scores/test-scores.component";
import { VolunteerCommunityServiceComponent } from "../shared/volunteer-community-service/volunteer-community-service.component";
import { Utilities } from '../../../shared/utilities.class';
import { PLPSharedService } from "../shared/shared/PLP-shared.service";

@Component({
  selector: 'report-view',
  templateUrl: './report.layout.html',
  styles: [`
              button, .previous, .next{
                display:none !important;
                background:blue;
              }
            `]
})
export class ReportComponent {
  constructor(private utils: Utilities, private plpShared: PLPSharedService) {
    //alert("coming in constructor");
  }
  sectionsList
  compleSectionsList = [];
  resultsArr = [];
  reportData: ReportModel[];

  ngOnInit() {
    //alert("coming in nginit");
    this.utils.showLoading();
    this.sectionsList = this.plpShared.getServiceList();
  }


  getReportData() {

  }

  changeFilledStatus(section) {
    //alert("coming in changeFilledStatus");
    if (section.result == "filled" && this.resultsArr.indexOf(section.section) == -1) {
      // alert("coming in filled:"+JSON.stringify(section));
      this.resultsArr.push(section.section);
    }
    if (section.result == "empty") {
      // alert("index value-----"+this.resultsArr+"length---"+this.resultsArr.length+" (section.section):"+JSON.stringify(section));
      // this.resultsArr.splice(this.resultsArr.indexOf(section.section),1);
      this.removeByValue(this.resultsArr, section.section);
    }
    if (this.compleSectionsList.indexOf(section.section) == -1) {
      this.compleSectionsList.push(section.section);
    }
    if (this.sectionsList.length == this.compleSectionsList.length) {

    }
    //this.utils.hideLoading();

    //alert("coming result array::"+JSON.stringify(this.resultsArr));  
  }

  removeByValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }
}
