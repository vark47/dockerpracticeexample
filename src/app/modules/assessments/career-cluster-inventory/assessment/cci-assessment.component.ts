import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { Http, Response } from '@angular/http';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { Utilities } from '../../../../shared/utilities.class';
@Component({
	selector: 'cci-jr-assessment',
	templateUrl: './cci-assessment.layout.html',
	styles: [`
  		.class-withOpacityIP {
    	opacity: 0.5;
		cursor: not-allowed;
		position: absolute;
  		}
  	`]
})
export class CCIJrAssessmentComponent {
	restoreQuesArr1 = [];
	prevQuestion = [];
	answerSet = [];
	ccijrquestionarr = [];
	ccijrresponsesarr = [];
	savePartialData = [];
	restorePrevQuesArr1 = [];
	showNxtCCIjr = false;
	rem = 0;
	valCheck = 0;
	prevLength = 0;
	InterestQuestionName = 0;
	currentValue = 0;
	remaining = 0;
	staticVal = 1;
	cnt = 1;
	logId;
	cciQuesNames;
	ccijrQuesResponses;
	isClassVisibleIP = false;
	subscription = new Subscription;
	public max: number = 100;
	btnHighLight = -1;
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-strongly', 'fa icon-asmnt-somewhat', 'fa icon-asmnt-between-somewhat'];

	constructor(private activatedRoute: ActivatedRoute, private activeRoute: ActivatedRoute, private apiJson: ApiCallClass,
		private trackEvnt: AssessmentsService, private eventService: EventDispatchService,
		private http: Http, private router: Router,
		private serverApi: ServerApi, private translate: TranslateService, private utils: Utilities,
	) {
		/**Here we get the questions for cci from intro */

		this.cciQuesNames = JSON.parse(this.utils.sessionStorageGet('ccijrQues'));
		/**Here we get the responses for cci from intro */
		this.ccijrQuesResponses = JSON.parse(this.utils.sessionStorageGet('ccijrQuesRes'));
		for (let i = 0; i < this.cciQuesNames.questions.length; i++) {
			this.ccijrquestionarr.push(this.cciQuesNames.questions[i].text);
		}
		for (let i = 0; i < this.ccijrQuesResponses.responses.length - 1; i++) {
			this.ccijrresponsesarr.push(this.ccijrQuesResponses.responses[i]);
		}

		/** Below code block listens broadcasted event and 
				* calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type == 'CCIjrSavePartial') {
				this.SaveParitalAssesment();
			}
			else if (e.type == 'saveAnswerSet') {
				this.utils.hideLoading();
			}
		});
	}

	ngOnInit() {
		this.logId = this.utils.sessionStorageGet('shortCCIjrLogID');
		// window.location.href += '#';
		// // making sure we have the fruit available for juice (^__^)
		// window.setTimeout(function () {
		// 	window.location.href += '!';
		// }, 50);

		let eqAnswerSet: any;
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			eqAnswerSet = params['eqAnswerSet'];

		});
		if ((this.utils.sessionStorageGet('savedPartialAsmnt') != '') && (this.utils.sessionStorageGet('savedPartialAsmnt') != null)) {
			this.utils.hideLoading();
			this.RestoreAnswerSets();
		} else if (eqAnswerSet != 0 && eqAnswerSet != '' && eqAnswerSet != null) {
			this.utils.hideLoading();
			this.RestoreAnswerSets();
		}
		else {
			this.utils.sessionStorageRemove('restoreAnsers');
			this.utils.sessionStorageRemove('savePartial');
			this.startEntrePreExam();
		}
	}
	ngOnDestroy() {
		window.location.href.replace(location.hash, '');
		this.subscription.unsubscribe();
		console.log('called ngOnDestroy');
	}
	/**This function is for starting the CCIjr assessement */
	startEntrePreExam() {
		if (this.utils.sessionStorageGet('restoreAnsers') == 'yes') {
			this.rem = this.cciQuesNames.questions.length - this.restoreQuesArr1.length;
			this.remaining = this.restoreQuesArr1.length - 1;
			this.InterestQuestionName = (this.rem);
			let value = 100 / this.cciQuesNames.questions.length;
			this.currentValue = this.rem * value;
			this.cnt = this.rem + 1;
			this.prevLength = this.rem;
			this.staticVal = this.cnt;
			this.btnHighLight = -1;
			this.answerSet = JSON.parse(this.utils.sessionStorageGet('restoreAnswerSet'));
			for (let i = 0; i < this.cnt; i++) {
				let quesName = 'shortip_ques_q' + i;
				this.prevQuestion.push({ 'key': quesName, 'question': (i), 'QuestionValue': this.answerSet[i] });
			}
		}
		else {
			this.isClassVisibleIP = true;
			this.InterestQuestionName = 0;
			this.remaining = this.cciQuesNames.questions.length - 1;
			this.answerSet = [];
			this.utils.sessionStorageRemove('restoreAnswerSet');
			this.utils.sessionStorageRemove('restoreQuesArr');
			this.utils.sessionStorageRemove('restorePrevQuesArr');

		}
		setTimeout(function () {
			this.utils.sessionStorageSet('hashFrom', '');
		}, 500);
	}
	/**This function gets called when we click  the  arrow in the assessement page 
   */
	nextIPArrow(cnt) {
		this.remaining = this.remaining - 1;
		this.isClassVisibleIP = false;
		//show or hide next Arrow based on the length of next array
		if ((this.cnt + 1) == this.staticVal) {
			this.showNxtCCIjr = false;
		}
		else {
			this.showNxtCCIjr = true;
		}
		this.prevLength = this.cnt;
		this.InterestQuestionName = this.cnt
		this.cnt++;
		if ((this.cnt) == this.staticVal) {
			this.btnHighLight = -1;
		}
		else {
			this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue);
		}
	}

	callQuestion(quesAnswered) {
		if (this.cnt <= this.cciQuesNames.questions.length) {
			this.remaining = this.remaining - 1;
			this.isClassVisibleIP = false;
			let value = 100 / this.cciQuesNames.questions.length;
			//Filling the bar based on the value
			if (this.staticVal == this.cnt) {
				this.valCheck = 0;
				this.currentValue = value * this.cnt;
			}
			this.InterestQuestionName = this.cnt;
			let quesName = 'shortip_ques_q' + (this.cnt - 1);
			if (this.utils.sessionStorageGet('savePartial') == 'yes') {
				this.answerSet = [];
				this.answerSet = this.savePartialData;
				this.savePartialData = [];
				this.utils.sessionStorageRemove('savePartial');
			}
			if (this.cnt == this.staticVal) {
				this.answerSet.push(quesAnswered);
				this.prevQuestion.push({ 'key': quesName, 'question': (this.InterestQuestionName - 1), 'QuestionValue': quesAnswered });
			}
			else {
				this.prevQuestion[this.cnt - 1].QuestionValue = quesAnswered;
				this.answerSet[this.cnt - 1] = quesAnswered;

			}
			this.prevLength = this.cnt;
			if (this.cnt == this.cciQuesNames.questions.length) {

				//if current question is the last question then set answer set
				this.remaining = 0;
				this.utils.showLoading();
				this.utils.sessionStorageSet('answerSetCCIjr', this.answerSet.toString());

				this.trackEvnt.getCCIjrResult(this.answerSet.toString(), this.utils.sessionStorageGet('SaveParUserNotesCCI'));
			}
			if (this.cnt == this.staticVal) {
				//Hide the next arrow when the current question is new
				this.staticVal++;
			}
			if (this.cnt + 1 == this.staticVal) {
				this.showNxtCCIjr = false;
				this.btnHighLight = -1;
			}
			else {
				this.btnHighLight = this.answerSet[this.cnt];
			}
			if (this.cnt != this.cciQuesNames.questions.length) {
				//increase the count value
				this.cnt = this.cnt + 1;
			}
		}
	}

	previousQuestion() {
		//checking whether it is in restore state or not
		if (this.cnt > 1) {
			this.remaining = this.remaining + 1;
			this.prevLength = this.prevLength - 1;
			this.cnt = this.cnt - 1;
			this.InterestQuestionName = this.cnt - 1;
			if (this.cnt == 1) {
				this.isClassVisibleIP = true;
			}
			this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue);
			if (this.cnt == this.staticVal) {
				//Hide the next arrow when the current question is new
				this.showNxtCCIjr = false;
			}
			else {
				//show the next arrow when previous clicked
				this.showNxtCCIjr = true;
			}
		}
	}
	/**This function is for saving the answers when we are in the middle of the assessement */
	SaveParitalAssesment() {
		let answ = [];
		let lastarray = [];
		this.utils.sessionStorageSet('isAssessment', 'true');
		this.apiJson.method = 'POST';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.endUrl = 'Users';
		this.apiJson.moduleName = 'Assessment/v1/';
		let data = {
			input_data: [
				{
					'param_type': 'path',
					'params': ['savePartial', this.logId]
				},
				{
					'param_type': 'query',
					'params': { 'stateAbbr': 'IC' }
				},
				{
					'param_type': 'body',
					'params': {
						'answers': lastarray,
						'userNotes': 'added'
					}
				}
			]

		}

		let text = ['enter_thougts', 'savemythoughts', 'cancel', 'btn_save', 'err_occ'];
		let transText = this.changeTextLang(text, this);

		try {
			this.savePartialData = JSON.parse(JSON.stringify(this.answerSet));
		}
		catch (e) {
			alert('json exception--->' + e.message);
		}

		this.utils.sessionStorageSet('staticval', this.staticVal - 1);

		try {
			let s = [];

			answ = this.answerSet;
			let last = answ.toString().split(',');

			let i;
			for (i = 0; i < this.staticVal - 1; i++) {
				lastarray.push(last[i]);

			}
			for (let i = this.staticVal - 1; i < this.cciQuesNames.questions.length; i++) {

				lastarray.push('NR');
			}
		}
		catch (e) {
			alert('Exception----' + e.message);
		}

		let dat = JSON.stringify(data);

		this.apiJson.data = dat;
		this.trackEvnt.showSaveDialog(this.apiJson, 'CCI', transText);
	}
	/**Tis is for restoring the set of answers */
	RestoreAnswerSets() {
		this.utils.sessionStorageSet('restoreAnsers', 'yes');
		this.utils.sessionStorageRemove('savePartial');
		this.restoreQuesArr1 = JSON.parse(this.utils.sessionStorageGet('restoreQuesArr'));
		this.restorePrevQuesArr1 = JSON.parse(this.utils.sessionStorageGet('restorePrevQuesArr'));
		this.startEntrePreExam();
	}
	/**This function is for changing the text of the language desired by us */
	changeTextLang(keyArr, ref) {
		let tranJson = {}
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
	saveChanges() {
		let ccichanges = true
		if (this.remaining == 0) {
			ccichanges = false;
		}
		return ccichanges;
	}

}

