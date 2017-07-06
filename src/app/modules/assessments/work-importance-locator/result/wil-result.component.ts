/** Angualr2 Libaries **/ 
import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RouterModule, Router } from '@angular/router';

@Component({
	selector: 'wil-result',
	templateUrl: './wil-result.layout.html',
})
export class WILResultComponent {

	constructor(private http: Http, private router: Router) {
			
	}

    ngOnInit() {
		
    }
}
