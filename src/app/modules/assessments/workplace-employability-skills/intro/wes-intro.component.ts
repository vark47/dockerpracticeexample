/** Angular imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** import shared Components */
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';

@Component({
	selector: 'wes-intro',
	templateUrl: './wes-intro.layout.html',
})
export class WESIntroComponent implements OnInit {

	introList = ['Complex communication skills', 'Collabation skills',
		'People management skills', 'Business management skills', 'Strategic Thinking'];

	constructor(private router: Router, private utils: Utilities, private activeRoute: ActivatedRoute,
		private apiJson: ApiCallClass, private serverApi: ServerApi) {
	}

	ngOnInit() {
		// Get the log-id of WES
		this.utils.showLoading();
		this.utils.sessionStorageSet('isAssessment', '');
		this.utils.sessionStorageSet('savedPartialAsmnt', '');
		this.utils.sessionStorageSet('isFrom', 'intro');
		this.utils.sessionStorageSet('save_ParUserNotes_WES', '');
		this.utils.sessionStorageSet('save_ComUserNotes_WES', '');
		this.utils.sessionStorageSet('mainPath', 'intro');
		this.utils.sessionStorageSet('hashFrom', 'intro');
		const wesIntro = {
			input_data: [
				{
					'param_type': 'path',
					'params': [this.utils.getAccountId(), 'WES']
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
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		this.apiJson.endUrl = 'users/start';
		this.apiJson.data = JSON.stringify(wesIntro);
		this.serverApi.callApi([this.apiJson]).subscribe((res) => {
			if (res[0].Success + '' === 'true') {
				this.utils.sessionStorageSet('wesLogID', res[0].Result);
				this.utils.hideLoading();
			} else {
				// alert("error occured");
			}
		}, this.utils.handleError);
	}

	// Go to assessment page when user click start button
	startAssessment() {
		const logId = this.utils.sessionStorageGet('wesLogID');
		if (logId !== null && logId !== '' && logId !== undefined) {
			this.utils.sessionStorageSet('save_ParUserNotes_WES', '');
			this.utils.sessionStorageSet('save_ComUserNotes_WES', '');
			this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
		} else {
			this.utils.handleError();
		}

	}
}
