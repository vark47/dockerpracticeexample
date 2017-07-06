import { Component, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { OccupationListComponent } from '../../shared/occupation-list/occupation-list.component';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { TranslateService } from 'ng2-translate';
import { Subscription } from "rxjs/Subscription";
declare var $: any;
@Component({
	selector: 'os-result',
	templateUrl: './os-result.layout.html',
})
export class OSResultComponent {
	@ViewChild(OccupationListComponent) private occListComp: OccupationListComponent;
	occsort = [];
	listlength = -1;
	inList = "";
	inNotList = "";
	subscription = new Subscription;
	constructor(private trackEvnt: AssessmentsService, private translate: TranslateService,
		private router: Router, private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService) {
		/** Below code block listens broadcasted event and 
		* calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {

			if (e.type == "OSSaveComplete") {
				this.saveUserNotes();
			}
			else if (e.type == "OSPrint") {
				this.printResult();
			}
			else if (e.type == "saveAnswerSet") {

			}
		});
	}

	/**This function is for getting into the Occ-sort result page. */
	ngOnInit() {
		this.utils.sessionStorageSet("isAssessment", "");
		this.utils.sessionStorageSet("module", "os");
		this.utils.sessionStorageSet("isFrom", "result");
		this.inList = this.utils.sessionStorageGet("isWhy");
		this.inNotList = this.utils.sessionStorageGet("isNotWhy");
		this.getSaveOccList();
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	/**This function is for displaying the saved occlist. */
	getSaveOccList() {
		setTimeout(function () {
			if (this.inList == "true" || this.inNotList == "true") {
				this.occListComp.inListOcc(this.inList);
			} else {
				this.occListComp.getOccListData(JSON.parse(this.utils.sessionStorageGet("OccList")));
			}
		}.bind(this), 1)
		this.occsort = JSON.parse(this.utils.sessionStorageGet("OccList"));
	}

	/** This function is for saving the usernotes when user clicked on the save button. */
	saveUserNotes() {
		this.apiJson.method = "POST";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let text = ['enter_thougts', 'savemythoughts', 'cancel', 'btn_save', 'err_occ'];
		let transText = this.changeTextLang(text, this);
		let SaveUserNotes = {};
		SaveUserNotes = {
			input_data: [

				{
					"param_type": "path",
					"params": [this.utils.sessionStorageGet("OccSortLogID")]
				},
				{
					"param_type": "query",
					"params": { "stateAbbr": "IC" }
				},
				{
					"param_type": "body",
					"params": "added"
				}
			]
		}
		let user = JSON.stringify(SaveUserNotes);
		this.apiJson.endUrl = "users/saveUserNotes";
		this.apiJson.data = user;
		this.trackEvnt.showSaveDialog(this.apiJson, "OS", transText);
	}

	printResult() {
		document.getElementById("openModalButton").click();
	}



	/**This function is for changing the language of text. */
	changeTextLang(keyArr, ref) {
		let tranJson = {};
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

	/**This function is for printing the result page when we click 
	 * on done button in popup, that displays when print button is clicked  */
	printResultPage(divName) {
		try {
			var sOption = "toolbar=no,location=no,directories=yes,menubar=no,";
			sOption += "scrollbars=yes,width=775,height=600,left=10,top=25";
			var winprint = window.open("", "", sOption);
			winprint.document.open();
			winprint.document.write('<html>');
			winprint.document.write(`
					<head>
                        <style>
							.alphanav-list li a {
								border-bottom: 1px solid #d6d6d6;
								display: block;
								padding: 15px 0 13px 51px;
								text-transform: capitalize;
							}
							.close,.print-btn-popup{
								display:none;
							}
						</style>
					</head>`);
			winprint.document.write('<body onload="window.print()"><div id="print">');
			winprint.document.write(document.getElementById(divName).innerHTML);
			winprint.document.write('               ');
			winprint.document.write('</div></body></html>')
			winprint.document.close();
			winprint.focus();
		} catch (e) {
			alert("exception:" + e.message);
		}
	}
}
