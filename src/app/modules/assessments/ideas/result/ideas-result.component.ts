import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Http, Response } from '@angular/http';


@Component({
	selector: 'ideas-result',
	templateUrl: './ideas-result.layout.html',
})
export class IdeasResultComponent {

	constructor(private http: Http, private router: Router) {
			
	}

    ngOnInit() {
		
    }
}
