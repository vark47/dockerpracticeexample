/** Angualr2 Libaries **/ 
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { NgModule, Input, Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule, Routes, RouterOutlet } from '@angular/router';

/** Modules and Components **/ 
import { FrameworkModule } from '../../../modules/framework/framework.module';
import { GridModule } from '../../../modules/framework/grid.module';
import { AppSharedModule } from '../../../app.sharedmodule';
import { SharedModule } from '../../../shared/shared-module';

import { WILStartComponent } from './work-importance.component';
import { WILIntroComponent } from './intro/wil-intro.component';
import { WILAssessmentComponent } from './assessment/wil-assessment.component';
import { WILResultComponent } from './result/wil-result.component';
import { WILRestoreComponent } from './restore/wil-restore.component';
import { StaticHeaderComponent } from '../shared/header-footer/header.component';
import { AssessmentHeaderComponent } from '../shared/assessment-header/assessment-header.component';

// import { OccCareerHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-career-header-component';
// import { OccClusterHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-cluster-header-component';
// import { OccEmergHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/emergCareers-header-component';
// import { OccIndexComponent } from '../../../modules/occ-details/shared/occ-index/occ-index-component';
// import { OSCompareComponent } from '../occ-sort/compareOcc/compare-component';
/* Services**/
import { ApiCallClass } from '../../../shared/apicall.model';
import { ServerApi } from '../../../shared/app.apicall.service';
import { Utilities } from '../../../shared/utilities.class';
import { AssessmentsService } from '../shared/services/assessments.service';

import { UnSavedChangesCanActive } from '../../../shared/unsaved-canActivate';
import { ActivatingClass } from '../../../shared/activateGuard';

const routes: Routes = [{
    path: '', component: WILStartComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "prefix" },
        { path: 'intro', component: WILIntroComponent },
        { path: 'assessment', component: WILAssessmentComponent,canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass] },//, canActivate: [ActivatingClass] },
        { path: 'result', component: WILResultComponent },
        { path: 'restore', component: WILRestoreComponent },
        // { path: 'occCareer', component: OccCareerHeaderComponent },
        // { path: 'occCluster', component: OccClusterHeaderComponent },
        // { path: 'occEmergCareer', component: OccEmergHeaderComponent },
        // { path: 'occIndex', component: OccIndexComponent },
        // { path: 'compare', component: OSCompareComponent },

    ]
}];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        FrameworkModule,
        RouterModule.forChild(routes)],
    declarations: [
        WILAssessmentComponent,
        WILIntroComponent,
       WILRestoreComponent, WILResultComponent,
        WILStartComponent
    ],
    providers: []
})
export class WILModule { }