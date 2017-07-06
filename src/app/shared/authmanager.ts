
/** Angular imports */
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/** Custom imports */
import { Utilities } from './utilities.class';
import { routeConstants } from './app.constants';

declare var $: any;

@Injectable()

export class AuthManager implements CanActivate {
    constructor(private router: Router, private utils: Utilities) {

    }

    canActivate(active: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        try {

            let rtArr = [], root;
            if (this.utils.localStorageGet('auth_key')) {
                active.pathFromRoot.forEach(function (val, inx) {
                    if (inx === 1) { root = val.url.toString().toLowerCase(); }
                });

                if (root === 'login') {

                    const module = JSON.parse(this.utils.localStorageGet('module'));

                    routeConstants.forEach(function (val, inx) {
                        if (module.moduleslist.indexOf(val.module.toLowerCase()) >= 0) {
                            rtArr.push(val);
                        }
                    });

                    let allowedRoutesArray = [];
                    rtArr.forEach(function (val, inx) {
                        allowedRoutesArray = allowedRoutesArray.concat(val.allowedRoutes);

                    });

                    if ($.inArray(root, allowedRoutesArray) !== -1) {
                        return true;
                    }

                    this.router.navigateByUrl(rtArr[0].baseUrl);
                    return false;
                } else {
                    return true;
                }
            }
            this.utils.sessionExpired();
            return false;
        } catch (e) {
            alert('exception:' + e.message);
        }
    }
}
