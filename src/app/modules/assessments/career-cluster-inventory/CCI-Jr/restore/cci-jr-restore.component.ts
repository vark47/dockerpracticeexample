import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Http, Response } from '@angular/http';


@Component({
	selector: 'cci-jr-restore',
	templateUrl: './cci-jr-restore.layout.html',
})
export class CCIJrRestoreComponent {

	constructor(private http: Http, private router: Router) {
		
	}

    ngOnInit() {
    }
}
