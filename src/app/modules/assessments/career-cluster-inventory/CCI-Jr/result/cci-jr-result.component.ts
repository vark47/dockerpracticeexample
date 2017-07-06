import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { clusterDetails } from '../../../shared/constants/assessments-constants';


@Component({
	selector: 'cci-jr-result',
	templateUrl: './cci-jr-result.layout.html',
})
export class CCIJrResultComponent {
constantVals=[];
cardboxcolor = ['result-card1-cci-bg-plp4','result-card2-cci-bg-plp4','result-card3-cci-bg-plp4'];
	constructor(private http: Http, private router: Router) {
			
	}

    ngOnInit() {
		this.constantVals = clusterDetails;
    }
}
