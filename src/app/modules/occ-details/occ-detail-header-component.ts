import { Component } from '@angular/core';
import { Utilities } from '../../shared/utilities.class';
import { Router } from '@angular/router';
@Component({
  selector: 'occ-detail-static-header',
  template: ` 
`,
})
export class OccDetailStaticHeaderComponent {
  menuState = false;
  filter = { 'hidden': true };
  userName = "";
  constructor(private router: Router, private utils: Utilities) {
    console.log("in OccDetailStaticHeaderComponent constructor");
  }

  ngOnInit() {
    this.userName = this.utils.sessionStorageGet("userName");
  }
  logout() {
    this.utils.mainLogOut();

  }
  menuToggle() {
    this.menuState = !this.menuState;
  }
  menuClose() {
    this.menuState = false;
  }
}
