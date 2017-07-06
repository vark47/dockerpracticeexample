/** Angular imports */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/** Custom imports */
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';

/** import shared Components */
import { Utilities } from '../../../../shared/utilities.class';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { AssessmentsService } from '../../shared/services/assessments.service';

@Component({
	selector: 'wes-result',
	templateUrl: './wes-result.layout.html',
})

export class WESResultComponent implements OnInit, OnDestroy {

	resultWESvar;
	keys = [];
	percentage = [];
	subscription = new Subscription;
	numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

	/** names of images in cards and graphs */
	icons = ['/assets/images/plp-4-1.png', '/assets/images/plp-4-2.png', '/assets/images/plp-4-3.png',
		'/assets/images/plp-4-4.png', '/assets/images/plp-4-5.png', '/assets/images/plp-4-6.png',
		'/assets/images/plp-4-7.png', '/assets/images/plp-4-8.png', '/assets/images/plp-4-9.png'];
	osResult = [];

	constructor(private trackEvnt: AssessmentsService, private router: Router,
		private utils: Utilities, private translate: TranslateService,
		private apiJson: ApiCallClass, private eventService: EventDispatchService) {
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type === 'WESSaveComplete') {
				this.saveUserNotes();
			} else if (e.type === 'EQPrint') {
				// this.printResult();
			} else if (e.type === 'saveAnswerSet') {

			}
		});
	}

	ngOnInit() {
		const score = [], levels = [];
		this.utils.sessionStorageSet('isAssessment', '');
		this.utils.sessionStorageSet('isFrom', 'result');
		this.resultWESvar = (JSON.parse(this.utils.sessionStorageGet('resultWES')));

		// Get all the keys in api result call
		this.keys = (Object.keys(this.resultWESvar));
		for (let i = 0; i < this.keys.length; i++) {
			score.push(this.resultWESvar[this.keys[i]].score);
			levels.push(this.resultWESvar[this.keys[i]].level);
		}
		// Align the keys in decending order of score
		for (let i = 0; i < score.length; i++) {
			for (let j = i + 1; j < score.length; j++) {
				if (score[i] < score[j]) {
					const a = score[i];
					score[i] = score[j];
					score[j] = a;
					const b = levels[i];
					levels[i] = levels[j];
					levels[j] = b;
					const c = this.keys[i];
					this.keys[i] = this.keys[j];
					this.keys[j] = c;
				} else if (score[i] === score[j]) {
					if (this.keys[i] > this.keys[j]) {
						const a = this.keys[i];
						this.keys[i] = this.keys[j];
						this.keys[j] = a;
					}
				}
			}
			let colorClass;

			// Get the color for keys
			if (levels[i] === 'proficient') {
				colorClass = 'wes-color-box-proficient';
			} else if (levels[i] === 'knowledgeable') {
				colorClass = ('wes-color-box-Knowledge');
			} else if (levels[i] === 'needsImprovement') {
				colorClass = ('wes-color-box-NeedImp');
			}

			// Get the score and name of the respective keys
			this.osResult.push({
				givenName: this.keys[i],
				givenScore: score[i],
				givenIcon: this.icons[i],
				givenLevel: levels[i],
				givenColor: colorClass
			});
			this.percentage.push((score[i] / 12) * 100);
		}
		this.utils.hideLoading();

	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	// Save the usernotes when user click save button in result page
	saveUserNotes() {
		this.apiJson.method = 'POST';
		let SaveUserNotes = {};
		const text = ['enter_thougts', 'savemythoughts', 'cancel', 'btn_save', 'err_occ'];
		const transText = this.changeTextLang(text, this);
		this.apiJson.sessionID = this.utils.getAuthKey();

		this.apiJson.moduleName = 'Assessment/v1/';
		SaveUserNotes = {
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
					'params': 'added'
				}
			]
		};
		const user = JSON.stringify(SaveUserNotes);
		this.apiJson.endUrl = 'users/saveUserNotes';
		this.apiJson.data = user;
		this.utils.hideLoading();
		this.trackEvnt.showSaveDialog(this.apiJson, 'WES', transText);
	}
	changeTextLang(keyArr, ref) {
		const tranJson = {};
		for (let i = 0; i < keyArr.length; i++) {
			const key = keyArr[i];
			this.translate.get('LANG_EN_TRANS.' + key).subscribe(
				value => {
					// Value is our translated string
					tranJson[key] = value;
				});
		}
		return tranJson;
	}
}
