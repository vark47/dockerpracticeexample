import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { Observable } from 'rxjs/Observable';
import { Utilities } from '../../../../shared/utilities.class';
import { ServerApi } from '../../../../shared/app.apicall.service';

declare var $: any;
@Component({
  selector: 'at-a-glance-cluster',
  templateUrl: './at-a-glance-layout.html',
})

export class AtAGlanceClusterComponent implements OnInit {
  @Input() atAGlance = [];
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
   
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
}

