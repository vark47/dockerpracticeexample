import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { RouterModule, Router } from '@angular/router';
import { EventDispatchService } from '../../../../shared/event-dispatch.service';
import { Subscription } from "rxjs/Subscription";
import { TilesDynamicComponent } from '../tiles.component';
import { Utilities } from '../../../../shared/utilities.class';

@Component({
    selector: 'tile-component',
    template: `
      <dynamic-layout-tag [componentTypes]="componentType" [ItemsList]="itemsList"></dynamic-layout-tag>
    `,
})
export class TileDesignComponent implements OnInit, OnDestroy {
    @Input() itemsList = [];
    subscription = new Subscription;
    componentType = TilesDynamicComponent;
    constructor(private route: Router, private eventDispatcher: EventDispatchService, private utils: Utilities) {
    }

    ngOnInit() {

        let ref = this;
        let items = this.utils.localStorageGet('itemsList');

        this.itemsList = JSON.parse(items);

    }

    ngOnDestroy() {

    }
}
