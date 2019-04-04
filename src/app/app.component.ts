import {Component} from '@angular/core';
import {SrvService} from './srv.service';
import {LoginUser} from './loginuser';




@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    email: string;
    password: string;
    loginUser: LoginUser;
    passReset1 = false;
    passReset2 = false;
    passResetEmail: string;


    constructor(
        public srvService: SrvService
    ) {
        this.loginUser = new LoginUser();
    }

    signin(type: number) {
        this.srvService.signin$(type, this.email, this.password)
            .subscribe(value => {
                this.loginUser.id = value[0].user.uid;
                this.loginUser.providerId = value[0].additionalUserInfo.providerId;
                this.passReset2 = (value[0].additionalUserInfo.providerId === 'password');
                if (value[1]) {
                    this.loginUser.email = value[1].email;
                    this.loginUser.authorityLevel = value[1].authorityLevel;
                    this.loginUser.created = value[1].created.toDate();
                }
            });
        this.email = '';
        this.password = '';
    }

    logout() {
        this.loginUser.id = null;
        this.loginUser.email = null;
        this.srvService.logout();
    }

    resetPassword() {
        this.srvService.resetPassword(this.passResetEmail)
            .then(() => this.passReset1 = true);
    }

}
