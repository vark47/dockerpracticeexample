import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule, Router } from '@angular/router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

import { AppComponent } from './app.component';
import { LoginModule } from './modules/login/login-module';
import { LoginRoutingModule } from './modules/login/login.routing';
//import { AssesmentsSharedModule } from '../app/modules/assessments/assessments-shared-module';
import { AssessmentSharedRouting } from '../app/modules/assessments/assessments-shared-routing';
import { occDetailModule } from '../app/modules/occ-details/occ-details-module';
import { OccDetailsRoutingModule } from '../app/modules/occ-details/occ-details-routing';
import { Utilities } from './shared/utilities.class';
import { ServerApi } from './shared/app.apicall.service';


import { ApiCallClass } from './shared/apicall.model';
import { AuthManager } from './shared/authmanager';
import { ActivatingClass } from './shared/activateGuard';
import { EventDispatchService } from './shared/event-dispatch.service';
import { NgbdModalContent, NgbdModalLoaderContent, AssessmentModalPopups,  SnackBar } from './shared/shared-modal-component';
//import { AssessmentModalPopups } from './shared/shared-modal-component';

import { GridModule } from './modules/framework/grid.module';
import { ListDynamicComponent } from './modules/framework/layouts/list.component';
import { TilesDynamicComponent } from './modules/framework/layouts/tiles.component';
import { WidgetDynamicComponent } from './modules/framework/layouts/widget.component';
import { TileDesignComponent } from './modules/framework/layouts/tiles-design/tiles-design.component';

import { FrameworkComponent } from './modules/framework/framework.component';

import { AssessmentHeaderComponent } from './modules/assessments/shared/assessment-header/assessment-header.component';

import { EnterpreneurQuizComponent } from './modules/assessments/entrepreneur-quiz/entrepreneur-quiz.component';
import { EQIntroComponent } from './modules/assessments/entrepreneur-quiz/intro/eq-intro.component';
import { EQAssessmentComponent } from './modules/assessments/entrepreneur-quiz/assessment/eq-assessment.component';
import { EQResultComponent } from './modules/assessments/entrepreneur-quiz/result/eq-result.component';
import { EQRestoreComponent } from './modules/assessments/entrepreneur-quiz/restore/eq-restore.component';

import { InterestProfilerShComponent } from './modules/assessments/interest-profiler-sf/interest-profiler-sf.component';
import { IPSFIntroComponent } from './modules/assessments/interest-profiler-sf/intro/ipsf-intro.component';
import { IPSFAssessmentComponent } from './modules/assessments/interest-profiler-sf/assessment/ipsf-assessment.component';
import { IPSFResultComponent } from './modules/assessments/interest-profiler-sf/result/ipsf-result.component';
import { IPSFRestoreComponent } from './modules/assessments/interest-profiler-sf/restore/ipsf-restore.component';
import { IPSFOccListComponent } from './modules/assessments/interest-profiler-sf/occlist/ipsf-occ-list.component';
import { OccSortComponent } from './modules/assessments/occ-sort/occ-sort.component';
import { OSIntroComponent } from './modules/assessments/occ-sort/intro/os-intro.component';
import { FactorsComparison } from './modules/assessments/occ-sort/factors-comparison/factors-comparison.component';
import { OSAssessmentComponent } from './modules/assessments/occ-sort/assessment/range/os-assessment-range.component';
import { OSFactorsAssessmentComponent } from './modules/assessments/occ-sort/assessment/factors/os-assessment-factors.component';
import { OSResultComponent } from './modules/assessments/occ-sort/result/os-result.component';
import { OSRestoreComponent } from './modules/assessments/occ-sort/restore/os-restore.component';

import { IPAssessmentDirective } from './modules/assessments/shared/assessments-directives/ip-assessment-directive';
import { EqAssessmentDirective } from './modules/assessments/shared/assessments-directives/eq-assessment-directive';
import { StaticFooterComponent } from './modules/assessments/shared/header-footer/footer.component';
import { StaticHeaderComponent } from './modules/assessments/shared/header-footer/header.component';
import { ClassDirective } from './modules/assessments/shared/assessments-directives/assessment-class-directive';

import { OccupationListComponent } from './modules/assessments/shared/occupation-list/occupation-list.component';

import { SharedModule } from './shared/shared-module';

import { AssessmentEntryComponent } from './modules/assessments/assessments-main.component';
import { AssesmentsSharedModule } from './modules/assessments/assessments-shared-module';
import { EnterpreneurQuizModule } from './modules/assessments/entrepreneur-quiz/entquiz.module';
// import { APP_STATES } from './app.states'; 
import { OccupationEntryComponent } from './modules/occ-details/occupations-main.component';

import { PLPSectionsModule } from './modules/PLP/plp-shared-module';
import { AppSharedModule } from './app.sharedmodule';
import { UnSavedChangesCanActive } from './shared/unsaved-canActivate';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
@NgModule({
  declarations: [

    AppComponent,
    NgbdModalContent,
    //AssessmentEntryComponent,
    // AssessmentHeaderComponent,
     AssessmentModalPopups, SnackBar,
    /*EQIntroComponent, EnterpreneurQuizComponent,
    EQAssessmentComponent, EQResultComponent, EQRestoreComponent, */
    /*  IPSFAssessmentComponent,
      IPSFIntroComponent, IPSFOccListComponent,
      IPSFRestoreComponent, IPSFResultComponent,
      InterestProfilerShComponent, 
      
      IPAssessmentDirective, EqAssessmentDirective, ClassDirective,
      OSIntroComponent, FactorsComparison,
       OSFactorsAssessmentComponent, OSAssessmentComponent,OSRestoreComponent,
       OSResultComponent,
      OccSortComponent, StaticHeaderComponent, StaticFooterComponent,
      OccupationListComponent,*/
    NgbdModalLoaderContent,

    //TileDesignComponent


  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,

    TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }),
    GridModule.withComponents([
      WidgetDynamicComponent,
      TilesDynamicComponent,
      ListDynamicComponent]),

    SharedModule,
    CommonModule,
    RouterModule,
    LoginRoutingModule,
    // PLPSharedRoutingModule,
    // AssessmentSharedRouting,
    OccDetailsRoutingModule,
    //AppRoutingModule,
    LoginModule,

    occDetailModule,
    NgbModule.forRoot(),
    
    AssesmentsSharedModule,
    PLPSectionsModule,
    AppSharedModule.forRoot(),
    InfiniteScrollModule
    //EnterpreneurQuizModule,

    // MaterialModule.forRoot(),JsonSchemaFormModule.forRoot(),
  ],
  providers: [
    EventDispatchService, Utilities, NgbActiveModal,
    TranslateService, AuthManager, ActivatingClass,
    ServerApi, ApiCallClass, NgbdModalLoaderContent, UnSavedChangesCanActive
  ],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent, NgbdModalLoaderContent,// TileDesignComponent
    //AssessmentModalPopups, AssessmentUnSavedChanges
     AssessmentModalPopups,
  ]
})


export class AppModule { 
  constructor(private translate : TranslateService){
    translate.addLangs(["English", "Creole", "Español"]);
        translate.setDefaultLang('English');

        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/English|Español|Creole/) ? browserLang : 'English');
        //alert("translate in AppModule----"+translate.getDefaultLang());
  }
}

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}