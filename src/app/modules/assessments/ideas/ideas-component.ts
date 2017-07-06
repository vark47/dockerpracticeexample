import {Component,OnInit} from '@angular/core';
import {RouterModule, Router} from '@angular/router';

@Component({
	selector: 'ideas',
	template: `
				<assessment-header ></assessment-header>`,
})

export class IdeasComponent implements OnInit {
	asmnt_object;
	constructor(){
		document.title = 'IDEAS';
	}

	ngOnInit(){
		this.asmnt_object={
			"title":"IDEAS",
			"btn_class":"green-btn-plp2"
		}
	}
 }