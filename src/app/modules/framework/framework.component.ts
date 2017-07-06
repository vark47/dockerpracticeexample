import { Component, OnInit, Output, Input } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { Utilities } from '../../shared/utilities.class';

import { getRouteConfig } from '../../route.config';
import { routeObj } from '../../shared/app.constants';
import { Subscription } from "rxjs/Subscription";
import { EventDispatchService } from '../../shared/event-dispatch.service';
@Component({
    selector: 'PLP-framework',
    templateUrl: './framework.layout.html'
})
export class FrameworkComponent implements OnInit {

    componentTypes: any[];
    initPLPContent = 'personalInfo';
    initAssessmentContent = 'tiles';
    initOccContent = 'occIndex';
    menuItems = [];
    appTitle = '';
    selectedLang = "";
    userName = "";
    subscription = new Subscription();
    public supportedLanguages: any[];
    constructor(private utils: Utilities,
        private translate: TranslateService,
        private router: Router,
        private activatedRoute: ActivatedRoute, private eventService: EventDispatchService) {
        // Default data initialization
        let langArr = [];
        langArr = JSON.parse(this.utils.sessionStorageGet("langAssArr"));


        // translate.addLangs(langArr);
       // translate.setDefaultLang('English');

        // alert("lanArr---->" + JSON.stringify(langArr) + " translate.getLangs():" + translate.getLangs());
        // let browserLang = translate.getBrowserLang();
        // translate.use(browserLang.match(/English|Español|Creole/) ? browserLang : 'English');
        this.supportedLanguages = [
            { display: 'English', value: 'en' },
            { display: 'Español', value: 'es' },
            { display: 'Creole', value: 'bi' }
        ];
        this.subscription = this.eventService.listen().subscribe((e) => {
            if (e.type.indexOf('&PLPSectionName') != -1) {
                let name = e.type.split('&');
                this.userName = name[0];
            }
        });
    }

    ngOnInit(): void {
        this.subscribeToLangChanged(); // subscribe to language changes
        let frameConfig = this.utils.localStorageGet('loginFrameworkConfiguration');

        if (frameConfig !== undefined && frameConfig !== null && frameConfig !== '') {
            // console.log("framework component frameConfig is:" + frameConfig);
            // const newtemproute = getRouteConfig(JSON.parse(frameConfig));
            // this.router.resetConfig(newtemproute);
            let framework = (JSON.parse(frameConfig));
            this.menuItems = [];
            this.appTitle = framework.Result.header.longName;
            this.userName = framework.Result.name.split(' ').slice(0, 1).join(' ');
           
            //this.menuItems = (JSON.parse(frameConfig)).Result.modules.modList;
            framework.Result.modules.modList.forEach(function (obj, inx) {
                let tmpobj = {};
               // alert("obj.moduleId--->"+obj.moduleId);
                if (obj.moduleId != undefined) {

                    tmpobj['title'] = obj.displayName;

                    if (obj.layout == 'tiles') {
                        tmpobj['subroute'] = 'tiles';
                    }
                    else if (obj.defaultComp != "") {
                        tmpobj['subroute'] = routeObj[obj.defaultComp].itemConfig.url;
                    }
                    else {
                        tmpobj['subroute'] = routeObj[obj.compList[0].moduleId].itemConfig.url;
                    }
                    if (obj.moduleId == "modSorts") {
                        tmpobj['root'] = 'assessment';
                    } else if (obj.moduleId == "modPLP") {
                        tmpobj['root'] = 'plpcontent';
                    } else if (obj.moduleId == "modOccs") {
                        tmpobj['root'] = 'occupations';
                        //tmpobj['subroute'] = routeObj['fileOcc'].itemConfig.url;
                    }
                    this.menuItems.push(tmpobj);
                }
                //  if (obj.moduleId != undefined && routeObj[obj.compList[0].compId]!=undefined) {

                //     tmpobj['title'] = obj.displayName;

                //     if (obj.layout == 'tiles') {
                //         tmpobj['subroute'] = 'tiles';
                //     }
                //     else if (obj.defaultComp != "") {
                //         tmpobj['subroute'] = routeObj[obj.defaultComp].itemConfig.url;
                //     }
                //     else {
                //        // console.log("obj.compList[0].moduleId----->"+obj.compList[0].compId+"--obj:"+JSON.stringify(obj));
                //        // console.log("routeObj[obj.compList[0].moduleId]----->"+routeObj[obj.compList[0].compId]);
                //         tmpobj['subroute'] = routeObj[obj.compList[0].compId].itemConfig.url;
                //     }
                //     if (obj.moduleId == "modSorts") {
                //         tmpobj['root'] = 'assessment';
                //     } else if (obj.moduleId == "modPLP") {
                //         tmpobj['root'] = 'plpcontent';
                //     } else if (obj.moduleId == "modOccs") {
                //         tmpobj['root'] = 'occupations';
                //         //tmpobj['subroute'] = routeObj['fileOcc'].itemConfig.url;
                //     }
                //     this.menuItems.push(tmpobj);
                // }
            }.bind(this))
        }
        // alert("this.menuItems---->"+this.menuItems[0].root);
    }
    logout() {
        this.utils.mainLogOut();
    }


    isCurrentLang(lang: string) {
        return lang === this.translate.currentLang;
    }
    isActive(instruction: any[]): boolean {
        let v1 = this.router.isActive(this.router.createUrlTree(['framework/' + instruction]), true);
        let v2 = this.router.isActive(this.router.createUrlTree(['framework/' + instruction]), false);
        //console.log('createUrltree :' + this.router.createUrlTree(instruction) + ' isactive true:' + v1 + ' isactive false:' + v2 + ' instruction:' + instruction);
        return v2;
    }
    userDataChanged(evnt) {
        // this.username=  this.utils.sessionStorageGet("userName");
        // this.username = evnt.username;
        //  alert("this.username----->"+this.username);
    }

    loadModules(root, subroute) {

        // console.log('framework component called root url:' + root + ' subroute:' + subroute);
        this.router.navigate(['./' + root + '/' + subroute], { relativeTo: this.activatedRoute });
    }

    selectLang(lang: string) {
        //alert("coming in select lang--->" + lang);
        var ref = this;
        this.supportedLanguages.forEach(function (index, val) {
            if (index.value == lang) {
                ref.selectedLang = index.display;
                //alert("coming in if");
            }
        })
        this.utils.sessionStorageSet("langset", lang);

        this.translate.use(lang);
        //alert("ref.asmnt_object.title--->"+ref.asmnt_object.title);
        //ref.assessmenthead = ref.translate.transform(ref.asmnt_object.title);
        /*this.translate.get('LANG_EN_TRANS.' + ref.asmnt_object.title).subscribe(
          value => {
            // value is our translated string
            let eqTitle = value;
            // alert("alertTitle---->"+eqTitle);
            ref.assessmenthead = eqTitle;
          })
        if (ref.asmnt_object.extra != "") {
          let extraname = ref.asmnt_object.extra;
          this.translate.get('LANG_EN_TRANS.' + ref.asmnt_object.extra).subscribe(
            value => {
              // value is our translated string
              //   let eqTitle = value;
              //  alert("alertTitle---->"+eqTitle);
              //   ref.assessmentheadextra = eqTitle;
              let eqExtra = value;
              let urlname = ref.asmnt_object.endurl;
              if (extraname == 'occ_list' && urlname == 'factors') {
                ref.whyOcc();
              }
              else if (extraname == 'select_prior_factor' && urlname == 'factors') {
                ref.occFactorHeader();
              }
              else {
                ref.assessmentheadextra = " : " + eqExtra;
              }
            })
          // ref.assessmentheadextra = " : " + ref.translate.transform(ref.asmnt_object.extra);
        }
        else {
          ref.assessmentheadextra = "";
        }*/

        let factorArr = {};
        factorArr = JSON.parse(this.utils.sessionStorageGet("testArr"));
    }
    public translatedText: string;
    refreshText() {
        // refresh translation when language change
        this.translatedText = this.translate.instant('hello world');
    }
    subscribeToLangChanged() {
        // refresh text
        // please unsubribe during destroy
        return this.translate.onLangChange.subscribe(x => this.refreshText());
    }
}