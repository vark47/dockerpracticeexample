import { Component, Input } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there! {{ transVal | translate}} {{'LANG_EN_TRANS.shortip_strong_like' | translate}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Hello, {{name}}!</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() name;
  @Input() transVal;
  constructor(public activeModal: NgbActiveModal) { }
}

/*@Component({
  selector: 'ngbd-modal-component',
  templateUrl: './shared-modal-layout.html'
})
export class NgbdModalComponent {
  constructor(private modalService: NgbModal) { }

  open() {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'World';
  }
}*/
