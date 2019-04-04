import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {Observable, from, combineLatest} from 'rxjs';
import {switchMap, map} from 'rxjs/operators';

@Injectable()
export class SrvService {

    constructor(
        private firebaseAuth: AngularFireAuth,
        private db: AngularFirestore
    ) {
    }

    signin$(type: number, email: string, password: string): Observable<any> {
        let user$: Observable<any>;
        if (type === 0) {
            user$ = from(this.firebaseAuth.auth.signInWithEmailAndPassword(email, password));
        }
        if (type === 1) {
            user$ = from(this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password));
        }
        if (type === 2) {
            user$ = from(this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
        }
        const userProfile$: Observable<any> = user$.pipe(switchMap(value => {
            return this.db.collection('/userProfile').doc(value.user.uid).valueChanges();
        }));
        return combineLatest(user$, userProfile$);
    }

    logout() {
        this.firebaseAuth
            .auth
            .signOut();

    }

    resetPassword(email: string) {
        const auth = firebase.auth();

        return auth.sendPasswordResetEmail(email)
            .then(() => console.log('email sent'))
            .catch((error) => console.log(error));
    }

}

