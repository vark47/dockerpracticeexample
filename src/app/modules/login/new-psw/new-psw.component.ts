import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiCallClass } from '../../../shared/apicall.model';
import { ServerApi } from '../../../shared/app.apicall.service';
import { Utilities } from '../../../shared/utilities.class';
import { messages } from '../../../shared/messages';

declare var $: any;
@Component({
    selector: 'new-psw',
    templateUrl: './new-psw.layout.html',
    styleUrls: ['../login.style.css'],
})
export class NewPasswordComponent implements OnInit {
    // confirmPassword: AbstractControl;
    // newPassword: AbstractControl;
    tokendata = {
        token: ""
    };
    userdata = {
        newPassword: "",
        Password: ""
    };
    uname: any;
    urlObj;
    section = "NewPassword";
    //data: ApiCallClass;
    newPasswordForm: FormGroup;
    public successVal = false;
    public errorVal = false;
    errorMessage;
    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        private server: ServerApi,
        private apiJson: ApiCallClass, private activeRoute: ActivatedRoute, fb: FormBuilder, private utils: Utilities) {
        let tokenVal: any;
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            tokenVal = params['Token'];
        });
        this.tokendata = {
            token: tokenVal
        };
        // this.userdata.StateAbbr = this.activeRoute.snapshot.params.stateAbbr;

        this.activatedRoute.params.subscribe(params => {
            this.uname = params['uname'];
        });
        // this.userdata.Username = uname;
        /* this.newPasswordForm = fb.group({
            'newPassword': ["", Validators.compose([Validators.required, CustomValidations.passwordStrength])],
            'confirmPassword': ["", Validators.compose([Validators.required, CustomValidations.passwordStrength])]
        });*/
        // this.newPassword = this.newPasswordForm.controls['newPassword'];
        // this.confirmPassword = this.newPasswordForm.controls['confirmPassword'];
           this.newPasswordForm = new FormGroup({
          newPassword: new FormControl(),
          confirmPassword:new FormControl()
        });
        this.errorMessage = messages;

    }


    ngOnInit() {
        // $('input[name=ConfirmPassword]').focus();
        //   this.urlObj = this.shared.getUrlObject(this.section);
        /**Calling token validation on loading.*/
        this.validateToken(function () { });
    }

    /**This function is used for token validation.*/
    validateToken(cb) {
        try {
            this.apiJson.method = "GET";
            this.apiJson.endUrl = "PasswordResetTokenValid";//this.urlObj.tokenUrl;
            let user = JSON.stringify(this.tokendata);
            this.apiJson.data = user;
            this.apiJson.moduleName = "login";
            // alert("user--->"+user);
            this.server.callAuthApi([this.apiJson]).subscribe(resp => {
                // alert("resp[0].Success===>"+resp[0].Success);
                if (resp[0].Success + "" == "true") {
                    if (resp[0].Result + "" == "true") {
                        cb(this);
                    }
                    else {
                        this.router.navigateByUrl('login/loginForm?status=expired');
                    }
                }
                else {
                    // alert("Error occured while authenticating");
                }
            });
        }
        catch (e) {
            alert("validateToken exception:" + e.message);
        }
    }

    /**This function is used for sending new password.*/
    sendNewPassword() {
        this.utils.showLoading();
        this.validateToken(this.resetPassword);
    }

    /**This function is used for resetting new password.*/
    resetPassword(ref) {
        let resetCredentials = {
            Username: "",
            Password: ""
        };
        try {
            // if(this.userdata){
            if (ref.userdata.newPassword.trim() == ref.userdata.Password.trim()) {
                ref.apiJson.method = "POST";
                // let urlObj = ref.shared.getUrlObject(ref.section);
                ref.apiJson.endUrl = 'PasswordReset';//urlObj.endUrl;
                resetCredentials = {
                    Username: ref.uname,
                    Password: ref.userdata.Password
                };
                ref.apiJson.data = JSON.stringify(resetCredentials);
                ref.server.callAuthApi([ref.apiJson]).subscribe(resp => {
                    // alert("resp.Result---->"+resp.Result);
                    if (resp.Result + "" == "true") {
                        // this.router.navigate(['./plpcontent']);
                        ref.utils.hideLoading();
                        ref.successVal = true;
                    }
                }, ref.utils.handleError());
            }
            else {
                ref.utils.hideLoading();
                ref.errorVal = true;
                setTimeout(function () {
                    ref.errorVal = false;
                    // console.log(this.edited);
                }.bind(ref), 5000);
            }
        }
        catch (e) {
            alert("resetPassword exception:" + e.message);
        }
    }

    RedirectToLogin() {
        this.router.navigateByUrl('/login/loginForm');
    }

}
