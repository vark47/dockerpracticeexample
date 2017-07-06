import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ServerApi } from '../../../shared/app.apicall.service';
import { ApiCallClass } from '../../../shared/apicall.model';
import { Utilities } from '../../../shared/utilities.class';
import { messages } from '../../../shared/messages';
import { Subscription } from "rxjs/Subscription";

import { EventDispatchService } from '../../../shared/event-dispatch.service';

declare var $: any;
@Component({
    selector: 'forgot-username',
    templateUrl: './forgot-username.layout.html',
    styleUrls: ['../login.style.css'],
})
export class UsernameRecoveryComponent implements OnInit {
    //  email: AbstractControl;
    userdata = {
        email: ""
    }
    loginText = {
        "user_rec_heading": "Username Recovery",
        "user_rec_inp_info_text": "If you entered your e-mail address when you created your account, you can have your username e-mailed to that address.",
        "user_rec_btn": "E-mail Username",
        "user_rec_inp_help_text": "If you need help or have questions, please see your teacher, counselor or advisor to get a temporary password. The temporary passwords are set in your school's MCIS site administration database.",

    }
    // data: ApiCallClass;
    public successVal = false;
    errorMessage;
    public errorVal = false;
    subscription = new Subscription;
    section = "UsernameRecovery";
    ForgotUserNameForm: FormGroup;
    constructor(private router: Router, private server: ServerApi, private eventService: EventDispatchService,
        private apiJson: ApiCallClass, fb: FormBuilder, private utils: Utilities) {
        /*this.ForgotUserNameForm = fb.group({
            'email': ["", Validators.compose([Validators.required, CustomValidations.mailFormat])]

        });*/

        this.errorMessage = messages;
        // this.email = this.ForgotUserNameForm.controls['email'];
        this.subscription = eventService.listen().subscribe((e) => {
            /** After event listen it will check whether user want to save partially or completely */

            if (e.type == "loginTextChanged") {
				/** If user want to save partially, then we call the respective function 
                 * and we are setting true to isAssessment to tell that, we are saving from assessment.
                */
                this.updateLoginText();
            }

        });
    }

    ngOnInit() {
        this.updateLoginText();
        this.ForgotUserNameForm = new FormGroup({
            EmailAddress: new FormControl()
        });
        // $('input[name=EmailAddress]').focus();
    }

    updateLoginText() {
        let tmptext = this.utils.sessionStorageGet('loginText');
        if (tmptext != undefined && tmptext != null && tmptext + '' !== '[object Object]') {
            this.loginText = JSON.parse(tmptext);
        }
    }

    resetUsername() {
        try {
            this.utils.showLoading();
            this.apiJson.method = "GET";
            // let urlObj = this.shared.getUrlObject(this.section);
            this.apiJson.endUrl = 'UsernameRecovery';//urlObj.endUrl;

            let user = JSON.stringify(this.userdata);
            this.apiJson.data = user;
            this.apiJson.moduleName = "login";
            this.server.callAuthApi([this.apiJson]).subscribe(resp => {
                if (resp[0].Result + "" == "true") {
                    // this.router.navigate(['./plpcontent']);
                    this.utils.hideLoading();
                    this.successVal = true;
                }
                else {
                    //alert("coming in else");
                    this.utils.hideLoading();
                    this.errorVal = true;
                    setTimeout(function () {
                        this.errorVal = false;
                        // console.log(this.edited);
                    }.bind(this), 5000);
                }
            }, this.utils.handleError);

        }
        catch (e) {
            alert("resetUsername exception:" + e.message);
        }
    }
}
