// import { provideRouter, RouterConfig } from '@angular/router';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/*import { ReportComponent } from '../modules/PLP/report/report.component';
import { PlpComponent } from '../modules/PLP/PLP-sections/PLP-sections.component';*/

import { LoginComponent } from './login.component';

import { LoginFormComponent } from './login-form/login-form.component';
import { NewPasswordComponent } from './new-psw/new-psw.component';

import { UsernameRecoveryComponent } from './recovery-user/forgot-username.component';
import { PasswordRecoveryComponent } from './recovery-psw/forgot-psw.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login', component: LoginComponent, children: [

            { path: 'loginForm', component: LoginFormComponent },
            { path: '', redirectTo: 'loginForm', pathMatch: 'full' },
            { path: 'newPassword/:uname', component: NewPasswordComponent },
            { path: 'usernameRecovery', component: UsernameRecoveryComponent },
            { path: 'passwordRecovery', component: PasswordRecoveryComponent },
        ]
    },
// { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class LoginRoutingModule { }
