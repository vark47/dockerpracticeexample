import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ApiCallClass } from '../../../../shared/apicall.model';
import { GraduationRequirementsModel } from './graduation-requirements.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';

@Component({
  selector: 'graduation-requirements',
  templateUrl: './graduation-requirements.layout.html',

})

export class GraduationRequirementsComponent {
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();

  graduationRequirementsData = new GraduationRequirementsModel();
  sectionObject;
  questionObject;
  endurl;
  section = "GraduationRequirements";


  constructor(private plpShared: PLPSharedService, private utils: Utilities, private serverApi: ServerApi, private apiJson: ApiCallClass) {
  }

  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.questionObject = this.plpShared.getQuestion(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.getGraduationRequirementsData();
  }

  getGraduationRequirementsData() {
    let data = {
      accountID: this.utils.getAccountId()
    }
    this.apiJson.method = "GET";
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    this.apiJson.moduleName = "PLP";
    this.apiJson.sessionID = this.utils.getAuthKey();
    let dat = JSON.stringify(data);

    this.apiJson.data = dat;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      this.graduationRequirementsData = response[0].Result;

      // if (response[0].Result != null) {
      //   this.containResult.emit({ "section": this.section, result: "filled" });
      // }
      // else {
      //   this.containResult.emit({ "section": this.section, result: "empty" });
      // }
      this.utils.hideLoading();
    }, this.utils.handleError);
  }

  postGraduationRequirementsData() {

  }

//   changeView(evnt) {
//  //   this.changeInrView.emit(evnt);
//   if(evnt.result == "filled"){
//             this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
//         }
//         else if(evnt.result == "empty"){
//             this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
       
//  }
//   }

}
