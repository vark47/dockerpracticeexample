
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input, Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, RouterOutlet } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FrameworkModule } from '../../../modules/framework/framework.module';
import { GridModule } from '../../../modules/framework/grid.module';

import { CCIJrComponent } from './career-cluster.component';
import { CCIJrIntroComponent } from '../career-cluster-inventory/intro/cci-intro.component';
import { CCIJrAssessmentComponent } from '../career-cluster-inventory/assessment/cci-assessment.component';
import { CCIJrResultComponent } from '../career-cluster-inventory/result/cci-result.component';
import { CCIJrRestoreComponent } from '../career-cluster-inventory/restore/cci-restore.component';


import { StaticHeaderComponent } from '../shared/header-footer/header.component';
import { AssessmentHeaderComponent } from '../shared/assessment-header/assessment-header.component';


import { ApiCallClass } from '../../../shared/apicall.model';
import { ServerApi } from '../../../shared/app.apicall.service';
import { Utilities } from '../../../shared/utilities.class';

import { AssessmentsService } from '../shared/services/assessments.service';

import { AppSharedModule } from '../../../app.sharedmodule';

import { SharedModule } from '../../../shared/shared-module';
import { UnSavedChangesCanActive } from '../../../shared/unsaved-canActivate';
import { ActivatingClass } from '../../../shared/activateGuard';

const routes: Routes = [{
    path: '', component: CCIJrComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "prefix" },
        { path: 'intro', component: CCIJrIntroComponent },
        { path: 'assessment', component: CCIJrAssessmentComponent, canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass]},//, canActivate: [ActivatingClass] },
        { path: 'result', component: CCIJrResultComponent },
        { path: 'restore', component: CCIJrRestoreComponent }


    ]
}];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        FrameworkModule,
        RouterModule.forChild(routes)],
    declarations: [
        CCIJrAssessmentComponent,
        CCIJrIntroComponent,
        CCIJrRestoreComponent, CCIJrResultComponent,
        CCIJrComponent
    ],
    providers: [
        /*, AssessmentsService,
        SharedService, ApiCallClass,
        ServerApi, Utilities*/
    ]
})
export class CCIModule { }