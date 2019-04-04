import {Component} from '@angular/core';
import {SrvService} from './srv.service';
import {LoginUser} from './loginuser';
import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    email: string;
    password: string;
    loginUser: LoginUser;
    passReset = false;
    passResetEmail: string;

    private setIntervalHandler: any;


    constructor(
        public srvService: SrvService
    ) {
        this.loginUser = new LoginUser();
    }

    login() {
        this.srvService.login(this.email, this.password)
            .subscribe(value => {
                this.loginUser.id = value[0];
                if (value[1]) {
                    this.loginUser.email = value[1].email;
                    this.loginUser.authorityLevel = value[1].authorityLevel;
                    this.loginUser.created = value[1].created.toDate();
                }
            });
    }

    signup() {
        this.srvService.signup(this.email, this.password)
            .subscribe(value => {
                this.loginUser.id = value[0];
                if (value[1]) {
                    this.loginUser.email = value[1].email;
                    this.loginUser.authorityLevel = value[1].authorityLevel;
                    this.loginUser.created = value[1].created.toDate();
                }
            });
    }

    logout() {

        this.loginUser.id = null;
        this.loginUser.email = null;
        this.srvService.logout();
    }

    resetPassword() {
        this.srvService.resetPassword(this.passResetEmail)
            .then(() => this.passReset = true);
    }

}
