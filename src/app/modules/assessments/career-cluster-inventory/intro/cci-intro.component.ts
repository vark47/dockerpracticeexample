import { ApiCallClass } from '../../../../shared/apicall.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
@Component({
	selector: 'cci-jr-intro',
	templateUrl: './cci-intro.layout.html',
})
export class CCIJrIntroComponent {
	cciQuesNames;
	accountId;
	ccijrQuesResponses;
	constructor(private activeRoute: ActivatedRoute, private apiJson: ApiCallClass, private http: Http, private router: Router,
		private serverApi: ServerApi, private utils: Utilities) {
		this.getCCIjrQues();
		this.getCCIjrQuesRes();

	}
	/*This method is used to get into Career Cluster Inventory  assessment.*/
	ngOnInit() {
		this.utils.sessionStorageSet("savedPartialAsmnt", "");
		this.utils.sessionStorageSet("isAssessment", "");
		this.utils.sessionStorageSet("isFrom", "intro");
		this.utils.sessionStorageSet("mainPath", "intro");
		this.accountId = this.utils.getAccountId();
		this.getLogID();
	}
	/**This method is for getting the questions for CCI from API */
	getCCIjrQues() {
		this.apiJson.endUrl = this.utils.sessionStorageGet('CCIassessment');
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		const data = {
			input_data: [
				{
					'param_type': 'path',
					'params': ['questions']
				},
				{
					'param_type': 'query',
					'params': { 'lang': 'en' }
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
			this.cciQuesNames = response[0].Result;
			this.utils.sessionStorageSet('ccijrQues', JSON.stringify(this.cciQuesNames));
			this.utils.hideLoading();
		}, this.utils.handleError());

	}
	/**This method is for getting the responses for CCIjr from API */
	getCCIjrQuesRes() {
		// this.apiJson.endUrl = this.utils.sessionStorageGet('CCIassessment');
		if (this.utils.sessionStorageGet('CCIassessment') == null) {
			window.sessionStorage.setItem("CCIassessment", "CCIAdult");
		}
		this.apiJson.endUrl = this.utils.sessionStorageGet('CCIassessment')
		//alert("endurl-->" + this.apiJson.endUrl)
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		let data = {
			input_data: [
				{
					'param_type': 'path',
					'params': ['responses']
				},
				{
					'param_type': 'query',
					'params': { 'lang': 'en' }
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
			this.ccijrQuesResponses = response[0].Result;
			this.utils.sessionStorageSet('ccijrQuesRes', JSON.stringify(this.ccijrQuesResponses));

			this.utils.hideLoading();
		}, this.utils.handleError);
	}

	/*This method is used to get the Career Cluster Inventory junior logid.*/
	getLogID() {

		try {
			this.apiJson.endUrl = 'Users';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';
			let data = {
				input_data: [
					{
						'param_type': 'path',
						'params': ['start', this.accountId, this.utils.sessionStorageGet('CCIassessment')]
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
			this.utils.showLoading();
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {
				this.utils.hideLoading();
				this.utils.sessionStorageSet('shortCCIjrLogID', response[0].Result);
			});
		}

		catch (e) {
			console.log("exception message-->" + e.message);
		}
	}

	/**This method is to navigate to CCIjr assessement page */
	StartAssessment() {
		if (this.utils.sessionStorageGet('shortCCIjrLogID') != null && this.utils.sessionStorageGet('shortCCIjrLogID') != '' && this.utils.sessionStorageGet('shortCCIjrLogID') != undefined) {
			this.utils.sessionStorageSet('SaveParUserNotesCCI', '');
			this.utils.sessionStorageSet('SaveComUserNotesCCI', '');
			this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
		}
		else {
			this.utils.handleError();
		}

	}
}
