
/** Route module */
import { Routes, RouterModule } from '@angular/router';

/** Active Guard */
import { ActivatingClass } from './shared/activateGuard';
import { Http, Response } from '@angular/http';
/** Framework */
import { FrameworkComponent } from './modules/framework/framework.component';
import { TileDesignComponent } from './modules/framework/layouts/tiles-design/tiles-design.component';

/** Login */
import { LoginComponent } from './modules/login/login.component';
import { LoginFormComponent } from './modules/login/login-form/login-form.component';
import { NewPasswordComponent } from './modules/login/new-psw/new-psw.component';
import { UsernameRecoveryComponent } from './modules/login/recovery-user/forgot-username.component';
import { PasswordRecoveryComponent } from './modules/login/recovery-psw/forgot-psw.component';

/** Assessments */
import { AssessmentEntryComponent } from './modules/assessments/assessments-main.component';
import { OccupationEntryComponent } from './modules/occ-details/occupations-main.component';
import { TilesDynamicComponent } from './modules/framework/layouts/tiles.component';

/** Assessments EQ*/
import { EnterpreneurQuizComponent } from './modules/assessments/entrepreneur-quiz/entrepreneur-quiz.component';
import { EQIntroComponent } from './modules/assessments/entrepreneur-quiz/intro/eq-intro.component';
import { EQAssessmentComponent } from './modules/assessments/entrepreneur-quiz/assessment/eq-assessment.component';
import { EQResultComponent } from './modules/assessments/entrepreneur-quiz/result/eq-result.component';
import { EQRestoreComponent } from './modules/assessments/entrepreneur-quiz/restore/eq-restore.component';

/** Assessments IP*/
import { InterestProfilerShComponent } from './modules/assessments/interest-profiler-sf/interest-profiler-sf.component';
import { IPSFIntroComponent } from './modules/assessments/interest-profiler-sf/intro/ipsf-intro.component';
import { IPSFAssessmentComponent } from './modules/assessments/interest-profiler-sf/assessment/ipsf-assessment.component';
import { IPSFResultComponent } from './modules/assessments/interest-profiler-sf/result/ipsf-result.component';
import { IPSFRestoreComponent } from './modules/assessments/interest-profiler-sf/restore/ipsf-restore.component';
import { IPSFOccListComponent } from './modules/assessments/interest-profiler-sf/occlist/ipsf-occ-list.component';

/** Assessments OS*/
import { OccSortComponent } from './modules/assessments/occ-sort/occ-sort.component';
import { OSIntroComponent } from './modules/assessments/occ-sort/intro/os-intro.component';
import { FactorsComparison } from './modules/assessments/occ-sort/factors-comparison/factors-comparison.component';
import { OSAssessmentComponent } from './modules/assessments/occ-sort/assessment/range/os-assessment-range.component';
import { OSFactorsAssessmentComponent } from './modules/assessments/occ-sort/assessment/factors/os-assessment-factors.component';
import { OSResultComponent } from './modules/assessments/occ-sort/result/os-result.component';
import { OSRestoreComponent } from './modules/assessments/occ-sort/restore/os-restore.component';

/** Occupations */
import { OccIndexComponent } from './modules/occ-details/shared/occ-index/occ-index-component';
import { OccCareerHeaderComponent } from './modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from './modules/occ-details/shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from './modules/occ-details/shared/occ-common-header/emergCareers-header-component';
// import { OccEmergHeaderComponent } from './modules/occ-details/shared/occ-common-header/emergCareers-header-component';

import { AuthManager } from './shared/authmanager';
/** PLP section */

import { PlpComponent } from './modules/PLP/PLP-sections/PLP-sections.component';

/** Importing route config */
import { routeObj, sectionsArr } from './shared/app.constants';



export const loginRoute =
    /** Login module route constant */
    {
        path: 'login',
        component: LoginComponent, children: [

            { path: 'loginForm', component: LoginFormComponent },
            { path: '', redirectTo: 'loginForm', pathMatch: 'full' },
            { path: 'newPassword/:uname', component: NewPasswordComponent },
            { path: 'usernameRecovery', component: UsernameRecoveryComponent },
            { path: 'passwordRecovery', component: PasswordRecoveryComponent }
        ]

    };

/** This route config is for tiles design.*/
let tileRoute = {
    path: 'tiles',
    component: TileDesignComponent
};

/** This route config is for parent routes.*/
let parentRoutes = {
    framework: {
        path: 'framework',
        component: FrameworkComponent,
        children: [],
        canActivate: [AuthManager]
        // pathMatch: 'prefix'
    },
    modSorts: {
        path: 'assessment',
        component: AssessmentEntryComponent,
        children: []
    },
    modPLP: {
        path: 'plpcontent',
        component: PlpComponent,
        children: []
    },
    modOccs: {
        path: 'occupations',
        component: OccupationEntryComponent,
        children: [],
    }

};





export function getRouteConfig(framework) {

    try {
        let results: Array<Object> = new Array<Object>();
        results = [];
        results.push(loginRoute);



       

        let tmpParent = parentRoutes;//JSON.parse(JSON.stringify(parentRoutes));

        // Initializing frameJSON with default framework parent route.
        let frameJSON;
        frameJSON = tmpParent.framework;
        // console.log("frameJSON --->" + JSON.stringify(frameJSON));

        // Initializing modlist variable with modList array of FrameworkJSON
        let modlist = framework.Result.modules.modList;
        let redirectVariable = framework.Result.modules.defaultModule;
        let parentRedirect = '', childRedirect = '';
        // Checking whether modlist contains any objects or not.
        if (modlist.length > 0) {
            // console.log("in route config");
            // Iterating through the modlist to get the framework configuration.
            modlist.forEach(function (obj, inx) {

                /* if (redirectVariable == obj.module_id) {
                     redirectToVal = routeObj[obj.defaultComp].routeConfig.path;
                     // alert( obj.module_id+obj.defaultComp+'routeObj'+JSON.stringify(routeObj[obj.defaultComp]));
                 }*/
                childRedirect = '';
                if (tmpParent[redirectVariable] == undefined) {
                    redirectVariable = obj.moduleId;
                }
                 //alert("parentRedirect --->" + parentRedirect + 'redirectVariable:' + redirectVariable + 'obj.moduleId:' + obj.moduleId + ' parentRoutes[redirectVariable]:' + tmpParent[redirectVariable]);

                if ((tmpParent[redirectVariable] != undefined) && parentRedirect == '') {

                    parentRedirect = tmpParent[redirectVariable].path;
                }

                // console.log('getRouteConfig moduleid is:' + obj.moduleId);
                if (obj.moduleId == "modPLP") {
                    plpSectionFunction(obj);
                }
                // Checking whether FrameworkJSON's parent route exists in our app parent route configuration.
                if (tmpParent[obj.moduleId] !== undefined) {

                    // Emptying the child array values
                    // Initializing inrJSON with empty array.
        let inrJSON = [];// inrJSON = [];

                    // If the layout is tiles then we have to place tiles route also
                    if (obj.layout === 'tiles') {
                        inrJSON.push(tileRoute);
                    }

                    // Iterating through Child array components of FrameworkJSON
                    obj.compList.forEach(function (objinr, inxinr) {

                        //console.log('routeObj:'+JSON.stringify(objinr));
                        // Checking whether the child component in FrameworkJSON is defined by us or not
                        if (routeObj[objinr.compId] !== undefined && routeObj[objinr.compId].routeConfig !== undefined) {


                            // If it is deifined then we have to push it into newly formed route json
                            inrJSON.push(routeObj[objinr.compId].routeConfig);
                        }


                        if ((routeObj[objinr.compId] != undefined) && childRedirect == '') {
                            childRedirect = routeObj[objinr.compId].routeConfig.path;
                        }
                    });

                    if (obj.defaultComp != "" && obj.defaultComp != null) {
                        // alert("in if" + JSON.stringify(routeObj[obj.defaultComp]));
                        inrJSON.push({ path: '', redirectTo: routeObj[obj.defaultComp].routeConfig.path, pathMatch: 'full' });
                        inrJSON.push({ path: '**', redirectTo: routeObj[obj.defaultComp].routeConfig.path, pathMatch: 'full' });
                    }
                    else {
                        // alert("in else  childRedirect:" + childRedirect + ":routeObj[obj.compList[0].compId]:" + (routeObj[obj.compList[0].compId]));
                        inrJSON.push({ path: '', redirectTo: childRedirect, pathMatch: 'full' });
                        inrJSON.push({ path: '**', redirectTo: childRedirect, pathMatch: 'full' });
                    }

                    // After preparing Child JSON we have add this child json to parent route json
                    tmpParent[obj.moduleId].children =inrJSON;// JSON.parse(JSON.stringify(inrJSON));

                    //console.log('getRouteConfig is inrJSON:'+JSON.stringify(inrJSON));
                    // Finally pushing this parent route json to framework route as child routs.
                    frameJSON.children.push(tmpParent[obj.moduleId]);//JSON.parse(JSON.stringify(tmpParent[obj.moduleId])));
                }

            });
            //alert("path in parent json" + JSON.stringify(parentRoutes[redirectVariable]) + " parentRedirect:" + parentRedirect);
            // if (redirectVariable != "" && redirectVariable != null) {
            // alert("in if" + JSON.stringify(routeObj[obj.defaultComp]));
            frameJSON.children.push({ path: '', redirectTo: parentRedirect, pathMatch: 'full' });
            frameJSON.children.push({ path: '**', redirectTo: parentRedirect, pathMatch: 'full' });
            /*}
            else {
                // alert("in else   obj.compList[0].compId:" + obj.compList[0].compId + ":routeObj[obj.compList[0].compId]:" + JSON.stringify(routeObj[obj.compList[0].compId]));
                frameJSON.children.push({ path: '', redirectTo: parentRedirect, pathMatch: 'full' });
                frameJSON.children.push({ path: '**', redirectTo: parentRedirect, pathMatch: 'full' });
            }*/
            
           // console.log("path in parent json" + JSON.stringify(frameJSON) + " parentRedirect:" + parentRedirect);
            
        }
        // let urlValue= 
        results.push(frameJSON);
        results.push({ path: '', redirectTo: 'framework', pathMatch: 'full' });
        results.push({ path: '**', redirectTo: 'framework', pathMatch: 'full' });
      //   console.log('framework json results:' + JSON.stringify(results));
        //console.log('framework json is:' + JSON.stringify(results) + 'frameJSON:' + JSON.stringify(frameJSON));

        return results;
    } catch (e) {
        console.log('getRouteConfig exception:' + e.message);
    }

}

function plpSectionFunction(plpObject) {
    if (sectionsArr.length != 0) {
        sectionsArr.length = 0;
    }
    // let sectionArray = [];
    // console.log('sectionsArr in PLPSectionFunc:' + JSON.stringify(sectionsArr) + ' plpObject.compList length:' + plpObject.compList.length);
    plpObject.compList.forEach(function (objinr, inxinr) {
        // console.log('inx:' + inxinr + ':objinr:' + JSON.stringify(objinr));
        if (routeObj[objinr.compId] !== undefined && routeObj[objinr.compId].itemConfig !== undefined) {
            sectionsArr.push(
                {
                    routerLink: routeObj[objinr.compId].routeConfig.path,
                    section: routeObj[objinr.compId].itemConfig.section,
                    SectionCode: routeObj[objinr.compId].itemConfig.apiName,
                    title: objinr.displayName,
                    icon: objinr.icon
                }
            )
        }

    });
    // console.log("sectionArray in plpSectionFunction framwork" + JSON.stringify(sectionArray));
    // sectionsArr.push(sectionArray);
    // console.log("sectionsArr in plpSectionFunction framwork" + (sectionsArr.length));

}