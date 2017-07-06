import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { OccupationListComponent } from '../../shared/occupation-list/occupation-list.component';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';

import { TranslateService } from 'ng2-translate';
import { pieColors } from '../../shared/constants/assessments-constants';
import { pieIpIcons } from '../../shared/constants/assessments-constants';

import { Subscription } from "rxjs/Subscription";

declare var $: any;
declare let Pizza: any;
declare let html2canvas: any;
@Component({
	selector: 'ipsf-result',
	templateUrl: './ipsf-result.layout.html',
})
export class IPSFResultComponent implements OnInit {
	buttonData: Object;
	occListArr = [];
	result = [];
	pieColor = {};
	pieIpColor = {};
	logId;
	subscription = new Subscription;

	constructor(private trackEvnt: AssessmentsService, private translate: TranslateService, private router: Router,
		private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService) {

		/** Below code block listens broadcasted event and 
		* calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {

			if (e.type == "IPSFSaveComplete") {
				this.saveIpSfAssessment();
			}
			else if (e.type == "IPSFPrint") {
				this.printResult();
			}
			else if (e.type == "saveAnswerSet") {

			}
		});
	}

	/**This function is for getting into the result page. */
	ngOnInit() {
		this.logId = this.utils.sessionStorageGet("shortIpLogID");
		this.utils.showLoading();
		this.utils.sessionStorageSet("isAssessment", "");
		this.utils.sessionStorageSet("isFrom", "result");
		this.pieColor = pieColors;
		this.pieIpColor = pieIpIcons
		this.jsonSort(JSON.parse(this.utils.sessionStorageGet("ipResult")));
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();

	}

	/**This method is for sorting the res */
	jsonSort(res) {
		var list = res;
		var keysSorted = Object.keys(list).sort(function (a, b) { return list[b] - list[a] });
		let sortJson = [];
		for (let i = 0; i < keysSorted.length; i++) {
			let obj = {};
			obj["interest"] = keysSorted[i];
			obj["score"] = res[keysSorted[i]].score;
			sortJson.push(obj);
		}
		this.utils.sessionStorageSet("resultIP", JSON.stringify(sortJson));
		this.result = JSON.parse(this.utils.sessionStorageGet("resultIP"));
		try {
			setTimeout(function () {
				this.displayPieChart(this);
			}.bind(this), 0);
		} catch (e) {
			console.log("exception=>" + e.message);
		}
	}

	/* This method for displaying the result in pie chart format. */
	displayPieChart(ref) {
		Pizza.init();
		ref.utils.hideLoading();
	}

	/* This method is for saving the assessment in the server with Usernotes.
		Here call for the SaveUserNotes takes place.
	*/
	saveIpSfAssessment() {
		this.apiJson.method = "POST";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let SaveUserNotes = {};
		let text = ['enter_thougts', 'savemythoughts', 'cancel', 'btn_save', 'err_occ'];
		let transText = this.changeTextLang(text, this);
		SaveUserNotes = {
			input_data: [
				{
					"param_type": "path",

					"params": ["saveUserNotes", this.logId]
				},
				{
					"param_type": "query",
					"params": { "stateAbbr": "IC" }
				},
				{
					"param_type": "body",
					"params": {
						"userNotes": "added"
					}
				}
			]
		}
		let user = JSON.stringify(SaveUserNotes);
		this.apiJson.endUrl = "Users";
		this.apiJson.data = user;
		this.trackEvnt.showSaveDialog(this.apiJson, "IPCOMPLETE", transText);

	}

	/* This method gets called when user clicks the area of interest.
	    This navigates user to occupation list which gets the occupation based on interest.*/
	getOccListBasedOnInterest = function (interest) {
		this.utils.sessionStorageSet("ipsfInterest", interest);
		setTimeout(function () {
			let rtArr = this.router.url.split('/');
			let rtVal = rtArr.slice(1, rtArr.length - 1).join('/');
			this.router.navigate([rtVal + '/occlist'], { relativeTo: this.activeRoute });
		}.bind(this), 0);
	}

	/* This method is for printing the result page when we click on print button.*/
	printResult() {
		setTimeout(() => { Pizza.init() }, 1000);
		document.getElementById("openModalButton").click();

	}

	/**This function is for changing the language of text. */
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

    /**This function is for printing the result page when we click 
	* on done button in popup, that displays when print button is clicked  */

	printResultPage(divName) {
		var theCanvas = "";
		try {

			html2canvas(document.getElementById("print-list"), {
				onrendered: function (canvas) {
					theCanvas = canvas;
					var headingToPrint = document.getElementById('ip-print-heading');
					var divToPrint = document.getElementById('print-piechart');
					var textToPrint = document.getElementById('print-text');
					var list = document.getElementById('list-popup');


					var newWin = window.open('', 'Print-Window', 'width=500,height=500');

					newWin.document.open();
					newWin.document.write(`<html>
                                          <head>
                                               <link type="text/css" rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
                                                <style>
                                                 .main-print-ip{
                                                     width:30%;
                                                     float:left;
                                                 }
                                                 .ip-img-print-main{
                                                    width:70%;
                                                     margin:34px 0 30px 0;
                                                 }
                                                 .headding-ip{
                                                     margin-left:10px;
                                                 }
                                                   .print-text{
                                                      margin:10px;
                                                 }
                                                  @media screen and (max-width: 767px) {
													   .main-print-ip{
                                                     width:100%;
                                                     float:left;
                                                 }
                                                      .ip-img-print-main{
                                                    width:100%;
                                                     margin:34px 0 30px 0;
                                                 }
                                                 }                                             
												   </style>
                                            </head>
                                                 <body onload="window.print()"> <h4 class="headding-ip">`+ headingToPrint.innerHTML + `</h4> <div class="main-print-ip">` + divToPrint.innerHTML + `</div>
                                                 <div class="color-box"  style="margin: 56px 0 82px;">` + list.innerHTML + `</div>` + textToPrint.innerHTML + `</body></html>`);

					newWin.document.close();
					setTimeout(function () { window.close(); }, 10000);
				}
			});
		}
		catch (e) {
			console.log("printResultPage exception:" + e.message);
		}

	}
}


