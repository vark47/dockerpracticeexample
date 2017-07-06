import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';

import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';

import { ApiCallClass } from '../../../../shared/apicall.model';
import { clusterDetails } from '../../shared/constants/assessments-constants';


@Component({
	selector: 'cci-jr-result',

	templateUrl: './cci-result.layout.html',
})
export class CCIJrResultComponent {
	constantVals = [];
	ccijrresultarr = [];
	result = [];
	logId;
	keys = [];
	ccijrResult = [];
	clusIconValue = [];
	clusBgColor = [];
	subscription = new Subscription;

	constructor(private http: Http, private router: Router, private translate: TranslateService, private trackEvnt: AssessmentsService,
		private utils: Utilities, private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService) {

		/** Below code block listens broadcasted event and 
		* calls respective functionality for this assessment */

		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type === 'CCIjrSaveComplete') {
				this.saveCCIjrAssessment();
			}
		});
	}
	ngOnInit() {
		let ref = this;
		this.utils.hideLoading();
		this.logId = this.utils.sessionStorageGet('shortCCIjrLogID');
		this.utils.sessionStorageSet('isAssessment', 'true');
		this.utils.sessionStorageSet('isFrom', 'result');
		/**Hear we are getting the result for Career Cluster Inventory */
		this.ccijrresultarr = JSON.parse(this.utils.sessionStorageGet('CCIjrResult'));
		for (let k = 0; k < ref.ccijrresultarr.length; k++) {
			clusterDetails.forEach(function (obj, inx) {
				/**Hear we are comparing the Cluster ID's */
				if (ref.ccijrresultarr[k].clusterID == obj.clusterId) {
					ref.ccijrresultarr[k].clusterIconValue = (obj.clusterIconValue);
					ref.ccijrresultarr[k].clusterBgColor = (obj.clusterBgColor);
					ref.ccijrresultarr[k].clusterName = (obj.clusterName);

				}
			})
		}
		this.jsonSort(JSON.parse(this.utils.sessionStorageGet('CCIjrResult')));
	}
	/**This method is for sorting the score to desending order */
	jsonSort(res) {
		let obj = {};
		let Careerlist = res;
		let resultccijr = [];
		let score = []

		for (let j = 0; j < Careerlist.length; j++) {
			score.push(Careerlist[j].score);
			this.keys.push(Careerlist[j].clusterID);
		}
		for (let i = 0; i < score.length; i++) {
			for (let j = i + 1; j < score.length; j++) {
				if (score[i] < score[j]) {
					let firstscore = score[i];
					score[i] = score[j];
					score[j] = firstscore;
					let secondscore = this.keys[i];
					this.keys[i] = this.keys[j];
					this.keys[j] = secondscore;
				}
				else if (score[i] == score[j]) {
					if (this.keys[i] > this.keys[j]) {
						let firstscore = this.keys[i];
						this.keys[i] = this.keys[j];
						this.keys[j] = firstscore;
					}
				}
			}

			for (let k = 0; k < this.ccijrresultarr.length; k++) {
				if (this.ccijrresultarr[k].clusterID == this.keys[i]) {
					this.ccijrResult.push({
						ccijrClusterId: this.keys[i],
						ccijrScore: score[i],
						ccijrIcon: this.ccijrresultarr[k].clusterIconValue,
						ccijrBgColor: this.ccijrresultarr[k].clusterBgColor,
						ccijrClusterName: this.ccijrresultarr[k].clusterName
					});
				}
			}
		}
	}

	/**This method is for saving the complete user notes */
	saveCCIjrAssessment() {
		this.apiJson.method = 'POST';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		let SaveUserNotes = {};
		let text = ['enter_thougts', 'savemythoughts', 'cancel', 'btn_save', 'err_occ'];
		let transText = this.changeTextLang(text, this);
		SaveUserNotes = {

			input_data: [
				{
					'param_type': 'path',

					'params': ['saveUserNotes', this.logId]
				},
				{
					'param_type': 'query',
					'params': { 'stateAbbr': 'IC' }
				},
				{
					'param_type': 'body',
					'params': {
						'userNotes': 'added'
					}
				}
			]
		}
		let user = JSON.stringify(SaveUserNotes);
		this.apiJson.endUrl = 'Users';
		this.apiJson.data = user;
		this.trackEvnt.showSaveDialog(this.apiJson, 'CCICOMPLETE', transText);
	}

	//**This function is for changing the language of text. */
	//*This function is or changing the text of the language desired by us */
	changeTextLang(keyArr, ref) {
		let tranJson = {}
		for (let i = 0; i < keyArr.length; i++) {
			let key = keyArr[i];
			this.translate.get('LANG_EN_TRANS.' + key).subscribe(
				value => {
					/**value is our translated string*/
					tranJson[key] = value;
				});
			return tranJson;
		}

	}

	ngOnDestroy() {
		window.location.href.replace(location.hash, '');
		this.subscription.unsubscribe();
		console.log('called ngOnDestroy');
	}
}
