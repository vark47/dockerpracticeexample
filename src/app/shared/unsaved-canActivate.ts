
/** Angular imports */
import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
/** Custom imports */
import { Utilities } from './utilities.class';
import { Subscription } from "rxjs/Subscription";
import { EventDispatchService } from './event-dispatch.service';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { NgbModal, NgbModalOptions, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { NgbdModalContent } from './shared-modal-component';

@Injectable()
export class UnSavedChangesCanActive implements CanDeactivate<any>{
    // public modalResponse: Observable<boolean> = new Observable((observer) => { });

    subscription = new Subscription;
    options: NgbModalOptions = {
        backdrop: 'static',
    };
    constructor(private router: Router, private utils: Utilities, private modalService: NgbModal) {

    }
    canDeactivate(component: any): any {
        let sessExp = this.utils.sessionStorageGet('sessionExpired');
        //alert('inside canActive sessExp:' + sessExp);
        if (component.saveChanges() && sessExp != 'true') {

            return this.confirm();
        }
        this.utils.sessionStorageRemove('sessionExpired');
        return true;
    }

    confirm() {
        const modalRef = this.modalService.open(NgbdModalContent, this.options);
        if (this.utils.sessionStorageGet('savePartial') == "yes") {
            modalRef.componentInstance.unsavedTxt = 'LANG_EN_TRANS.quit_assmt';
        } else {
              modalRef.componentInstance.unsavedTxt = 'LANG_EN_TRANS.unsaved_change';
        }
            modalRef.componentInstance.headsection = 'LANG_EN_TRANS.trans_alert';
            modalRef.componentInstance.yesbtn = 'LANG_EN_TRANS.yes';
            modalRef.componentInstance.nobtn = 'LANG_EN_TRANS.no';
            modalRef.componentInstance.valueofunchange = "unsavedcheck";
                return modalRef.result;
    }

}
