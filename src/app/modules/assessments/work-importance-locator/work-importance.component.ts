/** Angualr2 Libaries **/ 
import { Component,OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
	selector: 'wil-start-component',
	template: `
				<assessment-header></assessment-header>`,
})
export class WILStartComponent implements OnInit{
	asmnt_object;
	constructor(private router:Router){
		document.title = 'Work Importance Locator';
	}

	ngOnInit(){
		this.asmnt_object={
			"title":"Work Importance Locator",
			"btn_class":"blue-btn-plp2"
		}
	}
 }
