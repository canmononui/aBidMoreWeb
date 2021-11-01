import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
// Copy comment
import firebase from 'firebase/app';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: any = null;
  public statusLoginFail = false;
  public resetPassFail = false;
  
  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    public firestore: AngularFirestore,
    private afs: AngularFirestore) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      // console.log('- AUTH - authState - ', this.authState)
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  get currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest'
    } else if (this.currentUserAnonymous) {
      return 'Anonymous'
    } else {
      return this.authState['displayName'] || 'User without a Name'
    }
  }

  get statusloginFail() {
    return this.statusLoginFail;
  }

  get resetpassFail() {
    return this.resetPassFail;
  }

  get getAuthState() {
    return this.authState;
  }

  googleLogin(idRefCode: any) {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider, idRefCode);
  }

  facebookLogin(idRefCode: any) {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider, idRefCode);
  }

  private socialSignIn(provider, idRefCode) {
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        // SET REFCODE TO UPPER CASE
        var _refCodeUpper: any = null
        if(idRefCode != null){
          _refCodeUpper = idRefCode.toUpperCase();
        }
        // CHECK REFCODE IN DB
        this.firestore.collection('user-buyer', ref => ref
        .where('yourRefCode', '==', _refCodeUpper))
        .get().toPromise()
        .then((doc) => {
          if(doc.empty){
            _refCodeUpper = null;
          }
          var _timeStmap: any = firebase.firestore.Timestamp.now();
          var _yourRefCode:any = credential.user.uid[0].toUpperCase() + credential.user.uid[1].toUpperCase() + _timeStmap.seconds.toString();
          // CHECK NEW USER ?
          if(credential.additionalUserInfo.isNewUser){
            // CREATE VARIABLE
            var _name:any = null;
            var _lastName:any = null;
            // CHECK PROVIDER = FACEBOOK ?
            if(credential.credential.providerId == 'facebook.com'){
              var _profile:any = credential.additionalUserInfo.profile;
              _name = _profile.first_name;
              _lastName = _profile.last_name;
            }
            // CHECK PROVIDER = GOOGLE ?
            else if(credential.credential.providerId == 'google.com'){
              var _profile:any = credential.additionalUserInfo.profile;
              _name = _profile.given_name;
              _lastName = _profile.family_name;
            }
            // ADD DATA USER-BUYER
            this.afs.collection('user-buyer').doc(credential.user.uid).set({
              createAt: _timeStmap,
              accountStatus: false,
              userStatus: 'waitingUpdateUserData',
              displayName: null,
              hideDisplayName: false,
              email: credential.user.email,
              name: _name,
              lastName: _lastName,
              age: null,
              birthDate: null,
              phoneNumber: null,
              refCode: _refCodeUpper,
              yourRefCode: _yourRefCode,
              gender: null,
              profileImg: {
                imgUrl: credential.user.photoURL,
                imgpath: null
              },
              uid: credential.user.uid,
            })
            .then(() => {
              // CREATE NEW USER SUCCESS => UPDATE 
              this.router.navigate([`/update-user-buyer`]);
            })
          .catch(error => console.log(error));
          }
          else{
            // OLD USER 
            // CHECK HAVE USER-BYER ?
            this.firestore.collection('user-buyer').doc(credential.user.uid).get().toPromise()
            .then((val) => {
              // GET USER BUYER DES
              if (val.data() != undefined) {
                const _userBuyer: any = val.data()
                if (_userBuyer.accountStatus) {
                  // ACCOUNT APPROVE
                  this.router.navigate(['/']);
                }
                else {
                  // ACCOUNT NOT APPROVE => UPDATE 
                  this.router.navigate([`/update-user-buyer`]);
                }
              }
              else{
                this.firestore.collection('user-seller').doc(credential.user.uid).get().toPromise()
                .then((val) => {
                  if(val.data() != undefined){
                    const _userSeller: any = val.data();
                    // ADD DATA USER-BUYER
                    this.afs.collection('user-buyer').doc(credential.user.uid).set({
                      createAt: _timeStmap,
                      accountStatus: false,
                      userStatus: 'waitingUpdateUserData',
                      displayName: null,
                      hideDisplayName: false,
                      email: credential.user.email,
                      name: null,
                      lastName: null,
                      age: null,
                      birthDate: null,
                      phoneNumber: _userSeller.phoneNumber,
                      phoneNumberVerifyAt: _userSeller.phoneNumberVerifyAt,
                      refCode: _refCodeUpper,
                      yourRefCode: _yourRefCode,
                      gender: null,
                      profileImg: {
                        imgUrl: null,
                        imgpath: null
                      },
                      uid: credential.user.uid,
                    })
                    .then(() => {
                      // ACCOUNT NOT APPROVE => UPDATE 
                      this.router.navigate([`/update-user-buyer`]);
                    })
                  }
                })
              }
            })
          }
        })
      })
      .catch(error => console.log(error));
  }
  
  anonymousLogin() {
    return this.afAuth.signInAnonymously()
      .then((user) => {
        // console.log('SIGNIN ANONYMOUS');
        // console.log('- AUTH - SIGNIN ANONYMOUS --> ', user.user);
        // this.authState = user.user;
        // console.log('- AUTH - authState - ', this.authState)
        this.router.navigate(['/'])
        var dataReturn:any = user.user
        return dataReturn;
      })
      .catch(error => console.log(error));
  }

  emailSignUpNewV(email: string, password: string, idRefCode: any) {
    // OLD VERSION
    // var displayNameArr = email.split("@", 2);
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        var _userSignUp: any = user.user
        // SET REFCODE TO UPPER CASE
        var _refCodeUpper: any = null
        if(idRefCode != null){
          _refCodeUpper = idRefCode.toUpperCase();
        }
        // CHECK REFCODE IN DB
        this.firestore.collection('user-buyer', ref => ref
        .where('yourRefCode', '==', _refCodeUpper))
        .get().toPromise()
        .then((doc) => {
          if(doc.empty){
            _refCodeUpper = null;
          }
          var _timeStmap: any = firebase.firestore.Timestamp.now();
          var _yourRefCode:any = _userSignUp.uid[0].toUpperCase() + _userSignUp.uid[1].toUpperCase() + _timeStmap.seconds.toString();
          // ADD DATA USER-BUYER
          this.afs.collection('user-buyer').doc(_userSignUp.uid).set({
            createAt: _timeStmap,
            accountStatus: false,
            userStatus: 'waitingEmailVerify',
            displayName: null,
            hideDisplayName: false,
            email: email,
            name: null,
            lastName: null,
            age: null,
            birthDate: null,
            phoneNumber: null,
            refCode: _refCodeUpper,
            yourRefCode: _yourRefCode,
            gender: null,
            profileImg: {
              imgUrl: null,
              imgpath: null
            },
            uid: _userSignUp.uid,
          })
            .then(() => {
              // SEND EMAIL VERIFICATION
              var actionCodeSettings = {
                // url: 'https://abidmore.com',
                // THIS VERSION => 404 PAGE NOT FOUND
                url: 'https://abidmore.com/signin',
                // THIS VERSION => TEST LOCAL HOST
                // url: 'http://localhost:4200/signin',
                handleCodeInApp: true,
              };
              this.authState.sendEmailVerification(actionCodeSettings)
                .then(() => {
                  this.afAuth.signOut()
                    .then((msg) => {
                      // this.authState = null;
                      this.router.navigate(['/check-email-verify'])
                    })
                    .catch(error => console.log(error));
                })
            })
          })
      })
      .catch(error => console.log(error));
  }

  signInWithEmailLink(email: string, url: string): Promise<any> {
    return this.afAuth.signInWithEmailLink(email, url);
  }

  linkWithPhoneNumber(phoneNumber: string, applicationVerifier): Promise<any> {
    return this.authState.linkWithPhoneNumber(phoneNumber, applicationVerifier)
  }

  resendVerifyOTP(phoneNumber: string): Promise<any> {
    return this.authState.verifyPhoneNumber(phoneNumber, true);
  }

  verifyOTP(confirmationResult, OTPCode: string): Promise<any> {
    return confirmationResult.confirm(OTPCode)
  }

  emailSignin(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      this.statusLoginFail = false;
      const _user:any = user.user;
      if (_user.emailVerified) {
        // ACCOUNT EMAIL VERIFIED
        this.firestore.collection('user-buyer').doc(_user.uid).get().toPromise()
        .then((val) => {
          // GET USER BUYER DES
          if (val.data() != undefined) {
            const _userBuyer: any = val.data()
            if (_userBuyer.accountStatus) {
              // ACCOUNT APPROVE
              this.router.navigate(['/']);
            }
            else {
              // ACCOUNT NOT APPROVE => UPDATE 
              this.router.navigate([`/update-user-buyer`]);
            }
          }
          else{
            this.firestore.collection('user-seller').doc(_user.uid).get().toPromise()
            .then((val) => {
              if(val.data() != undefined){
                const _userSeller: any = val.data();
                var _timeStmap: any = firebase.firestore.Timestamp.now();
                // ADD DATA USER-BUYER
                this.afs.collection('user-buyer').doc(_user.uid).set({
                  createAt: _timeStmap,
                  accountStatus: false,
                  userStatus: 'waitingUpdateUserData',
                  displayName: null,
                  hideDisplayName: false,
                  email: _user.email,
                  name: null,
                  lastName: null,
                  age: null,
                  birthDate: null,
                  phoneNumber: _userSeller.phoneNumber,
                  phoneNumberVerifyAt: _userSeller.phoneNumberVerifyAt,
                  refCode: null,
                  yourRefCode: _userSeller.yourRefCode,
                  gender: null,
                  profileImg: {
                    imgUrl: null,
                    imgpath: null
                  },
                  uid: _user.uid,
                })
                .then(() => {
                  // ACCOUNT NOT APPROVE => UPDATE 
                  this.router.navigate([`/update-user-buyer`]);
                })
              }
            })
          }
        })
      }
      else {
        // ACCOUNT EMAIL NOT VERIFIED
        this.afAuth.signOut()
          .then((msg) => {
            this.router.navigate(['/check-email-verify'])
          })
          // ERROR SIGNOUT
          .catch(error => console.log(error));
      }
    })
    .catch(error => {
      // console.log(error)
      if (error) {
        this.statusLoginFail = true;
      }
    });
    // OLD VERSION
    // return this.afAuth.signInWithEmailAndPassword(email, password)
    //   .then((user) => {
    //     this.authState = user
    //     // console.log(this.authState.uid)
    //     // console.log(user)
    //     // const _userBuyer:any = user;
    //     // this.router.navigate(['/'])
    //     console.log('- AUTH - SIGNIN EMAIL --> ', user.user)
    //     // console.log(user.user.phoneNumber)
    //     // CHECK THIS USER EMAIL VERIFIED ?
    //     if (user.user.emailVerified) {
    //       // CHECK THIS USER PHONE NUMBER VERIFIED ?
    //       if(user.user.phoneNumber == null){
    //         // VERIFIED ENAIL SUCCESS !!BUT NOT VERIFIED NUMBER => GO TO UPDATE USER BUYER DES
    //         this.router.navigate([`/update-user-buyer`])
    //       }
    //       else{
    //         // VERIFIED NUMBER SUCCESS => GO TO HOME PAGE
    //         this.router.navigate(['/'])
    //       }
    //     }
    //     else{
    //       this.afAuth.signOut()
    //       .then((msg) => {
    //         // this.authState = null;
    //         debugger
    //         this.router.navigate(['/check-email-verify'])
    //       })
    //       .catch(error => console.log(error));
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     if (error) {
    //       // this.authState = null;
    //       this.statusLoginFail = true;
    //     }
    //   });
  }

  resetPassword(email: string) {
    const fbAuth = firebase.auth();
    return fbAuth.sendPasswordResetEmail(email)
  }

  getCurrentLoggedIn() {
    this.afAuth.authState.subscribe(auth => {
      // console.log(this.authState)
      if (this.authState != null &&  this.authState.emailVerified) {
        if (this.router.url == '/signup' || this.router.url == '/signin' || this.router.url == '/check-email-verify') {
          // ROUTER URL = SIGNUP
          // ROUTER URL = LOGIN
          this.firestore.collection('user-buyer').doc(this.authState.uid).get().toPromise()
            .then((val) => {
              // GET USER BUYER DES
              const _userBuyer: any = val.data();
              if (_userBuyer.accountStatus) {
                // debugger
                // ACCOUNT APPROVE
                this.router.navigate(['/']);
              }
              else {
                // debugger
                // ACCOUNT NOT APPROVE => UPDATE 
                this.router.navigate([`/update-user-buyer`]);
              }
            })
        }
      }
      else {
        // NOT LOGIN
        // THIS FOR CHECK EMAIL VERIFY PAGE [NO LOGIN]
        // THIS FOR EMAIL VERIFY PAGE [NO LOGIN && => GO TO LOGIN]
        // NO ACTION ROUTER URL
      }
    })
    // OLD VERSION
    // this.afAuth.authState.subscribe(auth => {
    //   // console.log(auth)
    //   if (auth) {
    //     // console.log(auth,'email - ',auth.email)
    //     // console.log(auth,'isAnonymous - ',auth.isAnonymous)
    //     if(auth.email != null && auth.emailVerified == true && auth.isAnonymous == false && auth.phoneNumber != null){
    //       this.router.navigate(['/'])
    //     }
    //   }
    // });
  }

  signOut(): void {
    this.afAuth.signOut()
      .then((msg) => {
        // console.log(msg)
        // this.authState = null;
        // this.addData = false;
        // REMOVE LOCAL STORAGE OF SHOW MODAL INSTRUCTION
        localStorage.removeItem('showPopupInstruction');
        // GO TO SIGNIN PAGE 
        this.router.navigate(['/signin'])
      })
      .catch(error => console.log(error));
  }

}
