import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router'
import { Subscription } from "rxjs/Subscription";
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { Utilities } from '../../../../shared/utilities.class';
@Component({
	selector: 'lss-result',
	templateUrl: './lss-result.layout.html',
})
export class LSSResultComponent {
	logID;
	subscription = new Subscription;
	resultls;
	result = [{ heading: 'Your Primary Learning style is auditory', url: '/assets/images/ear.png' }, { heading: 'Your Primary learning style is visual ', url: '/assets/images/hand-stop.png' }]

	constructor(private http: Http, private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService,
		private trackEvnt: AssessmentsService,
		private translate: TranslateService,
		private router: Router, private utils: Utilities, private activeRoute: ActivatedRoute) {
		/** Below code block listens broadcasted event and 
		 * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {

			if (e.type === "LSSaveComplete") {
				this.saveUserNotes();
			}
			else if (e.type === "LSPrint") {

			}

		});
	}


	ngOnInit() {
		
		this.utils.hideLoading();
		let color = ['#ffc72e', '#70cde9', '#ee4242'];
		window.sessionStorage.setItem("color", JSON.stringify(color));
		this.utils.sessionStorageSet("isAssessment", "");
		this.utils.sessionStorageSet("isFrom", "result");
		let res = JSON.parse(window.sessionStorage.getItem("resultLearnStyle"));
		let col = JSON.parse(window.sessionStorage.getItem("color"));
		this.learnStyleResult(res, col);
	}
	ngOnDestroy() {
		window.location.href.replace(location.hash, "");
		this.subscription.unsubscribe();
		console.log("called ngOnDestroy");
	}
	learnStyleResult(res, col) {
		let list = res;
		let colList = col;
		let keysObtain = Object.keys(list).sort(function (a, b) { return list[b] - list[a] });
		let objJson = [];
		for (let i = 0; i < keysObtain.length; i++) {
			let obj1 = {};
			obj1["learnstyle"] = keysObtain[i];
			obj1["score"] = res[keysObtain[i]];
			obj1["color"] = colList[i];
			objJson.push(obj1);
		}
        this.utils.sessionStorageSet("resultLS", JSON.stringify(objJson));
		this.resultls = JSON.parse(this.utils.sessionStorageGet("resultLS"));
	}
	/**This function is for saving the user notes when user clicks on save button. */
	saveUserNotes() {
		try{
		this.logID = this.utils.sessionStorageGet("learnStyleLogID");
		this.apiJson.method = "POST";
		let SaveUserNotes = {};
		let text = ['enter_thougts', 'savemythoughts', 'cancel', 'btn_save', 'err_occ'];
		let transText = this.changeTextLang(text, this);
		this.apiJson.sessionID = this.utils.getAuthKey();

		this.apiJson.moduleName = "Assessment/v1/";
		SaveUserNotes = {

			input_data: [
				{
					"param_type": "path",
					"params": [this.logID]
				},
				{
					"param_type": "query",
					"params": { "stateAbbr": "IC" }
				},
				{
					"param_type": "body",
					"params": { "userNotes": "added" }
				}
			]
		}
		let user = JSON.stringify(SaveUserNotes);
		this.apiJson.endUrl = "users/saveUserNotes/";
		this.apiJson.data = user;
		this.trackEvnt.showSaveDialog(this.apiJson, "LSCOMPLETE", transText);
		}catch(e){
			console.log("save user notes"+e.message);
		}
	}
	/**This function is for changing the language of text. */
	changeTextLang(keyArr, ref) {
		let tranJson = {};
		for (let i = 0; i < keyArr.length; i++) {
			let key = keyArr[i];
			//tranJson[key] = ref.translate.transform(key);
			this.translate.get('LANG_EN_TRANS.' + key).subscribe(
				value => {
					// value is our translated string
					tranJson[key] = value;
					
					//alert("alertTitle---->"+alertTitle);
					//ref.assessmentheadextra = eqTitle;
				})
		}
		return tranJson;
	}


}
