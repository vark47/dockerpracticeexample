
/** Angular imports */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

/** Third party library import */
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from 'ng2-translate';

/** Custom imports */
// import { ConfigObj } from '../app.config';
import { ApiCallClass } from './apicall.model';
import { ServerApi } from './app.apicall.service';
import { Utilities } from './utilities.class';
import { EventDispatchService } from './event-dispatch.service';

@Component({
  selector: 'ngbd-modal-content',
  template: `<div class="modal-header" data-keyboard="false">
      <h4 class="modal-title"> {{headsection | translate}}{{trans_error |translate}}</h4>
      <!--<button type="button" class="close" aria-label="Close" (click)="closemodal()" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button> -->
      </div>
      <div class="modal-body">
     {{session_exp_txt | translate}} {{err_occ | translate}}{{unsavedTxt | translate}}</div>
      <div class="modal-footer"  [hidden]="closevalue">      
      <button id="save" type="button" class="btn btn-success" (click)=" deleteTestScore()" >{{yesbtn | translate}}</button> 
      <button id="cancel" type="button" class="btn btn-primary" (click)="activeModal.close('Close click')">{{nobtn | translate}}</button> 
      </div>   
     <div class="modal-footer" [hidden]="!closevalue">
       <button id="cancel" type="button" class="btn btn-warning" (click)="closemodal()" >{{close |translate}}</button> 
     </div>    
    `
})
export class NgbdModalContent implements OnInit {
  @Input() headsection;
  @Input() yesbtn;
  @Input() nobtn;
  @Input() deletevalue;
  @Input() arrayValue;
  @Input() arrayMobValue;

  @Input() trans_error;
  @Input() closebtn;
  @Input() err_occ;

  @Input() session_exp_txt;
  @Input() sessionName;

  @Input() Closebtnvalue;

  @Input() unsavedTxt;
  @Input() valueofunchange;

  browserDom: BrowserDomAdapter;
  closevalue = false;
  testScoreArr = [];
  constructor(private http: Http, private router: Router,
    private activeModal: NgbActiveModal, private apiJson: ApiCallClass,
    private translate: TranslateService, private eventService: EventDispatchService) {
    this.browserDom = new BrowserDomAdapter();
  }

  ngOnInit() {
    // console.log("close vlaue is  :" + this.Closebtnvalue);
    try {
      setTimeout(function () {
        this.browserDom.setStyle(document.querySelector('.modal-dialog'), "width", "90%");
      }.bind(this), 0);
    }
    catch (e) {
      alert("error--->" + e.message);
    }
    if (this.Closebtnvalue == 1) {
      this.closevalue = true;
    }

  }

  deleteTestScore() {
    if (this.deletevalue >= 0) {
      for (var i = 0; i < this.arrayValue.length; i++) {
        if (this.deletevalue == i) {
          this.arrayValue.splice(i, 1);
          for (let j = 0; j < 2; j++) {
            this.browserDom.setStyle(document.querySelectorAll('.SaveBtn' + i)[j], "display", "none");
            this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + i)[j], "display", "block");
            this.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + i)[j], "display", "none");
          }
        }
      }
      for (var i = 0; i < this.arrayMobValue.length; i++) {
        if (this.deletevalue == i) {
          this.arrayMobValue.splice(i, 1);
          for (let j = 0; j < 2; j++) {
            this.browserDom.setStyle(document.querySelectorAll('.SaveBtn' + i)[j], "display", "none");
            this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + i)[j], "display", "block");
            this.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + i)[j], "display", "none");
          }
        }
      }
    }

    if (this.sessionName == "sessioncheck") {
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("sessionExtend", true, true);
      this.eventService.dispatch(evnt);
    }
    if (this.valueofunchange == "unsavedcheck") {
      console.log("unsavedcheck-->");
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("unsaved", true, true);

      this.eventService.dispatch(evnt);
    }
    this.activeModal.close(true);
  }

  closemodal() {
    // console.log("called close()");

    this.activeModal.close(true);

  }

}

@Component({
  selector: 'ngbd-modal-loader',
  template: `
     <div  id="backdrop"  style="display:none;position: fixed;width: 100%;height: 100%;left:0;top:0;z-index:9999;
background: rgba(0,0,0,0.7);">

 <div  align="center" class="loading-center-v" >
    <div class="loader"></div>
    </div></div>
    `
})
export class NgbdModalLoaderContent implements OnInit {
  shwHideVal;
  browserDom: BrowserDomAdapter;
  constructor() {
    this.browserDom = new BrowserDomAdapter();
  }

  ngOnInit() {

  }
  showLoading() {
    // console.log("coming in showLoading");
    setTimeout(function () {
      this.browserDom.setStyle(document.querySelector('#backdrop'), "display", "block");
    }.bind(this), 0);
  }

  hideLoading() {
    // console.log("coming in hideLoading");
    this.browserDom.setStyle(document.querySelector('#backdrop'), "display", "none");
  }

}




@Component({
  selector: 'ngbd-modal-content',
  template: `
  
  <div class="modal-header" style="color: #0b8cbc;" data-keyboard="false">
      <h5 class="modal-title"> {{aaheadsection|translate}} {{answerSet_txt}}</h5>
      
      </div>
      <div class="modal-body"><h6 id="thought">{{enter_thought_txt | translate}}</h6><p  [hidden]="showcomponent"><textarea class="form-control popup-textarea-plp2" rows="5" id="comment" placeholder="" [(ngModel)]="str"></textarea></p>
     <p [hidden]="!showcomponent" >{{delete_sure_txt | translate}}</p>
     <p style="color: #FF0000; font-size:14px;" [hidden]="!showcomponent">{{action_undone_txt | translate}}</p>
     </div>
      <div class="modal-footer" >      
      <button id="save" type="button" class="{{classProperty}}"  (click)=" assessmentCommonAction()" >{{yesbtn | translate}}</button> 
      <button id="cancel" type="button" class="btn btn-warning" (click)="activeModal.close('Close click')">{{nobtn | translate}}</button> 
      </div>    
    `
})
export class AssessmentModalPopups implements OnInit {
  //saveModal parameters
  @Input() aaheadsection;
  @Input() enter_thought_txt;
  @Input() textarea_txt;
  @Input() yesbtn;
  @Input() nobtn;
  @Input() classProperty;
  // @Input() jsonObjTxt;
  str: string;

  //deleteModal parameters

  @Input() showvalue;
  @Input() delete_sure_txt;
  @Input() answerSet_txt;
  @Input() action_undone_txt;

  showcomponent = false;
  browserDom: BrowserDomAdapter;
  constructor(private http: Http,
    private activeModal: NgbActiveModal, private apiJson: ApiCallClass,
    private translate: TranslateService, private eventService: EventDispatchService) {
    this.browserDom = new BrowserDomAdapter();
  }
  ngOnInit() {
    setTimeout(function () {
      this.browserDom.setStyle(document.querySelector('.modal-dialog'), "width", "90%");
      if (this.showvalue == 1) {
        this.showcomponent = true;
        this.classProperty = "btn btn-danger";
      }
      else {
        this.classProperty = "btn btn-success";
      }
      this.str = this.textarea_txt;
    }.bind(this), 0);
  }


  assessmentCommonAction() {

    if (this.showvalue == 1) {
      // console.log("delete Ok !...");
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("DeleteButtonAction", true, true);
      this.eventService.dispatch(evnt);

    } else {
      if (this.showvalue == 2) {
        window.sessionStorage.setItem("textareaValue", this.str);
        let evnt = document.createEvent("CustomEvent");
        evnt.initEvent("SaveButtonAction", true, true);
        this.eventService.dispatch(evnt);

      }

    }
    this.activeModal.close();
  }

  ngOnDistroy() {
    // console.log("comming to distroy !...");
    this.showvalue = "";
  }
}




@Component({
  selector: 'ngbd-modal-content',
  template: `<div id="snackbar">
  {{snackbarname}}
  </div>    `
})
export class SnackBar implements OnInit {
  snackbarname
  constructor(private http: Http,
    private activeModal: NgbActiveModal) {
  }

  ngOnInit() {

  }
  myFunction(funcName) {
    this.snackbarname = funcName
    let x = document.getElementById("snackbar")
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }
}
