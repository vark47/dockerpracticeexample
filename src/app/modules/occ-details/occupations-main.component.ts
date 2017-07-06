import { Component, OnInit } from '@angular/core';

import { Route, Router, ActivatedRoute } from '@angular/router';

import { WidgetDynamicComponent } from '../framework/layouts/widget.component';

import { Utilities } from '../../shared/utilities.class';

@Component({
    // moduleId: module.id,
    selector: 'occupation-entry',
    template: `
            <div id="wrapper-plp">
            <div id="main-wrapper-plp">
                 <div id="main-plp">
                <dynamic-layout-tag [componentTypes]="componentType" [ItemsList]="itemsList"></dynamic-layout-tag>

                <static-footer class="footerheightlength" ></static-footer>
                </div>
                </div></div>
            `
})
export class OccupationEntryComponent implements OnInit {
    componentType = WidgetDynamicComponent;
    itemsList;
    message;
    defaultPage = '';
    footerval;
    footervalip;
    footerPostion = 0;
    viewValue = 0;
    constructor(private utils: Utilities, private actRoute: ActivatedRoute, private router: Router) {
        /*this.actRoute.queryParams.subscribe(params => {

            this.defaultPage = params["page"];
            if (this.defaultPage != '' && this.defaultPage != undefined) {
                this.router.navigate([this.defaultPage], { relativeTo: this.actRoute });
            }
        });*/
        document.title="Careers";
    }

    ngOnInit() {
        // alert("in OccupationEntryComponent")
        let frame = this.utils.getFrameworkComponent('modOccs');

        // let items = this.utils.getItemsList(frame.compList, false);
        // this.itemsList = items;


        // // alert('assessment-header items are:' + JSON.stringify(this.itemsList));
        // this.utils.localStorageSet('itemsList', JSON.stringify(this.itemsList));

        //  alert("asmnt header itemsList:" + JSON.stringify(items));
        // this.componentType = frame.component;
       this.itemsList =  {"menuHighlightStatus":false,
                            "menuItems":[{"name":"Careers","url":"./occdetails/occIndex",
                            "image":"/assets/images/enterpreneurial-icon.png",
                            "color":"#0a8f72"}]}
    this.utils.localStorageSet('itemsList', JSON.stringify(this.itemsList));
    // alert('assessment-header items are:' + JSON.stringify(this.itemsList));
    this.componentType = frame.component;
        //  this.router.navigateByUrl('./interestProfilerSf/intro');

    }

}