
import { Injectable } from '@angular/core';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { Router, Routes } from '@angular/router';
import { NgbdModalContent, NgbdModalLoaderContent } from './shared-modal-component';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from "rxjs/Subscription";

import { EventDispatchService } from './event-dispatch.service';

import { Http, Response } from '@angular/http';
import { routeObj, returnUrl } from './app.constants';
import { messages } from './messages';

import { TilesDynamicComponent } from '../modules/framework/layouts/tiles.component';
import { WidgetDynamicComponent } from '../modules/framework/layouts/widget.component';
import { ListDynamicComponent } from '../modules/framework/layouts/list.component';

declare var $: any;
let errCall;
/* $dialog is reference of loading model template.*/

@Injectable()
export class Utilities {

    subscription = new Subscription;
    options: NgbModalOptions = {
        backdrop: 'static',
    };
    timeoutVariable;
    modalRef1;
    /** This function is for logging out of the modules. */
    handleError = function (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        // alert("error in outer---->" + JSON.stringify(error))
        window.localStorage.removeItem("error");
        clearTimeout(errCall);
        errCall = setTimeout(function () {
            try {
                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
                console.error("errMsg--->" + errMsg + "----error----->" + JSON.stringify(error)); // log to console instead
                console.error("handle error error.name:" + error.name + "error.status:" + error.status);
                if (error.name === "TokenExpiredError") {
                    this.activeModel.close(true);
                    // this.callsave();
                    // this.showModal("Sorry an error occurred");
                    this.sessionExpired();
                }
                else if (error.status + "" === "401") {
                    // this.showModal("Sorry an error occurred");
                    // this.callsave();
                    this.activeModel.close(true);
                    // this.modalServic
                    this.sessionExpired();
                } else {
                    // this.showModal("Sorry an error occurred");
                    this.callsave();
                }
            } catch (e) {
                console.log('Handle error exception:' + e.message);
            }
            //alert("error is:"+errMsg);
            //$dialog.modal('hide');
        }.bind(this), 0);
    }.bind(this);
    constructor(private translate: TranslateService, private router: Router, private http: Http,
        private modalService: NgbModal, private activeModel: NgbActiveModal, private eventService: EventDispatchService,
        private loaderContent: NgbdModalLoaderContent) {

        /* this.subscription = eventService.listen().subscribe((e) => {
             // After event listen it will check whether user want to save partially or completely 
             console.log("Utilities Subscription event called:" + e.type);
         });*/
    }



    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getFrameworkComponent(moduleName) {
        let frame;
        let framework = JSON.parse(this.localStorageGet('loginFrameworkConfiguration'));
        framework.Result.modules.modList.forEach(function (obj, inx) {
            // console.log('getFrameworkComponent module is:' + JSON.stringify(obj));
            if (obj.moduleId === moduleName) {
                frame = obj;
                if (obj.layout === 'widget') {
                    frame['component'] = WidgetDynamicComponent;
                } else if (obj.layout === 'tiles') {
                    frame['component'] = TilesDynamicComponent;
                } else if (obj.layout === 'dashboard') {
                    frame['component'] = ListDynamicComponent;
                }
            }
        });
        return frame;
    }

    dispatchSectionLoad(name) {
        // this.ItemName = 'plpWidget&' + name;

        var evnt = document.createEvent("CustomEvent");
        evnt.initEvent(name, true, true);
        this.eventService.dispatch(evnt);
        //  alert("In utilities dispatchSectionLoad name:" + name);
    }

    getItemsList(items, status) {
        let list = [], result = {};

        items.forEach(function (obj, inx) {
            if (routeObj[obj.compId] !== undefined) {
                list.push(routeObj[obj.compId].itemConfig);
            }
        });

        result = {
            'menuHighlightStatus': status,
            'menuItems': list
        };
        return result;
    }




    /** For showing loading symbol */
    showLoading() {
        // this.waitingDialog.show('', { dialogSize: 'sm', progressType: 'warning' });
        this.loaderContent.showLoading();
    }

    /** For hiding loading symbol */
    hideLoading() {
        // this.waitingDialog.hide();
        this.loaderContent.hideLoading();
    }



    hideModal() {
        //this.waitingDialog.hide();
    }

    changeTextLang(keyArr, ref) {
        let tranJson = {};
        for (let i = 0; i < keyArr.length; i++) {
            let key = keyArr[i];
            this.translate.get('LANG_EN_TRANS.' + key).subscribe(
                value => {
                    // value is our translated string
                    tranJson[key] = value;
                    //alert("alertTitle---->"+alertTitle);
                    //ref.assessmentheadextra = eqTitle;
                });
        }
        return tranJson;
    }

    open(text) {
        //console.log("testing text-->"+text);
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.name = 'World';
        modalRef.componentInstance.transVal = text;
    }
    //Call error modalpopup
    //Call error modalpopup
    callsave() {

        // this.localStorageSet("action", "close");
        const modalRef = this.modalService.open(NgbdModalContent, this.options);
        modalRef.componentInstance.trans_error = 'LANG_EN_TRANS.trans_error';
        modalRef.componentInstance.close = 'LANG_EN_TRANS.close';
        modalRef.componentInstance.err_occ = 'LANG_EN_TRANS.err_occ';
        modalRef.componentInstance.Closebtnvalue = '1';

    }
    //call testScore "are you sure to delete" modalpopup
    callAlertSure(inx, testarray, testMobArray) {
        const modalRef = this.modalService.open(NgbdModalContent, this.options);
        modalRef.componentInstance.deletevalue = inx;
        modalRef.componentInstance.arrayValue = testarray;
        modalRef.componentInstance.arrayMobValue = testMobArray;
        modalRef.componentInstance.headsection = 'LANG_EN_TRANS.trans_alert';
        modalRef.componentInstance.yesbtn = 'LANG_EN_TRANS.yes';
        modalRef.componentInstance.nobtn = 'LANG_EN_TRANS.no';
        modalRef.componentInstance.err_occ = 'LANG_EN_TRANS.delete_sure';
        //modalRef.dismiss();

    }
    //call when session expired modalpopup
    openModalForSession() {

        this.modalRef1 = this.modalService.open(NgbdModalContent, this.options);
        this.modalRef1.componentInstance.yesbtn = 'LANG_EN_TRANS.yes';
        this.modalRef1.componentInstance.nobtn = 'LANG_EN_TRANS.no';
        this.modalRef1.componentInstance.headsection = 'LANG_EN_TRANS.session_exp';
        this.modalRef1.componentInstance.session_exp_txt = 'LANG_EN_TRANS.session_exp_txt';
        this.modalRef1.componentInstance.sessionName = "sessioncheck";
        this.setClearTime();
    }
    setClearTime() {
        clearTimeout(this.timeoutVariable);
        this.timeoutVariable = setTimeout(function () {
            this.modalRef1.close();
            this.sessionExpired();

        }.bind(this), 2 * 60 * 1000);
    }

    clearTimeoutVariable() {
        // alert("clearTimeoutVariable");
        //  this.modalRef1.close();
        clearTimeout(this.timeoutVariable);
    }
    showStartOverDialog() {
        const modalRef = this.modalService.open(NgbdModalContent, this.options);
        modalRef.componentInstance.headsection = 'LANG_EN_TRANS.trans_alert';
        modalRef.componentInstance.unsavedtxt = 'LANG_EN_TRANS.unsaved_change';
        modalRef.componentInstance.yesbtn = 'LANG_EN_TRANS.yes';
        modalRef.componentInstance.nobtn = 'LANG_EN_TRANS.no';
        modalRef.componentInstance.valueofunchange = "unsavedcheck";
    }
    sessionExpired() {
        this.sessionStorageSet('sessionExpired', 'true');
        this.exitApp('expired');
        //  window.localStorage.removeItem("accountID");
        //  window.localStorage.removeItem("auth_key");
        //  let logoutURL = this.sessionStorageGet("LogoutURL");
        //  if (logoutURL !== '' && logoutURL !== null && logoutURL !== undefined) {
        //      this.router.navigateByUrl(logoutURL);
        //  }
        //  else {
        //      this.router.navigateByUrl("login/loginForm?status=expired");
        //  }

    }
    mainLogOut() {
        this.exitApp('loggedout');
        /* window.localStorage.removeItem("auth_key");
         window.localStorage.removeItem("accountID");
         this.localStorageRemove("accountID");
         this.localStorageRemove("module");
         this.localStorageRemove('loginFrameworkConfiguration');
         this.eraseCookieFromAllPaths("LTILogin2");
         let logoutURL = this.sessionStorageGet("LogoutURL");
         //this.router.resetConfig([loginRoute]);
         if (logoutURL != "" && logoutURL != null && logoutURL != undefined) {
             this.router.navigateByUrl(logoutURL);
         } else {
             this.router.navigateByUrl('login/loginForm?status=loggedout');
         }
         */
    }

    exitApp(option) {
        try {
            this.localStorageRemove('loginFrameworkConfiguration');
            window.localStorage.removeItem("auth_key");
            window.localStorage.removeItem("accountID");
            this.localStorageRemove("accountID");
            this.localStorageRemove("module");
            this.eraseCookieFromAllPaths("LTILogin2");
            let logoutURL = this.sessionStorageGet("LogoutURL");
            // let tmpRt: Routes;
            //tmpRt = (loginRoutes);//[{ path: '', redirectTo: 'login', pathMatch: 'full' }, loginRoute, { path: '**', redirectTo: 'login', pathMatch: 'full' }]
            // this.router.resetConfig(loginRoutes);
            //alert("inside exitapp" + logoutURL);
            if (logoutURL !== "" && logoutURL !== null && logoutURL !== undefined) {
                this.router.navigateByUrl(logoutURL);
            } else {
                this.router.navigateByUrl('login/loginForm?status=' + option);
            }
        }
        catch (e) {
            alert('exitApp exception:' + e.message);
        }
    }

    // Fake localStorage implementation. 
    // Mimics localStorage, including events. 
    // It will work just like localStorage, except for the persistant storage part. 

    //var LocalStorage =  {
    docCookiesGetItem(sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }
    docCookiesSetItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        let sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    }
    docCookiesRemoveItem(sKey, sPath, sDomain) {
        if (!sKey || !this.docCookiesHasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    }
    docCookiesHasItem(sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
    /* optional method: you can safely remove it! */
    docCookiesKeys() {
        let aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (let nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }


    localStorageGet(pKey) {
        // alert("localStorageGet key:"+pKey);
        try {
            if (this.localStorageSupported()) {
                try {
                    return window.localStorage.getItem(pKey);
                }
                catch (e) {
                    return this.docCookiesGetItem('localstorage.' + pKey);
                }
            } else {
                return this.docCookiesGetItem('localstorage.' + pKey);
            }
        }
        catch (e) {
            //alert("localStorageGet exception:"+e.message);
        }
    }



    localStorageSet(pKey, pValue) {
        //alert("localStorageSet key:"+pKey+" pValue:"+pValue);
        try {
            if (this.localStorageSupported()) {
                try {
                    window.localStorage.setItem(pKey, pValue);
                }
                catch (e) {
                    this.docCookiesSetItem('localstorage.' + pKey, pValue, "", "", "", "");
                }
            } else {
                this.docCookiesSetItem('localstorage.' + pKey, pValue, "", "", "", "");
            }
        }
        catch (e) {

            //  alert("localStorageSet exception:"+e.message);
        }
    }

    localStorageSupported() {
        // global to cache value
        //var gStorageSupported = undefined;
        let testKey = 'test', storage = window.localStorage;
        if (this.gStorageSupported === undefined) {
            try {
                storage.setItem("testKey", "1");

                this.gStorageSupported = true;
            } catch (error) {
                //alert("localstorage exception is:"+error.message);
                this.gStorageSupported = false;
            }
        }
        // alert("Localstorage support is:"+gStorageSupported);
        return this.gStorageSupported;
    }

    sessionStorageSet(pKey, pValue) {
        //alert("localStorageSet key:"+pKey+" pValue:"+pValue);
        try {

            if (this.sessionStorageSupported()) {
                try {
                    window.sessionStorage.setItem(pKey, pValue);
                }
                catch (e) {
                    this.docCookiesSetItem('sessionstorage.' + pKey, pValue, "", "", "", "");
                }
            } else {
                this.docCookiesSetItem('sessionstorage.' + pKey, pValue, '', '', '', '');
            }
        }
        catch (e) {

            //alert("sessionStorageSet exception:"+e.message);
        }
    }

    sessionStorageGet(pKey) {
        //alert("sessionStorageGet key:"+pKey);
        try {
            if (this.sessionStorageSupported()) {
                try {
                    return window.sessionStorage.getItem(pKey);
                }
                catch (e) {
                    return this.docCookiesGetItem('sessionstorage.' + pKey);
                }
            } else {
                return this.docCookiesGetItem('sessionstorage.' + pKey);
            }
        }
        catch (e) {
            //alert("sessionStorageGet exception:"+e.message);
        }
    }

    gStorageSupported = undefined;
    sessionStorageSupported() {
        // global to cache value

        let testKey = 'test', storage = window.sessionStorage;
        if (this.gStorageSupported === undefined) {
            try {
                storage.setItem('testKey', '1');


                this.gStorageSupported = true;
            } catch (error) {
                //alert("localstorage exception is:"+error.message);
                this.gStorageSupported = false;
            }
        }
        // alert("Localstorage support is:"+gStorageSupported);
        return this.gStorageSupported;
    }
    sessionStorageRemove(pKey) {
        try {
            if (this.sessionStorageSupported()) {
                try {
                    window.sessionStorage.removeItem(pKey);
                    return true;
                }
                catch (e) {
                    return this.docCookiesRemoveItem('sessionstorage.' + pKey, '', '');
                }

            } else {
                return this.docCookiesRemoveItem('sessionstorage.' + pKey, '', '');
            }
        }
        catch (e) {
            return true;
            //alert("sessionStorageGet exception:"+e.message);
        }
        //return true;
    }

    localStorageRemove(pKey) {
        try {
            if (this.localStorageSupported()) {
                try {
                    window.localStorage.removeItem(pKey);
                }
                catch (e) {
                    this.docCookiesRemoveItem('localstorage.' + pKey, '', '');
                }
            } else {
                this.docCookiesRemoveItem('localstorage.' + pKey, '', '');
            }
        }
        catch (e) {     //  alert("localStorageSet exception:"+e.message);

        }
    }
    eraseCookieFromAllPaths(name) {
        // This function will attempt to remove a cookie from all paths.
        let pathBits = location.pathname.split('/');
        let pathCurrent = ' path=';

        // do a simple pathless delete first.
        document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

        for (let i = 0; i < pathBits.length; i++) {
            pathCurrent += ((pathCurrent.substr(-1) !== '/') ? '/' : '') + pathBits[i];
            document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
        }
    }
    getFramework() {
        //framework = [];
        this.http.get('/assets/frameworkJSON.json').map((res: Response) => res.json())
            .subscribe(
            data => { this.localStorageSet('loginFrameworkConfiguration', JSON.stringify(data)); },
            err => console.error(err)
            );
        // return framework;
    }


    setAccountId(id) {
        return this.localStorageSet('accountID', id);
    }
    getAccountId() {
        return this.localStorageGet('accountID');
    }

    setAuthKey(key) {
        return this.localStorageSet('auth_key', key);
    }
    getAuthKey() {
        return this.localStorageGet('auth_key');
    }


    getReturnUrl() {
        return returnUrl.url;
    }

    getMessages() {
        //  alert("all messages:"+JSON.stringify(this.messages));
        return messages;
    }


}



