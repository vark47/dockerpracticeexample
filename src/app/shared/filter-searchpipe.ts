import { Pipe, PipeTransform, Input } from '@angular/core';
import { EventDispatchService } from './event-dispatch.service';

@Pipe({
    name: 'searchPipe',
   // pure: false
})
export class SearchPipe implements PipeTransform {
    constructor(private eventService: EventDispatchService) {

    }

    public transform(value, key: string, term: any, ratsearch: any, count: any) {
        let finalreturn = [];
        let returned = value.filter((item) => {
            //console.log("term is:-->" + JSON.stringify(term) + "key:" + key + "item:" + JSON.stringify(item)+"ratsearch-->"+ratsearch);
           // console.log("total list-->" + value.length);
          //  console.log("increment count-->" + count);
            if (item.hasOwnProperty(key)) {
                let filterchekcondition = true;
                try {
                    if (term.text !== '') {
                        let regExp = new RegExp('\\b' + term, 'gi');
                        filterchekcondition = regExp.test(item[key]);
                    }

                    //---------------------------------------------rating-----------------------------------------
                    if (ratsearch.rating.length > 0) {
                        console.log("rating vale--->" + ratsearch.rating.indexOf(item.rating));
                        if (ratsearch.rating.indexOf(item.rating) > -1) {
                        } else {
                            filterchekcondition = false;
                        }
                    }
                    //------------------------------------education--------------------------------------------           


                    if (ratsearch.edu.length > 0) {
                        if (ratsearch.edu.indexOf(item.edLevelID) > -1) {

                        } else {
                            filterchekcondition = false;
                        }
                    }

                    //---------------------------------------wages--------------------------------------------
                    if (ratsearch.wages.length > 0) {
                        if (ratsearch.wages.indexOf(item.wageID) > -1) {

                        } else {
                            filterchekcondition = false;
                        }



                    }
                } catch (e) {

                    console.log("error-->" + e.message);
                }
                item['visible'] = filterchekcondition;

                return filterchekcondition;
            } else {
                return false;
            }
        }
        );

     

        //console.log("returned-->"+returned);

        finalreturn = [];
        if (count >= returned.length) {

            finalreturn = returned;

        } else if (count < returned.length) {
            finalreturn=returned.slice(0,count);

            // for (let i = 0; i <= count; i++) {
            //     finalreturn.push(returned[i]);
            // }
        }
   /*  the below if condition when title list is "returned.length == 0"  it can raise the event . event name is "keycount" */
        if (finalreturn.length == 0) {
            let evnt = document.createEvent("CustomEvent");
            evnt.initEvent("keycount", true, true);
            //  console.log("hello it is event");
            this.eventService.dispatch(evnt);
        } else {
            let evnt = document.createEvent("CustomEvent");
            evnt.initEvent("itemcount", true, true);
            this.eventService.dispatch(evnt);
        }
      
        return finalreturn;
    }

}
/**This pipe is for showing the related occupation names 
 * that are searched and matched according to the cluster */
@Pipe({ name: 'visibleFilter', pure: false })
export class WithParentPipe implements PipeTransform {
    transform(value: Array<any>, args: any[] = null, ratsearch: any): any {

        return value.filter((item) => {

            return item.visible;
        });
    }
}

/**This pipe is for filtering the occupation names according to the cluster */
@Pipe({ name: 'filterChildItems', pure: false })
export class ChildLengthPipe implements PipeTransform {
    transform(value, key: string, term: any, ratsearch: any): any {
        return value.filter((item) => {
            let itemcnt = item.clusterTitle.filter((inritem) => {
                let filterchekcondition = true;
                try {
                    if (inritem.title !== '' || inritem.titleName != '') {
                        let regExp = new RegExp('\\b' + term, 'gi');
                        filterchekcondition = regExp.test(inritem.title);

                    }

                    if (ratsearch.rating.length > 0) {

                        if (ratsearch.rating.indexOf(inritem.rating) > -1) {
                        } else {
                            filterchekcondition = false;
                        }


                    }
                    if (ratsearch.edu.length > 0) {
                        if (ratsearch.edu.indexOf(inritem.edLevelID) > -1) {

                        } else {
                            filterchekcondition = false;
                        }
                    }
                    if (ratsearch.wages.length > 0) {
                        if (ratsearch.wages.indexOf(inritem.wageID) > -1) {
                        } else {
                            filterchekcondition = false;
                        }
                    }
                    inritem['visible'] = filterchekcondition;
                } catch (e) {
                    console.log("pipe exception:" + e.message);
                }
                return filterchekcondition;
            }).length;
 //console.log("item length--->"+itemcnt);

            item['childcnt'] = itemcnt;
           // console.log("item length--->"+JSON.stringifyitem)

            return item;
        });
    }
} 
