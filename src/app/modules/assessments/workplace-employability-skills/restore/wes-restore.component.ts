/** Angular imports */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/** Custom imports */
import { TranslateService } from 'ng2-translate';

/** import shared Components */
import { Utilities } from '../../../../shared/utilities.class';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';


@Component({
	selector: 'wes-restore',
	templateUrl: './wes-restore.layout.html',
})
export class WESRestoreComponent implements OnInit {
	restoreAnswerSet = [];
	resLength = -1;
	deleteVal = '';
	constructor(private trackEvnt: AssessmentsService, private eventService: EventDispatchService,
		private translate: TranslateService, private router: Router, private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private activeRoute: ActivatedRoute) {
		eventService.listen().subscribe((e) => {
			if (e.type === 'deleteAnswerSet') {
				this.deleteVal = this.utils.sessionStorageGet('delAnswerSet');
				this.getWESAnswerSet();
			}
		});

	}

	ngOnInit() {
		this.utils.sessionStorageSet('isFrom', 'restore');
		this.utils.sessionStorageSet('mainPath', 'restore');
		this.utils.sessionStorageSet('hashFrom', 'restore');
		this.getWESAnswerSet();
	}

	// Get all answer set and display in restore
	getWESAnswerSet() {
		this.utils.showLoading();
		this.apiJson.endUrl = 'users/answerSets';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		const data = {
			input_data: [

				{
					'param_type': 'path',
					'params': [this.utils.sessionStorageGet('wesLogID')]
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
		};
		this.apiJson.method = 'GET';
		this.apiJson.data = JSON.stringify(data);
		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
			this.restoreAnswerSet = response[0].Result;
			this.resLength = this.restoreAnswerSet.length;
			this.utils.hideLoading();
		}, this.utils.handleError);
	}

	// Get the answers for the required answer set and check whether it goes to result page or assessment page
	restoreQuestionsWES(answerSet, userNotes) {
		this.utils.showLoading();
		this.apiJson.endUrl = 'users/answerSets';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		const data = {
			input_data: [

				{
					'param_type': 'path',
					'params': [this.utils.sessionStorageGet('wesLogID'), 'restore', answerSet]
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
		};
		this.apiJson.method = 'GET';
		const dat = JSON.stringify(data);

		this.apiJson.data = dat;
		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
			const allAnswers = [];
			let resultAns = '';
			const answ = (response[0].Result.answers).split(',');
			for (let i = 0; i < answ.length; i++) {
				if (answ[i] !== 'NR') {
					allAnswers.push(parseInt(answ[i]));
					if (i < (answ.length - 1)) {
						resultAns = resultAns + parseInt(answ[i]) + ',';
					} else {
						resultAns = resultAns + parseInt(answ[i]);
					}

				} else {
					break;
				}
			}
			if (allAnswers.length !== answ.length) {
				this.utils.sessionStorageSet('save_ParUserNotes_WES', userNotes);
				this.utils.sessionStorageSet('wesAnswers', JSON.stringify(allAnswers));
				this.router.navigate(['../assessment'], {
					relativeTo: this.activeRoute,
					queryParams: { wesAnswerSet: answerSet, usrNotes: userNotes }
				});
			} else {
				this.trackEvnt.wesResultCall(resultAns, userNotes);
			}
		}, this.utils.handleError);
	}

	// Dispatch the answer set number when user click on delete to delete that answer set
	DeleteWESAnswerSet(answerSet) {
		this.apiJson.endUrl = 'users/answerSets';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		const text = ['delete_sure', 'action_undone', 'delete', 'cancel', 'delete_ans_set', 'err_occ'];
		const jsonText = this.changeTextLang(text, this);
		const data = {
			input_data: [

				{
					'param_type': 'path',
					'params': [this.utils.sessionStorageGet('wesLogID'), 'delete', answerSet]
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
		};
		this.apiJson.method = 'GET';
		const dat = JSON.stringify(data);
		this.apiJson.data = dat;
		this.trackEvnt.showDeleteDialog(this.apiJson, 'WES', jsonText);
	}
	changeTextLang(keyArr, ref) {

		// Used to change the language of the text
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
