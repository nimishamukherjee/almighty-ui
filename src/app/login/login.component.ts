import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { LoginItem } from './login-item';
import { LoginService } from './login.service';


@Component({
    selector: 'login-form',
    templateUrl: '/login.component.html',
    styleUrls: ['/login.component.css'],
})

export class LoginComponent {
  loginItem: LoginItem;
  showError: boolean = false;
  feedbackMessage: string = '';
  statusCode: number = 0;

  constructor(
    private router: Router,
    private loginService: LoginService) {
  }

  gitSignin() {
    this.loginService.gitHubSignIn().then(loginStatus => this.checkStatus(loginStatus));
  }

  checkStatus(loginStatus:any){
    if(loginStatus.status==200)
    {
      this.router.navigate(['work-item-list'],{});
    }else{
      this.statusCode = loginStatus.status;
      this.feedbackMessage = loginStatus.responseText;
      this.showError = true;
    }
  }

  closeAlert(){
    this.showError = false;
  }
}
