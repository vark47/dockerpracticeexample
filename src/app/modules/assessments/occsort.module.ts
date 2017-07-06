
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input, Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, RouterOutlet } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { ToasterModule, ToasterService } from 'angular2-toaster';

import { GridModule } from '../../modules/framework/grid.module';
import { AppSharedModule } from '../../app.sharedmodule';
import { SharedModule } from '../../shared/shared-module';
import { OccSortComponent } from './occ-sort/occ-sort.component';


import { SharedService } from '../../shared/shared.service';
import { ApiCallClass } from '../../shared/apicall.model';
import { ServerApi } from '../../shared/app.apicall.service';
import { Utilities } from '../../shared/utilities.class';
import { AssessmentsService } from './shared/services/assessments.service';


import { OSIntroComponent } from './occ-sort/intro/os-intro.component';
import { FactorsComparison } from './occ-sort/factors-comparison/factors-comparison.component';
import { OSAssessmentComponent } from './occ-sort/assessment/range/os-assessment-range.component';
import { OSFactorsAssessmentComponent } from './occ-sort/assessment/factors/os-assessment-factors.component';
import { OSResultComponent } from './occ-sort/result/os-result.component';
import { OSRestoreComponent } from './occ-sort/restore/os-restore.component';


import { OccupationListComponent } from './shared/occupation-list/occupation-list.component';
import { OccCareerHeaderComponent } from '../../modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from '../../modules/occ-details/shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from '../../modules/occ-details/shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from '../../modules/occ-details/shared/occ-index/occ-index-component';
import { OSCompareComponent } from './occ-sort/compareOcc/compare-component';
const routes: Routes = [{
    path: '',
    component: OccSortComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "prefix" },
        { path: 'intro', component: OSIntroComponent },
        { path: 'comparison', component: FactorsComparison },
        {
            path: 'assessment', component: OSAssessmentComponent, // canActivate: [ActivatingClass]
        },
        { path: 'factors', component: OSFactorsAssessmentComponent },
        { path: 'restore', component: OSRestoreComponent },
        { path: 'result', component: OSResultComponent },
        { path: 'occCareer', component: OccCareerHeaderComponent }, 
        { path: 'occCluster', component: OccClusterHeaderComponent },    
        { path: 'occEmergCareer', component: OccEmergHeaderComponent } ,
        { path: 'occIndex', component: OccIndexComponent } ,
        { path: 'compare' , component: OSCompareComponent },
        { path: '**', redirectTo: "intro", pathMatch: "prefix" },
    ]
}];

@NgModule({
    imports: [AppSharedModule.forRoot(),
    // AssesmentsSharedModule,
    /*  SharedModule,
      HttpModule, FormsModule,
      ToasterModule, NgbModule, ReactiveFormsModule,
      TranslateModule, GridModule,*/
    RouterModule.forChild(routes)],
    declarations: [OccSortComponent, OSIntroComponent, FactorsComparison,
        OSFactorsAssessmentComponent, OSAssessmentComponent, OSRestoreComponent,
        OSResultComponent
    ],
    providers: [
        /* TranslateService, AssessmentsService,
         SharedService, ApiCallClass,
         ServerApi, Utilities*/
    ]
})
export class OccSortModule { }
