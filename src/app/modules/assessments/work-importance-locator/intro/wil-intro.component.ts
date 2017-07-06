/** Angualr2 Libaries **/ 
import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router'

/** Services**/
import { Utilities } from '../../../../shared/utilities.class';


@Component({
	selector: 'wil-intro',
	templateUrl: './wil-intro.layout.html',
})
export class WILIntroComponent {
	eqQuestions;
	constructor(private http: Http, private router: Router,private activeRoute: ActivatedRoute) {
		
	}


    ngOnInit() {
		//this.utils.showLoading();
		
    }

	StartAssessment() {
			this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
	}
}
