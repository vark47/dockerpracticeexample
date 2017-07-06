
import { Component } from '@angular/core';
import { Utilities } from './shared/utilities.class';
import { routeConstants } from './shared/app.constants';
import { RouterModule, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { CustomDate } from '../app/shared/customPipes';

import { getRouteConfig } from './route.config';

declare var $: any;
import { environment } from '../environments/environment';

@Component({
  selector: 'PLP-app',
  template: `
 
  <template ngbModalContainer ></template>
  <ngbd-modal-loader></ngbd-modal-loader>
  <router-outlet></router-outlet>
  `,
  styleUrls: ['../assets/css/style.css']
})
export class AppComponent {
  constructor(private router: Router, private translate: TranslateService, private utils: Utilities) {
   setTimeout(function () {
            this.setFavicon(window.location.origin + "/assets/images/cis-icon.ico");
          }.bind(this), 500);
    try {

      /** Route configuration creation based on framework JSON loaded on last Login  */
      // this.utils.getFramework();
      let frameConfig = this.utils.localStorageGet('loginFrameworkConfiguration');

      if (frameConfig !== undefined && frameConfig !== null && frameConfig !== '') {
        // alert("appcomponent frameConfig is:" + frameConfig);
        const newtemproute = getRouteConfig(JSON.parse(frameConfig));
        this.router.resetConfig(newtemproute);
      }

      /** LTI Login related functionality */
      let LTILogin = this.utils.docCookiesGetItem("LTILogin2");
      console.log("LTILogin:" + LTILogin);
      if (LTILogin + "" !== "undefined" && LTILogin + '' !== 'null') {
        let LTIjson = JSON.parse(LTILogin);
        let accId = LTIjson.acctId;
        let authkey = LTIjson.auth_key;
        let module = LTIjson.module;
        let Logouturl = LTIjson.Logouturl;
        this.utils.sessionStorageSet("LogoutURL", Logouturl);
        this.utils.eraseCookieFromAllPaths("LTILogin2");
        this.utils.sessionStorageRemove("module");
        console.log("LTILogin json:" + JSON.stringify(LTIjson));
        let modArr = this.utils.localStorageGet("module");
        if (modArr + "" == "undefined" || modArr + "" == "null") {
          let tmp = { "moduleslist": [module] };
          this.utils.localStorageSet("module", JSON.stringify(tmp));
        }
        else {
          let tmp1 = JSON.parse(modArr);
          tmp1.moduleslist.push(module);
          tmp1.moduleslist = $.unique(tmp1.moduleslist);
          this.utils.localStorageSet("module", JSON.stringify(tmp1));
        }
        this.utils.localStorageSet("accountID", accId);
        this.utils.localStorageSet("auth_key", authkey);
        let rtArr = [];
        routeConstants.forEach(function (val, inx) {
          if (module == val.module.toLowerCase())
            rtArr.push(val);
        })
        console.log("rtArr is:" + JSON.stringify(rtArr) + "  module:" + module);
        if (rtArr.length >= 0)
          this.router.navigateByUrl("/login");//rtArr[0].baseUrl);
      }
    } catch (e) {
      alert("app component exception:" + e.message);
    }


  }

  // public toasterconfig: ToasterConfig =
  // new ToasterConfig({
  //   limit: 1,
  //   showCloseButton: true,
  //   tapToDismiss: false,
  //   timeout: 5000,
  //   positionClass: "toast-bottom-right"
  // });
   // Chrome allows you to simply tweak the HREF of the LINK tag.
  // Firefox appears to require that you remove it and readd it.
  setFavicon(url) {
    this.removeFavicon();
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
    if (window.console) console.log("Set FavIcon URL to " + this.getFavicon().href);
  }

  getFavicon() {
    var links = document.getElementsByTagName('link');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('rel') === 'icon') {
        return links[i];
      }
    }
    return undefined;
  }
    removeFavicon() {
    var links = document.getElementsByTagName('link');
    var head = document.getElementsByTagName('head')[0];
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('rel') === 'icon') {
        head.removeChild(links[i])
      }
    }
  }
}
