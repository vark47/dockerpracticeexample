import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Subscription } from "rxjs/Subscription";
import { ApiCallClass } from '../../../../shared/apicall.model';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';

@Component({
	selector: 'lss-restore',
	templateUrl: './lss-restore.layout.html',
})
export class LSSRestoreComponent {
	logID;
	restoreAnswerSet = [];
	resLength;
	answerSet;
	restoreQuesArr = [];
	restorePrevQuesArr = [];
	deleteVal;
	subscription = new Subscription;
	constructor(private router: Router, private serverApi: ServerApi, private eventService: EventDispatchService,
		private trackEvnt: AssessmentsService, private activatedRoute: ActivatedRoute, private translate: TranslateService,
		private utils: Utilities, private apiJson: ApiCallClass) {
		this.logID = this.utils.sessionStorageGet("learnStyleLogID");
	this.subscription =	eventService.listen().subscribe((e) => {
			/** After event listen it will check whether user want delete or not */
			if (e.type === "deleteAnswerSet") {
				this.deleteVal = this.utils.sessionStorageGet("delAnswerSet");
				this.getAnswerSet();

			}
		})
	}

	/*this method is used to get the saved answer sets form the server*/
	ngOnInit() {
		this.utils.showLoading();
		this.utils.sessionStorageSet("isFrom", "restore");
		this.utils.sessionStorageSet("mainPath", "restore");
		this.utils.sessionStorageSet("hashFrom", "restore");
		this.getAnswerSet();
	}
	ngOnDestroy(){
		 this.subscription.unsubscribe();
          console.log("called ngOnDestroy");
	}
	/*Used to display the list when restore button is clicked */  
	getAnswerSet() {
		try{
		this.utils.showLoading();
		this.utils.sessionStorageRemove("restoreQuesArr");
		this.utils.sessionStorageRemove("restorePrevQuesArr");
		this.apiJson.endUrl = "Users";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
			input_data: [
				{
					"param_type": "path",
					"params": ["answerSets", this.logID]
				},
				{
					"param_type": "query",
					"params": { "stateAbbr": "IC" }
				},
				{
					"param_type": "body",
					"params": {}
				}
			]
		}
		this.apiJson.method = "GET";
		let dat = JSON.stringify(data);
		this.apiJson.data = dat;
		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
			this.restoreAnswerSet = response[0].Result;
			this.resLength = this.restoreAnswerSet.length;
			
			this.utils.hideLoading();
		}, this.utils.handleError())
		}catch(e){
			console.log("lss get answerset"+ e.message);
		}
	}
	/*this method is used to restore the answer set and display the questions*/
	restoreQuestionsLearnStyle(answerSet, usernotes) {
        try{
        this.utils.showLoading();
		this.answerSet = answerSet;
		/*Set answer set so that it is used when the restore answer set is clicked */
		this.utils.sessionStorageSet("learnStyleAnswerSet", answerSet);
		this.apiJson.endUrl = "Users";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
			input_data: [
				{
					"param_type": "path",
					"params": ["answerSets", this.logID, "restore", this.answerSet]
				},
				{
					"param_type": "query",
					"params": { "stateAbbr": "IC" }
				},
				{
					"param_type": "body",
					"params": {}
				}
			]
		}
		this.apiJson.method = "GET";
		let dat = JSON.stringify(data);
		this.apiJson.data = dat;
		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
		   
			let quesName = "";
			let answerSetRes = [];
			var splitQuestions = response[0].Result.answers.split(',');
			
			/*pushing value to restoreQuesArr*/
			for (var i = 0; i < splitQuestions.length; i++) {
				if (splitQuestions[i] == 0) {
					quesName = "questions" + i;
					this.restoreQuesArr.push({ "key": quesName, "question": i, "QuestionValue": splitQuestions[i] });
				}
				else {
					quesName = "questions" + i;
					this.restorePrevQuesArr.push({ "key": quesName, "question": i, "QuestionValue": splitQuestions[i] });
					answerSetRes.push(splitQuestions[i]);
				}

			}
			/*if the length of restoreQuesArr is zero means all questions are answered */
			if (this.restoreQuesArr.length === 0) {
				/*Since all questions are answered goto result page*/
				this.utils.sessionStorageSet("learnStyleAnswerSet", response[0].Result.answers);
				this.trackEvnt.learnStyleResultCall(response[0].Result.answers, usernotes);
			}
			else {
				
				/*If all questions are not answered go to assessment page */
				this.utils.sessionStorageSet("SaveParUserNotesLS", usernotes);
				this.utils.sessionStorageSet("restoreAnswerSet", JSON.stringify(answerSetRes));
				this.utils.sessionStorageSet("restoreQuesArr", JSON.stringify(this.restoreQuesArr));
				this.utils.sessionStorageSet("restorePrevQuesArr", JSON.stringify(this.restorePrevQuesArr));
				
				this.router.navigate(['../assessment'], {
					relativeTo: this.activatedRoute,
					queryParams: { lsAnswerSet: answerSet }
				});
			}

		}, this.utils.handleError())
		}catch(e){
			console.log("restore questions"+e.message);
		}
	}

	/*this method is used to delete the answerset for learning style survey*/
	deleteLSAnswerSet(answerSet) {
		try{
		this.answerSet = answerSet;
		let text = ['delete_sure', 'action_undone', 'delete', 'cancel', 'delete_ans_set', 'err_occ'];
		let jsonText = this.changeTextLang(text, this);
		this.apiJson.endUrl = "Users";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";

		let data = {

			input_data: [
				{
					"param_type": "path",
					"params": ["answerSets", this.logID, "delete", this.answerSet]
				},
				{
					"param_type": "query",
					"params": { "stateAbbr": "IC" }
				},
				{
					"param_type": "body",
					"params": {}
				}
			]

		}
		this.apiJson.method = "GET";

		let dat = JSON.stringify(data);
		this.apiJson.data = dat;

		/*Check the action done in dialogbox */
		this.trackEvnt.showDeleteDialog(this.apiJson, "LS", jsonText);
		}catch(e){
			console.log("delete ls answerset"+e.message);
		}
	}
	changeTextLang(keyArr, ref) {
		/*Used to change the language of the text*/
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


}
