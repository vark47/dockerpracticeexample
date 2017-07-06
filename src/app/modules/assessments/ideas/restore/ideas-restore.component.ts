import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Http, Response } from '@angular/http';


@Component({
	selector: 'ideas-restore',
	templateUrl: './ideas-restore.layout.html',
})
export class IdeasRestoreComponent {

	constructor(private http: Http, private router: Router) {
		
	}

    ngOnInit() {
    }
}
