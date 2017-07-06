import { Component, OnInit } from '@angular/core';

import { Route, Router, ActivatedRoute } from '@angular/router';

import { WidgetDynamicComponent } from '../framework/layouts/widget.component';

import { Utilities } from '../../shared/utilities.class';

@Component({
    selector: 'assessment-entry',
    template: `
            <div id="wrapper-plp">
            <div id="main-wrapper-plp">
                 <div id="main-plp">
                <dynamic-layout-tag [componentTypes]="componentType" [ItemsList]="itemsList"></dynamic-layout-tag>

                <static-footer class="footerheightlength" ></static-footer>
                </div> </div> </div>
            `
})
export class AssessmentEntryComponent implements OnInit {
    componentType = WidgetDynamicComponent;
    itemsList;
    message;
    defaultPage = '';
    footerval;
    footervalip;
    footerPostion = 0;
    viewValue = 0;
    constructor(private utils: Utilities, private actRoute: ActivatedRoute, private router: Router) {

        document.title = "Assessments";
    }

    ngOnInit() {
        let frame = this.utils.getFrameworkComponent('modSorts');

        let items = this.utils.getItemsList(frame.compList, false);
        this.itemsList = items;


        this.utils.localStorageSet('itemsList', JSON.stringify(this.itemsList));
        this.componentType = frame.component;

    }

}