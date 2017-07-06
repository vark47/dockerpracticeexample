import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Utilities } from '../../shared/utilities.class';

@Component({
    selector: 'occ-detail',
    templateUrl: './occ-details-layout.html'
})
export class OccDetailsComponent implements OnInit {

    // data: ApiCallClass;
    constructor(private router: Router, private utils: Utilities) {

    }
    ngOnInit() {
        this.utils.hideLoading();
    }


}
