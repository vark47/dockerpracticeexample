import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { messages } from '../../../../shared/messages';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { IPAssessmentDirective } from '../../shared/assessments-directives/ip-assessment-directive';

@Component({
	selector: 'ipsf-assessment',
	templateUrl: './ipsf-assessment.layout.html',
	styles: [`
  		.class-withOpacityIP {
    	opacity: 0.5;
		cursor: not-allowed;
		position: absolute;
  		}
  	`],
})
export class IPSFAssessmentComponent implements OnInit, OnDestroy {
	questions;
	InterestQuestionName = 0;
	cnt = 1;
	showNxtIP = false;
	isClassVisibleIP = false;
	startExm = 0;
	internalcnt = 2;
	resCnt = 0;
	rem = 0;
	public max: number = 100;
	currentValue = 0;
	public type: string;
	remaining = 0;
	resAnswerSet = [];
	answerSet = [];
	prevLength = 0;
	prevQuestion = [];
	restoreQuesArr1 = [];
	restorePrevQuesArr1 = [];
	btnHighLight = -1;
	preQuesVal = -1;
	resPreQuesval = -1;
	nextArr = [];
	nextVal = 0;
	staticVal = 1;
	valCheck = 0;
	nextArr1 = [];
	nextVal1 = 0;
	constantVal = 0;
	successSave = false;
	savePartialData = [];
	ipQuesNames;
	callQues = 0;
	logId;
	ipQuesResponses;
	questionarr = [];
	responsesarr = [];
	subscription = new Subscription;
	constructor(private activatedRoute: ActivatedRoute, private trackEvnt: AssessmentsService, private router: Router,
		private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi,
		private translate: TranslateService, private eventService: EventDispatchService) {
		this.ipQuesNames = JSON.parse(this.utils.sessionStorageGet("ipQues"));
		this.ipQuesResponses = JSON.parse(this.utils.sessionStorageGet("ipQuesRes"));
		for (let i = 0; i < this.ipQuesNames.questions.length; i++) {
			this.questionarr.push(this.ipQuesNames.questions[i].text);

		}
		for (let i = 0; i < this.ipQuesResponses.responses.length; i++) {
			this.responsesarr.push(this.ipQuesResponses.responses[i].text);

		}

		/** Below code block listens broadcasted event and 
		  * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {

			if (e.type == "IPSFSavePartial") {
				this.SaveParitalAssesment();
			}
			else if (e.type == "saveAnswerSet") {
				this.utils.hideLoading();
			}
		});
	}


	@Output('changeView') changeView = new EventEmitter();
	ngOnInit() {
		this.logId = this.utils.sessionStorageGet("shortIpLogID");
		this.changeView.emit({ "title": "assessment page", "btn_class": "green-btn-plp2" });
		let eqAnswerSet: any;
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
			this.utils.sessionStorageRemove("restoreAnsers");
			this.utils.sessionStorageRemove("savePartial");
			this.startEntrePreExam();
		}
	}


	ngOnDestroy() {
		window.location.href.replace(location.hash, "");
		this.subscription.unsubscribe();
	}


	/** This function is for starting the assessement */
	startEntrePreExam() {
		if (this.utils.sessionStorageGet("restoreAnsers") == "yes") {
			this.rem = this.ipQuesNames.questions.length - this.restoreQuesArr1.length;
			this.remaining = this.restoreQuesArr1.length - 1;
			this.InterestQuestionName = (this.rem);
			let value = 100 / 60;
			this.currentValue = this.rem * value;
			this.cnt = this.rem + 1;
			this.prevLength = this.rem;
			this.staticVal = this.cnt;
			this.btnHighLight = -1;
			this.answerSet = JSON.parse(this.utils.sessionStorageGet("restoreAnswerSet"));
			for (let i = 0; i < this.cnt; i++) {
				let quesName = "shortip_ques_q" + i;
				this.prevQuestion.push({ "key": quesName, "question": (i), "QuestionValue": this.answerSet[i] });
			}
		}
		else {
			this.isClassVisibleIP = true;
			this.InterestQuestionName = 0;
			this.remaining = this.ipQuesNames.questions.length - 1;
			this.answerSet = [];
			this.utils.sessionStorageRemove("restoreAnswerSet");
			this.utils.sessionStorageRemove("restoreQuesArr");
			this.utils.sessionStorageRemove("restorePrevQuesArr");

		}
	}
	/** This function gets called when we click  the  arrow in the assessement page  */
	nextIPArrow(cnt) {
		this.remaining = this.remaining - 1;
		this.isClassVisibleIP = false;
		// Show or hide next Arrow based on the length of next array
		if ((this.cnt + 1) == this.staticVal) {
			this.showNxtIP = false;
		}
		else {
			this.showNxtIP = true;
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
		if (this.cnt <= 60) {
			this.remaining = this.remaining - 1;
			this.isClassVisibleIP = false;
			let value = 100 / 60;
			// Filling the bar based on the value
			if (this.staticVal == this.cnt) {
				this.valCheck = 0;
				this.currentValue = value * this.cnt;
			}
			this.InterestQuestionName = this.cnt;
			let quesName = "shortip_ques_q" + (this.cnt - 1);
			if (this.utils.sessionStorageGet("savePartial") == "yes") {
				this.answerSet = [];
				this.answerSet = this.savePartialData;
				this.savePartialData = [];
				this.utils.sessionStorageRemove("savePartial");
			}
			if (this.cnt == this.staticVal) {
				this.answerSet.push(quesAnswered);
				this.prevQuestion.push({ "key": quesName, "question": (this.InterestQuestionName - 1), "QuestionValue": quesAnswered });
			} else {
				this.prevQuestion[this.cnt - 1].QuestionValue = quesAnswered;
				this.answerSet[this.cnt - 1] = quesAnswered;

			}
			this.prevLength = this.cnt;
			if (this.cnt == 60) {
				// If current question is the last question then set answer set
				this.remaining = 0;
				this.utils.showLoading();
				this.utils.sessionStorageSet('answerSetIP', this.answerSet.toString());
				this.trackEvnt.getIpSfResult(this.answerSet.toString(), this.utils.sessionStorageGet("SaveParUserNotesIP"));
			}
			if (this.cnt == this.staticVal) {
				// Hide the next arrow when the current question is new
				this.staticVal++;
			}
			if (this.cnt + 1 == this.staticVal) {
				this.showNxtIP = false;
				this.btnHighLight = -1;
			} else {
				this.btnHighLight = this.answerSet[this.cnt];
			}
			if (this.cnt != 60) {
				// Increase the count value
				this.cnt = this.cnt + 1;
			}
		}
	}

	previousQuestion() {
		// Checking whether it is in restore state or not
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
				// Hide the next arrow when the current question is new
				this.showNxtIP = false;
			} else {
				// Show the next arrow when previous clicked
				this.showNxtIP = true;
			}
		}
	}
	/** This function is for saving the answers when we are in the middle of the assessement */
	SaveParitalAssesment() {
		let answ = [];
		let lastarray = [];
		this.utils.sessionStorageSet("isAssessment", "true");
		this.apiJson.method = "POST";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.endUrl = "Users";
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
			input_data: [
				{
					"param_type": "path",
					"params": ["savePartial", this.logId]
				},
				{
					"param_type": "query",
					"params": { "stateAbbr": "IC" }
				},
				{
					"param_type": "body",
					"params": {
						"answers": lastarray,
						"userNotes": "added"
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
			console.log("json exception--->" + e.message);
		}

		this.utils.sessionStorageSet("staticval", this.staticVal - 1);
		try {
			let s = [];

			answ = this.answerSet;
			let last = answ.toString().split(",");

			let i;
			for (i = 0; i < this.staticVal - 1; i++) {
				lastarray.push(last[i]);
			}
			for (let i = this.staticVal - 1; i < this.ipQuesNames.questions.length; i++) {
				lastarray.push("NR");
			}
		}
		catch (e) {
			console.log("Exception----" + e.message);
		}

		let dat = JSON.stringify(data);

		this.apiJson.data = dat;
		this.trackEvnt.showSaveDialog(this.apiJson, "IP", transText);
	}
	/** This is for restoring the set of answers */
	RestoreAnswerSets() {
		this.utils.sessionStorageSet("restoreAnsers", "yes");
		this.utils.sessionStorageRemove("savePartial");
		this.restoreQuesArr1 = JSON.parse(this.utils.sessionStorageGet("restoreQuesArr"));
		this.restorePrevQuesArr1 = JSON.parse(this.utils.sessionStorageGet("restorePrevQuesArr"));
		this.startEntrePreExam();
	}

	/** This function is for changing the text of the language desired by us */
	changeTextLang(keyArr, ref) {
		let tranJson = {}
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
	saveChanges() {
		let ipchanges = true
		if (this.remaining == 0) {
			ipchanges = false;
		}
		return ipchanges;
	}
}