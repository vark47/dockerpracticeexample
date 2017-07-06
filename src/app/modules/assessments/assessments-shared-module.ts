import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentEntryComponent } from './assessments-main.component';

import { AppSharedModule } from '../../app.sharedmodule';

import { GridModule } from '../framework/grid.module';
import { FrameworkModule } from '../framework/framework.module';
const routes: Routes = [{ path: '', component: AssessmentEntryComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes), GridModule
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: []
})
export class AssesmentsSharedModule { }
