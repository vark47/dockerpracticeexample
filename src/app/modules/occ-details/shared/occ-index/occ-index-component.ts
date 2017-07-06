import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Utilities } from '../../../../shared/utilities.class';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { clusterDetails } from '../../../assessments/shared/constants/assessments-constants';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { Subscription } from "rxjs/Subscription";
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
declare var $: any;
@Component({
	selector: 'occ-index',
	templateUrl: './occ-index-layout.html',
})

export class OccIndexComponent implements OnInit {
	browserDom: BrowserDomAdapter;
	chips = ['Rating', 'Education', 'Wages'];
	colors = ["career-list-green-plp3", "career-list-gray-plp3", "career-list-brown-plp3"];
	careerlist = ['Agriculter and Natural Resource', 'Food and Natural Resource', 'Archi and Construction'];
	clusterhide = true;
	titlehide = false;
	titlesum = 20;
	ClusName = [];
	titlelist = [];
	cluBgColor = [];
	occID = "";
	Occname = "";
	occIDVal;
	indexOccId = [];
	indexTitleName = [];
	search = { text: '', rating: [], wages: [], edu: [] };
	careerheader;
	filter = 0;
	educationheader;
	wageheader;
	ratingoptions: any = [];
	eduoptions = [];
	wageoptions = [];
	clusIconValue = [];
	countvalue;
	iconInxVal = 0;
	filtericon = ["fa fa-filter", "fa fa-times"];
	subscription = new Subscription;
	checkVal = "";
	headerValue = { headers: [] }
	indexValue = { buttons: [] }
	accountId;
	FilterName;
	selectTostVal = "";
	searchBox = true;
	backAssessmentValue = false;
	show = 0;
	constructor(private router: Router, private utils: Utilities,
		private apiJson: ApiCallClass, private activatedRoute: ActivatedRoute,
		private serverApi: ServerApi, private eventService: EventDispatchService) {
		this.browserDom = new BrowserDomAdapter();
		let rtArr = this.router.url.split('/');
		for (let i = 0; i < rtArr.length; i++) {
			if (rtArr[i] == 'occupations') {
				this.backAssessmentValue = false;
				break;
			}
			else {
				this.backAssessmentValue = true;
			}
		}
		this.activatedRoute.queryParams.subscribe(params => {
			// Defaults to 0 if no query param provided.
			this.checkVal = params['chk'];
			if (params['occid'] != undefined) {
				this.occIDVal = params['occid'];
				this.indexOccId.push(parseInt(this.occIDVal));
				this.indexTitleName.push(params['occname']);
			}

		});
		/*  the below subscribe is when title list is return 0 it can catch the event from filter-searchpipe.ts. event name is "keycount"*/
		this.subscription = eventService.listen().subscribe((e) => {
			console.log("comming count--->" + e.type);
			if (e.type == "keycount") {
				console.log("comming count");
				this.countvalue = 0;
			} else if (e.type == "itemcount") {
				this.countvalue = 1;
			}
		});
	}
	ngOnInit() {

		/**Hear we get the data from the server for pageCluster */
		this.accountId = this.utils.getAccountId();
		this.utils.showLoading();
		this.utils.sessionStorageRemove("occId")
		let indexlistInfo = {};
		indexlistInfo = {
			input_data: [

				{
					'param_type': 'path',
					'params': ["index", this.accountId]
				},
				{
					"param_type": "query",
					"params": { "lang": "en", "stateAbbr": "IC" }
				}
			]
		};

		this.apiJson.method = 'GET';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Occ/v1/';
		this.apiJson.endUrl = 'pages';
		this.apiJson.data = JSON.stringify(indexlistInfo);
		this.serverApi.callApi([this.apiJson]).subscribe((res) => {
			// seperate cluster and its title
			if (res[0].Success + '' == 'true') {

				for (let j = 0; j < res[0].Result.occs.length; j++) {
					this.titlelist.push(
						res[0].Result.occs[j]
					);
				}
				for (let j = 0; j < res[0].Result.emerging.length; j++) {
					this.titlelist.push(
						res[0].Result.emerging[j]);
				}
				for (let i = 0; i < res[0].Result.clusters.length; i++) {

					let titles = [];
					for (let j = 0; j < this.titlelist.length; j++) {
						if (this.titlelist[j].clusterID == res[0].Result.clusters[i].clusterID) {
							titles.push(this.titlelist[j]);
						}
					}
					let ref = this;
					ref.ClusName.push({
						clusterId: res[0].Result.clusters[i].clusterID,
						clusterName: res[0].Result.clusters[i].title,
						clusterRating: res[0].Result.clusters[i].rating,
						clusterTitle: titles
					})
					clusterDetails.forEach(function (obj, inx) {
						if (ref.ClusName[i].clusterId == obj.clusterId) {
							ref.clusIconValue.push(obj.clusterIconValue);
							ref.cluBgColor.push(obj.clusterBgColor);
						}
					});
				}
				setTimeout(function () {
					this.search = { text: ' ', rating: [], wages: [], edu: [] };
					setTimeout(function () {
						this.search = { text: '', rating: [], wages: [], edu: [] };
						this.utils.hideLoading();
					}.bind(this), 1300);

				}.bind(this), 700);
			}
		}, this.utils.handleError);
		// this is to call getFilterApi for filter in search box
		this.getFilterApi();
	}

	changeText() {
		//to change icon from filter icon to x icon
		this.iconInxVal = 0;
		this.searchBox = true;
	}
	/* code for based on child title count display message "There is no cluster list avaiable"*/
	parentCnt: Number = 0;
	incrementCount(val: Number) {

		this.parentCnt = this.parentCnt.valueOf() + val.valueOf();
	}
	clearParentVal() {
		this.parentCnt = 0;
	}
	/* this method is get "career interest,education level ,wages" from server api. and display on occupation-list.layout.html */
	getFilterApi() {
		let filterlistInfo = {};
		filterlistInfo = {
			input_data: [

				{
					'param_type': 'path',
					'params': ["index", "text", this.accountId]
				},
				{
					"param_type": "query",
					"params": { "lang": "en", "stateAbbr": "IC" }
				}
			]
		};
		this.apiJson = new ApiCallClass();
		this.apiJson.method = 'GET';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Occ/v1/';
		this.apiJson.endUrl = 'pages';
		this.apiJson.data = JSON.stringify(filterlistInfo);
		this.serverApi.callApi([this.apiJson]).subscribe((res) => {
			if (res[0].Success + "" == "true") {
				for (let k = 0; k < res[0].Result.headers.length; k++) {
					this.headerValue.headers[res[0].Result.headers[k].type] = res[0].Result.headers[k].header;
				}
				this.FilterName = this.headerValue.headers.filter
				for (let j = 0; j < res[0].Result.buttons.length; j++) {
					this.indexValue.buttons[res[0].Result.buttons[j].button] = res[0].Result.buttons[j].title;
				}

				for (let i = 0; i < res[0].Result.filters.length; i++) {
					if (res[0].Result.filters[i].title == "Career Interest") {

						this.careerheader = res[0].Result.filters[i].title;
						for (let j = 0; j < res[0].Result.filters[i].ratings.length; j++) {
							if (res[0].Result.filters[i].ratings[j].title == "High Interest") {
								this.ratingoptions.push({ "title": res[0].Result.filters[i].ratings[j].title, "id": res[0].Result.filters[i].ratings[j].id, "status": false })

							} else if (res[0].Result.filters[i].ratings[j].title == "Low Interest") {
								this.ratingoptions.push({ "title": res[0].Result.filters[i].ratings[j].title, "id": res[0].Result.filters[i].ratings[j].id, "status": false })

							} else if (res[0].Result.filters[i].ratings[j].title == "Not Rated") {
								this.ratingoptions.push({ "title": res[0].Result.filters[i].ratings[j].title, "id": res[0].Result.filters[i].ratings[j].id, "status": false })

							}


						}

					}
					if (res[0].Result.filters[i].title == "Education Level") {

						this.educationheader = res[0].Result.filters[i].title;
						for (let j = 0; j < res[0].Result.filters[i].ratings.length; j++) {

							this.eduoptions.push({ "title": res[0].Result.filters[i].ratings[j].title, "id": res[0].Result.filters[i].ratings[j].id, "status": false })

						}
					}
					if (res[0].Result.filters[i].title == "Median Wages") {
						this.wageheader = res[0].Result.filters[i].title;
						for (let j = 0; j < res[0].Result.filters[i].ratings.length; j++) {

							this.wageoptions.push({ "title": res[0].Result.filters[i].ratings[j].title, "id": res[0].Result.filters[i].ratings[j].id, "status": false })

						}
					}
				}
			}

		}, this.utils.handleError);

	}

	callOccDetail(occID, occName, clusterIcon, clusterColor) {
		if (this.indexOccId.length < 2 || (this.indexOccId.length == 2
			&& this.indexOccId.indexOf(occID) != -1)) {
			if (this.indexOccId[0] != occID && (this.indexOccId.length != 0)) {
				// alert("twoDigit---->");
				this.utils.sessionStorageSet("compareFirstid", this.indexOccId[0]);
				this.utils.sessionStorageSet("compareFirstname", this.indexTitleName[0]);
				this.utils.sessionStorageSet("compareFirst", "true");
			}
			else {
				this.utils.sessionStorageSet("compareFirst", "false");
			}
			let twoDigit = occID.toString().substr(0, 2);

			this.utils.sessionStorageSet("savedVal", "false");
			// alert( "twoDigit---->"+twoDigit);
			if (twoDigit == 14) {
				this.router.navigate(['../occEmergCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: occID, occname: occName, clusIcon: clusterIcon, clusColor: clusterColor } });
			}
			else {
				this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: occID, occname: occName } });

			}
		}
	}

	callOccDetailCluster(clusterId, ClusterName, clusterIcon, clusterColor) {
		if (this.indexOccId.length < 2 || (this.indexOccId.length == 2
			&& this.indexOccId.indexOf(clusterId) != -1)) {
			this.utils.showLoading();
			//let clusterIcon = this.utils.sessionStorageGet("clusterIcon");
			this.router.navigate(['../occCluster'], {
				relativeTo: this.activatedRoute,
				queryParams: { clusId: clusterId, clusName: ClusterName, clusIcon: clusterIcon, clusColor: clusterColor }
			});

		}
	}
	/** Code comment end why and whynot */


	value(key, checkVal) {
		if (checkVal == 'ref') {
			return '#clus' + key;
		}
		else if (checkVal == 'controls') {
			return 'clus' + key;
		}
	}

	// clusterListFun() {
	// 	this.clusterhide = false;
	// 	this.titlehide = true;
	// }
	// titleListFun() {
	// 	this.titlehide = false;
	// 	this.clusterhide = true;
	// }

	clusterListFun(hide) {
		if (hide == 'cluster' && (this.show != 1)) {
			this.show = 1;
			this.titlehide = true;
			this.clusterhide = false;
		}
		else if (hide == 'title' && (this.show != 0)) {
			this.show = 0;


			this.titlehide = false;
			this.clusterhide = true;
		}
	}
	checkCareer(id, name, e) {
		// console.log("in occ index checkCareer--" + this.indexTitleName.length);
		if ((e.which == 13 || e == "click") && this.indexTitleName.length <= 2) {
			let isAvailable = false;
			let inx1 = -1;
			for (let i = 0; i < this.indexOccId.length; i++) {

				if (id == this.indexOccId[i]) {
					isAvailable = true;
					inx1 = i;
					break;
				}
				else {
					isAvailable = false;
				}
			}
			if (isAvailable == false) {
				this.indexOccId.push(id);
				this.indexTitleName.push(name);
				isAvailable = true;
				this.utils.sessionStorageSet("savedValId", this.indexOccId[0]);
				this.utils.sessionStorageSet("savedValName", this.indexTitleName[0]);
				this.myFunction(name);
			}
			else {
				this.indexOccId.splice(inx1, 1);
				this.indexTitleName.splice(inx1, 1);
				this.utils.sessionStorageSet("savedValId", this.indexOccId);
				this.utils.sessionStorageSet("savedValName", this.indexTitleName);
			}
		}
	}

	CompareOccupations() {
		//alert("coming in CompareOccupations");
		try {
			this.router.navigate(['../compare'], {
				relativeTo: this.activatedRoute,
				queryParams: {
					occId: this.indexOccId[0] + "&" + this.indexOccId[1],
					occName: this.indexTitleName[0] + "&" + this.indexTitleName[1]
				}
			});
		}
		catch (e) {
			alert("error--->" + e.message);
		}

	}

	backAssessment() {
		// this.utils.backNavigation(assment);
		this.router.navigate(['../result'], { relativeTo: this.activatedRoute });
	}
	getResultFilter() {

		let filteroption = { text: this.search.text, rating: [], wages: [], edu: [] };



		for (let i = 0; i < this.ratingoptions.length; i++) {
			if (this.ratingoptions[i].status) {
				filteroption.rating.push(this.ratingoptions[i].id);
			}

		}
		for (let i = 0; i < this.eduoptions.length; i++) {
			if (this.eduoptions[i].status) {
				filteroption.edu.push(this.eduoptions[i].id);
			}
		}
		for (let i = 0; i < this.wageoptions.length; i++) {
			if (this.wageoptions[i].status) {
				filteroption.wages.push(this.wageoptions[i].id);

			}

		}

		this.search = filteroption;
		if (filteroption.text.length == 0 && filteroption.rating.length == 0 && filteroption.wages.length == 0 && filteroption.edu.length == 0) {
			this.countvalue = 1;
		} else if (filteroption.text.length != 0 || filteroption.rating.length != 0 || filteroption.wages.length != 0 || filteroption.edu.length != 0) {

			this.countvalue = 1;
		}
		this.iconInxVal = 0;
		this.searchBox = true;


	}
	resetCheckBoxes() {
		let filteroption = { text: this.search.text, rating: [], wages: [], edu: [] };

		for (let i = 0; i < this.ratingoptions.length; i++) {
			if (this.ratingoptions[i].status) {
				this.ratingoptions[i].status = false;
			}
		}
		for (let i = 0; i < this.eduoptions.length; i++) {
			if (this.eduoptions[i].status) {
				this.eduoptions[i].status = false;
			}
		}
		for (let i = 0; i < this.wageoptions.length; i++) {
			if (this.wageoptions[i].status) {
				this.wageoptions[i].status = false;
			}

		}
		this.search = filteroption;


	}
	showHideIcon() {
		if (this.iconInxVal == 0) {
			this.iconInxVal = 1;
			this.searchBox = false;
		}
		else {
			this.iconInxVal = 0;
			this.searchBox = true;
		}
	}

	methodfilter(valfil) {
		if (this.filter != valfil) {
			this.filter = valfil;
		}
		else {
			this.filter = 999;
		}
	}
	cancelButton() {
		this.iconInxVal = 0;
		this.searchBox = true;
	}
	myFunction(funcName) {


		this.selectTostVal = funcName
		let x = document.getElementById("snackbar")
		x.className = "show";
		setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
	}
	onScroll() {
		console.log('scrolled!!');
		// add another 6 items
		//	const start = this.titlesum;
		this.titlesum += 20;
		//console.log("sum is-->" + this.titlesum);
		//alert("titlelist length is-->" + this.titlelist.length);
		// if (this.titlesum < this.titlelist.length) {
		// 	//alert("sum2 is-->" + this.sum);
		// 	this.addItems(start, this.titlesum);
		// }
	}
}