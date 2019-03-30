import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
// import * as firebase from 'firebase/app';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
import {LoginUser} from './loginuser';

@Injectable()
export class SrvService {

  constructor(
      private firebaseAuth: AngularFireAuth,
      private db: AngularFirestore
  ) {  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.firebaseAuth
        .auth
        .signInWithEmailAndPassword(email, password);
  }

  signup(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.firebaseAuth
        .auth
        .createUserWithEmailAndPassword(email, password);
  }

  logout() {
    this.firebaseAuth
        .auth
        .signOut();

  }

  resetPassword(email: string) {
    const auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
        .then(() => console.log("email sent"))
        .catch((error) => console.log(error));
  }

  getUserProfile(id: string): Observable<any> {
    return this.db.collection('/userProfile').doc(id).valueChanges();
  }

}

