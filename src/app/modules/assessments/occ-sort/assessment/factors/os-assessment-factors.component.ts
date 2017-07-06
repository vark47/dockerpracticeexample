import { Component, OnDestroy, Renderer, ElementRef } from '@angular/core';
import { OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { Subscription } from "rxjs/Subscription";
import { messages } from '../../../../../shared/messages';
import { ApiCallClass } from '../../../../../shared/apicall.model';
import { ServerApi } from '../../../../../shared/app.apicall.service';
import { Utilities } from '../../../../../shared/utilities.class';
import { TranslateService } from 'ng2-translate';
import { AssessmentsService } from '../../../shared/services/assessments.service';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { AssessmentHeaderComponent } from '../../../shared/assessment-header/assessment-header.component';
declare var $: any;
let storedNames = [];
let FactorsList = [];
@Component({
    selector: 'os-assessment-factors',
    templateUrl: './os-assessment-factors.layout.html',
    styles: [`
  		.class-margin {
	        margin: 0px 0 0 17px;
  		}
  	`],
})
export class OSFactorsAssessmentComponent implements OnInit, OnDestroy {
    @ViewChild('itemsp2Val') el: ElementRef;
    browserDom: BrowserDomAdapter;
    occ_sort_factors = [];
    occ_sort_factors2 = [];
    dummyText = true;
    occ_factors_final_arr = [];
    rankFactors = "false";
    errorVal = false;
    textArr = [];
    marginClass = false;
    nextHide = true;
    close_e_mobile_prev = false;
    showdiv = false;
    transText;
    alert_mobile = true;
    select_plp2 = true;
    isDisableSelect = true;
    curVal = false;
    eventHolder = [];
    eventHolder1 = [];
    isDisable = true;
    isDisableNext = true;
    close_e_mobile = true;
    fa_times = true;
    focusVal;
    factorsArray1 = [];
    factorsArray2 = [];
    finalFactorsMob = [];
    finalArray = [1, 2, 3, 4, 5];
    emptybox = [1, 2, 3, 4, 5];
    strValue = [];
    nextFactorsValue = false;
    eventHolder2 = [];
    showImpFac = false;
    facNames; enterEventListener;
    subscription = new Subscription;
    constructor(private trackEvnt: AssessmentsService, private router: Router,
        private utils: Utilities, private activeRoute: ActivatedRoute,
        private assessOccFunction: AssessmentHeaderComponent, private apiJson: ApiCallClass, private serverApi: ServerApi,
        private translate: TranslateService, private renderer: Renderer, private elementRef: ElementRef,
    ) {
        this.browserDom = new BrowserDomAdapter();

    }



    visible = 0;
    count = 0;

    ngOnInit() {
        try {
            let ref = this;
            this.utils.sessionStorageSet("occFactorHeader", "false");
            this.browserDom.setStyle(this.browserDom.query('.view'), "position", "fixed");
            this.browserDom.setStyle(this.browserDom.query('.view'), "bottom", "0px");
            let widthVal = document.getElementById("fhid").offsetWidth + "px";
            ref.browserDom.setStyle(ref.browserDom.query('.view'), "width", widthVal);
            //alert("this.FactorsList--->"+this.errorVal);
            window.onresize = null;
            window.onscroll = null;
            this.nextFactorsValue = false;
            this.utils.sessionStorageRemove('occ_factors');
            this.utils.sessionStorageSet("isAssessment", "");
            this.utils.sessionStorageSet("savedPartialAsmnt", "");
            this.occ_sort_factors = [];
            this.occ_sort_factors2 = [];
            this.occ_factors_final_arr = [];
            storedNames = [];
            this.facNames = JSON.parse(this.utils.sessionStorageGet("factors"));
            /** We are spliting the factors into two column */
            let occ_sort_length = this.facNames.length / 2;
            for (var i = 0; i < occ_sort_length; i++) {
                /** Adding the first half occ factors to a variable */
                this.occ_sort_factors.push(i);
            }
            for (var i = occ_sort_length; i < this.facNames.length; i++) {
                /** Adding the second half occ factors to a variable */
                this.occ_sort_factors2.push(i);
            }
            this.enterEventListener = function (event) {
                try {
                    if (document.getElementById("fhid") != null) {
                        let widthVal = document.getElementById("fhid").offsetWidth + "px";
                        let heightVal = document.getElementById("fhid").offsetHeight + "px";
                        var elmnt = document.getElementById("main-plp");
                        let scrollHeight = document.getElementById("main-plp").scrollHeight;
                        // console.log(elmnt.scrollTop + "elmnt.scrollTop");
                        //    console.log("scrolltop--->"+(document.body.scrollTop + window.innerHeight)+"----scrollHeight--->"+scrollHeight);
                        if ((elmnt.scrollTop + elmnt.offsetHeight) >= scrollHeight) {
                            console.log("in if");
                            ref.browserDom.setStyle(ref.browserDom.query('.view'), "bottom", heightVal);
                            ref.browserDom.setStyle(ref.browserDom.query('.view'), "width", widthVal);
                        }
                        else {
                            console.log("in else");
                            // ref.browserDom.setStyle(ref.browserDom.query('.view'), "position", "fixed");
                            ref.browserDom.setStyle(ref.browserDom.query('.view'), "bottom", "0px");
                            ref.browserDom.setStyle(ref.browserDom.query('.view'), "z-index", "6");
                            ref.browserDom.setStyle(ref.browserDom.query('.view'), "width", widthVal);
                        }
                    }
                }
                catch (e) {
                    alert("error in factor tru block--->" + e.message);
                }
            }
            document.addEventListener("scroll", this.enterEventListener, true);
            window.onresize = function () {
                // console.log("scrollHeight   (elmnt.scrollTop + elmnt.offsetHeight)");
                if (document.getElementById("fhid") != null) {
                    let widthVal = document.getElementById("fhid").offsetWidth + "px";
                    let heightVal = document.getElementById("fhid").offsetHeight + "px";
                    var elmnt = document.getElementById("main-plp");
                    let scrollHeight = document.getElementById("main-plp").scrollHeight;
                    // console.log(scrollHeight + "scrollHeight   (elmnt.scrollTop + elmnt.offsetHeight)");
                    // (elmnt.scrollTop + elmnt.offsetHeight));
                    if ((elmnt.scrollTop + elmnt.offsetHeight) >= scrollHeight) {
                        // ref.browserDom.setStyle(ref.browserDom.query('.view'), "position", "absolute");
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), "bottom", heightVal);
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), "width", widthVal);
                    }
                    else {
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), "bottom", "0px");
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), "z-index", "6");
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), "width", widthVal);
                    }
                }
            }
        }
        catch (e) {
            alert("os factors exception:" + e.message);
        }
    }

    ngOnDestroy() {
        document.removeEventListener('scroll', this.enterEventListener, true);
        console.log("Removed event listener");
    }

    selectFactor(event, inx, value) {
        // this.viewVal=true; 
        this.isDisableSelect = false;
        if (this.factorsArray1.length < 10 && (this.factorsArray1.indexOf(inx) == -1)) {
            this.renderer.setElementClass(event.target, "disabledp2", true);
            this.eventHolder.push(event.target);
            if (this.factorsArray1.length == 1)
                this.focusVal = event;
            console.log(event);
            this.factorsArray1.push(inx);
            if (this.factorsArray1.length >= 5) {
                this.isDisable = false;
            }
            this.emptybox = [];
            this.count = this.factorsArray1.length;
            for (let i = 0; i < (5 - this.factorsArray1.length); i++)
                this.emptybox.push(i);
            if (this.factorsArray1.length < 10 && this.factorsArray1.length >= 5) {
                this.emptybox.push(1);
            }
        }
        else {
            let testArr = ['cannot_fact_10', 'trans_alert'];
            let translated = this.changeTextLang(testArr, this);

        }
        this.utils.sessionStorageSet("testArr", JSON.stringify(this.textArr));
    }

    selectFactorRemove(event, inx) {
        if (this.factorsArray1.length <= 5) {
            this.isDisable = true;
            if (this.factorsArray1.length == 1) {
                this.isDisableSelect = true;
            }
        }
        for (let i = 0; i < this.factorsArray1.length; i++) {

            if (this.factorsArray1[i] == inx) {
                this.renderer.setElementClass(this.eventHolder[i], "disabledp2", false);
                this.factorsArray1.splice(i, 1);
                this.eventHolder.splice(i, 1);
            }
        }
        this.emptybox = [];
        this.count = this.factorsArray1.length;
        if (this.factorsArray1.length < 5)
            for (let i = 0; i < (5 - this.factorsArray1.length); i++)
                this.emptybox.push(i);
        else
            this.emptybox.push(0);
    }

    nextFactors() {
        // alert("in nextFactors")
        // this.renderer.setElementProperty( "disabled", true);
        //document.getElementsByClassName('para-2-lines-break')
        var arrayOfAll = (document.getElementsByClassName("para-2-lines-break"));
        // alert(arrayOfAll + "length--" + arrayOfAll.length);
        for (let i = 0; i < arrayOfAll.length; i++)
            this.renderer.setElementClass(arrayOfAll[i], "disabledp2", true);
        let widthVal = document.getElementById("fhid").offsetWidth + "px";
        this.browserDom.setStyle(this.browserDom.query('.view'), "width", widthVal);
        this.utils.sessionStorageSet("occFactorHeader", "true");
        this.marginClass = true;
        /** After the next button click in factors screen we check whether the count  */
        this.emptybox = [];
        // alert("next factors");
        for (let i = 0; i < this.factorsArray1.length; i++)
            this.finalFactorsMob.push(this.factorsArray1[i]);
        this.curVal = true;
        this.showdiv = true;
        this.close_e_mobile = false;
        this.close_e_mobile_prev = true;
        this.nextFactorsValue = true;
        this.select_plp2 = false;

        this.isDisableNext = true;
        this.utils.sessionStorageRemove('occ_factors');
        this.rankFactors = "true";
        this.fa_times = false;
        this.renderer.setElementClass(this.el.nativeElement, "slideLeft", true);
        this.renderer.setElementClass(this.el.nativeElement, "mobile-factor-hs", true);
        this.renderer.setElementAttribute(document.getElementById("focus0"), "tabindex", "0");
        document.getElementById("focus0").focus();
        // this.factorsArray1[0].nativeElement.focus();
        // this.renderer.setElementProperty( "focus", true)
        // console.log(this.eventHolder[0]);
        // console.log(this.focusVal.target.autofocus)
        // this.focusVal.target.autofocus = true;
        // this.renderer.setElementProperty(this.eventHolder[0], "autofocus", true);
        this.isDisable = false;
        this.nextHide = false;
        /***for mobile** */
        window.onresize = null;
        this.visible = 2;
        this.visibleSet();
        this.assessOccFunction.occFactorHeader();
    }

    visibleSet() {
        let ref = this;
        // alert("window.innerWidth" + window.innerWidth)
        /** on window resize we use this data for mobile view*/
        window.onresize = function () {
            // console.log("in window resize" + window.innerWidth);
            try {
                if (window.innerWidth <= 767) {
                    // console.log("in if resize");
                    ref.showdiv = true;
                    ref.visible = 0;
                    ref.select_plp2 = false;
                    ref.close_e_mobile_prev = true;
                    ref.fa_times = false;

                    let widthVal = document.getElementById("fhid").offsetWidth + "px";
                    let heightVal = document.getElementById("fhid").offsetHeight + "px";
                    var elmnt = document.getElementById("main-plp");
                    let scrollHeight = document.getElementById("main-plp").scrollHeight;
                    if ((elmnt.scrollTop + elmnt.offsetHeight) >= scrollHeight) {
                        // ref.browserDom.setStyle(ref.browserDom.query('.view'), "position", "absolute");
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), "bottom", heightVal);
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), "width", widthVal);
                    }
                    else {
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), "bottom", "0px");
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), "z-index", "6");
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), "width", widthVal);
                    }
                }
                else {
                    // console.log("in else resize");
                    ref.visible = 1;
                }
            }
            catch (e) {
                console.log("error in resize--->" + e.message);
            }
        };
        if (window.innerWidth <= 767 && (this.visible == 0 || this.visible == 2)) {
            this.select_plp2 = false;
            this.fa_times = false;
            this.close_e_mobile_prev = true;
            this.showdiv = true;
        }
    }
    finalFactors(event, inx) {
        //alert("comimg in final factoers");
        if (this.nextFactorsValue == true) {
            if (this.factorsArray2.length < 5 && (this.factorsArray2.indexOf(inx) == -1)) {
                for (let i = 0; i < this.factorsArray1.length; i++) {
                    if (this.factorsArray1[i] == inx) {
                        this.factorsArray2.push(inx);
                        let k = document.getElementsByClassName("empty-div").length - this.factorsArray1.length;
                        this.renderer.setElementClass(document.getElementsByClassName("empty-div")[i], "disabledp2", true);
                        // this.renderer.setElementClass(document.getElementsByClassName("factordynamic")[i], "disabledp2", true);
                        for (let j = 0; j < this.finalFactorsMob.length; j++) {
                            if (this.finalFactorsMob[j] == inx)
                                this.finalFactorsMob.splice(j, 1);
                        }

                        this.eventHolder1.push(document.getElementsByClassName("empty-div")[i]);
                        this.eventHolder2.push(document.getElementsByClassName("empty-div")[k + i]);
                        this.dummyText = false;
                    }
                }

                if (this.factorsArray2.length == 5) {
                    this.isDisableNext = false;
                    this.utils.sessionStorageSet('occ_factors', JSON.stringify(this.factorsArray2));
                }
                if (this.finalFactorsMob.length == 0) {
                    this.showImpFac = true;
                }
                this.finalArray = [];
                for (let i = 0; i < (5 - this.factorsArray2.length); i++)
                    this.finalArray.push(i);
            }
            else {
                let txt = ['cannot_fact_5', 'trans_alert', 'select_only_five_fac'];
                let ref = this;
                let transText = ref.changeTextLang(txt, ref);

            }
        }
    }

    removeFinalFactor(event, inx) {
        if (this.factorsArray2.length <= 5) {
            this.isDisableNext = true;
        }
        for (let i = 0; i < this.factorsArray2.length; i++) {
            if (this.factorsArray2[i] == inx) {
                // this.finalFactorsMob.push(inx);
                this.factorsArray2.splice(i, 1);
                this.renderer.setElementClass(this.eventHolder1[i], "disabledp2", false);
                this.renderer.setElementClass(this.eventHolder2[i], "disabledp2", false);
                this.eventHolder1.splice(i, 1);
                this.eventHolder2.splice(i, 1);
                this.finalFactorsMob.push(inx);
            }
            // if(this.finalFactorsMob[i]==inx)
            if (this.showImpFac == true) {
                this.showImpFac = false;
            }

        }
        if (this.factorsArray2.length == 0)
            this.dummyText = true;
        this.finalArray = [];
        for (let i = 0; i < (5 - this.factorsArray2.length); i++)
            this.finalArray.push(i);
        this.utils.sessionStorageSet('occ_factors', JSON.stringify(this.factorsArray2));
    }
    nextQuestions() {
        this.browserDom.removeAttribute(this.browserDom.query('.view'), "position");

        let txt = ['cannot_fact_5', 'trans_alert', 'select_only_five_fac'];
        let ref = this;
        let transText = ref.changeTextLang(txt, ref);

        /** After clicking start button to start assessment */
        if (JSON.parse(this.utils.sessionStorageGet('occ_factors')) != null) {
            /** If the number of selected factors are not empty then we enter into this block */
            if (JSON.parse(this.utils.sessionStorageGet('occ_factors')).length == 5) {
                /** If the total length of selected factors are 5 thenwe navigate to the assessment page */
                this.utils.sessionStorageSet("SaveParUserNotesIP", "");
                this.utils.sessionStorageSet("SaveComUserNotesIP", "");
                this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
            }
            else if (JSON.parse(this.utils.sessionStorageGet('occ_factors')).length < 5) {

            }

        }

    }

    changeTextLang(keyArr, ref) {
        /**To change the different language*/
        let tranJson = {};
        for (let i = 0; i < keyArr.length; i++) {
            let key = keyArr[i];
            //tranJson[key] = ref.translate.transform(key);
            this.translate.get('LANG_EN_TRANS.' + key).subscribe(
                value => {
                    // value is our translated string
                    tranJson[key] = value;
                    //alert("alertTitle---->"+alertTitle);
                    //ref.assessmentheadextra = eqTitle;
                })
        }
        return tranJson;
    }
}