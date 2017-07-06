import { NgModule } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { ServerApi } from '../../shared/app.apicall.service';

import { Utilities } from '../../shared/utilities.class';
import { ApiCallClass } from '../../shared/apicall.model';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from '../login/login-form/login-form.component';
import { NewPasswordComponent } from '../login/new-psw/new-psw.component';
import { PasswordRecoveryComponent } from '../login/recovery-psw/forgot-psw.component';
import { UsernameRecoveryComponent } from '../login/recovery-user/forgot-username.component';
import { PageNotFoundComponent } from './pageNotFound.component';

@NgModule({
    imports: [
        HttpModule, CommonModule, FormsModule,
        ReactiveFormsModule, RouterModule
    ],
    declarations: [
        LoginComponent, LoginFormComponent, NewPasswordComponent,
        PasswordRecoveryComponent, UsernameRecoveryComponent, PageNotFoundComponent
    ],
    providers: [
        ApiCallClass, ServerApi, Utilities
    ]
})

export class LoginModule { }