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
            .then(value => {
                console.log('1. Nice, it worked!', value.user.uid);
                this.loginUser.email = value.user.email;
                this.loginUser.id = value.user.uid;
                this.getUserProfile(value.user.uid);
            })
            .catch(err => {
                console.log('Something went wrong:', err.message);
            });
        this.passResetEmail = this.email;
        this.email = this.password = '';
    }

    signup() {
        this.srvService.signup(this.email, this.password)
            .then(value => {
                console.log('1. Nice, it worked!', value.user.email);
                this.loginUser.email = value.user.email;
                this.loginUser.id = value.user.uid;
            })
            .catch(err => {
                console.log('Something went wrong:', err.message);
            });
        this.setIntervalHandler = setInterval(() => {
            this.getUserProfile(this.loginUser.id);
        }, 500);
        this.passResetEmail = this.email;
        this.email = this.password = '';
    }

    getUserProfile(id: string): void {
        if (id) {
            this.srvService.getUserProfile(id).subscribe(
                value => {
                    if (value) {
                        this.loginUser.authorityLevel = value.authorityLevel;
                        this.loginUser.createdTs = value.created;
                        this.loginUser.created = this.loginUser.createdTs.toDate();
                        clearInterval(this.setIntervalHandler);
                    }
                }
            );
        }
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
