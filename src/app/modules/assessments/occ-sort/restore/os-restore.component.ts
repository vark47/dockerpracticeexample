import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { messages } from '../../../../shared/messages';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
import { CustomDate } from '../../../../shared/customPipes';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { TranslateService } from 'ng2-translate';

var TRes = [], BRes = [];
var ResLength = 0, saved = 0;
@Component({
	selector: 'os-assessment-restore',
	templateUrl: './os-restore-layout.html',
	providers: [ApiCallClass, ServerApi, Utilities],
})

export class OSRestoreComponent implements OnInit {
	restoreAnswerSet = [];
	successDelete = false;
	deleteVal = "";
	resLength = -1;
	constructor(private assess: AssessmentsService,
		private translate: TranslateService, private router: Router, private activatedRoute: ActivatedRoute,
		private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService) {
		eventService.listen().subscribe((e) => {
			if (e.type == "deleteAnswerSet") {
				this.deleteVal = this.utils.sessionStorageGet("delAnswerSet");
				this.getEQAnswerSet();

			}
		})
	}

	// This method is used to get the saved answer sets form the server
	ngOnInit() {
		this.utils.showLoading();
		this.utils.sessionStorageSet("isFrom", "restore");
		this.utils.sessionStorageSet("mainPath", "restore");
		this.getEQAnswerSet();
	}


	getEQAnswerSet() {
		this.apiJson.endUrl = "users/answerSets";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
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

					}
				}
			]
		}
		this.apiJson.method = "GET";
		this.apiJson.data = JSON.stringify(data);
		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
			this.restoreAnswerSet = response[0].Result;
			this.resLength = this.restoreAnswerSet.length;
			this.utils.hideLoading();

			if (this.deleteVal != "0" && this.deleteVal != null && this.deleteVal != "") {

			}
		}, this.utils.handleError)
	}

	// This method is used to restore the answer set and display the questions
	restoreQuestionsOS(answerSet, userNotes) {
		this.utils.showLoading();
		this.utils.sessionStorageSet("OSAnswerSet", answerSet);
		this.apiJson.endUrl = "users/answerSets";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
			input_data: [

				{
					"param_type": "path",
					"params": [this.utils.sessionStorageGet("OccSortLogID"), "restoreOccSort", answerSet]
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
			TRes = response[0].Result.rangeTop.split(',');
			BRes = response[0].Result.rangeBottom.split(',');
			for (ResLength = 0; ResLength < TRes.length; ResLength++) {

				if (TRes[ResLength] == -1) {
					break;
				}
			}
			if (ResLength < 5) {
				this.utils.sessionStorageSet("SaveParUserNotesOS", userNotes);
				this.utils.sessionStorageSet('occ_factors', (JSON.stringify(response[0].Result.selectedFactors)));
				this.utils.sessionStorageSet('RangeTop', (JSON.stringify(response[0].Result.rangeTop)));
				this.utils.sessionStorageSet('RangeBottom', (JSON.stringify(response[0].Result.rangeBottom)));
				this.router.navigate(['../assessment'], {
					relativeTo: this.activatedRoute,
					queryParams: { eqAnswerSet: answerSet }
				});
			}
			if (ResLength == 5) {
				let occArray = [];
				occArray.push(response[0].Result);
				this.utils.sessionStorageSet('occsort', JSON.stringify(occArray));
				this.assess.getOccSortResult(occArray, userNotes);
			}
		}, this.utils.handleError)
	}

	// This method is used to delete the answerset for IP
	DeleteIPAnswerSet(answerSet) {
		this.apiJson.endUrl = "users/answerSets";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let text = ['delete_sure', 'action_undone', 'delete', 'cancel', 'delete_ans_set', 'err_occ'];
		let jsonText = this.changeTextLang(text, this);
		let data = {
			input_data: [

				{
					"param_type": "path",
					"params": [this.utils.sessionStorageGet("OccSortLogID"), "delete", answerSet]
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
		this.assess.showDeleteDialog(this.apiJson, "OS", jsonText);
	}
	changeTextLang(keyArr, ref) {
		let tranJson = {};
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