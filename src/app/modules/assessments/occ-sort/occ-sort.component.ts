import {Component,OnInit} from '@angular/core';
import {RouterModule, Router} from '@angular/router';

@Component({
	selector: 'occ-sort',
	template: `
				<assessment-header ></assessment-header>`,
})

export class OccSortComponent implements OnInit {
	asmnt_object;
	constructor(){
		document.title = 'Occupation Sort';
	}

	ngOnInit(){
		this.asmnt_object={
			"title":"Occupation Sort",
			"btn_class":"green-btn-plp2"
		}
	}
 }
