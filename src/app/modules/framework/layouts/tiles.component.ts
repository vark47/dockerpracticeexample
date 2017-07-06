import { Component, Input, OnInit, Renderer, OnDestroy } from "@angular/core";
import { RouterModule, Router, ActivatedRoute, NavigationEnd, NavigationStart, NavigationExtras } from '@angular/router';
import { EventDispatchService } from '../../../shared/event-dispatch.service';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'tiles-dynamic-component',
    templateUrl: `./tiles.layout.html`,
})
export class TilesDynamicComponent implements OnInit, OnDestroy {
    @Input() ItemsList;
    subscription = new Subscription;
    tileView = true;
    ItemName = "";
    urlArr;
    constructor(private renderer: Renderer, private route: Router, private activeRoute: ActivatedRoute, private eventDispatcher: EventDispatchService) {

        let ref = this, activeRouteUrl = '';
        route.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                activeRouteUrl = event.url;
                this.urlArr = activeRouteUrl.split('/');

                if (this.urlArr[this.urlArr.length - 1] === 'tiles' || this.urlArr.length === 3) {
                    this.tileView = true;
                } else {
                    this.tileView = false;
                }
            }

            if (event instanceof NavigationStart) {
            }

        })



    }

    ngOnInit() {
    }


    ngOnDestroy() {

    }

   
     tileClicked(name) {
        let Arr = this.route.url.split('./');
        this.ItemName = 'plpTile&' + name;
        var evnt = document.createEvent("CustomEvent");
        evnt.initEvent(this.ItemName, true, true);
        this.eventDispatcher.dispatch(evnt);
        if (name.trim() == "CCI Jr") {
            window.sessionStorage.setItem('CCIassessment', 'CCIJr');
        }
        else {
            window.sessionStorage.setItem('CCIassessment', 'CCIAdult');
        }

    }
}
