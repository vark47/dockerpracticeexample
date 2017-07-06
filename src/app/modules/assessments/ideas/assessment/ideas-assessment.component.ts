import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router,ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';

@Component({
	selector: 'ideas-assessment',
	templateUrl: './ideas-assessment.layout.html',
		styles: [`
  		.class-withOpacityIP {
    	opacity: 0.5;
		cursor: not-allowed;
		position: absolute;
  		}
  	`]
})
export class IdeasAssessmentComponent {
	isClassVisibleIP = false;
	public max: number = 100;
	btnHighLight = -1;
	constructor(private http: Http, private router: Router,private activeRoute: ActivatedRoute) {
		
	}

    ngOnInit() {
		
    }

	callResult(){
			this.router.navigate(['../result'], { relativeTo: this.activeRoute });
	}
}

