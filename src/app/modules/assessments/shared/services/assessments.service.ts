import { Injectable, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import { ServerApi } from '../../../../shared/app.apicall.service'
import { Utilities } from '../../../../shared/utilities.class';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from "rxjs/Subscription";
import { AssessmentModalPopups } from '../../../../shared/shared-modal-component';

let val = 0;
let valueEq = 0;

@Injectable()
export class AssessmentsService implements OnDestroy {
        options: NgbModalOptions = {
                backdrop: 'static'
        };
        jsonGlobalObject;
        jsonSaveObject;
        assessvalueSave;

        subscription = new Subscription;
        serverApi;
        utilities;
        indexResult;
        resultEntiQuizvar = 0;
        logId;
        logIDeq ;
        logID;
        answerSet;
        constructor(servApi: ServerApi, private utils: Utilities, private route: Router, private apiJson1: ApiCallClass, private apiJson2: ApiCallClass,
                private apiJson: ApiCallClass, private eventService: EventDispatchService,
                private modalService: NgbModal, private activeRoute: ActivatedRoute) {
                this.serverApi = servApi;
                this.utilities = utils;
                this.subscription = eventService.listen().subscribe((e) => {
                        /** After event listen it will check whether user want to save partially or completely */

                        if (e.type == "DeleteButtonAction") {
                                this.utils.showLoading();
                                this.jsonGlobalObject = JSON.parse(this.utils.sessionStorageGet('arr'));
                                this.serverApi.callApi([this.jsonGlobalObject]).subscribe((response) => {
                                        if (response[0].Result + "" === "true") {
                                                this.utils.sessionStorageRemove("repeat");
                                                let evnt = document.createEvent("CustomEvent");
                                                evnt.initEvent("deleteAnswerSet", true, true);
                                                this.eventService.dispatch(evnt);
                                        }
                                });

                        }
                });
                let ref = this;



                this.subscription = eventService.listen().subscribe((e) => {
                        /** After event listen it will check whether user want to save partially or completely */
                        try {
                                if (e.type == "OSSaveComplete" || e.type == "IPSFSaveComplete" || e.type == "EQSaveComplete" || e.type === "WESSaveComplete" || e.type == "CCIjrSaveComplete" || e.type == "LSSaveComplete") {
                                        this.utils.sessionStorageSet("saveval", "SaveComplete");
                                }
                                if (e.type == "OSSavePartial" || e.type == "EQSavePartial" || e.type == "IPSFSavePartial" || e.type === "WESSavePartial" || e.type == "CCIjrSavePartial" || e.type == "LSSavePartial") {
                                        this.utils.sessionStorageSet("saveval", "SavePartial");
                                }
                                if (e.type == "SaveButtonAction" && this.utils.sessionStorageGet("saveval") != null && this.utils.sessionStorageGet("saveval") != " ") {

                                        this.utils.showLoading();
                                        let val;
                                        let valueEq;
                                        let savevalue = this.utils.sessionStorageGet("saveval");

                                        let eqTransArr = JSON.parse(this.utils.sessionStorageGet("eqQues"));
                                        let tempObj = this.utils.sessionStorageGet('jsonSaveObject');

                                        if (tempObj != null && tempObj != undefined) {
                                                ref.jsonSaveObject = JSON.parse(tempObj);
                                        }
                                        let dat = JSON.parse(ref.jsonSaveObject.data);

                                        if (savevalue == "SavePartial") {

                                                const partialVar = window.sessionStorage.getItem("textareaValue");
                                                if (partialVar != "undefined") {
                                                        dat.input_data[2].params.userNotes = partialVar;
                                                }
                                                else {
                                                        dat.input_data[2].params.userNotes = "";
                                                }
                                        }

                                        else if (savevalue == "SaveComplete") {
                                                const completeVar = window.sessionStorage.getItem("textareaValue");
                                                if (completeVar != "undefined") {
                                                        dat.input_data[2].params = completeVar;
                                                }
                                                else {
                                                        dat.input_data[2].params = "";
                                                }
                                        }
                                        ref.jsonSaveObject.data = JSON.stringify(dat);
                                        valueEq = this.utils.sessionStorageGet("staticval");
                                        this.assessvalueSave = this.utils.sessionStorageGet("assesmentname");
                                        if (this.assessvalueSave == "IP") {
                                                val = this.utils.sessionStorageGet("staticval");
                                        } else if (this.assessvalueSave == "EQ") {
                                                if (savevalue == "SavePartial") {
                                                        this.utils.sessionStorageSet("SaveParUserNotesEQ", dat.input_data[2].params.userNotes);
                                                }
                                                else if (savevalue == "SaveComplete") {

                                                        this.utils.sessionStorageSet("SaveComUserNotesEQ", dat.input_data[2].params);
                                                }
                                        } else if (this.assessvalueSave == "OS") {
                                                if (savevalue == "SavePartial") {
                                                        this.utils.sessionStorageSet("SaveParUserNotesOS", dat.input_data[2].params.userNotes);
                                                }
                                                else if (savevalue == "SaveComplete") {
                                                        this.utils.sessionStorageSet("SaveComUserNotesOS", dat.input_data[2].params);
                                                }
                                        }
                                        else if (this.assessvalueSave == "WES") {
                                                // alert("iun os")
                                                if (savevalue == "SavePartial") {
                                                        this.utils.sessionStorageSet("save_ParUserNotes_WES", dat.input_data[2].params.userNotes);
                                                }
                                                else if (savevalue == "SaveComplete") {
                                                        this.utils.sessionStorageSet("save_Com_UserNotes_WES", dat.input_data[2].params);
                                                }

                                        }
                                         else if (this.assessvalueSave == "LS"){
                                              if (savevalue == "SavePartial") {
                                                    this.utils.sessionStorageSet("SaveParUserNotesLS", dat.input_data[2].params.userNotes);
                                                   
                                                }
                                                else if (savevalue == "SaveComplete"){
                                                     this.utils.sessionStorageSet("SaveComUserNotesLS", dat.input_data[2].params);
                                                }
                                        } 
                                        else if (this.assessvalueSave == "CCI") {
                                                // val = this.utils.sessionStorageGet("staticval");

                                                // console.log("if IP (val) data     :" + val);
                                                if (savevalue == "SavePartial") {
                                                        this.utils.sessionStorageSet("SaveParUserNotesCCI", dat.input_data[2].params.userNotes);
                                                }
                                                else if (savevalue == "SaveComplete") {
                                                        //alert("dat.input_data[2].params--->" + dat.input_data[2].params)
                                                        this.utils.sessionStorageSet("SaveComUserNotesCCI", dat.input_data[2].params);
                                                }


                                        }


                                        if (this.assessvalueSave === "IP" || this.assessvalueSave === "EQ" || this.assessvalueSave === "CCI"|| this.assessvalueSave === "LS") {
                                                if (dat.input_data[2].params.answers != undefined) {

                                                        dat.input_data[2].params.answers = dat.input_data[2].params.answers.toString();
                                                        dat.input_data[2].params.userNotes = dat.input_data[2].params.userNotes;
                                                }
                                        }
                                        this.jsonSaveObject.data = JSON.stringify(dat);
                                        let modName = this.assessvalueSave;
                                        this.serverApi.callApi([this.jsonSaveObject]).subscribe((response) => {

                                                if (response.Result + "" === "true") {
                                                        this.utils.hideLoading();
                                                        if (modName === "IP" || modName === "IPCOMPLETE") {
                                                                if (savevalue == "SavePartial") {
                                                                        this.utils.sessionStorageSet("SaveParUserNotesIP", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);
                                                                        this.utils.sessionStorageSet("SaveComUserNotesIP", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);

                                                                }
                                                                else if (savevalue == "SaveComplete") {
                                                                        this.utils.sessionStorageSet("SaveParUserNotesIP", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                        this.utils.sessionStorageSet("SaveComUserNotesIP", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                }

                                                        } else if (modName === "EQ" || modName === "EQCOMPLETE") {

                                                                if (savevalue == "SavePartial") {

                                                                        this.utils.sessionStorageSet("SaveParUserNotesEQ", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);
                                                                        this.utils.sessionStorageSet("SaveComUserNotesEQ", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);
                                                                }
                                                                else if (savevalue == "SaveComplete") {

                                                                        this.utils.sessionStorageSet("SaveParUserNotesEQ", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                        this.utils.sessionStorageSet("SaveComUserNotesEQ", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                }
                                                        }
                                                        else if (modName === "CCI" || modName === "CCICOMPLETE") {
                                                                if (savevalue == "SavePartial") {

                                                                        this.utils.sessionStorageSet("SaveParUserNotesCCI", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);
                                                                        this.utils.sessionStorageSet("SaveComUserNotesCCI", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);
                                                                }
                                                                else if (savevalue == "SaveComplete") {

                                                                        this.utils.sessionStorageSet("SaveParUserNotesCCI", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                        this.utils.sessionStorageSet("SaveComUserNotesCCI", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                }
                                                        }
                                                        else if (modName === "LS" || modName === "LSCOMPLETE"){
                                                                if (savevalue == "SavePartial") {
                                                                       
                                                                      this.utils.sessionStorageSet("SaveParUserNotesLS",JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);
                                                                     this.utils.sessionStorageSet("SaveComUserNotesLS", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);
                                                                  }
                                                                  else if(savevalue == "SaveComplete"){
                                                           
                                                                    this.utils.sessionStorageSet("SaveParUserNotesLS", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                    this.utils.sessionStorageSet("SaveComUserNotesLS", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                  } 
                                                        }

                                                        else if (modName === "OS" || modName === "OSCOMPLETE") {
                                                                if (savevalue == "SavePartial") {
                                                                        this.utils.sessionStorageSet("SaveParUserNotesOS", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);
                                                                        this.utils.sessionStorageSet("SaveComUserNotesOS", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);

                                                                }
                                                                else if (savevalue == "SaveComplete") {
                                                                        this.utils.sessionStorageSet("SaveParUserNotesOS", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                        this.utils.sessionStorageSet("SaveComUserNotesOS", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                }
                                                        }
                                                        else if (modName === "WES" || modName === "WESCOMPLETE") {
                                                                // alert("OSCOMPLETE-->" + JSON.stringify(JSON.parse(this.jsonSaveObject.data).input_data[2].params))
                                                                if (savevalue === "SavePartial") {
                                                                        this.utils.sessionStorageSet("save_ParUserNotes_WES", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);
                                                                        this.utils.sessionStorageSet("save_Com_UserNotes_WES", JSON.parse(this.jsonSaveObject.data).input_data[2].params.userNotes);
                                                                }
                                                                else if (savevalue === "SaveComplete") {
                                                                        this.utils.sessionStorageSet("save_ParUserNotes_WES", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                        this.utils.sessionStorageSet("save_Com_UserNotes_WES", JSON.parse(this.jsonSaveObject.data).input_data[2].params);
                                                                }
                                                        }
                                                        this.utils.sessionStorageSet("savePartial", "yes");
                                                        this.utils.sessionStorageSet("savedPartialAsmnt", "true");

                                                        if (this.utils.sessionStorageGet("isAssessment") === "true") {
                                                                //alert("json data------------->"+JSON.stringify(this.jsonSaveObject));
                                                                if (modName === "WES") {
                                                                        // alert("(JSON.parse(this.jsonSaveObject.data)--" + (JSON.stringify(this.jsonSaveObject.data)));
                                                                        this.settingDataForRefresh(JSON.parse(this.jsonSaveObject.data), modName);
                                                                } else if (modName !== "OS") {

                                                                        this.settingDataForRefresh(JSON.parse(this.jsonSaveObject.data).input_data[2].params.answers, modName);

                                                                } else {
                                                                        this.settingDataForRefresh(JSON.parse(this.jsonSaveObject.data), modName);
                                                                }

                                                        }

                                                        let evnt = document.createEvent("CustomEvent");
                                                        evnt.initEvent("saveAnswerSet", true, true);
                                                        this.eventService.dispatch(evnt);

                                                } else {

                                                }
                                        }, )
                                        this.utils.sessionStorageRemove("saveval")
                                }
                        } catch (e) {
                                console.log("error----." + e.message);
                        }
                });


        }


        /**  This function is to handle the refresh condition when in middle of assessment.
         *  This is similar to the restore condition
         **/
        settingDataForRefresh(respData, module) {
                let quesName, restoreQuesArr = [], restorePrevQuesArr = [], answerSetRes = [];

                if (module === "IP") {
                        let splitQuestions = respData.split(',');
                        for (let i = 0; i < splitQuestions.length; i++) {
                                if (splitQuestions[i] === "NR") {
                                        quesName = "shortip_ques_q" + i;
                                        restoreQuesArr.push({ "key": quesName, "question": i, "QuestionValue": splitQuestions[i] });
                                }
                                else {
                                        quesName = "shortip_ques_q" + i;
                                        restorePrevQuesArr.push({ "key": quesName, "question": i, "QuestionValue": splitQuestions[i] });
                                        answerSetRes.push(splitQuestions[i]);
                                }
                        }
                        this.utils.sessionStorageSet("restoreAnswerSet", JSON.stringify(answerSetRes));
                        this.utils.sessionStorageSet("restoreQuesArr", JSON.stringify(restoreQuesArr));
                        this.utils.sessionStorageSet("restorePrevQuesArr", JSON.stringify(restorePrevQuesArr));
                } else if (module === "EQ") {
                        let splitQuestions = respData.split(',');
                        for (let i = 0; i < splitQuestions.length; i++) {
                                if (splitQuestions[i] === 0) {
                                        quesName = "entrp_ques_q" + i;
                                        restoreQuesArr.push({ "key": quesName, "question": i, "QuestionValue": splitQuestions[i] });
                                }
                                else {
                                        quesName = "entrp_ques_q" + i;
                                        restorePrevQuesArr.push({ "key": quesName, "question": i, "QuestionValue": splitQuestions[i] });
                                        answerSetRes.push(splitQuestions[i]);
                                }
                        }
                        this.utils.sessionStorageSet("restoreAnswerSet", JSON.stringify(answerSetRes));
                        this.utils.sessionStorageSet("restoreQuesArr", JSON.stringify(restoreQuesArr));
                        this.utils.sessionStorageSet("restorePrevQuesArr", JSON.stringify(restorePrevQuesArr));

                } else if (module === "CCI") {
                        let splitQuestions = respData.split(',');
                        for (let i = 0; i < splitQuestions.length; i++) {
                                if (splitQuestions[i] === 'NR') {
					quesName = 'shortip_ques_q' + i;
					restoreQuesArr.push({ 'key': quesName, 'question': i, 'QuestionValue': splitQuestions[i] });
				}
				else {
					quesName = 'shortip_ques_q' + i;
					restorePrevQuesArr.push({ 'key': quesName, 'question': i, 'QuestionValue': splitQuestions[i] });
					answerSetRes.push(splitQuestions[i]);
				}
                        }
                        this.utils.sessionStorageSet("restoreAnswerSet", JSON.stringify(answerSetRes));
                        this.utils.sessionStorageSet("restoreQuesArr", JSON.stringify(restoreQuesArr));
                        this.utils.sessionStorageSet("restorePrevQuesArr", JSON.stringify(restorePrevQuesArr));

                } else if (module === "LS") {
           
                        let splitQuestions = respData.split(',');
                        for (let i = 0; i < splitQuestions.length; i++) {
                                if (splitQuestions[i] === 0) {
                                        quesName = "questions" + i;
                                        restoreQuesArr.push({ "key": quesName, "question": i, "QuestionValue": splitQuestions[i] });
                                }
                                else {
                                        quesName = "questions" + i;
                                        restorePrevQuesArr.push({ "key": quesName, "question": i, "QuestionValue": splitQuestions[i] });
                                        answerSetRes.push(splitQuestions[i]);
                                }
                        }
                        this.utils.sessionStorageSet("restoreAnswerSet", JSON.stringify(answerSetRes));
                        this.utils.sessionStorageSet("restoreQuesArr", JSON.stringify(restoreQuesArr));
                        this.utils.sessionStorageSet("restorePrevQuesArr", JSON.stringify(restorePrevQuesArr));
                     }
                
                else if (module === "WES") {
                        console.log("respData--" + JSON.stringify(respData.input_data[2].params.answers));
                        let splitQuestions = respData.input_data[2].params.answers.split(',');
                        let allAnswers = []
                        let resultAns = "";
                        for (let i = 0; i < splitQuestions.length; i++) {
                                // alert(answ[i]);
                                if (splitQuestions[i] != "NR") {
                                        allAnswers.push(parseInt(splitQuestions[i]));
                                        if (i < (splitQuestions.length - 1)) {
                                                resultAns = resultAns + parseInt(splitQuestions[i]) + ",";
                                        }
                                        else {
                                                resultAns = resultAns + parseInt(splitQuestions[i]);
                                        }

                                }
                                else {
                                        break;
                                }
                        }
                        this.utils.sessionStorageSet('wesAnswers', JSON.stringify(allAnswers));

                } else {
                        this.utils.sessionStorageSet('occ_factors', JSON.stringify(respData.input_data[2].params.selectedFactors));
                        this.utils.sessionStorageSet('RangeTop', JSON.stringify(respData.input_data[2].params.rangeTop));
                        this.utils.sessionStorageSet('RangeBottom', JSON.stringify(respData.input_data[2].params.rangeBottom));
                }
        }

        /** For showing loading symbol */
        showSaveDialog(arr, assessVal, txt) {
                this.utils.sessionStorageSet('assesmentname', assessVal);
                this.utils.sessionStorageSet('jsonSaveObject', JSON.stringify(arr));
                this.callSaveModal(assessVal);
        }

        /** For hiding loading symbol */
        hideSaveDialog() {
        }

        ngOnDestroy() {
        }
        /** For showing loading symbol */
        showDeleteDialog(arr, assessment, jsonText) {
                this.utils.sessionStorageRemove("delAnswerSet");
                this.utils.sessionStorageSet('arr', JSON.stringify(arr));
                this.callDeleteModal(arr, assessment, this);
        }

        showStartOverDialog(navUrl, saved, text) {
                let rtArr = this.route.url.split('/');
                let rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');
                this.route.navigate([rtVal + navUrl], { relativeTo: this.activeRoute });
        }
        hideStartOverDialog() {
        }

        /****************This is for making server calls********************/

        /**Interest Profiler Start*/

        /* This method is for getting the result from the server for the questions answered in assessment.
        *  Here call to SaveAndScoreShortIP takes place which saves the assessment with null UserNotes.
        */
        getIpSfResult(answerSet, textNotes) {
                this.answerSet = answerSet;
                this.apiJson.method = "POST";
                this.apiJson.sessionID = this.utils.getAuthKey();
                this.apiJson.moduleName = "Assessment/v1/";
                let SaveShortIP = {};
                SaveShortIP = {
                        input_data: [
                                {
                                        "param_type": "path",

                                        "params": [this.utils.sessionStorageGet("shortIpLogID")]
                                },
                                {
                                        "param_type": "query",
                                        "params": { "stateAbbr": "IC" }
                                },
                                {
                                        "param_type": "body",
                                        "params": this.answerSet

                                }
                        ]
                }
                this.apiJson.endUrl = "users/saveAndScoreShortIP";
                this.apiJson.data = JSON.stringify(SaveShortIP);
                this.serverApi.callApi([this.apiJson]).subscribe((res) => {
                        this.utils.sessionStorageSet("ipResult", JSON.stringify(res.Result));
                        let rtArr = this.route.url.split('/');
                        let rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');
                        this.route.navigate([rtVal + '/result'], { relativeTo: this.activeRoute });

                }, this.utilities.handleError);
                if (textNotes != null) {
                        this.utils.sessionStorageSet("SaveComUserNotesIP", textNotes);
                }

        }

        /**Interest Profiler End*/
        /**lss start */
         /*    This method is for getting the result from the server for the questions answered in assessment.
          Here call to saveAndScoreLearnStyle takes place which saves the assessment with null UserNotes.*/
        learnStyleResultCall(answerSet,textNotes){
        
             this.answerSet = answerSet;
                  this.logID= this.utils.sessionStorageGet("learnStyleLogID");
                this.apiJson.method = "POST";
                this.apiJson.sessionID = this.utils.getAuthKey();
                let saveLearnStyle = {};
                this.apiJson.moduleName = "Assessment/v1/";
              
                saveLearnStyle = {
                       
                        input_data: [
                         {
                             "param_type": "path",
                             "params": [parseInt(this.logID)]
                         },
                        {
                          "param_type": "query",
                          "params": { "stateAbbr": "IC"}
                         },
	                {
                          "param_type": "body",
                         "params": this.answerSet
		        }
                      ]
                }
                let user = JSON.stringify(saveLearnStyle);
                this.apiJson.endUrl = "users/saveAndScoreLearnStyle";
                this.apiJson.data = user;
                
                if (textNotes != null) {
                        this.utils.sessionStorageSet("SaveComUserNotesLS", textNotes);
                }
                
                 this.serverApi.callApi([this.apiJson]).subscribe((res) => {
                         window.sessionStorage.setItem("resultLearnStyle", JSON.stringify(res.Result));
                         let rtArr = this.route.url.split('/');
                        
                        let rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');//.createUrlTree(['./result'], { relativeTo: this.activeRoute })
                        this.route.navigate([rtVal + '/result'], { relativeTo: this.activeRoute });
              }, this.utilities.handleError())
               
        }
        /**lss end */
       /**CCIjr Start*/

        /* This method is for getting the result from the server for the questions answered in assessment.
        *  Here call to SaveAndScoreShortIP takes place which saves the assessment with null UserNotes.
        */
        getCCIjrResult(answerSet, textNotes) {
                let cciVar = ""
                let cciUrl = this.utils.sessionStorageGet('CCIassessment');
                // alert("cciurlservice-->" + cciUrl);
                // alert("result end url--->" + this.utils.sessionStorageGet('CCIassessment'));
                if (cciUrl.indexOf('CCIJr') != -1)
                        cciVar = "saveAndScoreCCIJr";
                else
                        cciVar = "saveAndScoreCCIAdult";


                this.answerSet = answerSet;
                let logID = this.utils.sessionStorageGet("shortCCIjrLogID");

                this.apiJson.method = "POST";
                this.apiJson.sessionID = this.utils.getAuthKey();
                this.apiJson.moduleName = "Assessment/v1/";
                let SaveShortCCIjr = {};
                SaveShortCCIjr = {
                        input_data: [
                                {
                                        "param_type": "path",

                                        "params": [cciVar, parseInt(logID)]
                                },
                                {
                                        "param_type": "query",
                                        "params": { "stateAbbr": "IC" }
                                },
                                {
                                        "param_type": "body",
                                        "params": this.answerSet

                                }
                        ]
                }


                this.apiJson.endUrl = "Users";
                this.apiJson.data = JSON.stringify(SaveShortCCIjr);

                this.serverApi.callApi([this.apiJson]).subscribe((res) => {

                        this.utils.sessionStorageSet("CCIjrResult", JSON.stringify(res.Result));
                        let rtArr = this.route.url.split('/');
                        let rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');//.createUrlTree(['./result'], { relativeTo: this.activeRoute })
                        this.route.navigate([rtVal + '/result'], { relativeTo: this.activeRoute });

                }, this.utilities.handleError);
                if (textNotes != null) {
                        this.utils.sessionStorageSet("SaveComUserNotesCCI", textNotes);
                        // $savemodal.find("#comment").val(textNotes);
                }

        }

        /**CCIjr End*/
        /**OccSort Start */

        getOccSortResult(occSortFields, textNotes) {
                let indexlistInfo = {};
                indexlistInfo = {
                        input_data: [

                                {
                                        'param_type': 'path',
                                        'params': ["index", this.utils.getAccountId()]
                                },
                                {
                                        "param_type": "query",
                                        "params": { "lang": "en", "stateAbbr": "IC" }
                                }
                        ]
                };

                /**Hear we get the data from the server for pageCluster */
                this.apiJson.method = 'GET';
                this.apiJson.sessionID = this.utils.getAuthKey();
                this.apiJson.moduleName = 'Occ/v1/';
                this.apiJson.endUrl = 'pages';
                this.apiJson.data = JSON.stringify(indexlistInfo);
                this.serverApi.callApi([this.apiJson]).subscribe((res) => {
                        this.indexResult = res[0];
                        let WhySaveShortIP = {};
                        WhySaveShortIP = {

                                input_data: [

                                        {
                                                "param_type": "path",
                                                "params": []
                                        },
                                        {
                                                "param_type": "query",
                                                "params": { "returnOnList": true, "lang": "en", "stateAbbr": "IC" }
                                        },
                                        {
                                                "param_type": "body",
                                                "params": {
                                                        "selectedFactors": occSortFields[0].selectedFactors,
                                                        "rangeTop": occSortFields[0].rangeTop,
                                                        "rangeBottom": occSortFields[0].rangeBottom,

                                                }
                                        }
                                ]
                        }
                        this.apiJson.method = "POST";
                        this.apiJson.sessionID = this.utils.getAuthKey();
                        this.apiJson.moduleName = "Assessment/v1/";
                        this.apiJson.endUrl = "occSort/score";
                        this.apiJson.data = JSON.stringify(WhySaveShortIP);
                        this.serverApi.callApi([this.apiJson]).subscribe((res) => {
                                if (res.Success + "" == "true") {
                                        this.utils.sessionStorageSet("OccList", JSON.stringify(res.Result));
                                        this.List("why", res.Result, this.indexResult);
                                }
                        }, this.utilities.handleError);

                        let WhyNotSaveShortIP = {};
                        WhyNotSaveShortIP = {

                                input_data: [

                                        {
                                                "param_type": "path",
                                                "params": []
                                        },
                                        {
                                                "param_type": "query",
                                                "params": { "returnOnList": false, "lang": "en", "stateAbbr": "IC" }
                                        },
                                        {
                                                "param_type": "body",
                                                "params": {
                                                        "selectedFactors": occSortFields[0].selectedFactors,
                                                        "rangeTop": occSortFields[0].rangeTop,
                                                        "rangeBottom": occSortFields[0].rangeBottom,

                                                }
                                        }
                                ]
                        }
                        this.apiJson2.method = "POST";
                        this.apiJson2.sessionID = this.utils.getAuthKey();
                        this.apiJson2.moduleName = "Assessment/v1/";
                        this.apiJson2.endUrl = "occSort/score";
                        this.apiJson2.data = JSON.stringify(WhyNotSaveShortIP);
                        this.serverApi.callApi([this.apiJson2]).subscribe((res) => {
                                if (res.Success + "" == "true") {
                                        this.utils.sessionStorageSet("NotOccList", JSON.stringify(res.Result));
                                        this.List("whynot", res.Result, this.indexResult);
                                }
                        }, this.utilities.handleError);

                        this.utils.sessionStorageSet("whyList", "");
                        this.utils.sessionStorageSet("whyList", JSON.stringify(WhySaveShortIP));
                }, this.utils.handleError);
                this.apiJson1.method = "POST";
                this.apiJson1.sessionID = this.utils.getAuthKey();
                this.apiJson1.moduleName = "Assessment/v1/";
                let occSave = {};
                occSave = {

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
                                                "selectedFactors": occSortFields[0].selectedFactors,
                                                "rangeTop": occSortFields[0].rangeTop,
                                                "rangeBottom": occSortFields[0].rangeBottom,

                                        }
                                }
                        ]
                }
                this.apiJson1.endUrl = "users/saveAndScoreOccSort";
                this.apiJson1.data = JSON.stringify(occSave);
                this.serverApi.callApi([this.apiJson1]).subscribe((res) => { });
                if (textNotes != null) {
                        this.utils.sessionStorageSet("SaveComUserNotesOS", textNotes);
                }
        }
        List(name, resultVal, indexRes) {
                let ref = this;
                let commonClusterIds = [];
                let occIdValues = [];

                let occListData = resultVal;

                let occClusValues = [];
                let titlelist = [];
                let ClusName = []


                let titlesValues = [];
                if (indexRes.Success + '' == 'true') {
                        for (let j = 0; j < indexRes.Result.occs.length; j++) {
                                occIdValues.push(
                                        indexRes.Result.occs[j]
                                );
                        }
                        for (let j = 0; j < indexRes.Result.emerging.length; j++) {
                                occIdValues.push(
                                        indexRes.Result.emerging[j]);
                        }
                        occClusValues = indexRes.Result.clusters;
                        if (occIdValues.length != 0) {
                                for (let j = 0; j < occIdValues.length; j++) {
                                        for (let i = 0; i < occListData.length; i++) {
                                                if (occIdValues[j].occID == occListData[i].occID) {
                                                        commonClusterIds.push(occIdValues[j]);
                                                        titlelist.push(occIdValues[j]);
                                                }
                                        }
                                }
                                for (let i = 0; i < occClusValues.length; i++) {
                                        let titles = [];
                                        let j = 0;
                                        for (j = 0; j < commonClusterIds.length; j++) {
                                                if (commonClusterIds[j].clusterID == occClusValues[i].clusterID) {
                                                        titles.push(commonClusterIds[j]);
                                                        titlesValues.push(commonClusterIds[j]);
                                                }
                                        }
                                        if (titles.length != 0) {

                                                ClusName.push({
                                                        clusterId: occClusValues[i].clusterID,
                                                        clusterName: occClusValues[i].title,
                                                        clusterRating: occClusValues[i].rating,
                                                        clusterTitle: titles
                                                })
                                        }
                                }
                        }
                        if (name == "why") {
                                this.utils.sessionStorageSet("yOccListtitle", JSON.stringify(titlelist));
                                this.utils.sessionStorageSet("yOccListclus", JSON.stringify(ClusName));
                                let rtArr = this.route.url.split('/');
                                let rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');//.createUrlTree(['./result'], { relativeTo: this.activeRoute })
                                this.route.navigate([rtVal + '/result'], { relativeTo: this.activeRoute });
                        }
                        else if (name == "whynot") {
                                this.utils.sessionStorageSet("ynOccListtitle", JSON.stringify(titlelist));
                                this.utils.sessionStorageSet("ynOccListclus", JSON.stringify(ClusName));
                        }
                }

        }

        /**OccSort End */
        /**Entrepreneur Quiz start */
       eqResultCall(answerSet, textNotes) {
                this.answerSet = answerSet;
                 this.logIDeq = this.utils.sessionStorageGet("entiQuizLogID");
                this.apiJson.method = "POST";
                this.apiJson.sessionID = this.utils.getAuthKey();
                let SaveEntiQuiz = {};
                this.apiJson.moduleName = "Assessment/v1/";
              
                SaveEntiQuiz = {
                      
                       input_data: [
                         {
                             "param_type": "path",
                             "params": [parseInt(this.logIDeq)]
                         },
                        {
                          "param_type": "query",
                          "params": { "stateAbbr": "IC"}
                         },
                         {
                          "param_type": "body",
                         "params": this.answerSet
                       }
                      ]
                }
                let user = JSON.stringify(SaveEntiQuiz);
                this.apiJson.endUrl = "users/saveAndScoreEntQuiz";
                this.apiJson.data = user;
            
                if (textNotes != null) {
                        this.utils.sessionStorageSet("SaveComUserNotesEQ", textNotes);
                      
               }
                
               this.serverApi.callApi([this.apiJson]).subscribe((res) => {
                      
                       window.sessionStorage.setItem("resultEntiQuiz", res.Result);
                        let rtArr = this.route.url.split('/');
                        let rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');//.createUrlTree(['./result'], { relativeTo: this.activeRoute })
                        this.route.navigate([rtVal + '/result'], { relativeTo: this.activeRoute });
                }, this.utilities.handleError())
              

       }
       /*EQ end*/
        wesResultCall(answerSet, textNotes) {
                let answers = "";
                answers = answerSet;
                // alert("answers--" + answers);
                this.apiJson.method = "POST";
                this.apiJson.sessionID = this.utils.getAuthKey();
                let SaveWES = {};
                this.apiJson.moduleName = "Assessment/v1/";
                SaveWES = {
                        input_data: [

                                {
                                        "param_type": "path",
                                        "params": [this.utils.sessionStorageGet("wesLogID")]
                                },
                                {
                                        "param_type": "query",
                                        "params": { "stateAbbr": "IC" }
                                },
                                {
                                        "param_type": "body",
                                        "params": answers
                                }
                        ]
                }
                let user = JSON.stringify(SaveWES);
                this.apiJson.endUrl = "users/saveAndScoreWES";
                this.apiJson.data = user;
                // alert("user--->" + user);
                if (textNotes != null) {
                        this.utils.sessionStorageSet("save_Com_UserNotes_WES", textNotes);
                        // $savemodal.find("#comment").val(textNotes);
                }
                this.serverApi.callApi([this.apiJson]).subscribe((res) => {

                        // console.log("wes result--->" + JSON.stringify(res.Result))
                        this.utils.sessionStorageSet("resultWES", JSON.stringify(res.Result));
                        let rtArr = this.route.url.split('/');
                        let rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');//.createUrlTree(['./result'], { relativeTo: this.activeRoute })
                        this.route.navigate([rtVal + '/result'], { relativeTo: this.activeRoute });

                }, this.utilities.handleError)
        }
        callSaveModal(assessVal) {
                try {
                        const modalRef = this.modalService.open(AssessmentModalPopups, this.options);

                        if (this.utils.sessionStorageGet("isFrom") === "result") {
                                if (assessVal === "IP" || assessVal === "IPCOMPLETE") {
                                        modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("SaveComUserNotesIP");

                                } else if (assessVal === "EQ" || assessVal === "EQCOMPLETE") {
                                        modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("SaveComUserNotesEQ");
                                }
                                else if (assessVal === "OS" || assessVal === "OSCOMPLETE") {
                                        modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("SaveComUserNotesOS");
                                }
                                else if (assessVal === "WES" || assessVal === "WESCOMPLETE") {
                                        modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("save_Com_UserNotes_WES");
                                }
								else if (assessVal === "CCI" || assessVal === "CCICOMPLETE") {
                                        modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("SaveComUserNotesCCI");
                                }
                                else if (assessVal === "LS" || assessVal === "LSCOMPLETE") {
                                       modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("SaveComUserNotesLS");
                                       }
                        }
                        if (assessVal === "IP" && (this.utils.sessionStorageGet("SaveParUserNotesIP") !== "") && (this.utils.sessionStorageGet("SaveParUserNotesIP") != null)) {
                                modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("SaveParUserNotesIP");

                        }
                        else if (assessVal === "EQ" && (this.utils.sessionStorageGet("SaveParUserNotesEQ") !== "") && (this.utils.sessionStorageGet("SaveParUserNotesEQ") != null)) {
                                modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("SaveParUserNotesEQ");

                        }
                        else if (assessVal === "OS" && (this.utils.sessionStorageGet("SaveParUserNotesOS") !== "") && (this.utils.sessionStorageGet("SaveParUserNotesOS") != null)) {
                                modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("SaveParUserNotesOS")

                        }
                        else if (assessVal === "WES" && (this.utils.sessionStorageGet("save_ParUserNotes_WES") !== "") && (this.utils.sessionStorageGet("save_ParUserNotes_WES") != null)) {
                                modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("save_ParUserNotes_WES")

                        }
                        else if (assessVal === "LS" && (this.utils.sessionStorageGet("SaveParUserNotesLS") !== "") && (this.utils.sessionStorageGet("SaveParUserNotesLS") != null)) {
                              modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("SaveParUserNotesLS");
                                 
                        }
 						else if (assessVal === "CCI" && (this.utils.sessionStorageGet("SaveParUserNotesCCI") !== "") && (this.utils.sessionStorageGet("SaveParUserNotesCCI") != null)) {
                                modalRef.componentInstance.textarea_txt = this.utils.sessionStorageGet("SaveParUserNotesCCI")

                        }
                        modalRef.componentInstance.aaheadsection = 'LANG_EN_TRANS.savemythoughts';
                        modalRef.componentInstance.enter_thought_txt = 'LANG_EN_TRANS.enter_thougts';
                        modalRef.componentInstance.yesbtn = 'LANG_EN_TRANS.btn_save';
                        modalRef.componentInstance.nobtn = 'LANG_EN_TRANS.cancel';
                        modalRef.componentInstance.showvalue = 2;
                } catch (e) {
                        console.log("modal comming  " + e.message);
                }
        }

        callDeleteModal(arr, assessment, ref) {
                let dat = JSON.parse(arr.data);
                this.utils.sessionStorageSet("delAnswerSet", dat.input_data[0].params[2]);
                const modalRef = this.modalService.open(AssessmentModalPopups, this.options);
                let text = ['delete_sure', 'action_undone', 'delete', 'cancel', 'delete_ans_set', 'err_occ'];
                modalRef.componentInstance.aaheadsection = 'LANG_EN_TRANS.delete_ans_set';
                modalRef.componentInstance.delete_sure_txt = 'LANG_EN_TRANS.delete_sure';
                modalRef.componentInstance.action_undone_txt = 'LANG_EN_TRANS.action_undone';
                modalRef.componentInstance.answerSet_txt = dat.input_data[0].params[2];
                modalRef.componentInstance.yesbtn = 'LANG_EN_TRANS.delete';
                modalRef.componentInstance.nobtn = 'LANG_EN_TRANS.cancel';
                modalRef.componentInstance.showvalue = 1;

        }


}