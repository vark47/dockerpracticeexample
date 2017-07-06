import { Component, Renderer, ElementRef } from '@angular/core';
import { OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { Subscription } from "rxjs/Subscription";

import { messages } from '../../../../../shared/messages';
import { ApiCallClass } from '../../../../../shared/apicall.model';
import { ServerApi } from '../../../../../shared/app.apicall.service';
import { Utilities } from '../../../../../shared/utilities.class';
import { EventDispatchService } from '../../../../../shared/event-dispatch.service';
import { AssessmentsService } from '../../../shared/services/assessments.service';

declare let noUiSlider: any;

var RangeT = "", RangeB = "", RangeTop = [], RangeBottom = [];
var Ques = [], doubleHandleSlider;
var PreTop = [], PreBottom = [], ResLength = 0;
@Component({
    selector: 'os-assessment-range',
    templateUrl: './os-assessment-range.layout.html',
})
export class OSAssessmentComponent {
    occFactors = []; Precount = 0;
    occIndex = []; saved = 0; can = 1;
    occQuestionVal = 0;
    allOptions; totalQuesNum;
    isOpacity = true;
    set = 0; success; value;
    min; max;
    requiredOpt = [];
    facNames = [];
    currentValue = 0;
    Eleval = document.getElementsByClassName('circle');
    cardplp2 = document.getElementsByClassName('card-plp-2');
    subscription = new Subscription;
    constructor(private activatedRoute: ActivatedRoute, private trackEvnt: AssessmentsService,
        private assess: AssessmentsService, private translate: TranslateService,
        private router: Router, private utils: Utilities,
        private apiJson: ApiCallClass, private serverApi: ServerApi,
        private el: ElementRef, private renderer: Renderer,
        private eventService: EventDispatchService) {
        /** Below code block listens broadcasted event and 
                * calls respective functionality for this assessment */
        this.subscription = eventService.listen().subscribe((e) => {
            /** After event listen it will check whether user want to save partially or completely */

            if (e.type == "OSSavePartial") {
                /** If user want to save partially, then we call the respective function 
                  * and we are setting true to isAssessment to tell that, we are saving from assessment.
                 */
                this.SavePartialOccSort();
                try {
                    this.utils.sessionStorageSet("isAssessment", "true");
                }
                catch (e) {
                    alert("e message--->" + e.message);
                }
            }
            else if (e.type == "saveAnswerSet") {
                this.utils.hideLoading();
            }
        });
    }
    ngOnInit() {
        window.location.href += "#";
        window.setTimeout(function () {
            window.location.href += "!";
        }, 50);
        PreTop = [];
        RangeTop = [];
        RangeBottom = [];
        this.allOptions;
        this.requiredOpt = [];
        Ques = []; PreTop = []; PreBottom = [];
        RangeT = "";
        RangeB = "";
        this.min = -1; this.max = -1;
        this.set = 0;
        var ref = this;
        /** By using the setTimeout, we are calling function when the timer elapses. */
        setTimeout(function () {
            ref.slider();
        }, 0);
        /** We are assigning the answer set to a variable and by the sessionStorage, factors are stored in occFactors.*/
        // let eqAnswerSet = this.router.routerState.queryParams.value.eqAnswerSet;
        let eqAnswerSet: any;
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            eqAnswerSet = params['eqAnswerSet'];
        });
        this.occFactors = JSON.parse(this.utils.sessionStorageGet("occ_factors")).toString().split(',');
        /** For every selected occ factor i'm considering question and its options */
        this.facNames = JSON.parse(this.utils.sessionStorageGet("factors"));
        this.allOptions = JSON.parse(this.utils.sessionStorageGet("allOptions"));
        this.occFactors.forEach((obj, key) => {
            /** LANG_EN_TRANS.occ_ques contains, all questions and its corresponding options
              *  and for each question we are checking whether it is selected by the user or not.
              */
            this.facNames.forEach((k, v) => {
                if (obj == k.factorID) {
                    /**  If the question matches then we are separating the index of that question
                     *  and its options and storing it in a variable occIndex. 
                     */
                    this.occIndex.push({ 'index': v });
                }
            })
        });
        this.totalQuesNum = this.occIndex.length;
        let mulvalue = 100 / this.totalQuesNum;
        this.currentValue = mulvalue * (this.set);
        /** By using session storage we are checking either savedPartialAsmnt or eqAnswerSet is null or not.
          * SavedPartialAsmnt is used in refresh condition where as eqAnswerSet is used in restore state.
          * Based on the result, it will check whether to go to restore state, or to normal state.
          */
        if ((this.utils.sessionStorageGet("savedPartialAsmnt") != "") && (this.utils.sessionStorageGet("savedPartialAsmnt") != null)) {
            this.RestoreAnswerSets();
        } else if (eqAnswerSet != 0 && eqAnswerSet != "" && eqAnswerSet != null) {
            this.RestoreAnswerSets();
        }
        else {
            /** Here option values and index value are stored in two variable, these
             * variables are used in html to display question and options
             */
            this.utils.sessionStorageRemove("savePartial");
            if (this.set == 0) {
                this.isOpacity = true;
            }
            this.occQuestionVal = this.occIndex[this.set].index;
            this.utils.hideLoading();

        }
        let textVal = [];
        for (let i = 0; i < this.totalQuesNum; i++) {
            textVal.push(this.allOptions[this.occQuestionVal][i].text);
        }
        this.requiredOpt = textVal;

    }
    ngOnDestroy() {
        window.location.href.replace(location.hash, "");
        this.subscription.unsubscribe();
    }
    /** The below function is used for partial save of assessment */
    SavePartialOccSort() {
        if ((PreTop.length) <= this.totalQuesNum && this.saved == 0) {
            var res;
            if ((this.min >= 0 && this.min < this.totalQuesNum) && PreTop.length >= this.set && PreTop.length < 6 && ResLength == 0) {
                // If the question was answered previously then we replace it with new answers
                PreTop[this.set] = (this.min);
                PreBottom[this.set] = (this.max);
            }
            else if ((this.min >= 0 && this.min < this.totalQuesNum) && ResLength != 0) {
                if (PreTop.length == this.set) {
                    // If the question was not answered previously then add that question and answer
                    PreTop.push(this.min);
                    PreBottom.push(this.max);
                }
                else if (PreTop[this.set - 1] != this.min || PreBottom[this.set - 1] != (this.max)) {
                    // If the question was answered previously then we replace it with new answers
                    PreTop[this.set] = (this.min);
                    PreBottom[this.set] = (this.max);
                }
            }
            RangeTop = [];
            RangeBottom = [];
            for (res = 0; res < PreTop.length; res++) {
                // Storing values from one to another
                RangeTop[res] = PreTop[res];
                RangeBottom[res] = PreBottom[res];
            }
            for (; RangeTop.length != this.totalQuesNum; res++) {
                RangeTop[res] = -1;
                RangeBottom[res] = -1;
            }
            RangeT = RangeTop.toString();
            RangeB = RangeBottom.toString();
            if (PreTop.length != Ques.length) {
                Ques.push(PreTop.length);
            }

        }
        /** If all the question are answered then the result will be stored */
        if (RangeTop.length == this.totalQuesNum) {
            let occsort = [];
            occsort.push({
                "factors": this.occFactors.toString(),
                "rangeTop": RangeT,
                "rangeBottom": RangeB,
                "Usernotes": "save"
            })
            this.apiJson.method = "POST";
            this.apiJson.sessionID = this.utils.getAuthKey();
            this.apiJson.moduleName = "Assessment/v1/";
            let text = ['enter_thougts', 'savemythoughts', 'cancel', 'btn_save', 'err_occ'];
            let transText = this.changeTextLang(text, this);
            let SavePartialPost = {};
            SavePartialPost = {

                input_data: [
                    {
                        "param_type": "path",
                        "params": [this.utils.sessionStorageGet("OccSortLogID")]
                    },
                    {
                        "param_type": "query",
                        "params": { "stateAbbr": "IC" }
                    },
                    {
                        "param_type": "body",
                        "params": {
                            "userNotes": occsort[occsort.length - 1].Usernotes,
                            "selectedFactors": occsort[occsort.length - 1].factors,
                            "rangeTop": occsort[occsort.length - 1].rangeTop,
                            "rangeBottom": occsort[occsort.length - 1].rangeBottom,

                        }
                    }
                ]
            }
            let user = JSON.stringify(SavePartialPost);
            this.apiJson.endUrl = "users/savePartialOccSort/";
            this.apiJson.data = user;
            this.assess.showSaveDialog(this.apiJson, "OS", transText);
        }

    }

    RestoreAnswerSets() {
        /** When we are in restore the  */
        this.utils.sessionStorageRemove("savePartial");
        let TRes = [], BRes = [];
        TRes = this.utils.sessionStorageGet('RangeTop').slice(1, -1).split(',');
        BRes = this.utils.sessionStorageGet('RangeBottom').slice(1, -1).split(',');
        for (ResLength = 0; ResLength < TRes.length; ResLength++) {
            /** Check value is greater than zero or not, if it is greater than zero then add the value to variables
             * if value less than zero break the loop
             */
            if (TRes[ResLength] == -1) {
                break;
            }
            else {
                Ques[ResLength] = ResLength + 1;
                PreTop[ResLength] = parseInt(TRes[ResLength]);
                PreBottom[ResLength] = parseInt(BRes[ResLength]);
            }
        }
        // If the answered questions less than 5 then go to previous
        if (ResLength == this.totalQuesNum) {
            // If all questions are answered then go to save
            this.saveOccSortDt();
        }
        else if (ResLength - 1 < (this.totalQuesNum - 1) && ResLength - 1 >= 0 || ResLength == 0) {
            if (ResLength == 0) {
                this.can = 0;
            }
            let ref = this;
            this.set = ResLength + 1;
            setTimeout(function () {
                ref.clickArrowPre();
            }.bind(this), 100);
            this.utils.hideLoading();
        }
    }
    changeClass(number, className, booleanVal) {
        for (let i = 0; i < number; i++) {
            this.renderer.setElementClass(this.Eleval[i], className, booleanVal);
            this.renderer.setElementClass(this.cardplp2[i], className, booleanVal);
        }
    }
    defaultColor() {
        /** We apply the default color that is green to all circles */
        this.changeClass(this.totalQuesNum, 'white-circle', false);
        /** We apply the default color that is green to all circles */

        this.changeClass(this.totalQuesNum, 'green-circle', true);
    }

    /**when the next arrow was clicked the below function will execute*/
    clickArrow() {
        let count = 0;
        let mulvalue = 100 / this.totalQuesNum;
        this.currentValue = mulvalue * (this.set + 1);
        if (this.set < (this.totalQuesNum - 1)) {
            this.defaultColor();
            /** We are setting default range bar values */
            doubleHandleSlider.noUiSlider.set([0, this.totalQuesNum]);
        }
        else {
            this.utils.showLoading();
        }
        if (this.Precount != 0) {
            /** If the previous button was clicked */
            this.Precount--;
        }
        if (((this.min >= 0 && this.min < this.totalQuesNum) && (this.max >= 0 && this.max < this.totalQuesNum)
            && (this.min <= this.max)) && this.set >= PreTop.length && PreTop.length != this.totalQuesNum && this.Precount == 0) {
            // Enter only when current answered question is new one
            PreTop.push(this.min);
            PreBottom.push(this.max);
            Ques.push(PreTop.length);
            count = PreTop.length - 1;
            if (count <= 4 || (PreTop.length - 1) != this.totalQuesNum) {
                RangeTop[PreTop.length - 1] = this.min;
                RangeBottom[PreTop.length - 1] = this.max;
                count++;
            }
        }
        else {
            var va = 0;
            // Checking whether the answered question already available are not
            for (let k = 0; k < Ques.length; k++) {
                if (Ques[k] == (this.set + 1)) {
                    va = 1;
                    break;
                }
            }
            if (va == 0 && (this.min <= this.max)) {
                // If range bar was not selected then we set to default value
                PreTop.push(0);
                PreBottom[PreTop.length - 1] = (this.totalQuesNum - 1);
                Ques.push(PreTop.length);
                RangeTop[PreTop.length - 1] = 0;
                RangeBottom[PreTop.length - 1] = this.totalQuesNum - 1;
                count = PreTop.length;
                this.saved = 0;
            }
            else if (va == 1 && (this.min <= this.max || PreTop.length != this.totalQuesNum) && this.min >= 0) {
                // If the question was answered previously then we replace it with new answers
                PreTop[this.set] = (this.min);
                PreBottom[this.set] = (this.max);
                RangeTop[this.set] = this.min;
                RangeBottom[this.set] = this.max;
                count = PreTop.length;
            }
            var NextT = PreTop[this.set + 1];
            var NextB = PreBottom[this.set + 1];
            /** We are setting default range bar values */
            doubleHandleSlider.noUiSlider.set([NextT, NextB + 1]);
            /** We add or remove color to circle */
            for (this.value = 0; this.value < this.totalQuesNum; this.value++) {
                if (this.value == NextT && NextT <= NextB) {
                    this.renderer.setElementClass(this.Eleval[NextT], 'green-circle', true);
                    this.renderer.setElementClass(this.cardplp2[NextT], 'green-circle', true);
                    NextT++;
                }
                else if (NextT != undefined) {
                    this.renderer.setElementClass(this.Eleval[this.value], 'white-circle', true);
                    this.renderer.setElementClass(this.cardplp2[this.value], 'white-circle', true);
                }
            }
        }
        // If all questions are answered we call save occ sort function
        if (PreTop.length == this.totalQuesNum && this.set >= (this.totalQuesNum - 1)) {
            this.saveOccSortDt();
        }
        if (this.set < (this.totalQuesNum - 1)) {
            try {
                this.set = this.set + 1;
                if (this.set == 0) {
                    this.isOpacity = true;
                }
                else {
                    this.isOpacity = false;
                }
                this.occQuestionVal = this.occIndex[this.set].index;
                let textVal = [];
                for (let i = 0; i < this.totalQuesNum; i++) {
                    textVal.push(this.allOptions[this.occQuestionVal][i].text);
                }
                this.requiredOpt = textVal;
            }
            catch (e) {
                alert("inc error" + e.message);

            }
        }
        this.min = -1; this.max = -1;
    }
    /**when the previous arrow was clicked the below function will execute*/
    clickArrowPre() {
        /** Checks whether the current question value is greater than 1 or not */
        if (this.set > 0) {
            if (this.set == 1) {
                this.isOpacity = true;
            }
            this.set--;
            this.occQuestionVal = this.occIndex[this.set].index;
            let textVal = [];
            for (let i = 0; i < this.totalQuesNum; i++) {
                textVal.push(this.allOptions[this.occQuestionVal][i].text);
            }
            this.requiredOpt = textVal;
            // this.i = (PreTop.length - 1) - Precount;
            this.defaultColor();
            /** ResLength represent the restore length */
            if (ResLength != 0) {
                var PreT = PreTop[this.set];
                var PreB = PreBottom[this.set];
                if (PreT >= 0 && PreB < this.totalQuesNum) {
                    /** We are setting range bar values */
                    doubleHandleSlider.noUiSlider.set([PreT, (PreB + 1)]);
                    // Adding and removing colors to the circle
                    for (this.value = 0; this.value < this.totalQuesNum; this.value++) {
                        if (this.value == PreT && PreT <= PreB) {
                            this.renderer.setElementClass(this.Eleval[PreT], 'green-circle', true);
                            this.renderer.setElementClass(this.cardplp2[PreT], 'green-circle', true);
                            PreT++;
                        }
                        else {
                            this.renderer.setElementClass(this.Eleval[this.value], 'white-circle', true);
                            this.renderer.setElementClass(this.cardplp2[this.value], 'white-circle', true);
                        }
                    }
                }
                else {
                    doubleHandleSlider.noUiSlider.set([0, this.totalQuesNum]);
                }
            }
            else if (this.can == 0) {
                doubleHandleSlider.noUiSlider.set([0, this.totalQuesNum]);
                // Adding and removing colors to the circle
                this.changeClass(this.totalQuesNum, 'green-circle', true);
            }
            else {
                /** in normal case */
                var PreT = PreTop[this.set];
                var PreB = PreBottom[this.set];
                /** Setting range bar values */
                doubleHandleSlider.noUiSlider.set([PreT, (PreB + 1)]);
                // Adding and removing colors to the circle
                for (this.value = 0; this.value < this.totalQuesNum; this.value++) {
                    if (this.value == PreT && PreT <= PreB) {
                        this.renderer.setElementClass(this.Eleval[PreT], 'green-circle', true);
                        this.renderer.setElementClass(this.cardplp2[PreT], 'green-circle', true);
                        PreT++;
                    }
                    else {
                        this.renderer.setElementClass(this.Eleval[this.value], 'white-circle', true);
                        this.renderer.setElementClass(this.cardplp2[this.value], 'white-circle', true);
                    }
                }
            }
            if ((this.min != -1) && (this.max != -1)) {
                var va = 0;
                // Checking whether the answered question already available are not
                for (var k = 0; k < Ques.length; k++) {
                    if (Ques[k] == (this.set + 2)) {
                        va = 1;
                        break;
                    }
                }
                if ((this.min != PreTop[(PreBottom.length - 1) - this.Precount] || this.max != PreBottom[(PreBottom.length - 1) - this.Precount]) && va == 1) {
                    // If the question was answered previously then we replace it with new answers
                    PreTop[this.set + 1] = this.min;
                    PreBottom[this.set + 1] = this.max;
                    RangeTop[this.set + 1] = this.min;
                    RangeBottom[this.set + 1] = this.max;
                    RangeT = RangeTop.toString();
                    RangeB = RangeBottom.toString();
                    this.Precount--;
                }
                else if (this.min >= 0 && this.min < this.totalQuesNum && va == 0) {
                    // If it was not answered then we add question and its corresponding answers 
                    PreTop.push(this.min);
                    PreBottom.push(this.max);
                    Ques.push(PreTop.length);
                    RangeTop.push(this.min);
                    RangeBottom.push(this.max);
                    RangeT = RangeTop.toString();
                    RangeB = RangeBottom.toString();
                    this.Precount--;
                }
            }
            this.Precount++;
            this.min = -1; this.max = -1;
        }
        if (PreTop.length == this.totalQuesNum && this.set >= 4) {
            this.saveOccSortDt();
        }
        let mulvalue = 100 / this.totalQuesNum;
        this.currentValue = mulvalue * this.set;
    }
    slider() {
        /** For range bar we use this function */

        doubleHandleSlider = document.querySelector('.double-handle-slider');
        /** We check the window width to display range bar either horizontally
         * or vertically
         */
        if (window.innerWidth <= 767) {
            this.success = 'vertical';
        }
        else {
            this.success = 'horizontal';
        }
        var re = this;
        /** If minimum and maximum values are set then we call slider function
         * if not we keep the default values that is 0 and 5
        */
        if (this.min >= 0 && this.min < this.totalQuesNum) {
            re.occSortSilder(this.min, this.max, this.success);
        }
        else {

            if (PreTop[this.set] >= 0 && PreTop[this.set] < this.totalQuesNum) {
                this.min = PreTop[this.set];
                this.max = PreBottom[this.set];
            }
            re.occSortSilder(0, 5, this.success);
        }
        this.changeClass(5, 'green-circle', true);
        var ref1 = this;
        // Every time we resize we destroy and create new slider
        window.onresize = function () {
            try {
                doubleHandleSlider.noUiSlider.destroy();
                ref1.slider();
            }
            catch (e) {
            }

        };
        var handle1 = [
            document.querySelector('.noUi-handle-lower'),
            document.querySelector('.noUi-handle-upper')
        ];
        for (let i = 0; i < handle1.length; i++) {
            handle1[i].setAttribute('tabindex', "0");
            handle1[i].addEventListener('click', function () {
                this.focus();
            });

            handle1[i].addEventListener('keydown', function (e: KeyboardEvent) {
                var numbers = doubleHandleSlider.noUiSlider.get();
                this.min = numbers[0]; this.max = numbers[1];
                var r;
                if (this.max - this.min >= 1) {
                    switch (e.which) {
                        case 37:
                            // numbers[1]
                            if (i == 0) {
                                r = [this.min - 1, this.max];
                                doubleHandleSlider.noUiSlider.set(r);
                                this.min--;
                            } else if (i == 1) {
                                r = [this.min, this.max - 1];
                                doubleHandleSlider.noUiSlider.set(r);
                                this.max--;
                            }
                            if (this.min != -1 && this.max != this.min) {
                                ref1.onHandlerSlide(r, i);
                            }
                            break;
                        case 39:
                            if (i == 0) {
                                r = [this.min + 1, this.max];
                                doubleHandleSlider.noUiSlider.set(r);
                                this.min++;
                            } else if (i == 1) {
                                r = [this.min, this.max + 1];
                                doubleHandleSlider.noUiSlider.set(r);
                                this.max++;
                            }
                            if (this.min != -1 && this.max != this.min) {
                                ref1.onHandlerSlide(r, i);
                            }
                            break;
                    }

                }

            });
        }
        doubleHandleSlider.noUiSlider.on('update', function (values, handle) {
            /** when the slider is changed we check all the code  */
            if ((values[0] != values[1]) && ((handle == 0) || (handle == 1))) {
            }
            else if ((values[0] != 0) && (values[0] == values[1]) && (handle == 0)) {
                let v0 = (values[0] - 1);
                let v1 = (values[1]);
                doubleHandleSlider.noUiSlider.set([v0, v1]);
            }
            else if ((values[0] != 0) && (values[0] == values[1]) && (handle == 1)) {
                let v0 = (values[0]);
                let v1 = (values[1] + 1);
                doubleHandleSlider.noUiSlider.set([v0, v1]);
            }
            if ((values[0] == 0) && (values[0] == values[1]) && (handle == 1)) {
                doubleHandleSlider.noUiSlider.set([0, 1]);
            }
        });
        doubleHandleSlider.noUiSlider.on('slide', function (values, handle) {
            ref1.onHandlerSlide(values, handle)
        });

    }
    onHandlerSlide(values, handle) {
        let mindp, maxdp;
        let ref1 = this;
        for (this.value = 0; this.value < 5; this.value++) {
            ref1.renderer.setElementClass(this.Eleval[this.value], 'white-circle', false);
            ref1.renderer.setElementClass(this.cardplp2[this.value], 'white-circle', false);
        }
        this.saved = 0;
        var rangeValues = values;
        this.min = rangeValues[0];
        this.max = rangeValues[1] - 1;
        mindp = this.min;
        maxdp = this.max;
        for (this.value = 0; this.value < 5; this.value++) {
            if (this.value == mindp && mindp <= maxdp) {
                ref1.renderer.setElementClass(this.Eleval[mindp], 'green-circle', true);
                ref1.renderer.setElementClass(this.cardplp2[mindp], 'green-circle', true);
                mindp++;
            }
            else {
                ref1.renderer.setElementClass(this.Eleval[this.value], 'white-circle', true);
                ref1.renderer.setElementClass(this.cardplp2[this.value], 'white-circle', true);
            }
        }
    }
    saveOccSortDt() {
        /** After completing all the 5 questions in result page if we save data then this function is executed */
        RangeT = PreTop.toString();
        RangeB = PreBottom.toString();
        let saveOccsort = [];
        saveOccsort.push({
            "selectedFactors": this.occFactors.toString(),
            "rangeTop": RangeT,
            "rangeBottom": RangeB
        })
        this.utils.sessionStorageSet('occsort', JSON.stringify(saveOccsort));
        this.trackEvnt.getOccSortResult(JSON.parse(this.utils.sessionStorageGet('occsort')), this.utils.sessionStorageGet("SaveParUserNotesOS"));
    }

    changeTextLang(keyArr, ref) {
        let tranJson = {};
        for (let i = 0; i < keyArr.length; i++) {
            let key = keyArr[i];
            this.translate.get('LANG_EN_TRANS.' + key).subscribe(
                value => {
                    tranJson[key] = value;
                })
        }
        return tranJson;
    }

    occSortSilder(mn, mx, success) {
        let ref = this;
        noUiSlider.create(doubleHandleSlider, {
            start: [mn, (mx + 1)],
            range: {
                'min': 0,
                'max': 5
            },
            orientation: success,
            connect: true,
            tooltips: true,
            step: 1,
            format: {
                to: function (value) {
                    return value;
                },
                from: function (value) {
                    return value;
                }
            }
        });
    }
    saveChanges() {
        let oschanges = true
        if ((5 - (this.set + 1)) == 0) {
            oschanges = false;
        }
        return oschanges;
    }
}
