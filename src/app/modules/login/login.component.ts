import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ServerApi } from '../../shared/app.apicall.service';
import { ApiCallClass } from '../../shared/apicall.model';
import { Utilities } from '../../shared/utilities.class';

import { EventDispatchService } from '../../shared/event-dispatch.service';

@Component({
    selector: 'login-element',
    templateUrl: './login.layout.html',
    styleUrls: ['./login.style.css'],
})
export class LoginComponent implements OnInit {

    loginText = {
        title: "Personal Learning Plan",
        subtitle: "The Personal Learning Plan is a tool that can help you set goals and make plans.",
        login_footer_image: "",
        login_footer_title: "Minnesota Career Information System",
        login_footer_subtitle: "1971-2016 University of Oregon. All rights reserved. Created by intoCareers, a unit of the University of Oregon."

    }

    // data: ApiCallClass;
    constructor(private router: Router, private eventService: EventDispatchService, private loginauth: ServerApi, private apiJson: ApiCallClass, private utils: Utilities) {

    }
    ngOnInit() {
        this.utils.hideLoading();
        let tmptext = this.utils.sessionStorageGet('loginText');
        if (tmptext != undefined && tmptext != null && tmptext + '' !== '[object Object]') {
            this.loginText = JSON.parse(tmptext);
        }
        this.getLoginText();
    }

    getLoginText() {
        try {
            //this.apiJson.method = "GET";
            this.apiJson.endUrl = "loginText";
            //this.apiJson.moduleName = "login";
            //let user = JSON.stringify(this.userdata);
            //this.apiJson.data = user;
            this.loginauth.callLogin(this.apiJson).subscribe(resp => {
                // alert("user logged in:" + JSON.stringify(resp));
                this.loginText = resp.Result.data;
                this.utils.sessionStorageSet('loginText', JSON.stringify(resp.Result.data));
                let evnt = document.createEvent("CustomEvent");
                evnt.initEvent("loginTextChanged", true, true);
                this.eventService.dispatch(evnt);
            });
        } catch (e) {
            console.log('getLoginText exception:' + e.message);
        }
    }

}
