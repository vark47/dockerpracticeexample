import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router,ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';

@Component({
	selector: 'cci-jr-assessment',
	templateUrl: './cci-jr-assessment.layout.html',
		styles: [`
  		.class-withOpacityIP {
    	opacity: 0.5;
		cursor: not-allowed;
		position: absolute;
  		}
  	`]
})
export class CCIJrAssessmentComponent {
	isClassVisibleIP = false;
	public max: number = 100;
	btnHighLight = -1;
	constructor(private http: Http, private router: Router,private activeRoute: ActivatedRoute) {
		
	}

    ngOnInit() {
		
    }

	callReult(){
			this.router.navigate(['../result'], { relativeTo: this.activeRoute });
	}
}

