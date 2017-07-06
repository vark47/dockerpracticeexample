import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
@Component({
	selector: 'lss-intro',
	templateUrl: './lss-intro.layout.html',
})
export class LSSIntroComponent {

	learnStyleQuestions: any;
	learnStyleResponses: any;
	sortName: any;
	accountID: any;

	constructor(private router: Router, private utils: Utilities, private apiJson: ApiCallClass, private serverApi: ServerApi, private activeRoute: ActivatedRoute) {
		 console.log('LSSIntroComponent loaded.');
		 this.getLearnStyleQues();
		this.getLearnStyleResponses();
	}

	/*This method start when it come from Learning Style Survey assessment*/
	ngOnInit() {
		this.utils.showLoading();
		this.utils.sessionStorageSet("savedPartialAsmnt", "");
		this.utils.sessionStorageSet("isAssessment", "");
		this.utils.sessionStorageSet("isFrom", "intro");
		this.utils.sessionStorageSet("mainPath", "intro");
		this.utils.sessionStorageSet("hashFrom", "intro");
		this.getLearnStyleLogID();
	}

	/*This method is used to get the Learning Style Survey logid.*/
	getLearnStyleLogID() {
		try {
			this.sortName = "LearnStyle";
			this.accountID = this.utils.getAccountId();
			this.apiJson.endUrl = "Users";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let data = {
				input_data: [
					{
						"param_type": "path",
						"params": ["start", this.accountID, this.sortName]
					},
					{
						"param_type": "query",
						"params": { "lang": "en", "stateAbbr": "IC" }
					}
				]
			}
			this.apiJson.method = "GET";

			let dat = JSON.stringify(data);
			this.apiJson.data = dat;
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {
				this.utils.sessionStorageSet("learnStyleLogID", response[0].Result);
				this.utils.hideLoading();
			}, this.utils.handleError())
		} catch (e) {
			console.log("get log id" + e.message);
		}
	}


	/*This method is used to get the questions from LearnStyle api call*/
	getLearnStyleQues() {
		try {
			this.apiJson.endUrl = "LearnStyle";
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
						"params": {}
					}
				]
			}
			this.apiJson.method = "GET";
			let dat = JSON.stringify(data);
			this.apiJson.data = dat;
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {
				this.learnStyleQuestions = response[0].Result;
				this.utils.sessionStorageSet("learnStyleQues", JSON.stringify(this.learnStyleQuestions));
				this.utils.hideLoading();
			}, this.utils.handleError())
		} catch (e) {
			console.log("get questions " + e.message);
		}
	}

	/*This method is used to get the responses of LearnStyle apiCall.*/
	getLearnStyleResponses() {
		try {
			this.apiJson.endUrl = "LearnStyle";
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
						"params": {}
					}
				]
			}
			this.apiJson.method = "GET";
			let dat = JSON.stringify(data);
			this.apiJson.data = dat;
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {
				this.learnStyleResponses = response[0].Result;
				this.utils.sessionStorageSet("learnStyleResponses", JSON.stringify(this.learnStyleResponses));
				this.utils.hideLoading();
			}, this.utils.handleError())
		} catch (e) {
			console.log("get responses-->" + e.message);
		}
	}

	/*This make to navigate to assessment page**/
	StartAssessment() {
		if (this.utils.sessionStorageGet("learnStyleLogID") != null && this.utils.sessionStorageGet("learnStyleLogID") != "" && this.utils.sessionStorageGet("learnStyleLogID") != undefined) {
			this.utils.sessionStorageSet("SaveParUserNotesLS", "");
			this.utils.sessionStorageSet("SaveComUserNotesLS", "");
			this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
		}
		else {
			this.utils.handleError();
		}

	}
}
