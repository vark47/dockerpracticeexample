import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { Utilities } from '../../../../shared/utilities.class';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { clusterDetails } from '../../../assessments/shared/constants/assessments-constants';


declare var $: any;
@Component({
  selector: 'related-careers',
  templateUrl: './related-careers-layout.html',
})

export class RelatedCareersComponent implements OnInit {
  @Input() relResult = [];
  @Output() changeViewRelate = new EventEmitter();
  utilities;
  relCareerDesc1;
  relCareerDesc2;
  relCareerDesc3;
  introRelated;
  ClusterIcon;
  ClusterColor;
  ClusterName;
  JobParagraph = [];
  constructor(private router: Router, private utils: Utilities, private activatedRoute: ActivatedRoute,
    private apiJson: ApiCallClass,
    private el: ElementRef, private serverApi: ServerApi) {
    this.utilities = utils;
  }
  ngOnInit() {
  }
  relatedCareerStart() {
    this.introRelated = this.relResult[1].sectionResults.intro;
    let lengthRelated = this.relResult[1].sectionResults.lists.length;
    if (this.relResult[1].sectionResults.lists[0].header == "Careers") {
      this.relCareerDesc1 = (this.relResult[1].sectionResults.lists[0].links);
      // alert("careers----->"+JSON.stringify(this.relCareerDesc1));
    }
    if (this.relResult[1].sectionResults.lists[1].header == "Career Cluster") {
      this.relCareerDesc2 = (this.relResult[1].sectionResults.lists[1].links);
      let ref = this;
      clusterDetails.forEach(function (obj, inx) {
        if (ref.relCareerDesc2[0].linkTitle == obj.clusterName) {
          ref.ClusterIcon = obj.clusterIconValue;
          ref.ClusterColor = obj.clusterBgColor;
          ref.ClusterName=obj.clusterName;
        }
      });
    }
    if (this.relResult[1].sectionResults.lists[2].header == "Military Careers") {
      this.relCareerDesc3 = (this.relResult[1].sectionResults.lists[2].links);
    }
    this.JobParagraph = this.relResult[0].sectionResults;
    // alert(JSON.stringify(this.relResult[1].sectionResults));
  }

  CallOccDetailCareer(id, name) {
    let twoDigit = id.toString().substr(0, 2);
    if (twoDigit == 14) {
      this.router.navigate(['../occEmergCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name,clusIcon: this.ClusterIcon, clusColor: this.ClusterColor } });
    }
    else {
      let occArray = [id, name]
      // this.changeViewRelate.emit(occArray)
      this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name } });
    }

  }

  CallOccDetailCluster(clusId, ClusName) {
    this.utils.showLoading();
    let clusterIcon = [];
    let clusterColor = [];
    clusterDetails.forEach(function (obj, inx) {
      if (ClusName == obj.clusterName) {
        clusterIcon.push(obj.clusterIconValue);
        clusterColor.push(obj.clusterBgColor);
      }
    });
    // let clusterIcon =this.utils.sessionStorageGet("clusterIcon");
    //alert(clusId+"---"+ClusName+"---"+clusterIcon+"-----"+clusterColor);
    this.router.navigate(['../occCluster'], {
      relativeTo: this.activatedRoute,
      queryParams: { clusId: clusId, clusName: ClusName, clusIcon: clusterIcon, clusColor: clusterColor }
    });
  }
}