import { Component, Input } from '@angular/core';
import { TranslateService, TranslatePipe } from 'ng2-translate';
@Component({
  selector: 'static-occ-footer',
  template: `<footer id="fhid" class="fh nb-footer footerpl2" style="z-index: 5;">
              <section class="copyright">
                <div class="container mob-head-style">
                  <div class="row">
                    <div class="col-sm-12">
                  <div class=" footer-text-desktop desktop-design-hide-plp2">
                   © 1971-2016 University of Oregon. All rights reserved. Created by intoCareers, a unit of the University of Oregon.
                   </div>     
                  <div class="mobile-design-hide-plp2">
                  <p>
                   <span class="footer-fnt">© 1971-2016 University of Oregon. All rights reserved.</span>                           
                             <span class="tooltip-footer-p2">
                     <span class="footer-fnt" style="color:#33ff99;" >Read more...</span>
                      <span class="tooltiptext"> © 1971-2016 University of Oregon. All rights reserved. Created by intoCareers, a unit of the University of Oregon.
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
export class StaticOccFooterComponent {


  constructor(private translate: TranslateService) {

  }
  ngOnInit() {

  }

}
