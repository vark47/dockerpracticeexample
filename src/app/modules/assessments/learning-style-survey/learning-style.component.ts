import {Component,OnInit} from '@angular/core';
import {RouterModule, Router} from '@angular/router';

import { TranslateService, TranslatePipe } from 'ng2-translate';
@Component({
	selector: 'lss-start-component',
	template: `<assessment-header ></assessment-header>`,
})

export class LssStartComponent implements OnInit {
	asmnt_object;
	constructor(){
		 
        console.log('LssStartComponent loaded.');
 
		document.title = 'Learning style survey';
	}

	ngOnInit(){
		this.asmnt_object={
			"title":"Learning style survey",
			"btn_class":"green-btn-plp2"
		}
	}
	
 }