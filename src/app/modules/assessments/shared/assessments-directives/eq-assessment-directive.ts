import { Directive, ElementRef, Renderer, ViewChild, HostListener } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';


@Directive({
    selector: '.orange-circle-button',
    host: {
        '(mouseleave)': 'onMouseLeave()',
        '(mouseup)': 'onMouseUp()',
        '(touchend)': 'onTouchend()',
        '(mouseenter)': 'onMouseEnter()',
        '(mousedown)': 'onMouseDown()',
        '(touchstart)': 'onTouchStart()'
    }
})

export class EqAssessmentDirective {

    dom: BrowserDomAdapter;

    constructor(private el: ElementRef, private re: Renderer) {
        this.dom = new BrowserDomAdapter();
    }
    onMouseLeave() {
        try {
            let ref = this;
            ref.dom.removeClass(this.el.nativeElement.querySelector("i"), "card-plp-2-i-hover");
            this.el.nativeElement.blur();
            ref.dom.removeClass(this.el.nativeElement, "card-green-hover");
            this.el.nativeElement.blur();

        } catch (e) {
            console.log("text-center directive onMouseLeave Exception:" + e.message);
        }
    }

    onMouseUp() {
        let ref = this;
        ref.dom.removeClass(ref.dom.query('.orange-circle-button'), "card-green-hover");
        ref.dom.query(".orange-circle-button,.card-plp-2").blur();

    }
    onTouchend() {
        let ref = this;
        this.re.setElementStyle(this.el.nativeElement.querySelector(".text-center"), "display", "block");
        ref.dom.removeClass(ref.dom.query('.orange-circle-button,.card-plp-2'), "card-green-hover");
        ref.dom.query(".orange-circle-button,.card-plp-2").blur();
    }
    onMouseEnter() {
        let ref = this;
        try {
            ref.dom.removeClass(ref.dom.query(".orange-circle-button"), "card-green-hover");
            ref.dom.removeClass(ref.dom.query(".orange-circle-button i"), "card-plp-2-i-hover");
            ref.dom.removeClass(ref.dom.query(".card-plp-2 i"), "card-plp-2-i-hover");
            ref.dom.addClass(this.el.nativeElement, "card-green-hover");
            ref.dom.addClass(this.el.nativeElement.querySelector("i"), "card-plp-2-i-hover");
        } catch (e) {
            console.log("mouse enter exception:" + e.message);
        }
    }
    onMouseDown() {
        let ref = this;
        ref.dom.removeClass(ref.dom.query(".orange-circle-button ,.card-plp-2 "), "card-green-hover");
        ref.dom.removeClass(ref.dom.query(".orange-circle-button i,.card-plp-2 i"), "card-plp-2-i-hover");
        ref.dom.addClass(this.el.nativeElement, "card-green-hover");
        ref.dom.addClass(this.el.nativeElement.querySelector("i"), "card-plp-2-i-hover");

    }
    onTouchStart() {
        let ref = this;
        ref.dom.removeClass(ref.dom.query(".orange-circle-button ,.card-plp-2 "), "card-green-hover");
        ref.dom.removeClass(ref.dom.query(".orange-circle-button i,.card-plp-2 i"), "card-plp-2-i-hover");
        ref.dom.addClass(this, "card-green-hover");
        ref.dom.addClass(this.el.nativeElement.querySelector("i"), "card-plp-2-i-hover");

    }

}