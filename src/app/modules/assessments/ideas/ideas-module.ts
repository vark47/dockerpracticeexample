
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input, Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, RouterOutlet } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FrameworkModule } from '../../../modules/framework/framework.module';
import { GridModule } from '../../../modules/framework/grid.module';

import { IdeasComponent } from './ideas-component';
import { IdeasIntroComponent } from './intro/ideas-intro.component';
import { IdeasAssessmentComponent } from './assessment/ideas-assessment.component';
import { IdeasResultComponent } from './result/ideas-result.component';
import { IdeasRestoreComponent } from './restore/ideas-restore.component';

        
import { StaticHeaderComponent } from '../shared/header-footer/header.component';
import { AssessmentHeaderComponent } from '../shared/assessment-header/assessment-header.component';


import { ApiCallClass } from '../../../shared/apicall.model';
import { ServerApi } from '../../../shared/app.apicall.service';
import { Utilities } from '../../../shared/utilities.class';

import { AssessmentsService } from '../shared/services/assessments.service';

import { AppSharedModule } from '../../../app.sharedmodule';

import { SharedModule } from '../../../shared/shared-module';


const routes: Routes = [{
    path: '', component: IdeasComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "prefix" },
        { path: 'intro', component: IdeasIntroComponent },
        { path: 'assessment', component: IdeasAssessmentComponent },//, canActivate: [ActivatingClass] },
        { path: 'result', component: IdeasResultComponent },
        { path: 'restore', component: IdeasRestoreComponent }
     

    ]
}];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        FrameworkModule,
        RouterModule.forChild(routes)],
    declarations: [
        IdeasAssessmentComponent,
        IdeasIntroComponent,
        IdeasRestoreComponent, IdeasResultComponent,
        IdeasComponent
    ],
    providers: [
        /*, AssessmentsService,
        SharedService, ApiCallClass,
        ServerApi, Utilities*/
    ]
})
export class IdeasModule { 
   constructor(){
        alert("coming in IdeasModule");
   }
}