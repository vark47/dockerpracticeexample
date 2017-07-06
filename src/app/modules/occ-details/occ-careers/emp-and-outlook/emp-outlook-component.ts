import { Component, OnInit, ViewChild, ElementRef, Renderer, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { Utilities } from '../../../../shared/utilities.class';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';


declare var $: any;
@Component({
  selector: 'emp-and-outlook',
  templateUrl: './emp-outlook-layout.html',
})

export class EmpOutlookComponent implements OnInit {
  @Input() empResult = [];
  @Input() empStates = [];
  @Input() occIDVal;
  utilities;
  emp_location = [];
  emp_outlook;
  state = [];
  opp_Rating = [];
  growthtrating = [];
  currentrating = [];
  displayValue = 1;
  military_outlook = [];
  userSelectedStates = [];
  currentValue = -1;
  chartValue = -1;
  stateIntro = "";
  stateval = [];
  empuniqueStates = [];
  empstateValuesCheck = [];
  empselectedStates = [];
  loc_btn_color = ["#a22903", "#005787", "#1b621e", "#014941", "#770c84"];
  empbuttonColor = true;
  constructor(private router: Router, private utils: Utilities, private apiJson: ApiCallClass,
    private el: ElementRef, private renderer: Renderer, private serverApi: ServerApi) {
    this.utilities = utils;
  }
  ngOnInit() {
  }
  emp_outlookStart() {
    this.stateIntro = this.empStates[0].intro
    for (let i = 0; i < this.empStates[0].states.length; i++) {
      let val = false;
      if (this.empStates[0].states[i].name == "United States") {
        val = true;
      }
      this.empuniqueStates.push({
        checkedVal: val, stateNam: this.empStates[0].states[i].name,
        stateAbb: this.empStates[0].states[i].abbr
      });
      this.stateval.push({
        checkedVal: val, stateNam: this.empStates[0].states[i].name,
        stateAbb: this.empStates[0].states[i].abbr
      });
    }
    for (let i1 = 0; i1 < this.empResult[0].sectionResults.length; i1++) {
      this.military_outlook.push(this.empResult[0].sectionResults[i1]);
    }
    this.emp_outlook = (this.empResult[1].sectionResults);
    for (let i1 = 0; i1 < this.empResult[2].sectionResults.states.length; i1++) {
      this.state.push(this.empResult[2].sectionResults.states[i1].state);
      this.currentrating.push(this.empResult[2].sectionResults.states[i1].ratings[0]);
      this.growthtrating.push(this.empResult[2].sectionResults.states[i1].ratings[1]);
      this.opp_Rating.push(this.empResult[2].sectionResults.states[i1].ratings[2]);
      if (this.currentrating[i1].rating == "Very Large") {
        this.currentValue = 4;
      }
      else if (this.currentrating[i1].rating == "Large") {
        this.currentValue = 3;
      }
      else if (this.currentrating[i1].rating == "Medium") {
        this.currentValue = 2;
      }
      else if (this.currentrating[i1].rating == "Small") {
        this.currentValue = 1;
      }
      else if (this.currentrating[i1].rating == "Very Small") {
        this.currentValue = 0;
      }
      if (this.opp_Rating[i1].rating == "Above Average") {
        this.chartValue = 2;
      }
      else if (this.opp_Rating[i1].rating == "Average") {
        this.chartValue = 1;
      }
      else if (this.opp_Rating[i1].rating == "Below Average") {
        this.chartValue = 0;
      }
      for (let k = 0; k < this.empuniqueStates.length; k++) {

        if (this.empResult[2].sectionResults.states[i1].state == this.empuniqueStates[k].stateNam) {
         // if (this.empuniqueStates[k].stateNam == "United States") {
            this.empselectedStates.push({ checkedVal: true, stateNam: this.empuniqueStates[k].stateNam });

         // }
          //else {
         //   this.empselectedStates.push({ checkedVal: false, stateNam: this.empuniqueStates[k].stateNam });

         // }
        }
      }
    }
    for (let i1 = 0; i1 < this.empResult[3].sectionResults.length; i1++) {
      this.emp_location.push(this.empResult[3].sectionResults[i1]);
    }
  }
  checkopen() {
    this.displayValue = 0;
    for (let j = 0; j < this.stateval.length; j++) {
      this.stateval[j].checkedVal = this.empuniqueStates[j].checkedVal;
      if (this.empuniqueStates[j].checkedVal == true) {
        this.displayValue++;
      }
    }
  }
  showStates() {
    this.userSelectedStates = [];
    for (let j = 0; j < this.stateval.length; j++) {
      if (this.stateval[j].checkedVal == true) {
        this.userSelectedStates.push(this.stateval[j].stateAbb);
      }
    }


    if (this.userSelectedStates.length != 0) {
    this.state = [];
    this.opp_Rating = [];
    this.growthtrating = [];
    this.currentrating = [];
    this.emp_location = [];
    this.empselectedStates = [];
    this.military_outlook = [];
      this.utils.showLoading();
      this.apiJson.method = "GET";
      this.apiJson.sessionID = this.utils.getAuthKey();
      this.apiJson.moduleName = "Occ/v1/";

      let Glancedata = {};

      Glancedata = {
        input_data: [
          {
            "param_type": "path",
            "params": ["occ", this.occIDVal, this.utils.getAccountId()]
          },
          {
            "param_type": "query",
            "params": { "sections": "MajorEmployers,OutlookInfo,OutlookRatings,TopOpeningLocations", "states": this.userSelectedStates, "lang": "en", "stateAbbr": "IC" }
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
      this.serverApi.callApi([this.apiJson]).subscribe((res) => {
        if (res[0].Success + "" == "true") {
          // console.log("empoutlook--->" + JSON.stringify(res[0].Result));


          for (let i1 = 0; i1 < res[0].Result[0].sectionResults.length; i1++) {
            this.military_outlook.push(res[0].Result[0].sectionResults[i1]);
          }
          this.emp_outlook = (res[0].Result[1].sectionResults);
          console.log("len-->" + res[0].Result[2].sectionResults.states.length)
          for (let i1 = 0; i1 < res[0].Result[2].sectionResults.states.length; i1++) {
            this.state.push(res[0].Result[2].sectionResults.states[i1].state);
            this.currentrating.push(res[0].Result[2].sectionResults.states[i1].ratings[0]);
            this.growthtrating.push(res[0].Result[2].sectionResults.states[i1].ratings[1]);
            this.opp_Rating.push(res[0].Result[2].sectionResults.states[i1].ratings[2]);
            if (this.currentrating[i1].rating == "Very Large") {
              this.currentValue = 4;
            }
            else if (this.currentrating[i1].rating == "Large") {
              this.currentValue = 3;
            }
            else if (this.currentrating[i1].rating == "Medium") {
              this.currentValue = 2;
            }
            else if (this.currentrating[i1].rating == "Small") {
              this.currentValue = 1;
            }
            else if (this.currentrating[i1].rating == "Very Small") {
              this.currentValue = 0;
            }
            if (this.opp_Rating[i1].rating == "Above Average") {
              this.chartValue = 2;
            }
            else if (this.opp_Rating[i1].rating == "Average") {
              this.chartValue = 1;
            }
            else if (this.opp_Rating[i1].rating == "Below Average") {
              this.chartValue = 0;
            }
            for (let k = 0; k < this.empuniqueStates.length; k++) {

              if (res[0].Result[2].sectionResults.states[i1].state == this.empuniqueStates[k].stateNam) {
                // if (this.empuniqueStates[k].stateNam == "United States") {
                //   this.empselectedStates.push({ checkedVal: true, stateNam: this.empuniqueStates[k].stateNam });

                // }
                // else {

                this.empselectedStates.push({ checkedVal: true, stateNam: this.empuniqueStates[k].stateNam });

                // }
              }
              // else{

              // }
            }
          }
          for (let i1 = 0; i1 < res[0].Result[3].sectionResults.length; i1++) {
            this.emp_location.push(res[0].Result[3].sectionResults[i1]);
          }





        } else {
          console.log("error occured");
        }
        // alert("wageDataVal length----"+this.wageDataVal.length)
        // let ref = this;
        // setTimeout(function () {
        //   ref.heightCalculation((ref.wageDataVal.length - 1), "waveTab");

        // }, 500);
        this.utils.hideLoading();

      }, this.utilities.handleError);
    }
    for (let j = 0; j < this.stateval.length; j++) {
      this.empuniqueStates[j].checkedVal = this.stateval[j].checkedVal;
    }
    for (let i = 0; i < this.empselectedStates.length; i++) {
      this.empselectedStates[i].checkedVal = false;
      for (let j = 0; j < this.stateval.length; j++) {
        //this.empuniqueStates[j].checkedVal = this.stateval[j].checkedVal;
        if (this.stateval[j].stateNam == this.empselectedStates[i].stateNam) {
          this.empselectedStates[i].checkedVal = this.stateval[j].checkedVal;

        }
      }
    }

  }
  count(val, e) {
    console.log("this.displayValue--" + this.displayValue);
    if ((e.which == 13 || e == "click") && this.displayValue < 5) {
      let isAvailable;
    for (let k = 0; k < this.stateval.length; k++) {
      isAvailable = false;
      if (this.stateval[k].stateNam == val) {
        if (this.stateval[k].checkedVal == true) {
          this.stateval[k].checkedVal = false;
          isAvailable = false;

       }
        else {
          this.stateval[k].checkedVal = true;
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
  else if (e.which == 13){
    e.preventDefault();
  }
  }
  resetStates() {
    for (let i = 0; i < this.empselectedStates.length; i++) {
      this.empselectedStates[i].checkedVal = false;
      for (let j = 0; j < this.stateval.length; j++) {
        this.empuniqueStates[j].checkedVal = false;
        this.stateval[j].checkedVal = false;
      }
    }
    this.displayValue = 0;
  }
}