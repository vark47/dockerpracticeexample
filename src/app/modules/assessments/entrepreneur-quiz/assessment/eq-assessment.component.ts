import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { messages } from '../../../../shared/messages';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Subscription } from "rxjs/Subscription";
import { EqAssessmentDirective } from '../../shared/assessments-directives/eq-assessment-directive';

@Component({
	selector: 'eq-assessment',
	templateUrl: './eq-assessment.layout.html',
	styles: [`
.class-withOpacity {
opacity: 0.5;
cursor: not-allowed;
position: absolute;
}
`],
})

export class EQAssessmentComponent {
	questions;
	EntrePreQuestionName = 0;
	cnt = 1;
	showNxt = false;
	isClassVisible = false;
	startExm = 0;
	resCnt = 0;
	public max: number = 100;
	currentValue = 0;
	public type: string;
	remaining = 0;
	rem = 0;
	answerSet = [];
	resAnswerSet = [];
	prevLength = 0;
	prevQuestion = [];
	restoreQuesArr1 = [];
	restorePrevQuesArr1 = [];
	btnHighLight = -1;
	preQuesValue = -1;
	resPreQuesVal = -1;
	QuestionsLength;
	savePartialData = [];
	nextArr = [];
	nextVal = 0;
	staticVal = 1;
	valCheck = 0;
	nextArr1 = [];
	nextVal1 = 0;
	constantVal = 0;
	callQues = 0;
	eqQuesNames;
	eqResponses;
	quesArr = [];
	dataArr = [];
	LogID;
	subscription = new Subscription;
	@Output('changeView') changeView = new EventEmitter();
	constructor(private activatedRoute: ActivatedRoute, private trackEvnt: AssessmentsService,
		private translate: TranslateService, private router: Router,
		private utils: Utilities, private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService) {
		this.eqQuesNames = JSON.parse(this.utils.sessionStorageGet("eqQues"));

		this.eqResponses = JSON.parse(this.utils.sessionStorageGet("eqResponses"));


		for (let i = 0; i < this.eqQuesNames.questions.length; i++) {
			this.quesArr.push(this.eqQuesNames.questions[i].text);
		}
		for (let i = 0; i < this.eqResponses.responses.length; i++) {
			this.dataArr.push(this.eqResponses.responses[i].text);

		}

		/** Below code block listens broadcasted event and 
		 * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {
			/** After event listen it will check whether user want to save partially or completely */

			if (e.type == "EQSavePartial") {
				/** If user want to save partially, then we call the respective function 
				 * and we are setting true to isAssessment to tell that, we are saving from assessment.
				*/
				this.SaveParitalAssesment();
			}
			else if (e.type == "saveAnswerSet") {
				this.utils.hideLoading();
			}
		});
	}
	saveChanges() {
		let eqchanges = true
		if (this.remaining == 0) {
			eqchanges = false;
		}
		return eqchanges;
	}

	ngOnInit() {

		this.changeView.emit({ "title": "assessment page", "btn_class": "green-btn-plp2" });
		/** Assigning the answer set to a variable */

		//Need to check
		let eqAnswerSet: any;

		/** By using session storage we are checking either savedPartialAsmnt or eqAnswerSet is null or not.
		 * SavedPartialAsmnt is used in refresh condition where as eqAnswerSet is used in restore state.
		 * Based on the result, it will check whether to go to restore state, or to normal state.
		 */
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			eqAnswerSet = params['eqAnswerSet'];
		});
		if ((this.utils.sessionStorageGet("savedPartialAsmnt") != "") && (this.utils.sessionStorageGet("savedPartialAsmnt") != null)) {
			this.utils.hideLoading();
			this.RestoreAnswerSets();
		} else if (eqAnswerSet != 0 && eqAnswerSet != "" && eqAnswerSet != null) {
			this.utils.hideLoading();
			this.RestoreAnswerSets();
		}
		else {
			// clearing the restore answer session and starting exam
			this.utils.sessionStorageRemove("restoreAnsers");
			this.startInterestPrExam();
		}

	}
	ngOnDestroy() {
		window.location.href.replace(location.hash, "");
		this.subscription.unsubscribe();
	}
	startInterestPrExam() {
		// Checking whether it is restore state or normal state
		if (this.utils.sessionStorageGet("restoreAnsers") == "yes") {
			// If it is restore state, set default values 
			this.currentValue = 0;
			// this.rem contain value of current question
			this.rem = this.eqQuesNames.questions.length - this.restoreQuesArr1.length;
			this.remaining = this.restoreQuesArr1.length - 1;
			this.EntrePreQuestionName = (this.rem);
			let value = 100 / this.eqQuesNames.questions.length;
			this.currentValue = this.rem * value;
			this.cnt = this.rem + 1;
			this.prevLength = this.rem;
			this.staticVal = this.cnt;
			this.btnHighLight = -1;
			this.answerSet = JSON.parse(this.utils.sessionStorageGet("restoreAnswerSet"));
			// Getting answer set values using session storage
			for (let i = 0; i < this.cnt; i++) {
				let quesName = "questions" + i;
				this.prevQuestion.push({ "key": quesName, "question": (i), "QuestionValue": this.answerSet[i] });
			}
		} else {
			// It is normal state a new exam will be started
			this.utils.sessionStorageRemove("restoreAnsers");
			this.isClassVisible = true;
			this.EntrePreQuestionName = 0;
			this.remaining = this.eqQuesNames.questions.length - 1;
			this.answerSet = [];
			// Clearing previous restore values
			this.utils.sessionStorageRemove("restoreAnswerSet");
			this.utils.sessionStorageRemove("restoreQuesArr");
			this.utils.sessionStorageRemove("restorePrevQuesArr");
		}
	}

	/**when the next arrow was clicked the execute below function*/
	nextEQArrow(cnt) {
		this.remaining = this.remaining - 1;
		this.isClassVisible = false;
		// Show or hide next Arrow based on the length of next array
		if ((this.cnt + 1) == this.staticVal) {
			this.showNxt = false;
		}
		else {
			this.showNxt = true;
		}
		this.prevLength = this.cnt;
		this.EntrePreQuestionName = this.cnt
		this.cnt++;
		if ((this.cnt) == this.staticVal) {
			this.btnHighLight = -1;
		}
		else {
			this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue);
		}
	}
	/** If any circle clicked to answer the question*/
	callQuestion(quesAnswered) {
		// Not in restore state and current question value is less than total question
		if (this.cnt <= 20) {
			this.remaining = this.remaining - 1;
			this.isClassVisible = false;
			let value = 100 / 20;

			// Filling the bar based on the value
			if (this.staticVal == this.cnt) {
				this.valCheck = 0;
				this.currentValue = value * this.cnt;
			}

			this.EntrePreQuestionName = this.cnt;
			let quesName = "questions" + (this.cnt - 1);
			if (this.utils.sessionStorageGet("savePartial") == "yes") {
				this.answerSet = [];
				this.answerSet = this.savePartialData;
				this.savePartialData = [];
				this.utils.sessionStorageRemove("savePartial");
			}

			if (this.cnt == this.staticVal) {
				this.answerSet.push(quesAnswered);
				this.prevQuestion.push({ "key": quesName, "question": (this.EntrePreQuestionName - 1), "QuestionValue": quesAnswered });
			} else {
				this.prevQuestion[this.cnt - 1].QuestionValue = quesAnswered;
				this.answerSet[this.cnt - 1] = quesAnswered;

			}

			this.prevLength = this.cnt;
			if (this.cnt == 20) {
				// If current question is the last question then set answer set
				this.remaining = 0;
				this.utils.showLoading();
				this.utils.sessionStorageSet("entiQuizAnswerSet", this.answerSet.toString());
				this.trackEvnt.eqResultCall(this.answerSet.toString(), this.utils.sessionStorageGet("SaveParUserNotesEQ"));
			}

			if (this.cnt == this.staticVal) {
				//Hide the next arrow when the current question is new
				this.staticVal++;
			}

			if (this.cnt + 1 == this.staticVal) {
				this.showNxt = false;
				this.btnHighLight = -1;
			} else {
				this.btnHighLight = this.answerSet[this.cnt];
			}
			if (this.cnt != 20) {
				// Increase the count value
				this.cnt = this.cnt + 1;
			}
		}
	}

	//This method is used when user clicks On previous button to navigate to the  previous question
	previousQuestion() {
		// Checking whether it is in restore state or not
		if (this.cnt > 1) {
			this.remaining = this.remaining + 1;
			this.prevLength = this.prevLength - 1;
			this.cnt = this.cnt - 1;
			this.EntrePreQuestionName = this.cnt - 1;
			if (this.cnt == 1) {
				this.isClassVisible = true;
			}
			this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue);
			if (this.cnt == this.staticVal) {
				// Hide the next arrow when the current question is new
				this.showNxt = false;
			}
			else {
				// Show the next arrow when previous clicked
				this.showNxt = true;
			}
		}
	}

	/** The below function is used for partial save of assessment */
	SaveParitalAssesment() {


		this.LogID = this.utils.sessionStorageGet("entiQuizLogID");
		this.utils.sessionStorageSet("isAssessment", "true");
		// Setting true to isAssessment to tell that, we are saving from assessment.
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
		// Storing answers in different states like restore and normal state
		try {
			let s = [];
			answ = this.answerSet;
			let last = answ.toString().split(",");
			let i;
			for (i = 0; i < this.staticVal - 1; i++) {
				lastarray.push(last[i]);
			}
			for (let i = this.staticVal - 1; i < this.eqQuesNames.questions.length; i++) {
				lastarray.push(0);
			}

		} catch (e) {
			console.log("Exception----" + e.message);
		}

		SavePartialPost = {

			input_data: [
				{
					"param_type": "path", "params": ["savePartial", this.LogID]
				},
				{ "param_type": "query", "params": { "stateAbbr": "IC" } },
				{ "param_type": "body", "params": { "answers": lastarray, "userNotes": "added" } }
			]
		}
		// Showing popUp for save dialog
		let dat = JSON.stringify(SavePartialPost);
		this.apiJson.data = dat;
		this.trackEvnt.showSaveDialog(this.apiJson, "EQ", transText);
	}

	RestoreAnswerSets() {
		/** When we are in restore state */
		this.utils.sessionStorageSet("restoreAnsers", "yes");
		this.utils.sessionStorageRemove("savePartial");

		//Getting the answer set from restore page
		this.restoreQuesArr1 = JSON.parse(this.utils.sessionStorageGet("restoreQuesArr"));
		this.restorePrevQuesArr1 = JSON.parse(this.utils.sessionStorageGet("restorePrevQuesArr"));

		// Starting the exam
		this.startInterestPrExam();
	}

	changeTextLang(keyArr, ref) {
		// Used to change the language of the text
		let tranJson = {};
		for (let i = 0; i < keyArr.length; i++) {
			let key = keyArr[i];
			this.translate.get('LANG_EN_TRANS.' + key).subscribe(
				value => {
					// Value is our translated string
					tranJson[key] = value;
				})
		}
		return tranJson;
	}
}