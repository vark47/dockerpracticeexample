import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router'
import { Http, Response } from '@angular/http';
import { Utilities } from '../../../../../shared/utilities.class';


@Component({
	selector: 'cci-jr-intro',
	templateUrl: './cci-jr-intro.layout.html',
})
export class CCIJrIntroComponent {
	eqQuestions;
	constructor(private http: Http, private router: Router,private utils:Utilities,private activeRoute: ActivatedRoute) {
		
	}


    ngOnInit() {
		//this.utils.showLoading();
		
    }

	StartAssessment() {
		
			this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
	
	}
}
