/** Angular imports */
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'wes-start-component',
	template: `<assessment-header ></assessment-header>`,
})

export class WESStartComponent implements OnInit {
	asmnt_object;

	constructor() {
		document.title = 'Work Employabaility Skills';
	}

	ngOnInit() {
		this.asmnt_object = {
			'title': 'Work Employabaility Skills',
			'btn_class': 'green-btn-plp2'
		};
	}
}
