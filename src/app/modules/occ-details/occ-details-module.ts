import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input, Pipe, PipeTransform } from '@angular/core';
import { Router, Routes, RouterModule, RouterOutlet } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService, TranslatePipe } from 'ng2-translate';
import { SharedModule } from '../../shared/shared-module';
import { ApiCallClass } from '../../shared/apicall.model';
import { ServerApi } from '../../shared/app.apicall.service';
import { Utilities } from '../../shared/utilities.class';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppSharedModule } from '../../app.sharedmodule';
import { OccDetailStaticHeaderComponent } from './occ-detail-header-component';
import { AtAGlanceComponent } from './occ-careers/at-a-glance/at-a-glance-component';
import { EduTrainingComponent } from './occ-careers/edu-and-training/edu-training-component';
import { EmpOutlookComponent } from './occ-careers/emp-and-outlook/emp-outlook-component';
import { JobDescriptionComponent } from './occ-careers/job-description/job-desc-component';
import { PersonalQualitiesComponent } from './occ-careers/personal-qualities/personal-qualities-component';
import { RelatedCareersComponent } from './occ-careers/related-careers/related-careers-component';
import { WagesComponent } from './occ-careers/wages/wages-component';
import { AtAGlanceClusterComponent } from './occ-clusters/at-a-glance/at-a-glance.component';
import { EducationComponent } from './occ-clusters/education/education.component';
import { PathwaysComponent } from './occ-clusters/pathways/pathways.component';
import { RelatedCareerClusterComponent } from './occ-clusters/related-careers/related-careers.component';
import { RightForMeComponent } from './occ-clusters/right-for-me/right-for-me-component';
import { AboutThisComponent } from './occ-emerg-careers/about-this-career/abt-this-career.component';
import { EduTrainingEmergComponent } from './occ-emerg-careers/edu-and-training/edu-and-training-component';
import { RelatedCareersEmergComponent } from './occ-emerg-careers/related-careers/related-careers.component';
import { OccCareerHeaderComponent } from './shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from './shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from './shared/occ-common-header/emergCareers-header-component';
import { StaticOccFooterComponent } from './shared/occ-common-footer/occ-footer-component';
import { OccIndexComponent } from './shared/occ-index/occ-index-component';
import { TextIteratorPipe } from './shared/text-custompipe';
import { OSCompareComponent } from '../assessments/occ-sort/compareOcc/compare-component';
import { OccupationEntryComponent } from './occupations-main.component';
import { IPSFResultComponent } from '../assessments/interest-profiler-sf/result/ipsf-result.component';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
// const routes: Routes = [
//     { path: 'occCareer', component: OccCareerHeaderComponent },
//     { path: 'occCluster', component: OccClusterHeaderComponent },
//     { path: 'occEmergCareer', component: OccEmergHeaderComponent },
//     { path: 'occIndex', component: OccIndexComponent },
//     { path: 'compare', component: OSCompareComponent }
// ];
@NgModule({
    imports: [ HttpModule, FormsModule, CommonModule,
        RouterModule, TranslateModule, NgbModule, ReactiveFormsModule, SharedModule,InfiniteScrollModule],
    declarations: [OccCareerHeaderComponent, OccClusterHeaderComponent, OccEmergHeaderComponent, StaticOccFooterComponent, AtAGlanceComponent, EduTrainingComponent, EmpOutlookComponent, JobDescriptionComponent,
        PersonalQualitiesComponent, RelatedCareersComponent, WagesComponent, AtAGlanceClusterComponent,
        EducationComponent, PathwaysComponent, RelatedCareerClusterComponent, RightForMeComponent,
        AboutThisComponent, EduTrainingEmergComponent, RelatedCareersEmergComponent,
        OccDetailStaticHeaderComponent, TextIteratorPipe, OccIndexComponent, OSCompareComponent],
    providers: [
         ApiCallClass, ServerApi, Utilities
    ]
})

export class occDetailModule {
}