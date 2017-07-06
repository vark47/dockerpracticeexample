/** Angular imports */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

/** Custom imports */
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';

/** import shared Components */
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { Utilities } from '../../../../shared/utilities.class';

@Component({
	selector: 'wes-assessment',
	templateUrl: './wes-assessment.layout.html',
	styles: [`
  		.class-withOpacity {
    	opacity: 0.5;
		cursor: not-allowed;
		position: absolute;
  		}
  	`],
})
export class WESAssessmentComponent implements OnInit, OnDestroy {

	WES_Questions = [];
	WES_Responses = [];
	currentQuestion = 0;
	nextVal = 1;
	answers = [];
	prevVal = 0;
	userNote = '';
	showNxt = false;
	btnHighLight = -1;
	currentValue = 0;
	remainQuestion = 20;
	subscription = new Subscription;

	constructor(private utils: Utilities, private activeRoute: ActivatedRoute,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private eventService: EventDispatchService,
		private assess: AssessmentsService, private translate: TranslateService) {
		this.subscription = eventService.listen().subscribe((e) => {
			/** After event listen it will check whether user want to save partially or completely */
			if (e.type === 'WESSavePartial') {
                /** If user want to save partially, then we call the respective function
                  * and we are setting true to isAssessment to tell that, we are saving from assessment.
                 */
				this.savePartialWES();
				this.utils.sessionStorageSet('isAssessment', 'true');
			} else if (e.type === 'saveAnswerSet') {
				this.utils.hideLoading();
			}
		});
	}

	ngOnInit() {
		try {
			this.utils.showLoading();
			window.location.href += '#';
			window.setTimeout(function () {
				window.location.href += '!';
			}, 50);
			let wesAnswerSet: any;
			this.activeRoute.queryParams.subscribe((params: Params) => {
				wesAnswerSet = params['wesAnswerSet'];
				this.userNote = params['usrNotes'];
			});

			// Check whether the assessment coming from restore or reloading
			const assess = this.utils.sessionStorageGet('savedPartialAsmnt');
			if ((assess !== '') && (assess != null)) {
				this.utils.hideLoading();
				this.RestoreAnswerSets();
			} else if (wesAnswerSet !== 0 && wesAnswerSet !== '' && wesAnswerSet != null) {
				this.utils.hideLoading();
				this.RestoreAnswerSets();
			} else {
				this.utils.sessionStorageRemove("savePartial");
				this.utils.sessionStorageRemove('restoreAnsers');
				this.getQuestions();
			}
		} catch (e) {
			console.log('Error in WES ngOnInit assessment--->' + e.message);
		}
	}

	ngOnDestroy() {
		window.location.href.replace(location.hash, '');
		this.subscription.unsubscribe();
	}

	// When user click on save button in assessment we save the answer for that particular answer set
	savePartialWES() {
		let ans = '';
		if (this.answers.length !== 36) {
			for (let i = 0; i < this.answers.length; i++) {
				if (ans !== '') {
					ans = ans + ',' + this.answers[i];
				} else {
					ans = this.answers[i] + '';
				}
			}
			const length = 36 - this.answers.length;
			for (let i = 0; i < length; i++) {
				ans = ans + ',NR';
			}
		}
		this.apiJson.method = 'POST';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		const text = ['enter_thougts', 'savemythoughts', 'cancel', 'btn_save', 'err_occ'];
		const transText = this.changeTextLang(text, this);
		let SavePartialPost = {};
		SavePartialPost = {
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
						'answers': ans,
						'userNotes': this.userNote
					}
				}
			]
		};
		const user = JSON.stringify(SavePartialPost);
		this.apiJson.endUrl = 'users/savePartial/';
		this.apiJson.data = user;
		this.assess.showSaveDialog(this.apiJson, 'WES', transText);
	}

	// Restore the answer up to where user answered the questions
	RestoreAnswerSets() {
		this.utils.sessionStorageRemove("savePartial");
		this.answers = JSON.parse(this.utils.sessionStorageGet('wesAnswers'));
		if (this.answers.length !== 0) {
			this.currentQuestion = this.answers.length;
			const value = 100 / 36;
			this.currentValue = this.currentQuestion * value;
			this.prevVal = this.currentQuestion - 1;
			this.nextVal = this.currentQuestion + 1;
		}
		this.getQuestions();
		this.utils.hideLoading();
	}

	// Get the all questions and its options values
	getQuestions() {
		this.apiJson.method = 'GET';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		this.apiJson.endUrl = 'wes/questions';
		const wesAssess = {
			input_data: [
				{
					'param_type': 'path',
					'params': []
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
		};
		this.apiJson.data = JSON.stringify(wesAssess);
		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
			for (let i = 0; i < response[0].Result.questions.length; i++) {
				this.WES_Questions.push(response[0].Result.questions[i].text);
			}
			this.utils.hideLoading();
		}, this.utils.handleError);

		this.utils.showLoading();
		this.apiJson.method = 'GET';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		this.apiJson.endUrl = 'wes/responses';
		let wesAnswer = {};
		wesAnswer = {

			input_data: [
				{
					'param_type': 'path',
					'params': []
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
		};
		this.apiJson.data = JSON.stringify(wesAnswer);
		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
			for (let i = 0; i < response[0].Result.responses.length; i++) {
				if (response[0].Result.responses[i].value !== 'NR') {
					this.WES_Responses.push(response[0].Result.responses[i].text);
				}
			}
			this.utils.hideLoading();
		}, this.utils.handleError);
	}

	// Save the user selected answer for that particular question
	callQuestion(quesVal) {
		if (this.currentQuestion === (this.answers.length)) {
			this.answers.push(quesVal);
			this.btnHighLight = -1;
		} else {
			this.answers[this.currentQuestion] = quesVal;
			this.btnHighLight = this.answers[this.currentQuestion + 1];
		}
		this.currentQuestion++;
		this.prevVal = this.currentQuestion - 1;
		this.nextVal = this.currentQuestion + 1;
		const value = 100 / 36;
		this.currentValue = this.currentQuestion * value;
		if (this.currentQuestion === (this.answers.length)) {
			this.showNxt = false;
		} else {
			this.showNxt = true;
		}
		if (this.currentQuestion === 36) {
			this.currentQuestion--;
			this.prevVal = this.currentQuestion + 1;
			this.nextVal = this.currentQuestion - 1;
			let resultAns = '';
			this.utils.showLoading();
			for (let i = 0; i < this.answers.length; i++) {
				if (i < (this.answers.length - 1)) {
					resultAns = resultAns + parseInt(this.answers[i]) + ',';
				} else {
					resultAns = resultAns + parseInt(this.answers[i]);
				}
			}
			this.assess.wesResultCall(resultAns, this.utils.sessionStorageGet('save_ParUserNotes_WES'));
		}
	}

	// Get the previous question and the answer that user selected for that question
	previousQuestion() {
		if (this.currentQuestion !== 0) {
			this.currentQuestion--;
			this.prevVal = this.currentQuestion - 1;
			this.nextVal = this.currentQuestion + 1;
			this.showNxt = true;
			this.btnHighLight = this.answers[this.currentQuestion];
		}
	}

	// Gets the question and its corresponding answer
	nextQuestion() {
		if (this.currentQuestion === (this.answers.length - 1)) {
			this.showNxt = false;
			this.btnHighLight = -1;
		} else {
			this.showNxt = true;
			this.btnHighLight = this.answers[this.currentQuestion + 1];
		}
		this.currentQuestion++;
		this.prevVal = this.currentQuestion - 1;
		this.nextVal = this.currentQuestion + 1;
	}
	changeTextLang(keyArr, ref) {
		const tranJson = {};
		for (let i = 0; i < keyArr.length; i++) {
			const key = keyArr[i];
			this.translate.get('LANG_EN_TRANS.' + key).subscribe(
				value => {
					tranJson[key] = value;
				});
		}
		return tranJson;
	}
	saveChanges() {
        let weschanges = true;
        if ((this.WES_Questions.length - (this.currentQuestion + 1)) === 0) {
            weschanges = false;
        }
        return weschanges;
    }
}
