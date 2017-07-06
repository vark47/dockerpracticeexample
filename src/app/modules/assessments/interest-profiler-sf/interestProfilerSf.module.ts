
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input, Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, RouterOutlet } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FrameworkModule } from '../../../modules/framework/framework.module';
import { GridModule } from '../../../modules/framework/grid.module';

import { InterestProfilerShComponent } from './interest-profiler-sf.component';
import { IPSFIntroComponent } from './intro/ipsf-intro.component';
import { IPSFAssessmentComponent } from './assessment/ipsf-assessment.component';
import { IPSFResultComponent } from './result/ipsf-result.component';
import { IPSFRestoreComponent } from './restore/ipsf-restore.component';
import { IPSFOccListComponent } from './occlist/ipsf-occ-list.component';

import { StaticHeaderComponent } from '../shared/header-footer/header.component';
import { AssessmentHeaderComponent } from '../shared/assessment-header/assessment-header.component';


import { ApiCallClass } from '../../../shared/apicall.model';
import { ServerApi } from '../../../shared/app.apicall.service';
import { Utilities } from '../../../shared/utilities.class';

import { AssessmentsService } from '../shared/services/assessments.service';

import { AppSharedModule } from '../../../app.sharedmodule';

import { SharedModule } from '../../../shared/shared-module';

import { OccupationListComponent } from '../shared/occupation-list/occupation-list.component';
import { OccCareerHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from '../../../modules/occ-details/shared/occ-index/occ-index-component';
import { OSCompareComponent } from '../occ-sort/compareOcc/compare-component';
import { IPAssessmentDirective } from '../shared/assessments-directives/ip-assessment-directive';
import { UnSavedChangesCanActive } from '../../../shared/unsaved-canActivate';
import { ActivatingClass } from '../../../shared/activateGuard';
const routes: Routes = [{
    path: '', component: InterestProfilerShComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "prefix" },
        { path: 'intro', component: IPSFIntroComponent },
        { path: 'assessment', component: IPSFAssessmentComponent, canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass] },//, canActivate: [ActivatingClass] },
        { path: 'result', component: IPSFResultComponent },
        { path: 'restore', component: IPSFRestoreComponent },
        { path: 'occlist', component: IPSFOccListComponent },
        { path: 'occCareer', component: OccCareerHeaderComponent },
        { path: 'occCluster', component: OccClusterHeaderComponent },
        { path: 'occEmergCareer', component: OccEmergHeaderComponent },
        { path: 'occIndex', component: OccIndexComponent },
        { path: 'compare', component: OSCompareComponent },

    ]
}];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        FrameworkModule,
        RouterModule.forChild(routes)],
    declarations: [
        IPSFAssessmentComponent,
        IPSFIntroComponent, IPSFOccListComponent,
        IPSFRestoreComponent, IPSFResultComponent,
        InterestProfilerShComponent, IPAssessmentDirective
    ],
    providers: []
})
export class InterestProfilerShModule { }