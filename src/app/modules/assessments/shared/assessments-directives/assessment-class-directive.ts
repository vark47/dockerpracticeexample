import { Directive, ElementRef, Renderer, ViewChild } from '@angular/core';


@Directive({
    selector: '.well-p2',
    host: {
        '(click)': 'callCheck()',

    }
})

export class ClassDirective {

    constructor(private el: ElementRef, private re: Renderer) {

    }
    callCheck() {
        try {
            this.re.setElementStyle(this.el.nativeElement.querySelector(".checked-image"), "display", "block");
        }
        catch (e) {
        }
    }


}