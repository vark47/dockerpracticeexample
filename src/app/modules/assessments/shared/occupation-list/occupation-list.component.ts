import { Component, Input, Renderer, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { AssessmentHeaderComponent } from '../../shared/assessment-header/assessment-header.component';
import { clusterDetails } from '../constants/assessments-constants';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { Subscription } from "rxjs/Subscription";
declare var $: any;

@Component({
	selector: 'occupation-list',
	templateUrl: './occupation-list.layout.html',
})

export class OccupationListComponent {
	@Input() occListData = [];
	@ViewChild('inner') dataContainer: ElementRef;
	/**   variable comment */
	why = 'false';
	whynot = 'true';
	titlelist = [];
	buttonData: Object;
	liTag;
	titlesum = 20;
	alphaStyle;
	occName;
	clusterhide = true;
	titlehide = false;
	imghide = true;
	selectTostVal = ""
	compareImg = false;
	hidenav = false;
	compareOccupation = false;
	dom: BrowserDomAdapter;
	occID = "";
	Occname = "";
	ClusName = [];
	indexOccId = [];
	indexTitleName = [];
	clusIconValue = [];
	filterSearch = 'false';
	cluBgColor = [];
	filter = 0;
	isActiveprime = false;
	isActive = true;
	occIdValues = [];
	occClusValues = [];
	moduleNameIs = this.utils.sessionStorageGet("module");
	search = { text: '', rating: [], wages: [], edu: [] };
	careerheader;
	educationheader;
	wageheader;
	ratingoptions: any = [];
	eduoptions = [];
	wageoptions = [];
	countvalue = 0;
	showBtn = 0;
	show = 1;
	iconInxVal = 0;
	filtericon = ["fa fa-filter", "fa fa-times"];
	subscription = new Subscription;
	headerValue = { headers: [] }
	FilterName;
	indexValue = { buttons: [] }
	searchBox = true;
	accountId;
	constructor(private router: Router, private activatedRoute: ActivatedRoute, private utils: Utilities,
		private apiJson1: ApiCallClass, private apiJson: ApiCallClass, private serverApi: ServerApi, private renderer: Renderer,
		private assessOccFunction: AssessmentHeaderComponent, private elementref: ElementRef, private eventService: EventDispatchService) {
		this.dom = new BrowserDomAdapter();

		/* The below subscribe is when title list is return 0 it can catch the event from filter-searchpipe.ts. event name is "keycount"*/
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type == "keycount") {
				this.countvalue = 0;
			} else if (e.type == "itemcount") {
				this.countvalue = 1;
			}
		});
	}

	ngOnInit() {
		this.accountId = this.utils.getAccountId();
		this.utils.showLoading();
		this.utils.sessionStorageRemove("occId")
		this.compareOccupation = false;
		this.utils.sessionStorageSet("checkNotOccList", "false");
		if (this.utils.sessionStorageGet("module") == 'ip') {
			this.compareImg = true;
			this.why = 'false';
			this.whynot = 'false';
		}

		else {
			this.compareImg = false;
			this.why = 'true';
			this.whynot = 'false';
		}

		this.getFilterApi();

	}
	changeText() {
		this.iconInxVal = 0;
		this.searchBox = true;
	}
	/* Code for based on child title count display message "There is no cluster list avaiable"*/
	parentCnt: Number = 0;
	incrementCount(val: Number) {

		this.parentCnt = this.parentCnt.valueOf() + val.valueOf();
	}
	clearParentVal() {
		this.parentCnt = 0;
	}
	/* This method is get "career interest,education level ,wages" from server api. and display on occupation-list.layout.html */

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
				if (this.utils.sessionStorageGet("module") == 'os') {
					this.utils.hideLoading();
				}
			}

		}, this.utils.handleError);

	}
	/** Used to display the list from where user compared occupation */
	inListOcc(checklist) {
		this.ClusName = [];
		this.titlelist = [];
		this.clusIconValue = [];
		this.cluBgColor = [];
		this.alphaStyle = this.utils.sessionStorageGet("module");
		if (this.utils.sessionStorageGet("returnName") == 'clus') {
			this.clusterListFun('cluster');
		}
		else {
			this.clusterListFun('title');
		}
		this.utils.sessionStorageSet("isWhy", "");
		this.utils.sessionStorageSet("isNotWhy", "");
		let ref = this;
		let whyList = JSON.parse(this.utils.sessionStorageGet("OccList"));
		if (checklist == "true" && whyList != null) {
			this.whynot = 'true';
			this.why = 'false';
			this.utils.sessionStorageSet("checkNotOccList", "false");
			this.ClusName = JSON.parse(this.utils.sessionStorageGet("yOccListclus"));
			this.titlelist = JSON.parse(this.utils.sessionStorageGet("yOccListtitle"));
			for (let k = 0; k < ref.ClusName.length; k++) {
				clusterDetails.forEach(function (obj, inx) {
					if (ref.ClusName[k].clusterId == obj.clusterId) {
						ref.clusIconValue.push(obj.clusterIconValue);
						ref.cluBgColor.push(obj.clusterBgColor);
					}
				});
			}
			this.isActive = true;
		}
		else if (whyList != null) {
			this.why = 'true';
			this.whynot = 'false';
			this.utils.sessionStorageSet("checkNotOccList", "true");
			this.ClusName = JSON.parse(this.utils.sessionStorageGet("ynOccListclus"));
			this.titlelist = JSON.parse(this.utils.sessionStorageGet("ynOccListtitle"));
			for (let k = 0; k < ref.ClusName.length; k++) {
				clusterDetails.forEach(function (obj, inx) {
					if (ref.ClusName[k].clusterId == obj.clusterId) {
						ref.clusIconValue.push(obj.clusterIconValue);
						ref.cluBgColor.push(obj.clusterBgColor);
					}
				});
			}
			this.isActive = false;
		}
		else {
			this.whyOccList();
		}
		this.utils.hideLoading();
	}

	/** Code commented starts why and whtnot */
	callOccDetail(occID, occName, clusterIcon, clusterColor) {
		if (this.indexOccId.length < 2 || (this.indexOccId.length == 2
			&& this.indexOccId.indexOf(occID) != -1)) {
			this.utils.sessionStorageSet("compareFirst", "false");
			let twoDigit = occID.toString().substr(0, 2);
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
			this.router.navigate(['../occCluster'], {
				relativeTo: this.activatedRoute,
				queryParams: { clusId: clusterId, clusName: ClusterName, clusIcon: clusterIcon, clusColor: clusterColor }
			});
		}
	}


	clusterListFun(hide) {
		if (hide == 'cluster' && (this.showBtn != 1)) {
			this.showBtn = 1;
			this.titlehide = true;
			this.clusterhide = false;
			this.isActiveprime = true;
		}
		else if (hide == 'title' && (this.showBtn != 0)) {
			this.showBtn = 0;
			this.titlehide = false;
			this.clusterhide = true;
			this.isActiveprime = false;
		}
	}
	getOccListData(resData) {
		this.alphaStyle = this.utils.sessionStorageGet("module");
		if (resData.length == 0 && this.why == 'true') {
			resData = JSON.parse(this.utils.sessionStorageGet("OccList"))
		}

		let commonClusterIds = [];
		this.occListData = [];
		this.ClusName = [];

		this.clusIconValue = [];
		this.cluBgColor = [];
		this.occListData = resData;
		this.titlelist = [];
		if (this.utils.sessionStorageGet("module") == "ip") {
			this.why = 'false';
			this.whynot = 'false';


			let ref = this;

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
			this.occIdValues = [];

			/**Hear we get the data from the server for pageCluster */
			this.apiJson1.method = 'GET';
			this.apiJson1.sessionID = this.utils.getAuthKey();
			this.apiJson1.moduleName = 'Occ/v1/';
			this.apiJson1.endUrl = 'pages';
			this.apiJson1.data = JSON.stringify(indexlistInfo);
			this.serverApi.callApi([this.apiJson1]).subscribe((res) => {
				let titlesValues = [];
				if (res[0].Success + '' == 'true') {
					for (let j = 0; j < res[0].Result.occs.length; j++) {
						this.occIdValues.push(
							res[0].Result.occs[j]
						);
					}
					for (let j = 0; j < res[0].Result.emerging.length; j++) {
						this.occIdValues.push(
							res[0].Result.emerging[j]);
					}
					this.occClusValues = res[0].Result.clusters;
					if (this.occIdValues.length != 0) {
						for (let j = 0; j < this.occIdValues.length; j++) {
							for (let i = 0; i < this.occListData.length; i++) {
								if (this.occIdValues[j].occID == this.occListData[i].occID) {
									commonClusterIds.push(this.occIdValues[j]);
									this.titlelist.push(this.occIdValues[j]);
								}
							}
						}
						this.titlesum = 20;
						for (let i = 0; i < this.occClusValues.length; i++) {
							let titles = [];
							let j = 0;
							for (j = 0; j < commonClusterIds.length; j++) {
								if (commonClusterIds[j].clusterID == this.occClusValues[i].clusterID) {
									titles.push(commonClusterIds[j]);
									titlesValues.push(commonClusterIds[j]);
								}
							}
							if (titles.length != 0) {

								ref.ClusName.push({
									clusterId: this.occClusValues[i].clusterID,
									clusterName: this.occClusValues[i].title,
									clusterRating: this.occClusValues[i].rating,
									clusterTitle: titles
								})
							}
						}
					}
				}
				for (let k = 0; k < ref.ClusName.length; k++) {
					clusterDetails.forEach(function (obj, inx) {
						if (ref.ClusName[k].clusterId == obj.clusterId) {
							ref.clusIconValue.push(obj.clusterIconValue);
							ref.cluBgColor.push(obj.clusterBgColor);
						}
					});
				}
				setTimeout(function () {
					//    this.search = " ";
					this.search = { text: ' ', rating: [], wages: [], edu: [] };
					setTimeout(function () {
						this.search = { text: '', rating: [], wages: [], edu: [] };
						this.utils.hideLoading();
					}.bind(this), 1300);
				}.bind(this), 700);

			}, this.utils.handleError);
		}
		if (this.alphaStyle == "os") {
			this.ClusName = JSON.parse(this.utils.sessionStorageGet("yOccListclus"));
			this.titlelist = JSON.parse(this.utils.sessionStorageGet("yOccListtitle"));
			let ref = this;
			for (let k = 0; k < ref.ClusName.length; k++) {
				clusterDetails.forEach(function (obj, inx) {
					if (ref.ClusName[k].clusterId == obj.clusterId) {
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
				this.myFunction(name);
			}
			else {
				this.indexOccId.splice(inx1, 1);
				this.indexTitleName.splice(inx1, 1);
			}
		}
	}

	occListClick(occId, occName, name) {
		if (this.indexOccId.length < 2 || (this.indexOccId.length == 2
			&& this.indexOccId.indexOf(occId) != -1)) {
			this.utils.sessionStorageSet("returnName", name);
			this.router.navigate(['../comparison'], {
				relativeTo: this.activatedRoute,
				queryParams: {
					occIdValue: occId,
					occupationName: occName
				}
			});
		}
	}

	whyOccList() {
		this.clusIconValue = [];
		this.cluBgColor = [];

		this.ClusName = [];
		this.titlelist = [];
		this.compareImg = false;
		this.utils.sessionStorageSet("checkNotOccList", "false");
		this.whynot = 'false';
		this.why = 'true';
		this.show = 1;

		if (this.utils.sessionStorageGet("module") == "os") {
			if (JSON.parse(this.utils.sessionStorageGet("OccList")).length != 0) {
				this.hidenav = false;
				this.imghide = true;
				this.ClusName = JSON.parse(this.utils.sessionStorageGet("yOccListclus"));
				this.titlelist = JSON.parse(this.utils.sessionStorageGet("yOccListtitle"));
				let ref = this;
				for (let k = 0; k < ref.ClusName.length; k++) {
					clusterDetails.forEach(function (obj, inx) {
						if (ref.ClusName[k].clusterId == obj.clusterId) {
							ref.clusIconValue.push(obj.clusterIconValue);
							ref.cluBgColor.push(obj.clusterBgColor);
						}
					});
				}
			}
			else {
				this.utils.hideLoading();
				this.hidenav = true;
				this.imghide = false;
			}
		}
	}

	whyNotOccList() {
		this.ClusName = [];
		this.titlelist = [];
		this.clusIconValue = [];
		this.cluBgColor = [];
		this.utils.sessionStorageSet("checkNotOccList", "true");
		this.why = 'false';
		this.whynot = 'true';
		this.show = 0;
		if (this.utils.sessionStorageGet("module") == "os") {
			if (JSON.parse(this.utils.sessionStorageGet("NotOccList")).length != 0) {
				this.hidenav = false;
				this.imghide = true;
				this.ClusName = JSON.parse(this.utils.sessionStorageGet("ynOccListclus"));
				this.titlelist = JSON.parse(this.utils.sessionStorageGet("ynOccListtitle"));
				let ref = this;
				for (let k = 0; k < ref.ClusName.length; k++) {
					clusterDetails.forEach(function (obj, inx) {
						if (ref.ClusName[k].clusterId == obj.clusterId) {
							ref.clusIconValue.push(obj.clusterIconValue);
							ref.cluBgColor.push(obj.clusterBgColor);
						}
					});
				}

			}
			else {
				this.utils.hideLoading();
				this.hidenav = true;
				this.imghide = false;
			}
		}
	}

	CompareOccupations() {
		try {
			this.utils.showLoading();
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

	/* This method is for filter data when ever user check checkbox like "career interest,educational level,wages" in occupation-list.layout.html */

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
		this.titlesum += 20;
	}
}