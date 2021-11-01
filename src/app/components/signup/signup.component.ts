import { AfterViewInit, Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore  } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public showContent = true
  public showLoading = false;
  public showFormEmail = true
  public showFormInfo = false
  public showFormRefCode = false
  public showFormPhoneNumber = false
  public showFormOtp = false
  public showFormCondition = false
  public placeholderSex = 'ตัวเลือก'
  public placeholderKnow = 'ตัวเลือก'
  public checkCondition = false;
  public errorText1 = '';
  public email = '';
  public password = '';
  public confirmPassword = '';
  public passErr = false;
  public idRefCode;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public db: AngularFireDatabase, 
    public firestore: AngularFirestore, 
    public storage: AngularFireStorage,
    public auth: AuthService,
    // public loadingCon: LoadingComponent,
  ) { 
    auth.getCurrentLoggedIn();
  }

  ngOnInit(): void {
    this.idRefCode = this.route.snapshot.paramMap.get("id");
    // console.log(this.idRefCode)
  }

  passInput($event): void {
    this.errorText1 = '';
    let hasNumber = /\d/.test($event.target.value);
    let hasUpper = /[A-Z]/.test($event.target.value);
    let hasLower = /[a-z]/.test($event.target.value);
    if($event.target.value.length <= 8 || hasNumber == false || hasUpper == false || hasLower == false){
      // NOT OK
      this.passErr = true;
    }
    else{
      // OK
      this.passErr = false;
    }
  }

  // GOTO
  goToInfo(email, password, confirmPassword) {
    // this.showFormEmail = false
    // this.showFormInfo = true
    if(password != confirmPassword){
      this.errorText1 = 'ข้อผิดพลาดรหัสผ่านและยืนยันรหัสผ่านไม่ถูกต้อง';
    }
    else if(email != '' && password != '' && confirmPassword != '' && password == confirmPassword){
      // Check Email Type
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const emailCheck = re.test(email);
      // console.log(emailCheck)
      if(emailCheck) {
        // Check Pass Type
        if(password.split(" ").length > 1){
          this.errorText1 = 'ข้อผิดพลาดรหัสผ่านไม่ถูกต้อง';
        }
        else if (this.passErr == true){
          this.errorText1 = 'รหัสผ่านควรมีมากกว่า 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่และพิมพ์เล็กและตัวเลข)';
        }
        else {
          // Check dbEmail == InputEmail
          firebase.auth().fetchSignInMethodsForEmail(email)
          .then(signInMethods => {
            if(signInMethods.length != 0) {
              this.errorText1 = 'ข้อผิดพลาดอีเมล์นี้ถูกใช้งานบนระบบแล้ว'; 
            }
            else {
              this.auth.emailSignUpNewV(email, password, this.idRefCode)
              // this.auth.sendSignInLinkToEmail(email)
              // this.showRegis = false;
              this.showContent = false;
              this.showLoading = true;
              // this.showCondition = true;
              // this.showInfo = true;
              this.email = email;
              this.password = password;
              this.confirmPassword = confirmPassword;
              this.errorText1 = '';
            }
          }) 
        }
      }
      else{
        this.errorText1 = 'ข้อผิดพลาดอีเมล์ไม่ถูกต้อง';
      }
    }
    else {
      this.errorText1 = 'กรุณาเพิ่มข้อมูลให้ถูกต้องครบถ้วน';
    }
  }

  goToRefCode(nameInput, lastNameInput){
    this.showFormInfo = false
    this.showFormRefCode = true
  }

  goToPhoneNumber(refCodeInput){
    this.showFormRefCode = false
    this.showFormPhoneNumber = true
  }
  
  goToOtp(phoneNumberInput){
    this.showFormPhoneNumber = false
    this.showFormOtp = true
  }

  goToCondition(){
    this.showFormOtp = false
    this.showFormCondition = true
  }

  // BACK
  backToEmail() {
    this.showFormEmail = true
    this.showFormInfo = false
  }

  backToInfo() {
    this.showFormInfo = true
    this.showFormRefCode = false
  }

  backToRefCode() {
    this.showFormRefCode = true
    this.showFormPhoneNumber = false
  }

  backToPhoneNumber() {
    this.showFormPhoneNumber = true
    this.showFormOtp = false
  }

  backToOtp() {
    this.showFormOtp = true
    this.showFormCondition = false
  }

  checkCon() {
    this.checkCondition = true;
  }

  selectSex(sexTH, sexEN) {
    this.placeholderSex = sexTH
  }

  selectKnow(knowTH, knowEN) {
    this.placeholderKnow = knowTH
  }
}
