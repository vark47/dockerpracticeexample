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
    selector: 'forgot-psw',
    templateUrl: './forgot-psw.layout.html',
    styleUrls: ['../login.style.css'],
})
export class PasswordRecoveryComponent implements OnInit {
    //userdata =new ForgotPswModel();
    // Username: AbstractControl;
    loginText = {
        "psw_rec_heading": "Password Recovery",
        "psw_rec_inp_info_text": "To reset your password, enter your username below.",
        "psw_rec_submit": "Submit",
        "psw_rec_frgt_btn": "Forgot Username",
        "psw_rec_help_text": "If you need help, please see your site administrator or contact technical support.",

    }
    userdata = {
        Username: "",
        ReturnURL: ""
    }
    // data: ApiCallClass;
    errorMessage;
    public successVal = false;
    public errorVal = false;
    subscription = new Subscription;
    section = "PasswordRecovery";
    ForgotPasswordForm: FormGroup;
    constructor(private router: Router, private server: ServerApi, private eventService: EventDispatchService,
        private apiJson: ApiCallClass, fb: FormBuilder, private utils: Utilities) {
        // this.ForgotPasswordForm = fb.group({
        //     Username: ["", Validators.compose([CustomValidations.noScript, Validators.required])]

        // });
        this.ForgotPasswordForm = new FormGroup({
            Username: new FormControl()
        });
        this.errorMessage = messages;
        //   this.Username = this.ForgotPasswordForm.controls['Username'];
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
        // $('input[name=Username]').focus();
    }

    updateLoginText() {
        let tmptext = this.utils.sessionStorageGet('loginText');
        if (tmptext != undefined && tmptext != null && tmptext + '' !== '[object Object]') {
            this.loginText = JSON.parse(tmptext);
        }
    }
    resetPassword() {
        try {
            this.utils.showLoading();
            this.apiJson.method = "POST";
            //let urlObj = this.shared.getUrlObject(this.section);
            this.apiJson.endUrl = 'PasswordResetSendEmail';//urlObj.endUrl;
            this.userdata.ReturnURL = this.utils.getReturnUrl() + "/" + this.userdata.Username;
            let user = JSON.stringify(this.userdata);
            this.apiJson.data = user;
            this.apiJson.moduleName = "login";
            this.server.callAuthApi([this.apiJson]).subscribe(resp => {
                if (resp.Result + "" == "true") {
                    this.utils.hideLoading();
                    this.successVal = true;
                    // this.router.navigate(['./plpcontent']);
                }
                else {
                    this.utils.hideLoading();
                    this.errorVal = true;
                    setTimeout(function () {
                        this.errorVal = false;
                        // console.log(this.edited);
                    }.bind(this), 5000);
                    // alert("error occured while authenticating");
                }
            }, this.utils.handleError)

        }
        catch (e) {
            alert("resetPassword exception:" + e.message);
        }
    }


}
