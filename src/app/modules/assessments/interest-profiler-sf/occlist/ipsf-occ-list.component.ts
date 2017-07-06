import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { OccupationListComponent } from '../../shared/occupation-list/occupation-list.component';
import { ApiCallClass } from '../../../../shared/apicall.model';
import { ServerApi } from '../../../../shared/app.apicall.service';
import { Utilities } from '../../../../shared/utilities.class';
import { pieColors } from '../../shared/constants/assessments-constants';
declare var $: any;
declare let Pizza: any;
@Component({
    selector: 'ipsf-occlist',
    templateUrl: './ipsf-occ-list.layout.html',
})
export class IPSFOccListComponent implements OnInit {
    buttonData: Object;
    ipsfOccListData = [];
    pieDataInOcc = [];
    interest;
    pieColor = {}
    area;
    @ViewChild(OccupationListComponent) private occListComp: OccupationListComponent;
    constructor(private router: Router, private utils: Utilities,
        private apiJson: ApiCallClass, private serverApi: ServerApi, private elementRef: ElementRef) {
    }

    ngOnInit() {
        try {
            this.utils.sessionStorageSet("module", "ip");
            this.pieDataInOcc = JSON.parse(this.utils.sessionStorageGet("resultIP"));
            this.interest = this.utils.sessionStorageGet("ipsfInterest");
            this.pieColor = pieColors;
            setTimeout(function () {
                this.displayPieChartInOccList(this);
            }.bind(this), 0);

        } catch (e) {
            console.log("ipsf occ list oninit exception:" + e.message);
        }
    }

    /** This function is to display the pie chart. */
    displayPieChartInOccList(ref) {
        try {
            Pizza.init();
            this.elementRef.nativeElement.querySelector("#" + ref.interest).click();
        }
        catch (e) {
            console.log("displayPieChartInOccList exception :" + e.message);
        }
    }

    /** This function is for getting the data from the server when clicked on the pie-chart links. */
    getIPAreaOccListParent(area) {
        this.utils.showLoading();
        this.area = area;
        let data = {

            input_data: [
                {
                    "param_type": "path",

                    "params": ["occList", this.area]
                },
                {
                    "param_type": "query",
                    "params": { "lang": "en", "stateAbbr": "IC" }
                },
                {
                    "param_type": "body",
                    "params": {

                    }
                }
            ]
        }
        this.interest = area;
        this.apiJson.method = "GET";
        this.apiJson.endUrl = "ShortIP";
        this.apiJson.moduleName = "Assessment/v1/";
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.data = JSON.stringify(data);
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            if (response[0].Success + "" == "true") {
                this.utils.sessionStorageSet("OccList", JSON.stringify(response[0].Result));
                this.ipsfOccListData = response[0].Result;
                /** The below call is for assigning the occ data to the alpha scroll */
                this.occListComp.getOccListData(response[0].Result);
            }
        }, this.utils.handleError);
    }
}





