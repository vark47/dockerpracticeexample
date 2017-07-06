import { Component, OnInit, Input } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { Utilities } from '../../../../shared/utilities.class';
import { clusterDetails } from '../../../assessments/shared/constants/assessments-constants';


@Component({
  selector: 'related-careers-emerg',
  templateUrl: './related-careers-layout.html',
})

export class RelatedCareersEmergComponent implements OnInit {
  @Input('relatedCareers') relatedCareers = {};

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private utils: Utilities) {
  }
  ngOnInit() {

  }
  CallOccDetailCareer(id, name,clusterIcon,clusterColor) {
    let twoDigit = id.toString().substr(0, 2);
    if (twoDigit == 14) {
      this.router.navigate(['../occEmergCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name,clusIcon: clusterIcon, clusColor: clusterColor } });
    }
    else {
      this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name } });
    }
    //  this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute ,queryParams: { occid: id , occname:name}});
  }

  CallOccDetailCluster(clusId, ClusName) {
    this.utils.showLoading();
    //let clusterIcon =this.utils.sessionStorageGet("clusterIcon");
    let clusterIcon = [];
    let clusterColor = [];
    clusterDetails.forEach(function (obj, inx) {
      if (ClusName == obj.clusterName) {
        clusterIcon.push(obj.clusterIconValue);
        clusterColor.push(obj.clusterBgColor);
      }
    });
    this.router.navigate(['../occCluster'], {
      relativeTo: this.activatedRoute,
      queryParams: { clusId: clusId, clusName: ClusName, clusIcon: clusterIcon, clusColor: clusterColor }
    });
  }


}





