import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { Utilities } from '../../../../shared/utilities.class';
import { ServerApi } from '../../../../shared/app.apicall.service';

declare var $: any;
@Component({
  selector: 'related-careers-cluster',
  templateUrl: './related-careers-layout.html',
})

export class RelatedCareerClusterComponent implements OnInit {
  @Input('relatedcareersData') relatedcareersData = {};
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.relatedcareersData['RelatedCareers'] = { 'lists': [] };
  }
  ngOnInit() {
  }

  CallOccDetailCareer(id, name) {
    let twoDigit = id.toString().substr(0, 2);
    // alert("twoDigit---->"+twoDigit);
    if (twoDigit == 14) {
      
       // alert( "icon------>"+this.relatedcareersData['clusterIcon']+"--cluster----"+this.relatedcareersData['clusterColor']);
      this.router.navigate(['../occEmergCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name,clusIcon: this.relatedcareersData['clusterIcon'], clusColor: this.relatedcareersData['clusterColor'] } });
      //  this.router.navigateByUrl("../occEmergCareer"), { relativeTo: this.activatedRoute,queryParams: { occid: id , occname:name}};
      // this.router.navigate(['../occEmergCareer'], { relativeTo: this.activatedRoute,queryParams: { occid: id , occname:name}});
    }
    else {
      this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name } });
    }
  }
}

