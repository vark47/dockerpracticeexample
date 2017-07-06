import { Component, OnInit, ViewChild, ElementRef, Renderer, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { Utilities } from '../../../../shared/utilities.class';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { AtAGlanceClusterComponent } from '../../occ-clusters/at-a-glance/at-a-glance.component';


declare var $: any;
@Component({
  selector: 'wages',
  templateUrl: './wages-layout.html',
})

export class WagesComponent implements OnInit {
  @Input() wageResult = [];
  @Input() wageStates = [];
  @Input() wageoccIDVal;
  browserDom: BrowserDomAdapter;
  utilities;
  emp_location = [];
  wageDate = [];
  wageHeaders = [];
  waveValue = ["tab-1", "tab-2", "tab-3"];
  wageDataVal = [];
  wageLabel = [];
  states = [];
  cities = [];
  uniqueStates = [];
  selectedStates = ["United States"];
  paraname = [];
  displayValue = 1;
  length = false;
  stateIntro;
  stateValuesCheck = [];
  check_checkBox = false;
  userSelectedStates = [];
  iconHide = [];
  stateval = [];
  showValue = 2;
  inxValue = -1;
  inx1Value = -1;
  notesdata = [];
  heightDiv = "190px";
  downTrue = false;
  buttonColor = true;
  loc_btn_color = ["#a22903", "#005787", "#1b621e", "#014941", "#770c84"];
  constructor(private router: Router, private utils: Utilities, private apiJson: ApiCallClass,
    private el: ElementRef, private renderer: Renderer, private serverApi: ServerApi) {
    this.utilities = utils;
    this.browserDom = new BrowserDomAdapter();
  }
  ngOnInit() {
    // this.browserDom.setStyle(this.browserDom.query('.tabs'), "min-height", this.heightDiv);
  }
  wagesStart() {
    this.stateIntro = this.wageStates[0].intro
    for (let i = 0; i < this.wageStates[0].states.length; i++) {
      let val = false;
      if (this.wageStates[0].states[i].name == "United States") {
        val = true;
      }
      this.uniqueStates.push({
        checkedVal: val, stateNam: this.wageStates[0].states[i].name,
        stateAbb: this.wageStates[0].states[i].abbr
      });
      this.stateval.push({ checkedVal: val, stateNam: this.wageStates[0].states[i].name });
    }
    for (let i1 = 0; i1 < this.wageResult[0].sectionResults.length; i1++) {
      this.emp_location.push(this.wageResult[0].sectionResults[i1]);
    }
    this.paraname = this.wageResult[1].sectionResults;
    for (let j = 0; j < this.wageResult[2].sectionResults.headers.length; j++) {
      this.wageHeaders.push(this.wageResult[2].sectionResults.headers[j].header);
    }
    for (let i1 = 0; i1 < this.wageResult[2].sectionResults.periods.length; i1++) {
      if (this.wageResult[2].sectionResults.periods[i1].period == "annual") {
        this.wageDate.push(this.wageHeaders[0]);
        this.wageDataVal.push("Annual Wages");
        this.length = true;
        this.hourlyWages(this.wageResult[2].sectionResults.periods[i1].wages, "annual");
      }
      else if (this.wageResult[2].sectionResults.periods[i1].period == "monthly") {
        this.wageDate.push(this.wageHeaders[1]);
        this.wageDataVal.push("Monthly Wages");
        this.length = true;
        this.hourlyWages(this.wageResult[2].sectionResults.periods[i1].wages, "monthly");
      }
      else if (this.wageResult[2].sectionResults.periods[i1].period == "hourly") {
        this.wageDate.push(this.wageHeaders[2]);
        this.wageDataVal.push("Hourly Wages");
        this.length = true;
        this.hourlyWages(this.wageResult[2].sectionResults.periods[i1].wages, "hourly");
      }
    }
    for (let i1 = 0; i1 < this.wageResult[2].sectionResults.notes.length; i1++) {

      this.notesdata = this.wageResult[2].sectionResults.notes;

    }
    let ref = this;
    // window.onresize = function () {
    //   // if (ref.userSelectedStates.length != 0){
    //   // console.log("on resize")
    //   ref.heightCalculation(ref.showValue, "waveTab");
    //   // }
    // }
    this.utils.hideLoading();
  }

  checkopen() {
    this.stateValuesCheck = [];
    this.displayValue = 0;
    for (let i = 0; i < this.uniqueStates.length; i++) {
      let Selectedvalue = true;
      for (let j = 0; j < this.selectedStates.length; j++) {
        if (this.selectedStates[j] == this.uniqueStates[i].stateNam) {
          this.stateValuesCheck.push(true);
          this.uniqueStates[i].checkedVal = true;
          this.stateval[i].checkedVal = true;
          this.displayValue++;
          Selectedvalue = false;
        }
      }
      if (Selectedvalue == true) {
        this.stateValuesCheck.push(false);
        this.uniqueStates[i].checkedVal = false;
        this.stateval[i].checkedVal = false;

      }
    }
    // for(let i=0;i<)
    // alert("uniqueStates-->" + (this.userSelectedStates));

  }
  showStates() {
    this.states = [];
    this.wageLabel = [];
    this.cities = [];
    this.userSelectedStates = [];
    this.selectedStates = [];
    this.iconHide = [];
    this.wageDate = [];
    this.wageDataVal = [];
    let isAvailable = false;
    for (let i = 0; i < this.uniqueStates.length; i++) {
      if (this.uniqueStates[i].checkedVal == true)
        this.userSelectedStates.push(this.uniqueStates[i].stateAbb);
    }
    // alert((this.userSelectedStates.length !=0)+"userSelectedStates--->" + this.userSelectedStates);
    if (this.userSelectedStates.length != 0) {
      this.length = true;
      this.utils.showLoading();
      this.apiJson.method = "GET";
      this.apiJson.sessionID = this.utils.getAuthKey();
      this.apiJson.moduleName = "Occ/v1/";

      let Glancedata = {};

      Glancedata = {
        input_data: [
          {
            "param_type": "path",
            "params": ["occ", this.wageoccIDVal, this.utils.getAccountId()]
          },
          {
            "param_type": "query",
            "params": { "sections": "WageLevels", "states": this.userSelectedStates, "lang": "en", "stateAbbr": "IC" }
          },
          {
            "param_type": "body",
            "params": {

            }
          }
        ]
      }
      let user = JSON.stringify(Glancedata);
      this.apiJson.endUrl = "pages";

      this.apiJson.data = user;
      // alert("before api result");      
      this.serverApi.callApi([this.apiJson]).subscribe((res) => {
        // alert("res[0].Success before");
        if (res[0].Success + "" == "true") {
          // alert("in true");
          // console.log("res[0].Result[0]-->" + res[0].Result[0]);
          // alert("after console");
          for (let i1 = 0; i1 < res[0].Result[0].sectionResults.periods.length; i1++) {
            if (res[0].Result[0].sectionResults.periods[i1].period == "annual") {
              // if (this.wageDate.indexOf(this.wageHeaders[0]) == -1) {
              this.wageDate.push(this.wageHeaders[0]);
              this.wageDataVal.push("Annual Wages");

              // }
              this.hourlyWages(res[0].Result[0].sectionResults.periods[i1].wages, "annual");
            }
            else if (res[0].Result[0].sectionResults.periods[i1].period == "monthly") {
              // if (this.wageDate.indexOf(this.wageHeaders[1]) == -1) {
              this.wageDate.push(this.wageHeaders[1]);
              this.wageDataVal.push("Monthly Wages");
              // }
              this.hourlyWages(res[0].Result[0].sectionResults.periods[i1].wages, "monthly");
            }
            else if (res[0].Result[0].sectionResults.periods[i1].period == "hourly") {
              // if (this.wageDate.indexOf(this.wageHeaders[2]) == -1) {
              this.wageDate.push(this.wageHeaders[2]);
              this.wageDataVal.push("Hourly Wages");
              // }
              this.hourlyWages(res[0].Result[0].sectionResults.periods[i1].wages, "hourly");
            }
          }
          for (let i1 = 0; i1 < res[0].Result[0].sectionResults.notes.length; i1++) {

            this.notesdata = res[0].Result[0].sectionResults.notes;

          }

          this.selectedStates = [];
          let isAvailable = false;
          for (let i = 0; i < this.uniqueStates.length; i++) {
            if (this.uniqueStates[i].checkedVal) {
              for (let j = 0; j < this.selectedStates.length; j++) {
                if (this.selectedStates[j] == this.uniqueStates[i].stateNam) {
                  isAvailable = true;
                  break;
                }
                else {
                  isAvailable = false;
                }
              }
              if (isAvailable == false) {
                this.selectedStates.push(this.uniqueStates[i].stateNam);
                isAvailable = true;
              }
            }
          }
          // this.utils.hideLoading();

        } else {
          console.log("error occured");
        }
        // alert("wageDataVal length----"+this.wageDataVal.length)
        let ref = this;
        this.utils.hideLoading();
      }, this.utilities.handleError);
    }
    else {
      this.length = false;
      // this.utils.hideLoading();
      this.browserDom.setStyle(this.browserDom.query('.tabs'), "min-height", '0px');
    }
  }
  value(key, key1, key3, checkVal) {
    // alert("checkVal==" + checkVal);
    if (checkVal == 'ref') {
      return '#' + this.wageLabel[key][key1].valueKey + key3;
    }
    else if (checkVal == 'controls') {
      return this.wageLabel[key][key1].valueKey + key3;
    }
    else if (key == -1 && key1 == -1 && key3 == -1) {
      return '#' + checkVal;
    }
  }

  count(val, e) {
    if ((e.keyCode == 13) || (e == "click")) {
      console.log("in if");
      let isAvailable;
      for (let k = 0; k < this.stateval.length; k++) {
        isAvailable = false;
        if (this.stateval[k].stateNam == val) {
          if (this.stateval[k].checkedVal == true) {
            this.stateval[k].checkedVal = false;
            this.uniqueStates[k].checkedVal = false;
            isAvailable = false;

          }
          else {
            this.stateval[k].checkedVal = true;
            this.uniqueStates[k].checkedVal = true;
            isAvailable = true;
          }
          break;
        }
      }
      if (isAvailable == true) {
        this.displayValue = this.displayValue + 1;

      }
      else {
        this.displayValue = this.displayValue - 1;
      }
    }
  }
  hourlyWages(hourlyWagesResult, name) {
    // console.log(name + "hourlyWagesResult--->" + JSON.stringify(hourlyWagesResult))
    try {
      let hourLength = [];
      let state = [];
      let lengthVal = false;
      let wageannual = [];
      for (let i = 0; i < hourlyWagesResult.length; i++) {
        // alert(hourlyWagesResult.length)
        let cityLength = [];
        let stateLength = [];
        let city = [];
        let valueKey = name + "" + i;
        let labelVal = hourlyWagesResult[i].label;
        hourLength.push({ labelVal, valueKey });
        // alert(JSON.stringify(hourlyWagesResult[i].locations))
        // alert("hourlyWagesResult[i].locations.length-->" + hourlyWagesResult[i].locations.length);
        for (let j = 0; j < hourlyWagesResult[i].locations.length; j++) {
          // alert(hourlyWagesResult[i].locations[j].isRegion);
          if (hourlyWagesResult[i].locations[j].isRegion == false) {
            lengthVal = false;
            // alert(hourlyWagesResult[i].locations[j]);
            stateLength.push(hourlyWagesResult[i].locations[j]);
            if (cityLength.length != 0) {
              this.iconHide.push(false);
              city.push(cityLength);
              cityLength = [];
            }
            else if (j != 0 && j != (hourlyWagesResult[i].locations.length - 1)) {

              this.iconHide.push(true);
              city.push([]);
            }
          }
          else if (hourlyWagesResult[i].locations[j].isRegion == true) {
            lengthVal = true;

            cityLength.push(hourlyWagesResult[i].locations[j]);
          }
        }
        if (cityLength.length != 0) {
          this.iconHide.push(false);
          city.push(cityLength);
          cityLength = [];
        }
        // alert(lengthVal)
        // console.log("city---" + city + "stateLength---" + stateLength + "cityLength---" + cityLength)
        if (lengthVal == false) {
          this.iconHide.push(true);
          city.push([]);
        }
        // alert(this.iconHide + "state----wageannual----")
        state.push(stateLength);
        wageannual.push(city)
      }
      this.wageLabel.push(hourLength);
      this.states.push(state);
      this.cities.push(wageannual);
    }
    catch (e) {
      console.log(e.message);
    }
    // console.log("cities--->" + JSON.stringify(this.cities) + "---states-->" + JSON.stringify(this.states));
  }
  resetStates() {

    for (let i = 0; i < this.uniqueStates.length; i++) {

      this.uniqueStates[i].checkedVal = false;

      this.stateval[i].checkedVal = false;

      this.displayValue = 0;

    }

  }


}