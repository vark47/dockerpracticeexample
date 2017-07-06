
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input, Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, RouterOutlet } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GridModule } from '../../../modules/framework/grid.module';
import { AppModule } from '../../../app.module';

import { FrameworkModule } from '../../framework/framework.module';

import { EnterpreneurQuizComponent } from './entrepreneur-quiz.component';
import { EQIntroComponent } from './intro/eq-intro.component';
import { EQAssessmentComponent } from './assessment/eq-assessment.component';
import { EQResultComponent } from './result/eq-result.component';
import { EQRestoreComponent } from './restore/eq-restore.component';

import { StaticHeaderComponent } from '../shared/header-footer/header.component';
import { AssessmentHeaderComponent } from '../shared/assessment-header/assessment-header.component';


import { ApiCallClass } from '../../../shared/apicall.model';
import { ServerApi } from '../../../shared/app.apicall.service';
import { Utilities } from '../../../shared/utilities.class';

import { AssessmentsService } from '../shared/services/assessments.service';

import { AssesmentsSharedModule } from '../assessments-shared-module';

import { SharedModule } from '../../../shared/shared-module';
import { OccupationListComponent } from '../shared/occupation-list/occupation-list.component';
import { ClassDirective } from '../shared/assessments-directives/assessment-class-directive';
import { EqAssessmentDirective } from '../shared/assessments-directives/eq-assessment-directive';
import { AppSharedModule } from '../../../app.sharedmodule';
import { UnSavedChangesCanActive } from '../../../shared/unsaved-canActivate';
import { ActivatingClass } from '../../../shared/activateGuard';

const routes: Routes = [{
    path: '', component: EnterpreneurQuizComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "prefix" },
        { path: 'intro', component: EQIntroComponent },
        { path: 'assessment', component: EQAssessmentComponent, canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass] },//, canActivate: [ActivatingClass] },
        { path: 'result', component: EQResultComponent },
        { path: 'restore', component: EQRestoreComponent }

    ]
}];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
    ],
    declarations: [
        EnterpreneurQuizComponent, EQIntroComponent,
        EQAssessmentComponent, EQResultComponent,
        EQRestoreComponent, ClassDirective, EqAssessmentDirective
    ],
    providers: [
    ],
})
export class EnterpreneurQuizModule {
}