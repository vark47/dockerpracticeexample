import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'enterpreneur_quiz',
	template: `<assessment-header ></assessment-header>`,
})

export class EnterpreneurQuizComponent implements OnInit {

	asmnt_object;
	constructor(private router: Router) {
		document.title = 'Entrepreneurs Assessment';
	}

	ngOnInit() {
		this.asmnt_object = {
			"title": "Entrepreneurial Career Assessment ",
			"btn_class": "green-btn-plp2"
		}
	}
}
