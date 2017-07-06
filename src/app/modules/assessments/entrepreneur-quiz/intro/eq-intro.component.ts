import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { messages } from '../../../../shared/messages';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';

@Component({
	selector: 'eq-into',
	templateUrl: './eq-intro.layout.html',
})

export class EQIntroComponent implements OnInit {
	eqQuestions;
	sortName;
	accountID;
	eqResponses;
	@Output() changeView = new EventEmitter();
	constructor(private http: Http, private activeRoute: ActivatedRoute, private translate: TranslateService,
		private router: Router, private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi) {
		this.getEqQues();
		this.getEqResponses();
	}

	getEqQues() {
		this.apiJson.endUrl = "EntQuiz";
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
			this.eqQuestions = response[0].Result;
			this.utils.sessionStorageSet("eqQues", JSON.stringify(this.eqQuestions));
			this.utils.hideLoading();
		}, this.utils.handleError)
	}
	getEqResponses() {
		this.apiJson.endUrl = "EntQuiz";
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
			this.eqResponses = response[0].Result;
			this.utils.sessionStorageSet("eqResponses", JSON.stringify(this.eqResponses));
			this.utils.hideLoading();
		}, this.utils.handleError)
	}
	/*This method start when it come from entrepreneur-quiz assessment*/
	ngOnInit() {
		this.utils.showLoading();
		this.utils.sessionStorageSet("savedPartialAsmnt", "");
		this.utils.sessionStorageSet("isAssessment", "");
		this.utils.sessionStorageSet("isFrom", "intro");
		this.utils.sessionStorageSet("mainPath", "intro");
		this.changeView.emit({ "title": "intro page", "btn_class": "green-btn-plp2" });
		this.getEQLogID();
	}

	/*This method is used to get the Entrepreneur-quiz logid.*/
	getEQLogID() {
		this.sortName = "EntQuiz";
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
			this.utils.sessionStorageSet("entiQuizLogID", response[0].Result);
			this.utils.hideLoading();
		}, this.utils.handleError)
	}

	/**This makes to navigate to assessement page. */
	StartAssessment() {
		if (this.utils.sessionStorageGet("entiQuizLogID") != null && this.utils.sessionStorageGet("entiQuizLogID") != "" && this.utils.sessionStorageGet("entiQuizLogID") != undefined) {
			this.utils.sessionStorageSet("SaveParUserNotesEQ", "");
			this.utils.sessionStorageSet("SaveComUserNotesEQ", "");
			this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
		}
		else {
			this.utils.handleError;
		}
	}
}
