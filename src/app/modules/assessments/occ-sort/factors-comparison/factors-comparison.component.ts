import { Component, OnInit, Output, EventEmitter, ViewChild, Renderer, ElementRef } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response } from '@angular/http';
import { messages } from '../../../../shared/messages';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';

var sysCard = document.getElementsByClassName('sysList');
var usrCard = document.getElementsByClassName('userList');

@Component({
	selector: 'factorsComparison',
	templateUrl: './factors-comparison.layout.html',
})
export class FactorsComparison {
	FactorsList;
	isWhy = "";
	isNotWhy = "";
	SelectedFactors = [];
	UserSelectedRangeTop = [];
	UserSelectedRangeBottom = [];
	SysSelectedFactors = [];
	SysSelectedRangeTop = [];
	SysSelectedRangeBottom = [];
	UserValues;
	OccIdValue;
	inxValue;
	occName = "";
	utilities;
	moduleNameIs = this.utils.sessionStorageGet("module");
	constructor(private http: Http, private router: Router, private activeRoute: ActivatedRoute,
		private utils: Utilities,
		private apiJson: ApiCallClass, private el: ElementRef, private renderer: Renderer, private serverApi: ServerApi) {
		this.utilities = utils;
	}
	ngOnInit() {
		this.UserValues = JSON.parse(this.utils.sessionStorageGet("whyList"));
		this.activeRoute.queryParams.subscribe((params: Params) => {
			this.OccIdValue = params['occIdValue'];
			this.occName = params['occupationName'];

		});
		let val = "";
		for (let i = 0; i < this.UserValues.input_data[2].params.selectedFactors.length; i++) {
			if (this.UserValues.input_data[2].params.selectedFactors[i] != ",") {
				val = val + this.UserValues.input_data[2].params.selectedFactors[i];
			}
			else if (this.UserValues.input_data[2].params.selectedFactors[i] == ",") {
				this.SelectedFactors.push(parseInt(val));
				val = "";
			}
			if (i == (this.UserValues.input_data[2].params.selectedFactors.length - 1))
				this.SelectedFactors.push(parseInt(val));
		}
		for (let i = 0; i < this.UserValues.input_data[2].params.rangeTop.length; i++) {
			if (i % 2 == 0) {
				this.UserSelectedRangeTop.push(parseInt(this.UserValues.input_data[2].params.rangeTop[i]))
				this.UserSelectedRangeBottom.push(parseInt(this.UserValues.input_data[2].params.rangeBottom[i]))
			}
		}
		if (this.utils.sessionStorageGet("checkNotOccList") == 'true') {
			this.utils.showLoading();
			this.apiJson.method = "POST";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let WhynotOccListdata = {};
			WhynotOccListdata = {

				input_data: [

					{
						"param_type": "path",
						"params": [this.OccIdValue]
					},
					{
						"param_type": "query",
						"params": { "stateAbbr": "IC" }
					},
					{
						"param_type": "body",
						"params": {
							"selectedFactors": this.UserValues.input_data[2].params.selectedFactors,
							"rangeTop": this.UserValues.input_data[2].params.rangeTop,
							"rangeBottom": this.UserValues.input_data[2].params.rangeBottom

						}
					}
				]
			}
			let user = JSON.stringify(WhynotOccListdata);
			this.apiJson.endUrl = "occSort/whyNotOcc/";
			this.apiJson.data = user;
			this.serverApi.callApi([this.apiJson]).subscribe((res) => {
				if (res.Success + "" == "true") {
					this.getWhynotOccListData(res.Result);
				} else {
					alert("error occured");
				}

			}, this.utilities.handleError);
		}
		else {
			this.utils.showLoading();
			this.apiJson.method = "POST";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let WhyOccListdata = {};
			WhyOccListdata = {
				input_data: [

					{
						"param_type": "path",
						"params": [this.OccIdValue]
					},
					{
						"param_type": "query",
						"params": { "stateAbbr": "IC" }
					},
					{
						"param_type": "body",
						"params": {
							"selectedFactors": this.UserValues.input_data[2].params.selectedFactors,
							"rangeTop": this.UserValues.input_data[2].params.rangeTop,
							"rangeBottom": this.UserValues.input_data[2].params.rangeBottom

						}
					}
				]
			}
			let user = JSON.stringify(WhyOccListdata);
			this.apiJson.endUrl = "occSort/whyOcc/";
			this.apiJson.data = user;

			this.serverApi.callApi([this.apiJson]).subscribe((res) => {
				if (res.Success + "" == "true") {
					this.getWhyOccListData(res.Result);
				}

			}, this.utilities.handleError);
		}
	}
	getWhyOccListData(data) {
		this.utils.sessionStorageSet("isWhy", "true");
		this.utils.sessionStorageSet("isNotWhy", "");
		this.utils.hideLoading();
		for (let i = 0; i < 5; i++) {
			this.SysSelectedFactors.push(data[i].factorID);
			this.SysSelectedRangeTop.push(data[i].rangeTop);
			this.SysSelectedRangeBottom.push(data[i].rangeBottom);
		}
		for (let val = 0; val < 5; val++) {
			var cardplp = sysCard[val].getElementsByClassName('s_list');
			let sysTop = this.SysSelectedRangeTop[val];
			let sysBtm = this.SysSelectedRangeBottom[val];
			this.renderer.setElementClass(cardplp[0], 'plp-2-progress-radius', true);
			this.renderer.setElementClass(cardplp[0], 'plp-2-progress-radius-first', true);
			for (let value = sysTop; value <= sysBtm; value++) {
				this.renderer.setElementClass(cardplp[value], 'plp-2-green-light', true);
			}
		}
		for (let val = 0; val < 5; val++) {
			var usrcardplp = usrCard[val].getElementsByClassName('u_list');
			let usrTop = this.UserSelectedRangeTop[val];
			let usrBtm = this.UserSelectedRangeBottom[val];
			for (let value = usrTop; value <= usrBtm; value++) {
				this.renderer.setElementClass(usrcardplp[value], 'plp-2-green', true);
			}
		}
	}
	getWhynotOccListData(data) {
		this.utils.sessionStorageSet("isNotWhy", "true");
		this.utils.sessionStorageSet("isWhy", "");
		this.utils.hideLoading();
		let Rangetop = [];
		let Rangebtm = [];
		this.SysSelectedRangeTop = [];
		this.SysSelectedRangeBottom = [];
		for (let i = 0; i < (data.length); i++) {
			this.SysSelectedFactors.push(data[i].factorID);
			Rangetop.push(data[i].rangeTop);
			Rangebtm.push(data[i].rangeBottom);
		}
		var cardVal = document.getElementsByClassName('card');
		for (let val = 0, k = 0; val < 5; val++) {
			for (let j = 0; j < this.SysSelectedFactors.length; j++) {
				if (this.SelectedFactors[val] != this.SysSelectedFactors[j]) {
					this.renderer.setElementStyle(cardVal[val], "display", "none");
					if (j == this.SysSelectedFactors.length - 1) {
						this.SysSelectedRangeTop.push(0);
						this.SysSelectedRangeBottom.push(0);
					}
				}
				else {
					this.renderer.setElementStyle(cardVal[val], "display", "block");
					this.SysSelectedRangeTop.push(Rangetop[k]);
					this.SysSelectedRangeBottom.push(Rangebtm[k]);
					k++;
					j = this.SysSelectedFactors.length - 1;
				}
			}
		}
		for (let val = 0; val < 5; val++) {
			var cardplp = sysCard[val].getElementsByClassName('s_list');
			let sysTop = this.SysSelectedRangeTop[val];
			let sysBtm = this.SysSelectedRangeBottom[val];
			this.renderer.setElementClass(cardplp[0], 'plp-2-progress-radius', true);
			this.renderer.setElementClass(cardplp[0], 'plp-2-progress-radius-first', true);
			for (let value = sysTop; value <= sysBtm; value++) {
				this.renderer.setElementClass(cardplp[value], 'plp-2-green-light', true);
			}
		}
		for (let val = 0; val < 5; val++) {
			var usrcardplp = usrCard[val].getElementsByClassName('u_list');
			let usrTop = this.UserSelectedRangeTop[val];
			let usrBtm = this.UserSelectedRangeBottom[val];
			for (let value = usrTop; value <= usrBtm; value++) {
				this.renderer.setElementClass(usrcardplp[value], 'plp-2-green', true);
			}
		}


	}
	goToList() {
		this.router.navigate(['../result'], { relativeTo: this.activeRoute });
	}
}