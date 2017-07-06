import { Component, Output, Renderer, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { ClassDirective } from '../../shared/assessments-directives/assessment-class-directive';
import { Subscription } from "rxjs/Subscription";

declare function circleGraphic(string): string;
declare let html2canvas: any;


@Component({
	selector: 'eq-result',
	templateUrl: './eq-result.layout.html',
})
export class EQResultComponent {
	resultEntiQuizvar = 0;
	browserDom: BrowserDomAdapter;
	subscription = new Subscription;
	cir;
	dataUrl;
	logID;
	@Output() changeView = new EventEmitter();
	constructor(private trackEvnt: AssessmentsService, private translate: TranslateService,
		private router: Router, private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi,
		private renderer: Renderer, private eventService: EventDispatchService) {
		this.browserDom = new BrowserDomAdapter();
		this.logID = this.utils.sessionStorageGet("entiQuizLogID");

		/** Below code block listens broadcasted event and 
		 * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {

			if (e.type == "EQSaveComplete") {
				this.saveUserNotes();
			}
			else if (e.type == "EQPrint") {
				this.printResult();
			}
			else if (e.type == "saveAnswerSet") {

			}

		});
	}

	/** This function gets start when enters into Entrepreneur-quiz result. */
	ngOnInit() {
		this.utils.sessionStorageSet("isAssessment", "");
		this.utils.sessionStorageSet("isFrom", "result");
		this.resultEntiQuizvar = parseInt(window.sessionStorage.getItem("resultEntiQuiz"));

		let ref = this;
		setTimeout(function () {

			this.cir = document.getElementsByClassName('circleGraphic1');

			circleGraphic(this.cir);
			this.cir = document.getElementsByClassName('circleGraphic2');

			circleGraphic(this.cir);
		}.bind(this), 200);

		this.utils.hideLoading();
	}
	ngOnDestroy() {

		this.subscription.unsubscribe();

	}

	/**This function is for saving the user notes when user clicks on save button. */
	saveUserNotes() {

		this.apiJson.method = "POST";
		let SaveUserNotes = {};
		let text = ['enter_thougts', 'savemythoughts', 'cancel', 'btn_save', 'err_occ'];
		let transText = this.changeTextLang(text, this);
		this.apiJson.sessionID = this.utils.getAuthKey();

		this.apiJson.moduleName = "Assessment/v1/";
		SaveUserNotes = {
			// "logID": this.utils.sessionStorageGet("entiQuizLogID"),
			// "UserNotes": "added"
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
		this.trackEvnt.showSaveDialog(this.apiJson, "EQCOMPLETE", transText);
	}

	/** This function is for displaying the pop-up when we ckick on print button */
	printResult() {
		var div = document.getElementById("circleGraphicpopup-print");
		while (div.firstChild) {
			div.removeChild(div.firstChild);
		}
		var variable = this.utils.sessionStorageGet("canvasId");
		document.getElementById("openModalButton").click();
		let ref = this;
		html2canvas(document.getElementsByClassName("block-box-circle-pt"), {
			onrendered: function (canvas) {
				try {
					ref.dataUrl = canvas;
					ref.browserDom.setInnerHTML(ref.renderer.selectRootElement("#circleGraphicpopup-print"), "<img src='" + canvas.toDataURL() + "'/>");
				}
				catch (e) {
					alert("print html2canvas eception:" + e.message);
				}
			}
		});

	}


	/** This function is for changing the language of text. */
	changeTextLang(keyArr, ref) {
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

	/**This function is for printing the result page when we click 
	 * on done button in popup, that displays when print button is clicked  */
	printResultPage(divName) {
		try {

			var printimage = document.getElementById('circleGraphicpopup-print');
			var headingToPrint = document.getElementById('eq-print-heading');
			var eqpara = document.getElementById('eq-print-para');
			var textToPrint = document.getElementById('eq-canvas-matter');
			var newWin = window.open('', 'Print-Window', 'width=500,height=500');
			newWin.document.open();
			newWin.document.write(`<html>
                                          <head>
                                               <link type="text/css" rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
                                                <style>
                                      .block-box-h {padding-top: 65px;}
                                   .block-box-h .result-para{padding: 8px 15px 0;}     
                                   .eq-result-text{padding-left: 83px;} 
								   .plp2-white {color: white;}
                                   .col-centered {float: none;margin: 0 auto;width:  100%;}  
                                   .col-centered-p2 {margin:-22px 0 0 -35px!important;text-align: center;}                                  
                                  .block-box-h .result-para {color: white; padding: 5px 0 0 50px;vertical-align: middle!important;}
								.circleGraphicpopup{    width: 200px;    height:  200px;}
                                  .div-icon h4{     margin:-20px 0 0 65px;}
                                  .print-btn-popup{margin:0 0 0 20px;}
                                  .div-icon img{ margin:0 0 0 15px;}
                                   .eq-data-print-popup{ padding:5px 17px;}   
								   

							      .block-box-circle-pt { 
									   -webkit-print-color-adjust: exact;
									  height: auto; background: #018574; background: -moz-linear-gradient(top, #018574 21%, #002923 100%);								
							     background: -webkit-linear-gradient(top, #018574  21%, #002923 100%); 
								 background: linear-gradient(to bottom, #018574 21%, #002923 100%); 
                                  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#018574', endColorstr='#002923', GradientType=0 ); 
								}
                                  .block-box-circle-pt h3 {color:#00dd33;}                                  
								    @media screen and (max-width: 767px) {
										  .block-box-circle-pt {height: auto;}
                                     .circleGraphicpopup{margin:0 0 0 100px;}
                                  
                                  .block-box-circle-pt h3 { padding-top:  10px;}
                                   .block-box-h{height:auto;padding-bottom:10px;}                                     .block-box-h {border-left: none;margin-top: 155px;}
                                    .block-box-h .result-para { padding: 0px;}
                                  }

                                    @media screen and (max-width: 360px) {
									 .block-box-circle-pt {height: 700px!important;}
                                        .circleGraphicpopup{margin:0 0 0 20px;}
                                    }

                                      .close,.print-btn-popup{
                                            display:none;
                                      }

                                    </style>
                                            </head>
											<body onload="window.print()"> <h4 class="headding-ip">`+ headingToPrint.innerHTML + `</h4> 
										 <div class="block-box-circle-pt"> <img src="` + this.dataUrl.toDataURL() + `" style="width:100%" /></div><div>` + eqpara.innerHTML + `</div> ` + textToPrint.innerHTML + `</body></html>`);
			newWin.document.close();
			setTimeout(function () { window.close(); }, 10000);
		} catch (e) {
			console.log(" Print exception:" + e.message);
		}
	}
}


