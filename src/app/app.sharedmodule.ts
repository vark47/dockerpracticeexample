import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { AssessmentHeaderComponent } from './modules/assessments/shared/assessment-header/assessment-header.component';
import { EQAssessmentComponent } from './modules/assessments/entrepreneur-quiz/assessment/eq-assessment.component';
import { EQResultComponent } from './modules/assessments/entrepreneur-quiz/result/eq-result.component';
import { EQRestoreComponent } from './modules/assessments/entrepreneur-quiz/restore/eq-restore.component';
import { EQIntroComponent } from './modules/assessments/entrepreneur-quiz/intro/eq-intro.component';
import { EnterpreneurQuizComponent } from './modules/assessments/entrepreneur-quiz/entrepreneur-quiz.component';

import { OccupationListComponent } from './modules/assessments/shared/occupation-list/occupation-list.component';
import { IPSFAssessmentComponent } from './modules/assessments/interest-profiler-sf/assessment/ipsf-assessment.component';
import { IPSFIntroComponent } from './modules/assessments/interest-profiler-sf/intro/ipsf-intro.component';
import { IPSFOccListComponent } from './modules/assessments/interest-profiler-sf/occlist/ipsf-occ-list.component';
import { IPSFRestoreComponent } from './modules/assessments/interest-profiler-sf/restore/ipsf-restore.component';
import { IPSFResultComponent } from './modules/assessments/interest-profiler-sf/result/ipsf-result.component';
import { InterestProfilerShComponent } from './modules/assessments/interest-profiler-sf/interest-profiler-sf.component';

import { OSFactorsAssessmentComponent } from './modules/assessments/occ-sort/assessment/factors/os-assessment-factors.component';
import { OSAssessmentComponent } from './modules/assessments/occ-sort/assessment/range/os-assessment-range.component';
import { OSIntroComponent } from './modules/assessments/occ-sort/intro/os-intro.component';
import { FactorsComparison } from './modules/assessments/occ-sort/factors-comparison/factors-comparison.component';
import { OSRestoreComponent } from './modules/assessments/occ-sort/restore/os-restore.component';
import { OSResultComponent } from './modules/assessments/occ-sort/result/os-result.component';
import { OccSortComponent } from './modules/assessments/occ-sort/occ-sort.component';
import { AssessmentsService } from './modules/assessments/shared/services/assessments.service';
import { StaticFooterComponent } from './modules/assessments/shared/header-footer/footer.component';
import { StaticHeaderComponent } from './modules/assessments/shared/header-footer/header.component';

import { TileDesignComponent } from './modules/framework/layouts/tiles-design/tiles-design.component';
import { OccCareerHeaderComponent } from './modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from './modules/occ-details/shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from './modules/occ-details/shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from './modules/occ-details/shared/occ-index/occ-index-component';
import { OSCompareComponent } from './modules/assessments/occ-sort/compareOcc/compare-component';
import { AssessmentEntryComponent } from './modules/assessments/assessments-main.component';
import { OccupationEntryComponent } from './modules/occ-details/occupations-main.component';

/** For popup models */
import { AssessmentModalPopups } from './shared/shared-modal-component';

/** PLP component */
import { PlpComponent } from './modules/PLP/PLP-sections/PLP-sections.component';
import { PLPNavHeaderComponent } from './modules/PLP/shared/shared/PLP-nav-header.component';
import { ReflectionComponent } from './modules/PLP/shared/shared/reflection.component';
//import { PLPSectionsModule } from './modules/PLP/plp-shared-module';

import { ApiCallClass } from './shared/apicall.model';
import { ServerApi } from './shared/app.apicall.service';
import { Utilities } from './shared/utilities.class';
import { EventDispatchService } from './shared/event-dispatch.service';


import { SharedModule } from './shared/shared-module';
import { GridModule } from './modules/framework/grid.module';
import { FrameworkModule } from './modules/framework/framework.module';
// import { TranslateModule, TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { AssesmentsSharedModule } from './modules/assessments/assessments-shared-module';
import { Http, HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Router } from '@angular/router';
import { occDetailModule } from '../app/modules/occ-details/occ-details-module';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
@NgModule({
    imports: [
        TranslateModule,
        CommonModule,
        //  TranslateModule.forRoot({
        //     provide: TranslateLoader,
        //     useFactory: (createTranslateLoader),
        //     deps: [Http]
        // }), 
        FrameworkModule, GridModule, //AssesmentsSharedModule,
        SharedModule,
        HttpModule, FormsModule,
        NgbModule, ReactiveFormsModule,
        RouterModule, occDetailModule,
        //  PLPSectionsModule
        InfiniteScrollModule
    ],
    declarations: [
        AssessmentHeaderComponent,
        StaticHeaderComponent, OccupationListComponent,
        PLPNavHeaderComponent,// PlpComponent
        //TileDesignComponent
        ReflectionComponent,
        AssessmentEntryComponent, StaticFooterComponent, OccupationEntryComponent
        //AssessmentModalPopups, AssessmentUnSavedChanges
    ],
    exports: [TranslateModule,
        AssessmentHeaderComponent,
        StaticHeaderComponent,
        OccupationListComponent,
        // TranslateModule,
        CommonModule, SharedModule, GridModule, NgbModule, FormsModule, ReactiveFormsModule,
        //PLPSectionsModule,
        PLPNavHeaderComponent,// PlpComponent
        ReflectionComponent, occDetailModule,
        AssessmentEntryComponent, StaticFooterComponent, OccupationEntryComponent
        //AssessmentModalPopups
    ],
    providers: [

    ]
})
export class AppSharedModule {

    static forRoot() {
        return {
            ngModule: AppSharedModule,
            providers: [ //services that you want to share across modules
                // SharedService,
                // SharedService2
                // TranslateService,
            ]
        }
    }
}
// export function createTranslateLoader(http: Http) {
//     return new TranslateStaticLoader(http, 'assets/i18n', '.json');
// }