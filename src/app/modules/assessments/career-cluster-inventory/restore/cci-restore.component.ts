import { ApiCallClass } from '../../../../shared/apicall.model';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { Http, Response } from '@angular/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { TranslateService } from 'ng2-translate';
import { Utilities } from '../../../../shared/utilities.class';
@Component({
	selector: 'cci-jr-restore',
	templateUrl: './cci-restore.layout.html',
})
export class CCIJrRestoreComponent {
	restoreAnswerSet = [];
	restoreQuesArr = [];
	restorePrevQuesArr = [];
	deleteVal = '';
	logId;
	resLength = -1;
	answerSet;
	constructor(private http: Http, private router: Router, private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private eventService: EventDispatchService,
		private assssementSer: AssessmentsService, private activatedRoute: ActivatedRoute, private translate: TranslateService, ) {
		eventService.listen().subscribe((e) => {
			if (e.type === 'deleteAnswerSet') {
				this.deleteVal = this.utils.sessionStorageGet('delAnswerSet');
				this.getCCIjrAnswerSet();
			}
		})

	}

	ngOnInit() {
		this.logId = this.utils.sessionStorageGet('shortCCIjrLogID');
		this.getCCIjrAnswerSet();
	}
	/**This method is for getting the answer sets from the Api */
	getCCIjrAnswerSet() {
		this.utils.showLoading();
		this.utils.sessionStorageRemove('restoreQuesArr');
		this.utils.sessionStorageRemove('restorePrevQuesArr');
		this.apiJson.endUrl = 'Users';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		let data = {
			input_data: [
				{
					'param_type': 'path',
					'params': ['answerSets', this.logId]
				},
				{
					'param_type': 'query',
					'params': { 'stateAbbr': 'IC' }
				},
				{
					'param_type': 'body',
					'params': {

					}
				}
			]
		}
		this.apiJson.method = 'GET';
		let dat = JSON.stringify(data);
		this.apiJson.data = dat;
		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
			this.restoreAnswerSet = response[0].Result;

			this.resLength = this.restoreAnswerSet.length;
			this.utils.hideLoading();

			if (this.deleteVal !== '0' && this.deleteVal !== null && this.deleteVal !== '') {

			}
		}, this.utils.handleError)
	}
	/** This method is used to restore the answer set and display the questions.*/
	restoreQuestionsCCIjr(answerSet, usernotes) {
		this.answerSet = answerSet;

		this.utils.showLoading();
		this.utils.sessionStorageSet('ShoptIPAnswerSet', answerSet);
		this.apiJson.endUrl = 'users/answerSets';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';

		const data = {

			input_data: [
				{
					'param_type': 'path',

					'params': [this.logId, 'restore', this.answerSet]
				},
				{
					'param_type': 'query',
					'params': { 'stateAbbr': 'IC' }
				},
				{
					'param_type': 'body',
					'params': {

					}
				}
			]


		}
		this.apiJson.method = 'GET';

		const dat = JSON.stringify(data);
		this.apiJson.data = dat;
		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
			let quesName = '';
			const answerSetRes = [];
			var splitQuestionsarray = [];
			var splitQuestions = response[0].Result.answers.split(',');

			for (var i = 0; i < splitQuestions.length; i++) {
				if (splitQuestions[i] === 'NR') {
					quesName = 'shortip_ques_q' + i;
					this.restoreQuesArr.push({ 'key': quesName, 'question': i, 'QuestionValue': splitQuestions[i] });
				}
				else {
					quesName = 'shortip_ques_q' + i;
					this.restorePrevQuesArr.push({ 'key': quesName, 'question': i, 'QuestionValue': splitQuestions[i] });
					answerSetRes.push(splitQuestions[i]);
				}
			}
			if (this.restoreQuesArr.length === 0) {
				this.utils.sessionStorageSet('answerSetCCIjr', response[0].Result.answers);
				/**The below function is for getting the result for the answer set. This is present in the
				 * assessment.service.ts. On success it navigates to the result page.
				 */
				this.assssementSer.getCCIjrResult(response[0].Result.answers, response[0].Result.userNotes);
			}
			else {
				// alert("usernotes--" + usernotes);
				this.utils.sessionStorageSet('SaveParUserNotesCCI', usernotes);
				this.utils.sessionStorageSet('restoreAnswerSet', JSON.stringify(answerSetRes));
				this.utils.sessionStorageSet('restoreQuesArr', JSON.stringify(this.restoreQuesArr));
				this.utils.sessionStorageSet('restorePrevQuesArr', JSON.stringify(this.restorePrevQuesArr));
				this.router.navigate(['../assessment'], {
					relativeTo: this.activatedRoute,
					queryParams: { eqAnswerSet: answerSet }
				});
			}
		}, this.utils.handleError)
	}
	/*This method is used to delete the answerset for Career Cluster Inventory.*/
	DeleteIPAnswerSet(answerSet) {
		this.answerSet = answerSet;
		const text = ['delete_sure', 'action_undone', 'delete', 'cancel', 'delete_ans_set', 'err_occ'];
		const jsonText = this.changeTextLang(text, this);
		this.apiJson.endUrl = 'users/answerSets';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		const data = {
			input_data: [
				{
					'param_type': 'path',

					'params': [this.logId, 'delete', this.answerSet]
				},
				{
					'param_type': 'query',
					'params': { 'stateAbbr': 'IC' }
				},
				{
					'param_type': 'body',
					'params': {

					}
				}
			]
		}
		this.apiJson.method = 'GET';
		const dat = JSON.stringify(data);
		this.apiJson.data = dat;
		this.assssementSer.showDeleteDialog(this.apiJson, 'CCI', jsonText);
	}
	/**This function is for changing the text language desired by user. */
	changeTextLang(keyArr, ref) {
		const tranJson = {};
		for (let i = 0; i < keyArr.length; i++) {
			const key = keyArr[i];
			this.translate.get('LANG_EN_TRANS.' + key).subscribe(
				value => {
					// value is our translated string
					tranJson[key] = value;

				});
		}
		return tranJson;
	}
}
