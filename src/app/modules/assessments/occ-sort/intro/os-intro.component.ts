import { Component, OnInit, Output, EventEmitter, Renderer, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { messages } from '../../../../shared/messages';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';

@Component({
	selector: 'os-into',
	templateUrl: './os-intro.layout.html',
})
export class OSIntroComponent {
	FactorsList;
	constructor(private http: Http, private router: Router, private activeRoute: ActivatedRoute,
		private utils: Utilities, private renderer: Renderer,
		private apiJson: ApiCallClass, private serverApi: ServerApi) {
		this.getFactors();
	}

	getFactors() {
		let occQuestions = {};
		occQuestions = {

			input_data: [

				{
					"param_type": "path",
					"params": []
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
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		this.apiJson.endUrl = "occSort/questions";
		this.apiJson.data = JSON.stringify(occQuestions);
		this.serverApi.callApi([this.apiJson]).subscribe((res) => {
			if (res[0].Success + "" == "true") {
				this.utils.sessionStorageSet("factors", JSON.stringify(res[0].Result.questions))
			}
		}, this.utils.handleError);

		let occQuesOpt = {};
		occQuesOpt = {

			input_data: [

				{
					"param_type": "path",
					"params": []
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
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		this.apiJson.endUrl = "occSort/responses";
		this.apiJson.data = JSON.stringify(occQuesOpt);
		this.serverApi.callApi([this.apiJson]).subscribe((res) => {
			let allOpts = [];
			if (res[0].Success + "" == "true") {
				for (let i = 0; i < res[0].Result.responses.length; i++) {
					allOpts.push(res[0].Result.responses[i].resp);
				}
				this.utils.sessionStorageSet("allOptions", JSON.stringify(allOpts));

			} else {
				alert("error occured");
			}
		}, this.utils.handleError);

	}
	/*This method is used to get into Occ-sort assessment.*/
	ngOnInit() {
		this.utils.showLoading();
		this.utils.sessionStorageSet("isAssessment", "");
		this.utils.sessionStorageSet("savedPartialAsmnt", "");
		this.utils.sessionStorageSet("isFrom", "intro");
		this.utils.sessionStorageSet("mainPath", "intro");
		this.apiJson.method = "GET";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let pageOCC = {};
		pageOCC = {
			input_data: [
				{
					"param_type": "path",
					"params": [this.utils.getAccountId(), "OccSort"]
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
		let user = JSON.stringify(pageOCC);

		this.apiJson.endUrl = "users/start";
		this.apiJson.data = user;

		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
			this.utils.sessionStorageSet("OccSortLogID", response[0].Result);
			this.utils.hideLoading();
		}, this.utils.handleError)
	}


	/**This makes to navigate to assessement page */
	StartAssessment() {
		if (this.utils.sessionStorageGet("OccSortLogID") != null && this.utils.sessionStorageGet("OccSortLogID") != "" && this.utils.sessionStorageGet("OccSortLogID") != undefined) {
			this.utils.sessionStorageSet("SaveParUserNotesOS", "");
			this.utils.sessionStorageSet("SaveComUserNotesOS", "");
			this.router.navigate(['../factors'], { relativeTo: this.activeRoute });
		}
		else {
			this.utils.hideLoading();
		}
	}

	logError(error: any) {

	}

}
