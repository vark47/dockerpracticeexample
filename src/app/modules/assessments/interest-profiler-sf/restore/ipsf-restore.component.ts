import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { messages } from '../../../../shared/messages';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { CustomDate } from '../../../../shared/customPipes';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { TranslateService } from 'ng2-translate';

@Component({
	selector: 'ipsf-restore',
	templateUrl: './ipsf-restore.layout.html',

})
export class IPSFRestoreComponent implements OnInit {
	restoreAnswerSet = [];
	restoreQuesArr = [];
	restorePrevQuesArr = [];
	successDelete = false;
	resLength = -1;
	deleteVal = "";
	logId;
	answerSet;
	constructor(private assssementSer: AssessmentsService, private translate: TranslateService,

		private activatedRoute: ActivatedRoute,
		private router: Router, private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private eventService: EventDispatchService) {
		eventService.listen().subscribe((e) => {
			if (e.type == "deleteAnswerSet") {
				this.deleteVal = this.utils.sessionStorageGet("delAnswerSet");
				this.getIPAnswerSet();
			}
		})
	}

	ngOnInit() {
		this.logId = this.utils.sessionStorageGet("shortIpLogID");
		this.utils.sessionStorageSet("isFrom", "restore");
		this.utils.sessionStorageSet("mainPath", "restore");
		this.getIPAnswerSet();
	}
	getIPAnswerSet() {
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
					"params": ["answerSets", this.logId]
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

			if (this.deleteVal != "0" && this.deleteVal != null && this.deleteVal != "") {

			}
		}, this.utils.handleError)
	}
	/** This method is used to restore the answer set and display the questions.*/
	restoreQuestionsIP(answerSet, usernotes) {
		this.answerSet = answerSet;
		this.utils.showLoading();
		this.utils.sessionStorageSet("ShoptIPAnswerSet", answerSet);
		this.apiJson.endUrl = "users/answerSets";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";

		let data = {

			input_data: [
				{
					"param_type": "path",

					"params": [this.logId, "restore", this.answerSet]
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

			let quesName = "";
			let answerSetRes = [];
			var splitQuestionsarray = [];
			var splitQuestions = response[0].Result.answers.split(',');
			for (var i = 0; i < splitQuestions.length; i++) {
				if (splitQuestions[i] == "NR") {
					quesName = "shortip_ques_q" + i;

					this.restoreQuesArr.push({ "key": quesName, "question": i, "QuestionValue": splitQuestions[i] });
				}
				else {
					quesName = "shortip_ques_q" + i;
					this.restorePrevQuesArr.push({ "key": quesName, "question": i, "QuestionValue": splitQuestions[i] });
					answerSetRes.push(splitQuestions[i]);
				}
			}
			if (this.restoreQuesArr.length == 0) {

				this.utils.sessionStorageSet('answerSetIP', response[0].Result.answers);
				this.assssementSer.getIpSfResult(response[0].Result.answers, response[0].Result.userNotes);

			}
			else {
				this.utils.sessionStorageSet("SaveParUserNotesIP", usernotes);
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
	/*This method is used to delete the answerset for interest-profiler.*/
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
					"param_type": "path",

					"params": [this.logId, "delete", this.answerSet]
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
		this.assssementSer.showDeleteDialog(this.apiJson, "IP", jsonText);
	}

	/**This function is for changing the text language desired by user. */
	changeTextLang(keyArr, ref) {
		let tranJson = {}
		for (let i = 0; i < keyArr.length; i++) {
			let key = keyArr[i];
			this.translate.get('LANG_EN_TRANS.' + key).subscribe(
				value => {
					// value is our translated string
					tranJson[key] = value;
				})
		}
		return tranJson;
	}
}
