import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Utilities } from '../../../../shared/utilities.class';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

import { ISlimScrollOptions } from 'ng2-slimscroll';

declare var $: any;
@Component({
    selector: 'compare-occ',
    templateUrl: './compare-layout.html',
})

export class OSCompareComponent implements OnInit {

    dom: BrowserDomAdapter;
    Firstresult = [];
    SecondResult = [];
    comOccName = [];
    comOccId = [];
    IndexkeyValue = [];
    iconClass = [];
    colorClass = [];
    outLookHeading = [];
    CompWageLabel = [];
    CompWageLabel1 = [];
    filter = [0, 999, 999, 999, 999, 999];
    finalCompArray = [];
    finalCompArray2 = [];
    growthimgsrc = [];
    occID = "";
    compareNames = [];
    occName = "";
    accountId = "";
    opts;
    backAssessmentValue = true;

    constructor(private router: Router, private renderer: Renderer, private utils: Utilities,
        private apiJson: ApiCallClass, private apiJson1: ApiCallClass, private serverApi: ServerApi,
        private activatedRoute: ActivatedRoute) {
        let rtArr = this.router.url.split('/');
        for (let i = 0; i < rtArr.length; i++) {
            if (rtArr[i] == 'occupations') {
                this.backAssessmentValue = false;
                break;
            }
            else {
                this.backAssessmentValue = true;
            }
        }
        this.dom = new BrowserDomAdapter();
        this.activatedRoute.queryParams.subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.occID = params['occId'];
            this.occName = params['occName'];
        });
        this.accountId = this.utils.getAccountId();
        this.opts = {
            position: 'right',
            barBackground: '#555',
            gridBackground: '#016269',
            barWidth: '6',
            gridWidth: '4',
            barBorderRadius: '2'
        }
    }

    ngOnInit() {
        this.utils.showLoading();
        let compareTwoOcc = [];
        let OccIds = [];
        /** Getv the occupation id and name that is selected by user in occ list */

        OccIds = this.occID.split('&');
        compareTwoOcc = this.occName.split('&');

        for (let i = 0; i < OccIds.length; i++) {
            this.comOccName.push(compareTwoOcc[i]);
            this.comOccId.push(OccIds[i]);
        }
        /** Here we are calling two api calls to get the result of the 
         * given occupations
         */
        this.apiJson = new ApiCallClass();
        this.apiJson.method = "GET";
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = "Occ/v1/";
        this.apiJson.endUrl = "pages";
        let compareInfo = {
            input_data: [
                {
                    "param_type": "path",
                    "params": ["occ", OccIds[0], this.accountId]
                },
                {
                    "param_type": "query",
                    "params": {
                        "sections": "Overview,TaskList,WageLevels,OutlookRatings,WorkingConditions,Preparation",
                        "states": "US", "lang": "en", "stateAbbr": "IC"
                    }
                },
                {
                    "param_type": "body",
                    "params": {

                    }
                }
            ]
        };

        let user = JSON.stringify(compareInfo);
        this.apiJson.data = user;
        compareTwoOcc[0] = this.apiJson;
        this.apiJson1 = new ApiCallClass();
        let compareInfo1 = {
            input_data: [
                {
                    "param_type": "path",
                    "params": ["occ", OccIds[1], this.accountId]
                },
                {
                    "param_type": "query",
                    "params": {
                        "sections": "Overview,TaskList,WageLevels,OutlookRatings,WorkingConditions,Preparation",
                        "states": "US", "lang": "en", "stateAbbr": "IC"
                    }
                },
                {
                    "param_type": "body",
                    "params": {

                    }
                }
            ]
        };

        this.apiJson1.method = "GET";
        this.apiJson1.sessionID = this.utils.getAuthKey();
        this.apiJson1.moduleName = "Occ/v1/";
        this.apiJson1.endUrl = "pages";
        let user1 = JSON.stringify(compareInfo1);
        this.apiJson1.data = user1;
        compareTwoOcc[1] = this.apiJson1;
        /** compareTwoOcc array contain data of two api call */
        this.serverApi.callApi(compareTwoOcc).subscribe((res) => {
            /** After hitting the api we get the result of 
             * frst and second occupations
             */
            for (let i = 0; i < res[0].Result.length; i++) {
                /** Since we get the same same result length for both first and second 
                 * occupations take the length of any result
                 */
                this.IndexkeyValue.push(res[0].Result[i].sectionName);
                if (res[0].Result[i].sectionName == "Overview") {
                    this.iconClass.push("icon-overview");
                    this.colorClass.push("overview_update-plp3");
                    this.Firstresult.push(res[0].Result[i].sectionResults);
                    this.SecondResult.push(res[1].Result[i].sectionResults);
                }
                else if (res[0].Result[i].sectionName == "TaskList") {
                    this.colorClass.push("ec-card-colr-powdblue");
                    this.iconClass.push("icon-job-list")
                    this.Firstresult.push(res[0].Result[i].sectionResults);
                    this.SecondResult.push(res[1].Result[i].sectionResults);
                }
                else if (res[0].Result[i].sectionName == "WageLevels") {
                    this.colorClass.push("rc-card-body1");
                    this.iconClass.push("icon-clu_finance");
                    this.Firstresult.push([res[0].Result[i].sectionResults]);
                    this.SecondResult.push([res[1].Result[i].sectionResults]);
                    this.firstWageValue(res[0].Result[i].sectionResults);
                    this.secondWageValue(res[1].Result[i].sectionResults)
                }
                else if (res[0].Result[i].sectionName == "OutlookRatings") {
                    this.colorClass.push("rc-card-body3");
                    this.iconClass.push("icon-employment-outlook")
                    this.Firstresult.push([res[0].Result[i].sectionResults]);
                    this.SecondResult.push([res[1].Result[i].sectionResults]);

                }
                else if (res[0].Result[i].sectionName == "WorkingConditions") {
                    this.colorClass.push("careere-dark-blue-card");
                    this.iconClass.push("icon-work-setting")
                    this.Firstresult.push(res[0].Result[i].sectionResults);
                    this.SecondResult.push(res[1].Result[i].sectionResults);
                }
                else if (res[0].Result[i].sectionName == "Preparation") {
                    this.colorClass.push("learning-style-card");
                    this.iconClass.push("icon-preparation")
                    this.Firstresult.push(res[0].Result[i].sectionResults);
                    this.SecondResult.push(res[1].Result[i].sectionResults);
                }
            }
            this.getCompareText();
        })
    }
    /** Below code is to get the text of section names dynamically form api
     * we use occ text api call and retrive the result in that we will 
     * show what are the session are available inthis compare screen
     */
    getCompareText() {
        let textNames = [];
        let scetionNames = [];
        this.apiJson.method = "GET";
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = "Occ/v1/"; let GlancedataText = {}; GlancedataText = {
            input_data: [
                {
                    "param_type": "path",
                    "params": ["occ", "text", this.accountId]
                },
                {
                    "param_type": "query",
                    "params": { "lang": "en", "stateAbbr": "IC" }
                },
                {
                    "param_type": "body",
                    "params": {}
                }
            ]
        }
        let user = JSON.stringify(GlancedataText);
        this.apiJson.endUrl = "pages"; this.apiJson.data = user; this.serverApi.callApi([this.apiJson]).subscribe((res) => {
            if (res[0].Success + "" == "true") {
                for (let l = 0; l < res[0].Result.sections.length; l++) {
                    if (res[0].Result.sections[l].section == "Overview" || res[0].Result.sections[l].section == "TaskList" ||
                        res[0].Result.sections[l].section == "WageLevels" || res[0].Result.sections[l].section == "OutlookRatings" ||
                        res[0].Result.sections[l].section == "WorkingConditions" || res[0].Result.sections[l].section == "Preparation") {
                        textNames.push(res[0].Result.sections[l].title);
                        scetionNames.push(res[0].Result.sections[l].section)
                    }
                }
                for (let i = 0; i < this.IndexkeyValue.length; i++) {
                    for (let j = 0; j < scetionNames.length; j++) {
                        if (this.IndexkeyValue[i] == scetionNames[j]) {
                            this.compareNames.push(textNames[j]);
                        }
                    }
                }
            }
            this.utils.hideLoading();
        }, this.utils.handleError);
    }
    /** firstWageValue method is to push all the values of first result
     *  according to their label names and the state Name 
     * so that the label contain states and ites payperiod and 
     * respective median wages of first occupation that is selected
     */
    firstWageValue(firstRes) {
        let LabelAvailable = false;
        let uniValName = true;
        let jsonValues = [];
        /** Get first wage result and push it to an json array */
        for (let i = 0; i < firstRes.periods.length; i++) {
            let allValues = [];
            for (let j = 0; j < firstRes.periods[i].wages.length; j++) {
                for (let loc = 0; loc < firstRes.periods[i].wages[j].locations.length; loc++) {
                    allValues.push({
                        label: firstRes.periods[i].wages[j].label,
                        location: firstRes.periods[i].wages[j].locations[loc].location,
                        period: firstRes.periods[i].period,
                        median: firstRes.periods[i].wages[j].locations[loc].median
                    });
                }
            }
            jsonValues.push(allValues);
            /** Get all labels in first result and store it in an array */
            for (let j = 0; j < firstRes.periods[i].wages.length; j++) {
                for (let k = 0; k < this.CompWageLabel.length; k++) {
                    if (firstRes.periods[i].wages[j].label == this.CompWageLabel[k]) {
                        LabelAvailable = true;
                        break;
                    }
                    else {
                        LabelAvailable = false;
                    }
                }
                if (LabelAvailable == false) {
                    this.CompWageLabel.push([firstRes.periods[i].wages[j].label]);
                }

            }
        }
        /** converting jsonValues so that the json array contain label name and its child values  */
        let jsonArray1 = [];
        for (let variable1 = 0; variable1 < this.CompWageLabel.length; variable1++) {
            for (let variable2 = 0; variable2 < jsonValues.length; variable2++) {
                let localArray = [];
                for (let variable3 = 0; variable3 < jsonValues[variable2].length; variable3++) {
                    if (jsonValues[variable2][variable3].label == this.CompWageLabel[variable1]) {
                        localArray.push({
                            loc: jsonValues[variable2][variable3].location,
                            prd: jsonValues[variable2][variable3].period,
                            mdn: jsonValues[variable2][variable3].median
                        });
                    }
                }
                jsonArray1.push({
                    lab: this.CompWageLabel[variable1],
                    val: localArray
                });
            }
        }
        /** convert jsonArray1 based on label so that we can have 
         * all the values of same label in one array andget the all unique 
         * names of same label in one array
        */
        let CompWageUniName = [];
        let jsonArray2 = [];
        for (let variable1 = 0; variable1 < this.CompWageLabel.length; variable1++) {
            let localjson = [];
            let uniqueName = [];
            let isValAvail = false;
            for (let variable2 = 0; variable2 < jsonArray1.length; variable2++) {
                if (jsonArray1[variable2].lab == this.CompWageLabel[variable1]) {
                    for (let variable3 = 0; variable3 < jsonArray1[variable2].val.length; variable3++) {
                        localjson.push(jsonArray1[variable2].val[variable3]);
                        for (let k = 0; k < uniqueName.length; k++) {
                            if (jsonArray1[variable2].val[variable3].loc == uniqueName[k]) {
                                isValAvail = true;
                                break;
                            }
                            else { isValAvail = false; }
                        }
                        if (isValAvail == false) {
                            uniqueName.push(jsonArray1[variable2].val[variable3].loc);
                        }
                    }
                }
            }
            CompWageUniName.push(uniqueName);
            jsonArray2.push(localjson);
        }
        /** now in final json array we have the state and ite values according to their 
         * label name so that we can display all the values in our template for first result
         */
        for (let variable1 = 0; variable1 < jsonArray2.length; variable1++) {
            let finalRes = [];
            for (let variable2 = 0; variable2 < CompWageUniName[variable1].length; variable2++) {
                let parares = [];
                for (let j = 0; j < jsonArray2[variable1].length; j++) {
                    if (jsonArray2[variable1][j].loc == CompWageUniName[variable1][variable2]) {
                        parares.push([jsonArray2[variable1][j].prd, jsonArray2[variable1][j].mdn]);
                    }
                }
                finalRes.push({
                    plocV: CompWageUniName[variable1][variable2],
                    pVal: parares
                });
            }
            this.finalCompArray.push(finalRes);

        }

    }
    /** secondWageValue method is to push all the values of second result
     *  according to their label names and the state Name 
     * so that the label contain states and ites payperiod and 
     * respective median wages of second occupation that is selected
     */
    secondWageValue(secondRes) {
        let LabelAvailable1 = false;
        let jsonValues = [];

        /** Get second wage result and push it to an json array */

        for (let variable1 = 0; variable1 < secondRes.periods.length; variable1++) {
            let allValues = [];
            for (let j = 0; j < secondRes.periods[variable1].wages.length; j++) {
                for (let loc = 0; loc < secondRes.periods[variable1].wages[j].locations.length; loc++) {
                    allValues.push({
                        label: secondRes.periods[variable1].wages[j].label,
                        location: secondRes.periods[variable1].wages[j].locations[loc].location,
                        period: secondRes.periods[variable1].period,
                        median: secondRes.periods[variable1].wages[j].locations[loc].median
                    });
                }
            }
            jsonValues.push(allValues);
            /** Get all labels in second result and store it in an array */
            for (let j = 0; j < secondRes.periods[variable1].wages.length; j++) {
                for (let k = 0; k < this.CompWageLabel1.length; k++) {
                    if (secondRes.periods[variable1].wages[j].label == this.CompWageLabel1[k]) {
                        LabelAvailable1 = true;
                        break;
                    }
                    else { LabelAvailable1 = false; }
                }
                if (LabelAvailable1 == false) {
                    this.CompWageLabel1.push([secondRes.periods[variable1].wages[j].label]);
                }
            }
        }

        /** converting jsonValues so that the json array contain label name and its child values  */
        let jsonArray1 = [];
        for (let variable1 = 0; variable1 < this.CompWageLabel1.length; variable1++) {
            for (let variable2 = 0; variable2 < jsonValues.length; variable2++) {
                let localArray = [];
                for (let variable3 = 0; variable3 < jsonValues[variable2].length; variable3++) {
                    if (jsonValues[variable2][variable3].label == this.CompWageLabel1[variable1]) {
                        localArray.push({
                            loc: jsonValues[variable2][variable3].location,
                            prd: jsonValues[variable2][variable3].period,
                            mdn: jsonValues[variable2][variable3].median
                        });
                    }
                }
                jsonArray1.push({
                    lab: this.CompWageLabel1[variable1],
                    val: localArray
                });
            }
        }
        /** convert jsonArray1 based on label so that we can have 
         * all the values of same label in one array andget the all unique 
         * names of same label in one array
        */
        let CompWageUniName = [];
        let jsonArray2 = [];
        for (let variable1 = 0; variable1 < this.CompWageLabel1.length; variable1++) {
            let localjson = [];
            let uniqueName = [];
            let isValAvail = false;
            for (let variable2 = 0; variable2 < jsonArray1.length; variable2++) {
                if (jsonArray1[variable2].lab == this.CompWageLabel1[variable1]) {
                    for (let variable3 = 0; variable3 < jsonArray1[variable2].val.length; variable3++) {
                        localjson.push(jsonArray1[variable2].val[variable3]);
                        for (let k = 0; k < uniqueName.length; k++) {
                            if (jsonArray1[variable2].val[variable3].loc == uniqueName[k]) {
                                isValAvail = true;
                                break;
                            }
                            else { isValAvail = false; }
                        }
                        if (isValAvail == false) {
                            uniqueName.push(jsonArray1[variable2].val[variable3].loc);
                        }
                    }
                }
            }
            CompWageUniName.push(uniqueName);
            jsonArray2.push(localjson);
        }
        /** now in final json array we have the state and ite values according to their 
         * label name so that we can display all the values in our template for first result
         */
        for (let variable1 = 0; variable1 < jsonArray2.length; variable1++) {
            let finalRes = [];
            for (let variable2 = 0; variable2 < CompWageUniName[variable1].length; variable2++) {
                let parares = [];
                for (let j = 0; j < jsonArray2[variable1].length; j++) {
                    if (jsonArray2[variable1][j].loc == CompWageUniName[variable1][variable2]) {
                        parares.push([jsonArray2[variable1][j].prd, jsonArray2[variable1][j].mdn]);
                    }
                }
                finalRes.push({
                    plocV: CompWageUniName[variable1][variable2],
                    pVal: parares
                });
            }
            this.finalCompArray2.push(finalRes);

        }
    }
    /** This method is used to check on which list user clicked, so that
    * the remaining panels are closed and we show the only user clicked panel.
    * simply it is for collapsing the panel
    */
    methodfilter(valfil, index) {
        this.filter = [999, 999, 999, 999, 999, 999];
        this.filter[index] = valfil;
    }
    /** The below method is used to return the key value according to the given check value */
    valueOccIndexCheck(key, checkVal) {
        if (checkVal == 'ref') {
            return '#collapsed' + key;
        }
        else if (checkVal == 'controls') {
            return 'collapsed' + key;
        }
    }


    CareerList(check) {
        this.utils.showLoading();
        this.router.navigate(['../occIndex'], { relativeTo: this.activatedRoute, queryParams: { chk: check } });
    }



    backAssessment() {
        if (this.utils.sessionStorageGet("module") == 'ip') {
            this.router.navigate(['../occlist'], { relativeTo: this.activatedRoute });
        }
        else {
            this.router.navigate(['../result'], { relativeTo: this.activatedRoute });
        }
    }
}