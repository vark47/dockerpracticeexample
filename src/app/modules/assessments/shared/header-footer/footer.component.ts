import { Component, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService, TranslatePipe } from 'ng2-translate';
import { Utilities } from '../../../../shared/utilities.class';
@Component({
  selector: 'static-footer',
  template: `<footer id="fhid" class="fh nb-footer footerpl2" style="z-index: 6;" *ngIf="showFooter">
              <section class="copyright">
                <div class="container mob-head-style">
                  <div class="row">
                    <div class="col-sm-12 align-footer">
                  <div class="footer-text-desktop desktop-design-hide-plp2">
                   {{footervaluetext}}
                  
                   </div>     
                  <div class="mobile-design-hide-plp2">
                  <p>
                    <span class="footer-fnt">{{'LANG_EN_TRANS.footer_mobile' | translate}}</span>                           
                             <span class="tooltip-footer-p2">
                     <span class="footer-fnt" style="color:#33ff99;" >{{'LANG_EN_TRANS.read_more' | translate}}...</span>
                      <span class="tooltiptext">{{footervaluetext}}
                       </span>
                   </span>
                   </p>
                 </div>
                  </div>
                </div>
                </div>
              </section>
              <section class="footer-bottom"> </section>
            </footer>`,

})
export class StaticFooterComponent {
  footervaluetext = "";
  footervalposition = "";
  viewval = 0;
  footervaliptext = "";
  asmntname = "";
  endurl = "";
  showFooter = true;
  constructor(private translate: TranslateService, private route: Router, private utils: Utilities) {
    route.events.subscribe(event => {
      try {
        if (event instanceof NavigationEnd) {
          let path = (window.location.pathname).split("/");
          if (path.length > 1) {
            this.asmntname = path[path.length - 2];
          }
          if (path.length > 2) {
            this.endurl = path[path.length - 1];
          }
          let frameConfig = this.utils.localStorageGet('loginFrameworkConfiguration');

          if (frameConfig !== undefined && frameConfig !== null && frameConfig !== '') {


            let foorJson = JSON.parse(frameConfig);

            this.footervaluetext = foorJson.Result.footer.copyright;

          }

        }
      } catch (e) {
        console.log('footer exception:' + e.message);
      }
    });
  }
  ngOnInit() {

  }

}
