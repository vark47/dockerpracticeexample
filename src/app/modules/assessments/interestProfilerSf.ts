
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input, Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, RouterOutlet } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FrameworkModule } from '../../modules/framework/framework.module';
import { GridModule } from '../../modules/framework/grid.module';

import { InterestProfilerShComponent } from './interest-profiler-sf/interest-profiler-sf.component';
import { IPSFIntroComponent } from './interest-profiler-sf/intro/ipsf-intro.component';
import { IPSFAssessmentComponent } from './interest-profiler-sf/assessment/ipsf-assessment.component';
import { IPSFResultComponent } from './interest-profiler-sf/result/ipsf-result.component';
import { IPSFRestoreComponent } from './interest-profiler-sf/restore/ipsf-restore.component';
import { IPSFOccListComponent } from './interest-profiler-sf/occlist/ipsf-occ-list.component';

import { StaticHeaderComponent } from './shared/header-footer/header.component';
import { AssessmentHeaderComponent } from './shared/assessment-header/assessment-header.component';

import { TranslateModule, TranslateService } from 'ng2-translate';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { SharedService } from '../../shared/shared.service';
import { ApiCallClass } from '../../shared/apicall.model';
import { ServerApi } from '../../shared/app.apicall.service';
import { Utilities } from '../../shared/utilities.class';

import { AssessmentsService } from './shared/services/assessments.service';

import { AppSharedModule } from '../../app.sharedmodule';

import { SharedModule } from '../../shared/shared-module';

import { OccupationListComponent } from './shared/occupation-list/occupation-list.component';
import { OccCareerHeaderComponent } from '../../modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from '../../modules/occ-details/shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from '../../modules/occ-details/shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from '../../modules/occ-details/shared/occ-index/occ-index-component';
import { OSCompareComponent } from './occ-sort/compareOcc/compare-component';
import { IPAssessmentDirective } from './shared/assessments-directives/ip-assessment-directive';
const routes: Routes = [{
    path: '', component: InterestProfilerShComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "prefix" },
        { path: 'intro', component: IPSFIntroComponent },
        { path: 'assessment', component: IPSFAssessmentComponent },//, canActivate: [ActivatingClass] },
        { path: 'result', component: IPSFResultComponent },
        { path: 'restore', component: IPSFRestoreComponent },
         { path: 'occlist', component: IPSFOccListComponent },
      { path: 'occCareer', component: OccCareerHeaderComponent }, 
      { path: 'occCluster', component: OccClusterHeaderComponent },    
      { path: 'occEmergCareer', component: OccEmergHeaderComponent } ,
      { path: 'occIndex', component: OccIndexComponent } ,
      { path: 'compare' , component: OSCompareComponent },

    ]
}];

@NgModule({
    imports: [  // BrowserModule,
        // CommonModule,
        // 
        AppSharedModule.forRoot(),
        // AssesmentsSharedModule,
        /* SharedModule,
         HttpModule, FormsModule,
         ToasterModule, NgbModule, ReactiveFormsModule,
         TranslateModule, GridModule,*/

        FrameworkModule,

        RouterModule.forChild(routes)],
    declarations: [
        IPSFAssessmentComponent,
        IPSFIntroComponent, IPSFOccListComponent,
        IPSFRestoreComponent, IPSFResultComponent,
        InterestProfilerShComponent,IPAssessmentDirective

    ],
    providers: [
        /*TranslateService, AssessmentsService,
        SharedService, ApiCallClass,
        ServerApi, Utilities*/
    ]
})
export class InterestProfilerShModule { }