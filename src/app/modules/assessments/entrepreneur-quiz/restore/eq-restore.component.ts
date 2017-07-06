import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { messages } from '../../../../shared/messages';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { CustomDate } from '../../../../shared/customPipes';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { TranslateService, TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'eq-restore',
	templateUrl: './eq-restore.layout.html',

})
export class EQRestoreComponent implements OnInit {
	restoreAnswerSet = [];
	restoreQuesArr = [];
	restorePrevQuesArr = [];
	successDelete = false;
	deleteVal = "";
	resLength = -1;
	logID;
	answerSet;
	constructor(private trackEvnt: AssessmentsService,
		private translate: TranslateService, private router: Router, private activatedRoute: ActivatedRoute,
		private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService) {
		this.logID = this.utils.sessionStorageGet("entiQuizLogID");
		/** Below code block listens broadcasted event and 
				 * calls respective functionality for this assessment */
		eventService.listen().subscribe((e) => {
			/** After event listen it will check whether user want delete or not */
			if (e.type == "deleteAnswerSet") {
				this.deleteVal = this.utils.sessionStorageGet("delAnswerSet");
				console.log("deleteval ---->" + this.deleteVal);
				this.getAnswerSet();

			}
		})
	}
	// This method is used to get the saved answer sets form the server
	ngOnInit() {
		this.utils.sessionStorageSet("isFrom", "restore");
		this.utils.sessionStorageSet("mainPath", "restore");
		this.getAnswerSet();
	}
	// Used to display the list when restore button is clicked    
	getAnswerSet() {

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
					"params": {

					}
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

		}, this.utils.handleError)
	}

	// This method is used to restore the answer set and display the questions
	restoreQuestionsEntiQuiz(answerSet, usernotes) {

		this.utils.showLoading();
		this.answerSet = answerSet;
		// Set answer set so that it is used when the restore answer set is clicked 
		this.utils.sessionStorageSet("entiQuizAnswerSet", answerSet);
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
			// Pushing value to restoreQuesArr
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
			// If the length of restoreQuesArr is zero means all questions are answered 
			if (this.restoreQuesArr.length == 0) {

				// Since all questions are answered goto result page
				this.utils.sessionStorageSet("entiQuizAnswerSet", response[0].Result.answers);
				this.trackEvnt.eqResultCall(response[0].Result.answers, usernotes);
			}
			else {
				// If all questions are not answered go to assessment page 
				this.utils.sessionStorageSet("SaveParUserNotesEQ", usernotes);
				this.utils.sessionStorageSet("restoreAnswerSet", JSON.stringify(answerSetRes));
				this.utils.sessionStorageSet("restoreQuesArr", JSON.stringify(this.restoreQuesArr));
				this.utils.sessionStorageSet("restorePrevQuesArr", JSON.stringify(this.restorePrevQuesArr));
				this.router.navigate(['../assessment'], {
					relativeTo: this.activatedRoute,
					queryParams: { eqAnswerSet: answerSet }
				});
			}
		}, this.utils.handleError)

	}

	// This method is used to delete the answerset for enterprenur-quiz
	DeleteIPAnswerSet(answerSet) {
		this.answerSet = answerSet;
		let text = ['delete_sure', 'action_undone', 'delete', 'cancel', 'delete_ans_set', 'err_occ'];
		let jsonText = this.changeTextLang(text, this);
		this.apiJson.endUrl = "users/answerSets";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
			input_data: [
				{
					"param_type": 'path',
					"params": [this.logID, "delete", this.answerSet]
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

		// Check the action done in dialogbox 
		this.trackEvnt.showDeleteDialog(this.apiJson, "EQ", jsonText);

	}
	changeTextLang(keyArr, ref) {
		//Used to change the language of the text
		let tranJson = {};
		for (let i = 0; i < keyArr.length; i++) {
			let key = keyArr[i];
			this.translate.get('LANG_EN_TRANS.' + key).subscribe(
				value => {
					// Value is our translated string
					tranJson[key] = value;
				})
		}
		return tranJson;
	}
}
