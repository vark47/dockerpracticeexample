/**Angular2 Libaries**/
import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
	selector: 'wil-assessment',
	templateUrl: './wil-assessment.layout.html'
})
export class WILAssessmentComponent {
	isClassVisibleIP = false;
	btnHighLight = -1;
	smiles =[{heading:'icon-asmnt-strongly-agree'},{heading:'icon-asmnt-between-strongly '},{heading:'icon-asmnt-strongly-disagree'},{heading:'icon-asmnt-somewhat'},{heading:'icon-asmnt-between-somewhat'}];
	cards =[{text:'this is text box for smiles'},{text:'this is text box for smiles'},{text:'this is text box for smiles'},{text:'this is text box for smiles'},{text:'this is text box for smiles'},{text:'this is text box for smiles'},];
	
	constructor(private http: Http, private router: Router,private activeRoute: ActivatedRoute) {
		alert("coming in construstor");
	}

    ngOnInit() {
		
    }
callQuestion(val){

}
	callResult(){
			this.router.navigate(['../result'], { relativeTo: this.activeRoute });
	}
}

