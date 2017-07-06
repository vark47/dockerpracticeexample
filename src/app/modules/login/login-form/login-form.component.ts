import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { CustomValidations } from '../../../shared/common-validation';
import { ApiCallClass } from '../../../shared/apicall.model';
import { ServerApi } from '../../../shared/app.apicall.service';
import { Utilities } from '../../../shared/utilities.class';

import { Subscription } from "rxjs/Subscription";

import { EventDispatchService } from '../../../shared/event-dispatch.service';

// var frameworkJson = require('../../../../assets/frameworkJSON.json');
import { getRouteConfig } from '../../../route.config';

declare var $: any;
@Component({
    selector: 'login-form-element',
    templateUrl: './login-form.layout.html',
    styleUrls: ['../login.style.css'],
    // selector: 'login-form-element',
    // templateUrl: './login-form.layout.html',
    // styleUrls: ['../login.style.css'],
})

export class LoginFormComponent implements OnInit {
    @ViewChild('namevalue') n: ElementRef;
    @ViewChild('namevalue1') n1: ElementRef;

    framework;
    userdata = {
        username: "",
        password: ""
    };
    errorMessage = {
        username_req: "Username is required.",
        password_req: "Password is required."
    };
    //data: ApiCallClass;
    session = "";
    loggout = "";
    isVisible = true;
    valCheck = "false";
    isBtnDisable = true;
    btnShow = true;
    public errorVal = false;
    public loginValidation = false;

    subscription = new Subscription;
    loginText = {
        login_heading: "Login to PLP",
        login_info_text: "Use your MCIS username and password to login.",
        forgot_uname_link: "Forgot your username or password?",
        login_btn_text: "Login",
        logout_success_msg: "Successfully logged out",
        login_sessexpire_msg: "Your session has expired",
    }

    PLPLoginForm: FormGroup;
    constructor(private activatedRoute: ActivatedRoute, private eventService: EventDispatchService,
        private translate: TranslateService, private router: Router, private utils: Utilities,
        private loginauth: ServerApi, private apiJson: ApiCallClass, private apiJson1: ApiCallClass,
        fb: FormBuilder) {
        this.PLPLoginForm = fb.group({
            UserName: ["", Validators.compose([Validators.required,
            CustomValidations.noScript])],
            Password: ["", Validators.compose([Validators.required,
            CustomValidations.noScript])]
        });
        // This is our new property, which we will access from the template
        let sessId = this.utils.getAuthKey();
        //alert("App component:"+sessId);
        if (sessId != null) {
            try {
                // console.log('changeRouteConfig framework json is:' + JSON.stringify(framework));
                // const newtemproute = getRouteConfig(framework);
                // console.log('In Login constructor previous RouteConfig json is:' + JSON.stringify(this.router.config));

                // let tmpRoute = this.router.config;
                // tmpRoute.push(newtemproute);
                // this.router.resetConfig(tmpRoute);

                // console.log('In Login constructor New changeRouteConfig json is:' + JSON.stringify(this.router.config));
                setTimeout(function () {
                    // this.router.navigateByUrl("/framework/assessment/occSort/intro");
                    // this.router.navigateByUrl("/login/usernameRecovery");
                }.bind(this), 2000);
                // this.router.navigateByUrl("/framework/plpcontent");
                //  window.location.href="/plpcontent";
            }
            catch (e) {
                //alert("exception:"+e.message);
            }
        }
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

    ngAfterViewChecked() {
        // console.log(this.n.nativeElement.value + AfterViewChecked);
        if (this.n.nativeElement.value) {
            if (this.valCheck == "false") {
                // console.log("isBtnDisable false");
                this.valCheck = "true";
                this.btnShow = false;
            }
            else if (this.valCheck != "") {
                // console.log("isBtnDisable true")
                this.valCheck = "";
                this.btnShow = true;
            }
        }
    }
    /**Initializing session value based on query param "status" in Login screen */
    ngOnInit() {
        this.updateLoginText();
        this.utils.sessionStorageRemove("compareFirst")
        this.utils.sessionStorageRemove("compareFirstid")
        this.utils.sessionStorageRemove("compareFirstname")
        let ref = this;
        setTimeout(function () {
            ref.isBtnDisable = ref.btnShow;
        }, 500);
        let status;
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            status = params['status'];
        });
        /**Tracking session expiry status */
        if (status == "expired") {
            if (this.n.nativeElement.value.trim() == this.userdata.username.trim() && this.n1.nativeElement.value.trim() == this.userdata.password.trim()) {
                this.isVisible = true;

                // $('#loginSbt').css("opacity", "1.0").css("cursor", "pointer");
            }
            else {
                //  $('#loginSbt').css("opacity", "0.45").css("cursor", "not-allowed");
                this.isVisible = false;

            }

            this.session = "true";
            this.loggout = "";
        }
        else if (status == "loggedout") {

            if (this.n.nativeElement.value.trim() == this.userdata.username.trim() && this.n1.nativeElement.value.trim() == this.userdata.password.trim()) {

                //$('#loginSbt').css("opacity", "1.0").css("cursor", "pointer");
                this.isVisible = true;

            }
            else {
                //$('#loginSbt').css("opacity", "0.45").css("cursor", "not-allowed");
                this.isVisible = false;

            }

            this.session = "";
            this.loggout = "true";
        }
        //alert(this.router.routerState.queryParams._value.status);
        /**Initializing validation messages object */
        this.errorMessage = this.utils.getMessages();
    }

    updateLoginText() {
        let tmptext = this.utils.sessionStorageGet('loginText');
        if (tmptext != undefined && tmptext != null && tmptext + '' !== '[object Object]') {
            this.loginText = JSON.parse(tmptext);
        }
    }

    login() {
        // alert(this.n.nativeElement.value+"----in login----"+this.n1.nativeElement.value)
        if (this.n.nativeElement.value && this.n1.nativeElement.value) {
            this.utils.showLoading();
            // this.cursorAllow = false;
            try {
                this.utils.localStorageSet('pageRefreshed', "");

                this.apiJson.method = "GET";
                this.apiJson.endUrl = "login";
                this.apiJson.moduleName = "login";
                let user = JSON.stringify(this.userdata);
                this.apiJson.data = user;
                let langArr = ["English", "Español", "Creole"];
                if ((this.userdata.username == "" && this.userdata.password == "")) {
                    this.loginValidation = true;
                    this.utils.hideLoading();
                    setTimeout(function () {
                        this.loginValidation = false;
                        // console.log(this.edited);
                    }.bind(this), 5000);
                }
                else {
                    this.loginauth.callLogin(this.apiJson).subscribe(resp => {
                        console.log("user logged in:" + JSON.stringify(resp.Result));
                         
                        if (resp.Result.UserValid + "" == "true") {
                            try {
                                let apiJson1 = new ApiCallClass;
                                apiJson1.method = "GET";
                                apiJson1.endUrl = "UserSettings";
                                apiJson1.moduleName = "login";
                                apiJson1.sessionID = this.utils.getAuthKey();
                                let user = JSON.stringify({
                                    //stateAbbr: 'MN',
                                    accountID: resp.Result.AccountID
                                });
                                apiJson1.data = user;
                                // this.utils.sessionStorageSet("userName",);
                                //console.log('before login apijson:' + JSON.stringify(apiJson1));
                                this.loginauth.callApi([apiJson1]).subscribe(respSetting => {

                                   // console.log('after login settings json:' + JSON.stringify(respSetting[0]));
                                    this.framework = respSetting[0];
                                    //this.framework = JSON.parse(this.utils.localStorageGet('loginFrameworkConfiguration'));
                                    this.utils.localStorageSet('loginFrameworkConfiguration', JSON.stringify(this.framework));
                                    // console.log('Loginform framework json is:' + JSON.stringify(this.framework));
                                    let newtemproute = getRouteConfig(this.framework);
                                    // console.log("new temproute----->"+JSON.stringify(newtemproute));
                                    /* try {
                                         console.log('In Login method Before changeRouteConfig new route string json is:' + (newtemproute.map(function (ref) {
                                             console.log('inside new route string json routeconfig:' + JSON.stringify(ref));
                                             return ref;
                                         })));
 
                                         console.log('In Login method Before changeRouteConfig Parse json is:' + (this.router.config));
 
                                         console.log('In Login method Before changeRouteConfig string json is:' + (this.router.config.map(function (ref) {
                                             console.log('inside old routeconfig:' + JSON.stringify(ref) + ' ref.data:' + ref.data);
                                             return ref;
                                         })));
 
                                     } catch (e) {
                                         console.log('loginform Before routerconfig exception:' + e.message);
                                     }*/
                                    //console.log('Loginform framework json is:' + JSON.stringify(this.framework));
                                    this.router.resetConfig([]);
                                    this.router.resetConfig(newtemproute);
                                    /* try {
                                         console.log('In Login method New changeRouteConfig Parse json is:' + (this.router.config));
 
                                         console.log('In Login method New changeRouteConfig string json is:' + (this.router.config.map(function (ref) {
                                             console.log('inside new routeconfig:' + JSON.stringify(ref) + ' ref.data:' + ref.data);
                                             return ref;
                                         })));
                                     } catch (e) {
                                         console.log('loginform routerconfig exception:' + e.message);
                                     }*/
                                    setTimeout(function () {
                                        //alert('framework loaded');
                                        this.router.navigateByUrl("framework");
                                    }.bind(this), 500);


                                });
                                //Navigate to PLP sectiona if result.Success is true
                                this.utils.sessionStorageSet("langAssArr", JSON.stringify(langArr));
                                this.utils.setAccountId(resp.Result.AccountID);
                            } catch (e) {
                                console.log('Login success routeLogin exception:' + e.message);
                            }
                        }
                        else {
                            //calling error call functionality if result.Success is not true
                            this.utils.hideLoading();
                            if (resp.Result.UserValid == false) {
                                this.errorVal = true;
                                setTimeout(function () {
                                    this.errorVal = false;
                                    // console.log(this.edited);
                                }.bind(this), 5000);
                            }
                        }
                    }, (err) => {
                        // alert("error in login:" + JSON.stringify(err));
                        //Handling the exception in Login API call
                        this.utils.hideLoading();
                        this.utils.handleError();
                    });
                }

            }
            catch (e) {
                console.log("exception in login--->" + e.message);
            }
        }
    }


}