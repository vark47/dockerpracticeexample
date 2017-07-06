import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { messages } from '../../../../shared/messages';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';

@Component({
	selector: 'ipsf-into',
	templateUrl: './ipsf-intro.layout.html',
})
export class IPSFIntroComponent {
	ipQuestions;
	ipQuesNames;
	ipQuesResponses;
	accountId;
	constructor(private http: Http, private router: Router, private activatedroute: ActivatedRoute,
		private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi) {
		this.getIPQues();
		this.getIPQuesRes();
	}

	getIPQues() {
		this.apiJson.endUrl = "ShortIP";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
			input_data: [
				{
					"param_type": "path",
					"params": ["questions"]
				},
				{
					"param_type": "query",
					"params": { "lang": "en" }
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
			this.ipQuesNames = response[0].Result;
			this.utils.sessionStorageSet("ipQues", JSON.stringify(this.ipQuesNames));
			this.utils.hideLoading();
		}, this.utils.handleError)

	}
	getIPQuesRes() {
		this.apiJson.endUrl = "ShortIP";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
			input_data: [
				{
					"param_type": "path",
					"params": ["responses"]
				},
				{
					"param_type": "query",
					"params": { "lang": "en" }
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
			this.ipQuesResponses = response[0].Result;
			this.utils.sessionStorageSet("ipQuesRes", JSON.stringify(this.ipQuesResponses));
			this.utils.hideLoading();
		}, this.utils.handleError)

	}


	/*This method is used to get into Interest-profiler assessment.*/
	ngOnInit() {
		this.utils.showLoading();
		this.utils.sessionStorageSet("savedPartialAsmnt", "");
		this.utils.sessionStorageSet("isAssessment", "");
		this.utils.sessionStorageSet("isFrom", "intro");
		this.utils.sessionStorageSet("mainPath", "intro");
		this.accountId = this.utils.getAccountId();
		this.getLogID();
	}

	/*This method is used to get the Interest-profiler logid.*/
	getLogID() {
		this.apiJson.endUrl = "Users";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
			input_data: [
				{
					"param_type": "path",
					"params": ["start", this.accountId, "ShortIP"]
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
			this.utils.sessionStorageSet("shortIpLogID", response[0].Result);
			this.utils.hideLoading();
		}, this.utils.handleError)
	}


	/**This makes to navigate to assessement page */
	StartAssessment() {
		if (this.utils.sessionStorageGet("shortIpLogID") != null && this.utils.sessionStorageGet("shortIpLogID") != "" && this.utils.sessionStorageGet("shortIpLogID") != undefined) {
			this.utils.sessionStorageSet("SaveParUserNotesIP", "");
			this.utils.sessionStorageSet("SaveComUserNotesIP", "");
			this.router.navigate(['../assessment'], { relativeTo: this.activatedroute });
		}
		else {
			this.utils.handleError();
		}
	}
}


