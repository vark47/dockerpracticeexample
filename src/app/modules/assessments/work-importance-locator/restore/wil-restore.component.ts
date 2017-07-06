/** Angualr2 Libaries **/ 
import { Component, OnInit} from '@angular/core';
import { Http, Response } from '@angular/http';
import { RouterModule, Router } from '@angular/router';

@Component({
	selector: 'wil-restore',
	templateUrl: './wil-restore.layout.html',
})
export class WILRestoreComponent {

	constructor(private http: Http, private router: Router) {
		
	}

    ngOnInit() {
    }
}
