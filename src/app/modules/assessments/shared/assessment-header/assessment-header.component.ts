import { AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { Component, OnInit, Input, Renderer, Output } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { TranslateService } from 'ng2-translate';
import { assessmentObjects } from '../constants/assessments-constants';
import { AssessmentsService } from '../services/assessments.service';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { Observable } from 'rxjs/Observable';

import { Utilities } from '../../../../shared/utilities.class';
import { StaticFooterComponent } from '../header-footer/footer.component';
declare var $: any;
@Component({
  selector: 'assessment-header',
  templateUrl: './assessment-header.layout.html',
  styles: [`.hide{
    display:none;
  }`]
})
export class AssessmentHeaderComponent implements OnInit {
  asmnt_object = { assessment: '', endurl: '', extra: '', title: '', color: '', btnClass: '', buttons: ['', ''] };
  public translatedText: string;
  public supportedLanguages: any[];
  selectedLang = "";
  //translate;
  assessmenthead;
  assessmentheadextra;
  footerval;
  footervalip;
  footerPostion = 0;
  viewValue = 0;
  _hash = "!";
  asmntname = "";
  endurl = "";
  constructor(private trackEvnt: AssessmentsService, private route: Router, private translate: TranslateService, private renderer: Renderer,
    private activatedRoute: ActivatedRoute, private utils: Utilities, private eventService: EventDispatchService) {
    try {
      route.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          let path = (window.location.pathname).split("/");
          if (path.length > 1) {
            this.asmntname = path[path.length - 2];
          }
          if (path.length > 2) {
            this.endurl = path[path.length - 1];
          }
          let ref = this, tmpObj;
          assessmentObjects.forEach(function (obj, inx) {
            if (ref.asmntname == obj.assessment && ref.endurl == obj.endurl) {
              translate.get('LANG_EN_TRANS.' + obj.title).subscribe(
                value => {
                  // value is our translated string
                  let eqTitle = value;
                  ref.assessmenthead = eqTitle;
                })
              if (obj.extra != "") {
                let extraName = obj.extra;
                translate.get('LANG_EN_TRANS.' + obj.extra).subscribe(
                  value => {
                    // value is our translated string
                    let eqExtra = value;
                    let urlname = obj.endurl;
                    if (extraName == 'select_prior_factor' && urlname == 'factors') {
                      ref.occFactorHeader();
                    }
                    else {
                      ref.assessmentheadextra = " : " + eqExtra;
                    }
                  })
              }
              else {
                ref.assessmentheadextra = "";
              }

              ref.footervalip = "";
              if (obj.assessment == "entrepreneurQuiz") {
                ref.footerval = "footer_eq";
              } else if (obj.assessment == "interestProfilerSf") {
                ref.footerval = "footer_ip";
                ref.viewValue = 1;
                ref.footervalip = "emp_training_footer";
              } else {
                ref.footerval = "footervaliptext";
              }
              tmpObj = obj;
            }

          });
          this.asmnt_object = tmpObj;

        }
      })
    } catch (e) {
      console.log("assessment header constructor exception:" + e.message);
    }
    this.supportedLanguages = [
      { display: 'English', value: 'en' },
      { display: 'Español', value: 'es' },
      { display: 'Creole', value: 'bi' }
    ];
  }

  ngOnInit() {
    this.utils.sessionStorageSet("logoutClicked", "");
  }

  /**This function is for saving the assessement in the middle of the assessement. */
  whyOcc(): Observable<Event> {
    let extraname;
    if (this.utils.sessionStorageGet("checkNotOccList") == "true") {
      extraname = "whynot_occ_list";
    }
    else {
      extraname = "why_occ_list";
    }
    this.translate.get('LANG_EN_TRANS.' + extraname).subscribe(
      value => {
        let eqExtra = value;
        this.assessmentheadextra = " : " + eqExtra;
      })
    return;
  }
  occFactorHeader(): Observable<Event> {
    let extraname;
    if (this.utils.sessionStorageGet("occFactorHeader") == "true") {
      extraname = "rank_prior_factor";
    }
    else {
      extraname = "select_prior_factor";
    }
    this.translate.get('LANG_EN_TRANS.' + extraname).subscribe(
      value => {
        let eqExtra = value;
        this.assessmentheadextra = " : " + eqExtra;
      })
    return;
  }
  SaveParitalAssesment(assessmentName) {
    var evnt = document.createEvent("CustomEvent");
    if (assessmentName == 'interestProfilerSf') {
      evnt.initEvent("IPSFSavePartial", true, true);
      this.eventService.dispatch(evnt);
    }
    else if (assessmentName == 'entrepreneurQuiz') {
      evnt.initEvent("EQSavePartial", true, true);
      this.eventService.dispatch(evnt);
    }
    else if (assessmentName == 'occSort') {
      evnt.initEvent("OSSavePartial", true, true);
      this.eventService.dispatch(evnt);
    }
    else if (assessmentName == 'wesAsessment') {
      evnt.initEvent("WESSavePartial", true, true);
      this.eventService.dispatch(evnt);
    }
   else if (assessmentName == 'cciJr' || assessmentName == 'cciAdult') {
      evnt.initEvent("CCIjrSavePartial", true, true);
      this.eventService.dispatch(evnt);
      //this.trackEvnt.dispatch(new Event("OSSavePartial"));
    }
     else if (assessmentName == 'lssAsessment') {
       evnt.initEvent("LSSavePartial",true,true);
      this.eventService.dispatch(evnt);
    }

  }

  /**This function is for restoring the answer sets. */
  RestoreAnswerSets(assessmentName) {
    if (assessmentName == 'interestProfilerSf') {
      this.route.navigate(['./restore'], { relativeTo: this.activatedRoute });
    }
    else if (assessmentName == 'entrepreneurQuiz') {
      this.route.navigate(['./restore'], { relativeTo: this.activatedRoute });
    }
    else if (assessmentName == 'occSort') {
      // this.route.navigateByUrl("occSort/restore");
      this.route.navigate(['./restore'], { relativeTo: this.activatedRoute });
    }
    else if (assessmentName == 'wesAsessment') {
      this.route.navigate(['./restore'], { relativeTo: this.activatedRoute });
    }
    else if (assessmentName == 'cciJr' || assessmentName == 'cciAdult') {
      this.route.navigate(['./restore'], { relativeTo: this.activatedRoute });
    }
     else if (assessmentName == 'lssAsessment') {
      this.route.navigate(['./restore'],{ relativeTo: this.activatedRoute });
    }


  }

  /**This function is for saving the assessement. */
  SaveResultAssessment(assessmentName) {
    $('#ipResSave').hide();
    $('#ipResPrint').hide();
    $('.icon-asmnt-cross').hide();
    $('.icon-asmnt-menu').show();
    var evnt = document.createEvent("CustomEvent");
    if (assessmentName == 'interestProfilerSf') {
      evnt.initEvent("IPSFSaveComplete", true, true);
      this.eventService.dispatch(evnt);
    }
    else if (assessmentName == 'entrepreneurQuiz') {
      evnt.initEvent("EQSaveComplete", true, true);
      this.eventService.dispatch(evnt);
    }
    else if (assessmentName == 'occSort') {
      evnt.initEvent("OSSaveComplete", true, true);
      this.eventService.dispatch(evnt);
      }
    else if (assessmentName == 'wesAsessment') {
      evnt.initEvent("WESSaveComplete", true, true);
      this.eventService.dispatch(evnt);
    }
    else if(assessmentName == 'lssAsessment') {
       evnt.initEvent("LSSaveComplete", true, true);
      this.eventService.dispatch(evnt)
    }
        else if (assessmentName == 'cciJr' || assessmentName == 'cciAdult') {
      evnt.initEvent("CCIjrSaveComplete", true, true);
      this.eventService.dispatch(evnt);
      //this.trackEvnt.dispatch(new Event("OSSaveComplete"));
    }
  }

  LaunchInterestProfile(assessmentName) {
    if (assessmentName == 'interestProfilerSf') {
      this.utils.sessionStorageSet("SaveParUserNotesIP", "");
      this.utils.sessionStorageSet("SaveComUserNotesIP", "");
      this.route.navigate(['./intro'], { relativeTo: this.activatedRoute });
    }
  }

  LaunchEntiQuiz(assessmentName) {
    if (assessmentName == 'entrepreneurQuiz') {
      this.utils.sessionStorageSet("SaveParUserNotesEQ", "");
      this.utils.sessionStorageSet("SaveComUserNotesEQ", "");
      this.route.navigate(['./intro'], { relativeTo: this.activatedRoute });
    }
  }

  LaunchOccSort(assessmentName) {
    if (assessmentName == 'occSort') {
      this.utils.sessionStorageSet("SaveParUserNotesOS", "");
      this.utils.sessionStorageSet("SaveComUserNotesOS", "");
      this.route.navigate(['./intro'], { relativeTo: this.activatedRoute });
    }
  }

  LaunchWES(assessmentName) {
    if (assessmentName == 'wesAsessment') {
      this.utils.sessionStorageSet("save_ParUserNotes_WES", "");
      this.utils.sessionStorageSet("save_Com_UserNotes_WES", "");
      this.route.navigate(['./intro'], { relativeTo: this.activatedRoute });
    }
  }
  LaunchcciJr(assessmentName) {
    if (assessmentName == 'cciJr' || 'cciAdult') {
      this.utils.sessionStorageSet("SaveParUserNotesCCI", "");
      this.utils.sessionStorageSet("SaveComUserNotesCCI", "");
      this.route.navigate(['./intro'], { relativeTo: this.activatedRoute });
    }
  }

  LaunchLearnStyle(assessmentName) {
    if (assessmentName == 'lssAsessment') {
      this.utils.sessionStorageSet("SaveParUserNotesLS", "");
      this.utils.sessionStorageSet("SaveComUserNotesLS", "");
      this.route.navigate(['./intro'], { relativeTo: this.activatedRoute });
    }
    }
  /**This function is for showing the pop-up and for starting the assessement.  */
  StartOver(assessmentName) {
    let text = ['unsaved_change', 'quit_assmt', 'cancel', 'btn_save', 'yes', 'no', 'trans_alert'];
    let transText = this.changeTextLang(text, this);
    if (assessmentName == 'interestProfilerSf') {
      this.utils.sessionStorageSet("SaveParUserNotesIP", "");
      this.utils.sessionStorageSet("SaveComUserNotesIP", "");
      if (this.asmnt_object.endurl == "assessment") {
        this.trackEvnt.showStartOverDialog("/intro", this.utils.sessionStorageGet('savePartial'), transText);
      } else {
        this.utils.sessionStorageRemove("shortIpLogID");
        this.route.navigate(['../interestProfilerSf/intro'], { relativeTo: this.activatedRoute });
      }
    } else if (assessmentName == 'entrepreneurQuiz') {
      this.utils.sessionStorageSet("SaveParUserNotesEQ", "");
      this.utils.sessionStorageSet("SaveComUserNotesEQ", "");
      if (this.asmnt_object.endurl == "assessment") {
        this.trackEvnt.showStartOverDialog("/intro", this.utils.sessionStorageGet('savePartial'), transText);
      } else {
        this.utils.sessionStorageRemove("entiQuizLogID");
        this.route.navigate(['../entrepreneurQuiz/intro'], { relativeTo: this.activatedRoute });
      }
    } else if (assessmentName == 'occSort') {
      this.utils.sessionStorageSet("SaveParUserNotesOS", "");
      this.utils.sessionStorageSet("SaveComUserNotesOS", "");
      if (this.asmnt_object.endurl == "assessment") {
        this.trackEvnt.showStartOverDialog("/intro", this.utils.sessionStorageGet('savePartial'), transText);
      } else {
        this.utils.sessionStorageRemove("OccSortLogID");
        this.route.navigate(['../occSort/intro'], { relativeTo: this.activatedRoute });
	  }
    } else if (assessmentName == 'wesAsessment') {
      this.utils.sessionStorageSet("save_ParUserNotes_WES", "");
      this.utils.sessionStorageSet("save_Com_UserNotes_WES", "");
      if (this.asmnt_object.endurl == "assessment") {
        // alert("coming in if");
        this.trackEvnt.showStartOverDialog("/intro", this.utils.sessionStorageGet('savePartial'), transText);
      } else {
        // alert("coming in else")
        this.utils.sessionStorageRemove("wesLogID");
        this.route.navigate(['../wesAsessment/intro'], { relativeTo: this.activatedRoute });
      }
    }
    else if (assessmentName == 'lssAsessment') {
    
      this.utils.sessionStorageSet("SaveParUserNotesLS", "");
      this.utils.sessionStorageSet("SaveComUserNotesLS", "");
      if (this.asmnt_object.endurl == "assessment") {
        this.trackEvnt.showStartOverDialog("/intro", this.utils.sessionStorageGet('savePartial'), transText);
      } else {
        this.utils.sessionStorageRemove("learnStyleLogID");
        this.route.navigate(['../lssAsessment/intro'], { relativeTo: this.activatedRoute });
      }
    }
    else if (assessmentName == 'cciJr' || assessmentName == 'cciAdult') {
      this.utils.sessionStorageSet("SaveParUserNotesCCI", "");
      this.utils.sessionStorageSet("SaveComUserNotesCCI", "");
      this.trackEvnt.showStartOverDialog('cciJr/intro', this.utils.sessionStorageGet('savePartial'), transText);
    }
    else {
      this.utils.sessionStorageRemove("shortCCIjrLogID");
      this.route.navigate(['./intro'], { relativeTo: this.activatedRoute });
    }

  }

  isCurrentLang(lang: string) {
    return lang === this.translate.currentLang;
  }
  selectLang(lang: string) {
    var ref = this;
    this.supportedLanguages.forEach(function (index, val) {
      if (index.value == lang) {
        ref.selectedLang = index.display;
      }
    })
    this.utils.sessionStorageSet("langset", lang);

    this.translate.get('LANG_EN_TRANS.' + ref.asmnt_object.title).subscribe(
      value => {
        // value is our translated string
        let eqTitle = value;
        ref.assessmenthead = eqTitle;
      })
    if (ref.asmnt_object.extra != "") {
      let extraname = ref.asmnt_object.extra;
      this.translate.get('LANG_EN_TRANS.' + ref.asmnt_object.extra).subscribe(
        value => {
          let eqExtra = value;
          let urlname = ref.asmnt_object.endurl;
          if (extraname == 'select_prior_factor' && urlname == 'factors') {
            ref.occFactorHeader();
          }
          else {
            ref.assessmentheadextra = " : " + eqExtra;
          }
        })
    } else {
      ref.assessmentheadextra = "";
    }

    let factorArr = {};
    factorArr = JSON.parse(this.utils.sessionStorageGet("testArr"));
  }

  refreshText() {
  }

  viewChanged(obj) {
    alert("viewChanged data is:" + JSON.stringify(obj));
  }

  /**This function is for printing the result screen in Interest-profiler and Entrepreneur-quiz. */
  printResult(assessmentName) {

    var evnt = document.createEvent("CustomEvent");

    if (assessmentName == 'interestProfilerSf') {
      evnt.initEvent("IPSFPrint", true, true);
      this.eventService.dispatch(evnt);
    }
    else if (assessmentName == 'entrepreneurQuiz') {
      evnt.initEvent("EQPrint", true, true);
      this.eventService.dispatch(evnt);
    } else if (assessmentName == 'occSort') {
      evnt.initEvent("OSPrint", true, true);
      this.eventService.dispatch(evnt);
    }
  }
  @HostListener('mousedown', ['$event'])
  onmousedown(event) {
    var currentDate = new Date();
    var currentSeconds = currentDate.getTime();
    this.utils.localStorageSet('currentSec', currentSeconds + "");

  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    this.onmousedown(event);
  }

  /*This function is to display the browser pop-up on page refresh*/

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander($event: any) {
    let savePart = this.utils.sessionStorageGet("savePartial");
    this.utils.sessionStorageSet("isAssessment", this.asmnt_object.endurl);

    if (this.asmnt_object.endurl == "assessment" && savePart != "yes" && this.utils.sessionStorageGet("logoutClicked") == "") {
      $event.returnValue = 'Your data will be lost!';
    }
  }

  @HostListener('window:hashchange', ['$event'])
  HashChangeEvent($event: any) {

    if (window.location.hash !== this._hash) {

      window.location.hash = this._hash;
    }
  }



  /**This function is for logging out of the modules. */
  logOut() {

    this.utils.sessionStorageSet("logoutClicked", "yes");
    if (this.asmnt_object.endurl == 'assessment') {
      let text = ['unsaved_change', 'quit_assmt', 'cancel', 'btn_save'];
      let transText = this.changeTextLang(text, this);
      this.trackEvnt.showStartOverDialog("logout", this.utils.sessionStorageGet('savePartial'), transText);
    } else {
      this.utils.mainLogOut();
    }
  }

  /**This function is to change the language of text. */
  changeTextLang(keyArr, ref) {
    let tranJson = {}
    for (let i = 0; i < keyArr.length; i++) {
      let key = keyArr[i];
      this.translate.get('LANG_EN_TRANS.' + key).subscribe(
        value => {
          // value is our translated string
          tranJson[key] = value;
        })
    }
    return tranJson;
  }


}