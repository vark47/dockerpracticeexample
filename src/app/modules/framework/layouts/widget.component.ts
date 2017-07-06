import { Component, Renderer, Input } from "@angular/core";
import { RouterModule, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { sectionsArr } from '../../../shared/app.constants';
import { EventDispatchService } from '../../../shared/event-dispatch.service';

import { ISlimScrollOptions } from 'ng2-slimscroll';
@Component({
    selector: 'widget-dynamic-component',
    template: `
         <div class="side-menu" >
           <a href="#" class="main-menu2" (click)="$event.preventDefault();menuToggle()"  >
                    <a class="icon-none-m" data-toggle="collapse" data-target=".nav-collapse.in">
                    <i class="fa-micon-menu fa icon" [class.fa-close]="menuState" [class.fa-bars]="!menuState"></i> </a>
                    <div class="nav-text2"> <span>Personal Learning Plan</span> </div>
           
                </a>
            <div class="scrollbar" id="style-1" (click)="menuClose()">
            <nav class="main-menu sidemenu-t" [class.expanded]="menuState"> 
            <div  class="plp1-scroll-bar" slimScroll [options]="opts" >
          <div class="scroll-innter" id="style-1"> 
            <ul>
                    <li *ngFor="let item of ItemsList.menuItems"     
                       class="white-color"  [ngClass]="(ItemsList.menuHighlightStatus)? 'menu-filled':'blue-btn-plp2'"
                        [class.menu-active]="(viewMode == item.url)  && ItemsList.menuHighlightStatus">
                       <a [routerLink]="item.url"><span  [ngClass]="(item.fillStatus )? 'menu-span-plp1':'blue-btn-plp2'">  
                       <i class="fa-micon {{item.icon}} fa fa-lg"></i> </span>
                       <span class="nav-text"> {{item.name}} </span>
                         <i *ngIf = "item.fillStatus==true" class="fa-micon fa fa-check fa-lg"></i>
                        </a>                      
                    </li>
                    </ul>          
</div>
</div>
        </nav>
          </div>
        </div>
            <div (click)="menuClose()" class="" >
                <router-outlet></router-outlet>      
  
</div>
    `,
})


export class WidgetDynamicComponent {
    @Input() ItemsList;
    ItemName = "";
    viewMode;
    menuState = false;
    opts;
    Highlight;
    filledStatus;
    subscription = new Subscription();
    constructor(private renderer: Renderer, private eventService: EventDispatchService) {
       //  alert("menuitems------------>"+JSON.stringify(this.ItemsList));
        this.subscription = this.eventService.listen().subscribe((e) => {
            try {
                //   let name = e.type;
                console.log('widget constructor observable called:' + e.type);

                if(e.type.indexOf('&PLPSections') != -1){
                    let name = e.type.split('&');
                this.viewMode = './' + name[0];
            }
            else if (e.type.indexOf('&Filled') != -1) {
                    console.log('widget constructor Filled called:' + e.type);
                    let name = e.type.split('&');
                    this.viewMode = './' + name[0];
                    // this.filledStatus = true;
                    let ref = this;
                    this.ItemsList['menuItems'].forEach(function (obj, inx) {
                        if (obj.url == ref.viewMode) {
                            obj['fillStatus'] = true;
                        }
                    });
                }
                else if (e.type.indexOf('&Empty') != -1) {
                    console.log('widget constructor Empty called:' + e.type);
                    let name = e.type.split('&');
                    this.viewMode = './' + name[0];
                    // this.filledStatus = false;
                    let ref = this;
                    this.ItemsList['menuItems'].forEach(function (obj, inx) {
                        if (obj.url == ref.viewMode) {
                            obj['fillStatus'] = false;
                        }
                    });
                }
            } catch (e) {
                alert('widget constructor inside exception:' + e.message);
            }
        });

        this.opts = {
            position: 'right',
            barBackground: '#555',
            gridBackground: '#016269',
            barWidth: '6',
            gridWidth: '4',
            barBorderRadius: '2'
        }

    }
    menuToggle() {
        this.menuState = !this.menuState;
        //alert('menu toggle clicked:' + this.menuState);
    }
    menuClose() {
        this.menuState = false;
    }
    // widgetClicked(name) {
    //     this.ItemName = 'plpWidget&' + name;
    //     var evnt = document.createEvent("CustomEvent");
    //     evnt.initEvent(this.ItemName, true, true);
    //     this.eventService.dispatch(evnt);
    // }

    trackevnt() {
        console.log('menu click event false');
    }

    ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
