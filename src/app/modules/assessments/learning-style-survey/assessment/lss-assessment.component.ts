import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Subscription } from "rxjs/Subscription";
import { ApiCallClass } from '../../../../shared/apicall.model';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { Utilities } from '../../../../shared/utilities.class';
@Component({
	selector: 'lss-assessment',
	templateUrl: './lss-assessment.layout.html',
	styles: [`
  		.class-withOpacity {
    	opacity: 0.5;
		cursor: not-allowed;
		position: absolute;
  		}
  	`],
})
export class LSSAssessmentComponent {
	
	lsResArray = [];
	learnStyQues = [];
	answerSet = [];
	quesCnt = 1;
	currentValue;
	learnStyleQuestionName;
	staticVal = 1;
	restoreQuesArr1 = [];
	rem;
	remaining = 0;
	prevQuestion = [];
	prevLength;
	showNxt = false;
	btnHighLight = -1;
	isClassVisible = false;
	savePartialData = [];
	restorePrevQuesArr1 = [];
	logID;/*store logid*/
	qcnt;
	learnStyleQuesNames: any;/*for storing the questions */
	learnStyleResponses: any;/*for storing the responses */
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-somewhat', 'fa icon-asmnt-strongly-disagree'];
	subscription = new Subscription;
	constructor(private router: Router, private utils: Utilities,
		private activatedRoute: ActivatedRoute,
		private eventService: EventDispatchService, private translate: TranslateService,
		private trackEvnt: AssessmentsService, private apiJson: ApiCallClass) {
		this.learnStyleQuesNames = JSON.parse(this.utils.sessionStorageGet("learnStyleQues"));
		this.learnStyleResponses = JSON.parse(this.utils.sessionStorageGet("learnStyleResponses"));
		this.qcnt = this.learnStyleQuesNames.questions.length;
		for (let i = 0; i < this.learnStyleQuesNames.questions.length; i++) {
			this.learnStyQues.push(this.learnStyleQuesNames.questions[i].text);
		}
		for (let i = 0; i < this.learnStyleResponses.responses.length - 1; i++) {
			this.lsResArray.push(this.learnStyleResponses.responses[i]);
		}
		/** Below code block listens broadcasted event and 
			 * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {
			/** After event listen it will check whether user want to save partially or completely */

			if (e.type === "LSSavePartial") {
				/** If user want to save partially, then we call the respective function 
                 * and we are setting true to isAssessment to tell that, we are saving from assessment.
                */
				this.saveParitalAssesment();
			}
			else if (e.type === "saveAnswerSet") {
				this.utils.hideLoading();
			}
		});
	}


	ngOnInit() {
		let lsAnswerSet;

		this.activatedRoute.queryParams.subscribe((params: Params) => {
			lsAnswerSet = params['lsAnswerSet'];
		});
		if ((this.utils.sessionStorageGet("savedPartialAsmnt") != "") &&
			(this.utils.sessionStorageGet("savedPartialAsmnt") != null)) {
			this.utils.hideLoading();
			this.RestoreAnswerSets();
		}
		else if (lsAnswerSet != 0 && lsAnswerSet != "" && lsAnswerSet != null) {
            this.utils.hideLoading();
			this.RestoreAnswerSets();
		}

		else {
			/*clearing the restore answer session and starting exam*/
			this.utils.sessionStorageRemove("restoreAnsers");
			this.startInterestPrExam();
		}

	}


	RestoreAnswerSets() {
		/* When we are in restore state */
		this.utils.sessionStorageSet("restoreAnsers", "yes");
		this.utils.sessionStorageRemove("savePartial");
		/*Getting the answer set from restore page*/
		this.restoreQuesArr1 = JSON.parse(this.utils.sessionStorageGet("restoreQuesArr"));
		this.restorePrevQuesArr1 = JSON.parse(this.utils.sessionStorageGet("restorePrevQuesArr"));
		/*starting the exam*/
		this.startInterestPrExam();
	}
	ngOnDestroy() {
		window.location.href.replace(location.hash, "");
		this.subscription.unsubscribe();
	}
	/*This function is used for starting the previous exam when it is restore state*/
	startInterestPrExam() {
		try {
			/*checking whether it is restore state or normal state*/
			if (this.utils.sessionStorageGet("restoreAnsers") === "yes") {
				/*if it is restore state, set default values*/
				this.currentValue = 0;
				/*this.rem contain value of current question*/
				this.rem = this.learnStyleQuesNames.questions.length - this.restoreQuesArr1.length;
				this.remaining = this.restoreQuesArr1.length - 1;
				this.learnStyleQuestionName = (this.rem);
				let value = 100 / this.qcnt;
				this.currentValue = this.rem * value;
				this.quesCnt = this.rem + 1;
				this.prevLength = this.rem;
				this.staticVal = this.quesCnt;
				this.btnHighLight = -1;
				this.answerSet = JSON.parse(this.utils.sessionStorageGet("restoreAnswerSet"));

				/*Getting answer set values using session storage*/
				for (let i = 0; i < this.quesCnt; i++) {
					let quesName = "questions" + i;
					this.prevQuestion.push({ "key": quesName, "question": (i), "QuestionValue": this.answerSet[i] });
				}

			}
			else {
				/* It is normal state a new exam will be started */
				this.utils.sessionStorageRemove("restoreAnsers");
				this.isClassVisible = true;
				this.learnStyleQuestionName = 0;
				this.remaining = this.learnStyleQuesNames.questions.length - 1;

				this.answerSet = [];
				/*Clearing previous restore values*/
				this.utils.sessionStorageRemove("restoreAnswerSet");
				this.utils.sessionStorageRemove("restoreQuesArr");
				this.utils.sessionStorageRemove("restorePrevQuesArr");
			}
		} catch (e) {
			console.log("start prexam exception--->" + e.message);
		}
	}
	/*This function is used for the call the next question while clicking the response in the assessment*/
	callQuestion(quesAnswered) {
		try {
			if (this.quesCnt <= this.qcnt) {
				this.remaining = this.remaining - 1;
				this.isClassVisible = false;
				let value = 100 / this.qcnt;
				/*Filling the bar based on the value*/
				if (this.staticVal === this.quesCnt) {
					this.currentValue = value * this.quesCnt;
				}
				this.learnStyleQuestionName = this.quesCnt;

				let quesName = "questions" + (this.quesCnt - 1);
				if (this.utils.sessionStorageGet("savePartial") == "yes") {
					this.answerSet = [];
					this.answerSet = this.savePartialData;
					this.savePartialData = [];
					this.utils.sessionStorageRemove("savePartial");
				}
				if (this.quesCnt === this.staticVal) {
					this.answerSet.push(quesAnswered);
					this.prevQuestion.push({
						"key": quesName,
						"question": (this.learnStyleQuestionName - 1),
						"QuestionValue": quesAnswered
					});
				}
				else {
					this.prevQuestion[this.quesCnt - 1].QuestionValue = quesAnswered;
					this.answerSet[this.quesCnt - 1] = quesAnswered;

				}
				this.prevLength = this.quesCnt;

				if (this.quesCnt === this.qcnt) {
					/*if current question is the last question then set answer set*/
					this.remaining = 0;
					this.utils.showLoading();
					this.utils.sessionStorageSet("learnStyleAnswerSet", this.answerSet.toString());

					this.trackEvnt.learnStyleResultCall(this.answerSet.toString(), this.utils.sessionStorageGet("SaveParUserNotesLS"));
				}
				if (this.quesCnt === this.staticVal) {
					/*Hide the next arrow when the current question is new*/
					this.staticVal++;
				}
				if (this.quesCnt + 1 === this.staticVal) {
					this.showNxt = false;
					this.btnHighLight = -1;
				}
				else {
					this.btnHighLight = this.answerSet[this.quesCnt];
				}
				if (this.quesCnt !== this.qcnt) {
					/*increase the count value*/
					this.quesCnt = this.quesCnt + 1;
				}
			}
		} catch (e) {
			console.log("call question-->" + e.message);
		}
	}
	/*This function is used for clicking next arrow in the assessment.*/
	nextLSArrow(cnt) {
		try {
			this.remaining = this.remaining - 1;
			this.isClassVisible = false;
			/*show or hide next Arrow based on the length of next array*/
			if ((this.quesCnt + 1) === this.staticVal) {
				this.showNxt = false;
			}
			else {
				this.showNxt = true;
			}
			this.prevLength = this.quesCnt;
			this.learnStyleQuestionName = this.quesCnt;
			this.quesCnt++;
			if ((this.quesCnt) === this.staticVal) {
				this.btnHighLight = -1;
			}
			else {
				this.btnHighLight = parseInt(this.prevQuestion[this.quesCnt - 1].QuestionValue);

			}
		} catch (e) {
			console.log("next arrow" + e.message);
		}
	}
	/*This method is used when user clicks On previous button to navigate to the  previous question*/
	previousQuestion() {
		/*checking whether it is in restore state or not*/
		try {
			if (this.quesCnt > 1) {

				this.remaining = this.remaining + 1;
				this.prevLength = this.prevLength - 1;
				this.quesCnt = this.quesCnt - 1;
				this.learnStyleQuestionName = this.quesCnt - 1;
				if (this.quesCnt === 1) {
					this.isClassVisible = true;
				}
				this.btnHighLight = parseInt(this.prevQuestion[this.quesCnt - 1].QuestionValue);

				if (this.quesCnt === this.staticVal) {
					/*Hide the next arrow when the current question is new*/
					this.showNxt = false;
				}
				else {
					/*show the next arrow when previous clicked*/
					this.showNxt = true;
				}
			}
		} catch (e) {
			console.log("previous question" + e.message);
		}
	}
	/** The below function is used for partial save of assessment */
	saveParitalAssesment() {

		try {
			this.logID = this.utils.sessionStorageGet("learnStyleLogID");
			this.utils.sessionStorageSet("isAssessment", "true");
			/*Setting true to isAssessment to tell that, we are saving from assessment.*/
			let answ = [];
			let lastarray = [];
			this.apiJson.method = "POST";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.endUrl = "Users";
			this.apiJson.moduleName = "Assessment/v1/";
			let SavePartialPost = {};
			let text = ['enter_thougts', 'savemythoughts', 'cancel', 'btn_save'];
			let transText = this.changeTextLang(text, this);

			try {
				this.savePartialData = JSON.parse(JSON.stringify(this.answerSet));
			}
			catch (e) {
				console.log("json exception--->" + e.message);
			}

			this.utils.sessionStorageSet("staticval", this.staticVal - 1);
			/*storing answers in different states like restore and normal state*/
			try {
				let s = [];
				answ = this.answerSet;

				let last = answ.toString().split(",");
				let i;
				for (i = 0; i < this.staticVal - 1; i++) {
					lastarray.push(last[i]);
				}

				for (let i = this.staticVal - 1; i < this.learnStyleQuesNames.questions.length; i++) {
					lastarray.push(0);
				}

			}
			catch (e) {
				console.log("Exception----" + e.message);
			}

			SavePartialPost = {

				input_data: [
					{
						"param_type": "path",
						"params": ["savePartial", this.logID]
					},
					{
						"param_type": "query",
						"params": { "stateAbbr": "IC" }
					},
					{
						"param_type": "body",
						"params": { "answers": lastarray, "userNotes": "added" }
					}
				]

			}
			/*showing popUp for save dialog*/

			this.apiJson.data = JSON.stringify(SavePartialPost);

			this.trackEvnt.showSaveDialog(this.apiJson, "LS", transText);
		} catch (e) {
			console.log("save partial assessment" + e.message);
		}
	}
	changeTextLang(keyArr, ref) {
		/*Used to change the language of the text*/
		let tranJson = {};
		for (let i = 0; i < keyArr.length; i++) {
			let key = keyArr[i];
			this.translate.get('LANG_EN_TRANS.' + key).subscribe(
				value => {
					tranJson[key] = value;

				})
		}
		return tranJson;
	}

	saveChanges() {
		let lsschanges = true
		if (this.remaining == 0) {
			lsschanges = false;
		}
		return lsschanges;
	}
}
