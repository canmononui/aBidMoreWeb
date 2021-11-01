import { AfterViewInit, Component, OnInit } from '@angular/core';
// FIREBASE
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-user-buyer',
  templateUrl: './update-user-buyer.component.html',
  styleUrls: ['./update-user-buyer.component.css']
})
export class UpdateUserBuyerComponent implements OnInit, AfterViewInit {
  
  public id;
  public userBuyer:any
  // FOR CONTENT
  public showContent = false;
  public showLoading = false;
  public showInfo = false;
  public showRefCode = false;
  public showCondition = false;
  // FOR INFO
  public displayName = '';
  public displayNameErr = false;
  public name = '';
  public lastName = '';
  public phoneNumber = '';
  public gender = '';
  public textTypeGender = 'กรุณาเลือก';
  public age:number = 0;
  public dayText = 'กรุณาเลือก';
  public monthText = 'กรุณาเลือก';
  public yearText = 'กรุณาเลือก';
  public yearArr:any = [];
  public errorText2 = '';
  public errorTextNull = '';
  // FOR OTP
  public recaptchaVerifier:any;
  public sendOtp = true;
  public applicationVerifier:any;
  public recaptchaResponse:any;
  public showOtp = false;
  public textLoad = false;
  public confirmationResult:any;
  public phoneNumberPlus = '';
  time: number = 60;
  display;
  interval;
  public submitOTPFail = false;
  public errorTextOtpFail = '';
  public reSendOTP = false;
  // FOR REFCODE
  public refCode: any;
  public refCodeCheck = false;
  public errorText5 = '';
  // FOR CONDITION
  public checkCondition = false;
  public captchaVerify = true;
  public contract:any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public firestore: AngularFirestore,
    private afAuth: AngularFireAuth,

  ) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get("id");
    this.id = this.auth.currentUserId;
    if(this.id){
      // GET CONTRACT-MERCHANT
      this.firestore.collection('contract-buyer').doc('m14XElMtM6D2KT8zyTzE').get().toPromise()
      .then((val) => {
        this.contract = val.data();
      })
      // GET YEAR & USER MORE 13 YEAR 
      var _year = firebase.firestore.Timestamp.now().toDate().getFullYear() - 13
      // console.log(_year)
      for(var i=0; i<100; i++){
        this.yearArr.push(_year.toString())
        _year--
      }
      this.yearArr
      // console.log(this.id)
      this.firestore.collection('user-buyer').doc(this.id)
      .get().toPromise()
      .then((userBuyer) => {
        if(userBuyer != undefined){
          // HAVE USER BUYER
          this.userBuyer = userBuyer.data();
          // console.log(this.userBuyer)
          // CHECK DISPLAY NAME = NULL ?
          if(this.userBuyer.displayName != null){
            this.displayName = this.userBuyer.displayName;
          }
          // CHECK NAME = NULL ?
          if(this.userBuyer.name != null){
            this.name = this.userBuyer.name;
          }
          // CHECK LAST NAME = NULL ?
          if(this.userBuyer.lastName != null){
            this.lastName = this.userBuyer.lastName
          }
          if(this.userBuyer.gender != null){
            if(this.userBuyer.gender == 'male'){
              this.gender = this.userBuyer.gender;
              this.textTypeGender = 'ชาย';
            }
            else if(this.userBuyer.gender == 'female'){
              this.gender = this.userBuyer.gender;
              this.textTypeGender = 'หญิง';
            }
            else{
              this.gender = null;
              this.textTypeGender = 'ไม่ระบุ';
            }
          }
          if(this.userBuyer.birthDate != null){
            // this.age = this.userBuyer.age;
            this.dayText = this.userBuyer.birthDate.dayText;
            this.monthText = this.userBuyer.birthDate.monthText;
            this.yearText = this.userBuyer.birthDate.yearText;
          }
          // CHECK PHONE NUMBER = NULL ?
          if(this.userBuyer.phoneNumber != null){
            this.phoneNumber = this.userBuyer.phoneNumber;
          }
          // CHECK REF CODE = NULL ?
          if(this.userBuyer.refCode != null){
            // console.log(this.userBuyer.refCode)
            this.refCode = this.userBuyer.refCode;
            this.refCodeCheck = true;
          }
          else{
            this.refCode = '';
          }
          // SHOW CONTENT
          this.showContent = true;
          this.showInfo = true;
        }
        else{
          // NO USER BUYER
          this.router.navigate(['/'])
        }
      })
    }
    else{
      this.router.navigate(['/'])
    }
  }

  ngAfterViewInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        this.recaptchaResponse = response;
      },
      'expired-callback': () => {
        this.recaptchaResponse = undefined;
      }
    });
    this.recaptchaVerifier.render()
  }

  backWardToInfo(){
    this.showInfo = true;
    this.showRefCode = false;
  }

  backWardToRefCode(){
    this.showRefCode = true;
    this.showCondition = false;
  }

  usernameInput($event): void {
    this.firestore.collection('user-buyer', ref => ref
    .where('displayName', '==', $event.target.value))
    .get().toPromise()
    .then((userList) => {
      if(userList.size != 0 && userList.docs[0].id != this.id){
        // NOT OK
        this.displayNameErr = true;
      }
      else {
        // OK 
        this.displayNameErr = false;
      }
    })
  }

  selectGender(gender){
    if(gender == 'male'){
      this.gender = gender;
      this.textTypeGender = 'ชาย';
    }
    else if(gender == 'female'){
      this.gender = gender;
      this.textTypeGender = 'หญิง';
    }
    else{
      this.gender = null;
      this.textTypeGender = 'ไม่ระบุ';
    }
    // console.log(this.gender)
  }

  selectDay(day){
    this.dayText = day;
  }

  selectMonth(month){
    this.monthText = month
  }

  selectYear(year){
    this.yearText = year
  }

  // NEW VERIFIED PHONE NUMBER
  goToRefCode(displayName, name, lastName, phoneNumber) {
    // console.log(displayName, name, lastName, phoneNumber)
    this.errorText2 = ''; 
    if(displayName.length < 4 || this.displayNameErr){
      this.errorText2 = 'กรุณาเพิ่มชื่อโปรไฟล์ให้ถูกต้อง';
    }
    else if(this.recaptchaResponse == undefined){
      this.errorText2 = 'กรุณายืนยันฉันไม่ใช่โปรแกรมอัตโนมัติ';
    }
    else if(phoneNumber.length < 10 || phoneNumber.split(" ").length > 1){
      this.errorText2 = 'หมายเลขโทรศัพท์ไม่ถูกต้อง';
    }
    else if (displayName != '' && this.displayNameErr == false && this.dayText != 'กรุณาเลือก' && this.monthText != 'กรุณาเลือก' && this.yearText != 'กรุณาเลือก' && name != '' && lastName != '' && this.gender != '' && phoneNumber != ''){
      this.showOtp = false;
      this.textLoad = true;
      this.phoneNumberPlus = '+66' + phoneNumber.split(/0(.+)/)[1]
      this.auth.linkWithPhoneNumber(this.phoneNumberPlus, this.recaptchaVerifier)
      .then((result) => {
        // console.log(result)
        this.textLoad = false;
        this.showOtp = true;
        this.time = 60;
        this.startTimer();
        this.confirmationResult = result;
        this.name = name;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
      })
      .catch((error) => {
        console.log(error)
        if(error){
          this.textLoad = false
          this.showOtp = false
          this.recaptchaResponse == undefined;
          if(error.code == "auth/captcha-check-failed"){
            this.errorText2 = 'การยืนยันฉันไม่ใช่โปรแกรมอัตโนมัติเกิดข้อผิดพลาดโปรติดต่อศูนย์ช่วยเหลือ';
          }
          else if(error.code == "auth/user-disabled"){
            this.errorText2 = 'หมายเลขโทรศัพท์นี้ถูกระงับบนระบบของเรา';
          }
          else if(error.code == "auth/invalid-phone-number"){
            this.errorText2 = 'หมายเลขโทรศัพท์ไม่ถูกต้องโปรดลองอีกครั้ง';
          }
          else if(error.code == "auth/provider-already-linked"){
            this.errorText2 = 'บัญชีนี้ได้ยืนยันหมายเลขโทรศัพท์แล้ว';
          }
          else if(error.code == "auth/too-many-requests"){
            this.errorText2 = 'อุปกรณ์นี้ถูกระงับการขอรหัส OTP เนื่องจากมีกิจกรรมที่ผิดปกติโปรดลองอีกครั้งในภายหลัง';
          }
          else if(error.code == "auth/unverified-email"){
            this.errorText2 = 'อีเมลของบัญชียังไม่ได้รับการยืนยันทางอีเมล';
          }
          else if(error.code == "auth/missing-phone-number"){
            this.errorText2 = 'ไม่พบหมายเลขโทรศัพท์นี้โปรดลองด้วยหมายเลขโทรศัพท์อื่น';
          }
        }
      });
    }
    else {
      this.errorText2 = 'กรุณาเพิ่มข้อมูลให้ถูกต้องครบถ้วน';
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time--;
      } else {
        this.time--;
      }
      var t = this.transform(this.time)
      if(t == '0'){
        this.pauseTimer();
        this.display = '';
      }
      else {
        this.display = 'ใน ' + this.transform(this.time) + ' วินาที';
      }
    }, 1000);
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return String(value - minutes * 60)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  inputFocus(fromtxt, totxt){
    var length = fromtxt.length;
    var maxlength = fromtxt.getAttribute(maxlength);
    if(length == maxlength){
      totxt.focus();
    }
  }

  changePhoneNumber(){
    this.phoneNumber = ''
    this.phoneNumberPlus = '';
    this.errorText2 = '';
    this.recaptchaResponse == undefined;
    // this.chekForResend = true;
  }

  reSendOTPClick(){
    this.textLoad = false;
    this.showOtp = false;
    this.submitOTPFail = false;
    this.errorText2 = '';
    this.errorTextOtpFail = '';
    this.reSendOTP = true;
    this.recaptchaResponse = undefined;
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container-resend', {
      'size': 'normal',
      'callback': (response) => {
        this.recaptchaResponse = response;
      },
      'expired-callback': () => {
        this.recaptchaResponse = undefined;
      }
    });
    this.recaptchaVerifier.render()
  }

  submitResendOTP(){
    if(this.recaptchaResponse != undefined){
      this.textLoad = false;
      this.showOtp = false;
      this.submitOTPFail = false;
      this.errorText2 = '';
      this.errorTextOtpFail = '';
      this.reSendOTP = false;
      this.requestOtpCodeAgain();
    } 
  }

  closeResendOTP(){
    this.textLoad = false;
    this.showOtp = true;
    this.submitOTPFail = false;
    this.errorText2 = '';
    this.errorTextOtpFail = '';
    this.reSendOTP = false;
  }

  requestOtpCodeAgain(){
    this.reSendOTP = false
    // console.log(this.recaptchaVerifier)
    this.textLoad = true
    this.auth.linkWithPhoneNumber(this.phoneNumberPlus, this.recaptchaVerifier)
    .then((result) => {
      // console.log(result)
      this.confirmationResult = result;
      this.textLoad = false
      this.showOtp = true
    })
    .catch((error) => {
      console.log(error)
      if(error){
        this.textLoad = false
        this.showOtp = false
        this.submitOTPFail = true;
        this.recaptchaResponse == undefined;
        if(error.code == "auth/captcha-check-failed"){
          this.errorText2 = 'การยืนยันฉันไม่ใช่โปรแกรมอัตโนมัติเกิดข้อผิดพลาดโปรติดต่อศูนย์ช่วยเหลือ';
        }
        else if(error.code == "auth/user-disabled"){
          this.errorText2 = 'หมายเลขโทรศัพท์นี้ถูกระงับบนระบบของเรา';
        }
        else if(error.code == "auth/invalid-phone-number"){
          this.errorText2 = 'หมายเลขโทรศัพท์ไม่ถูกต้องโปรดลองอีกครั้ง';
        }
        else if(error.code == "auth/provider-already-linked"){
          this.errorText2 = 'บัญชีนี้ได้ยืนยันหมายเลขโทรศัพท์แล้ว';
        }
        else if(error.code == "auth/too-many-requests"){
          this.errorText2 = 'อุปกรณ์นี้ถูกระงับการขอรหัส OTP เนื่องจากมีกิจกรรมที่ผิดปกติโปรดลองอีกครั้งในภายหลัง';
        }
        else if(error.code == "auth/unverified-email"){
          this.errorText2 = 'อีเมลของบัญชียังไม่ได้รับการยืนยันทางอีเมล';
        }
        else if(error.code == "auth/missing-phone-number"){
          this.errorText2 = 'ไม่พบหมายเลขโทรศัพท์นี้โปรดลองด้วยหมายเลขโทรศัพท์อื่น';
        }
      }
    });
  }

  checkOtp(digit1, digit2, digit3, digit4, digit5, digit6){
    var OTPCodeInput = String(digit1 + digit2 + digit3 + digit4 + digit5 + digit6);
    this.auth.verifyOTP(this.confirmationResult, OTPCodeInput)
    .then((result) => {
      // console.log(result)
      // OTP VERIFIED
      this.textLoad = false;
      this.showOtp = false;
      this.submitOTPFail = false;
      // Clear Error 
      this.errorText2 = 'ยืนยันหมายเลขโทรศัพท์สำเร็จ';
      this.errorTextOtpFail = '';
    })
    .catch((error) => {
      console.log(error)
      if(error){
        this.textLoad = false
        this.showOtp = false
        this.submitOTPFail = true;
        this.recaptchaResponse == undefined;
        if(error.code == "auth/invalid-verification-code"){
          this.errorTextOtpFail = 'รหัส OTP ของคุณไม่ถูกต้องโปรดเพิ่มรหัส OTP อีกครั้ง';
        }
        if(error.code == "auth/missing-verification-code"){
          this.errorTextOtpFail = 'ไม่พบรหัส OTP นี้โปรดลองอีกครั้ง';
        }
        
      }
    });
  }

  otpFail(){
    this.submitOTPFail = false;
    this.showOtp = true;
  }

  next(){
    if(this.errorText2 == 'ยืนยันหมายเลขโทรศัพท์สำเร็จ'){
      var _monthNumber:any
      if(this.monthText == 'มกราคม'){ _monthNumber = 0 }
      else if (this.monthText == 'กุมภาพันธ์') { _monthNumber = 1 }
      else if (this.monthText == 'มีนาคม') { _monthNumber = 2 }
      else if (this.monthText == 'เมษายน') { _monthNumber = 3 }
      else if (this.monthText == 'พฤษภาคม') { _monthNumber = 4 }
      else if (this.monthText == 'มิถุนายน') { _monthNumber = 5 }
      else if (this.monthText == 'กรกฎาคม') { _monthNumber = 6 }
      else if (this.monthText == 'สิงหาคม') { _monthNumber = 7 }
      else if (this.monthText == 'กันยายน') { _monthNumber = 8 }
      else if (this.monthText == 'ตุลาคม') { _monthNumber = 9 }
      else if (this.monthText == 'พฤศจิกายน') { _monthNumber = 10 }
      else if (this.monthText == 'ธันวาคม') { _monthNumber = 11 }
    // GET FIREBASE TIMESTAMP
    var _timeStamp:any = firebase.firestore.Timestamp.now();
    // CAL AGE FROM YEAR TEXT INPUT
    this.age = _timeStamp.toDate().getFullYear() - Number(this.yearText);
    // UPDATE INFO IN COL 'user-buyer'
    this.firestore.collection('user-buyer').doc(this.id).update({
      birthDate: {
        dayText: this.dayText,
        monthText: this.monthText,
        yearText: this.yearText,
        birthDateTimestamp: new Date(Number(this.yearText), _monthNumber, Number(this.dayText), 0, 0, 0, 0)
      },
      displayName: this.displayName,
      name: this.name,
      lastName: this.lastName,
      gender: this.gender,
      age: this.age,
      phoneNumber: this.phoneNumber,
      phoneNumberVerifyAt: _timeStamp,
      userStatus: 'waitingUpdateUserData'
    })
    .then(docRef => {
      this.showInfo = false;
      this.showRefCode = true;
    })
    .catch(error => {
      console.error("Error Update Info user-buyer document: ", error)
    })
    }
  }

  // NOW VERIFIED PHONE NUMBER SUCCESS
  goToRefCode_(displayName, name, lastName){
    // console.log(name, lastName, age)
    this.errorTextNull = '';
    if(displayName != '' && this.displayNameErr == false && this.dayText != 'กรุณาเลือก' && this.monthText != 'กรุณาเลือก' && this.yearText != 'กรุณาเลือก' && name != '' && lastName != ''){
      this.displayName = displayName;
      this.name = name;
      this.lastName = lastName;
      this.showInfo = false;
      this.showRefCode = true;
    }
    else {
      this.errorTextNull = 'กรุณาเพิ่มข้อมูลให้ถูกต้องครบถ้วน';
    }
  }

  // REFCODE
  goToCondition(refCode) {
    // refCode = '4C6Aauw5N8miAanBxAVW';
    if(this.refCodeCheck){
      this.showRefCode = false;
      this.showCondition = true;
    }
    else if(refCode != ''){
      this.errorText5 = '';
      // SET REFCODE TO UPPER CASE
      var _refCodeUpper:any =  refCode.toUpperCase()
      // CHECK REFCODE IN DB
      this.firestore.collection('user-buyer', ref => ref
      .where('yourRefCode', '==', _refCodeUpper))
      .get().toPromise()
      .then((doc) => {
        if(doc.empty){
          this.refCode = null;
          this.errorText5 = 'ข้อผิดพลาดรหัสแนะนำไม่ถูกต้อง';
        }
        else{
        // IF HAVE REF CODE
        this.refCode = _refCodeUpper;
        // CHANGE CONTENT
        this.showRefCode = false;
        this.showCondition = true;
        // CLEAR ERROR
        this.errorText5 = '';
        }
      })
    }
    else {
      // NON INPUT REF CODE => CHANGE CONTENT
      this.refCode = null;
      this.showRefCode = false;
      this.showCondition = true;
      this.errorText5 = '';
    }
  }

  checkCon() {
    this.checkCondition = true;
  }

  // CAPTCHA
  resolved(captchaResponse: string) {
    if(captchaResponse){
      this.captchaVerify = false;
    }
    // console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  goToUpdateUserBuyer(){
    this.showContent = false;
    this.showLoading = true;
    var _monthNumber:any
    if(this.monthText == 'มกราคม'){ _monthNumber = 0 }
    else if (this.monthText == 'กุมภาพันธ์') { _monthNumber = 1 }
    else if (this.monthText == 'มีนาคม') { _monthNumber = 2 }
    else if (this.monthText == 'เมษายน') { _monthNumber = 3 }
    else if (this.monthText == 'พฤษภาคม') { _monthNumber = 4 }
    else if (this.monthText == 'มิถุนายน') { _monthNumber = 5 }
    else if (this.monthText == 'กรกฎาคม') { _monthNumber = 6 }
    else if (this.monthText == 'สิงหาคม') { _monthNumber = 7 }
    else if (this.monthText == 'กันยายน') { _monthNumber = 8 }
    else if (this.monthText == 'ตุลาคม') { _monthNumber = 9 }
    else if (this.monthText == 'พฤศจิกายน') { _monthNumber = 10 }
    else if (this.monthText == 'ธันวาคม') { _monthNumber = 11 }
  // GET FIREBASE TIMESTAMP
  var _timeStamp:any = firebase.firestore.Timestamp.now();
  // CAL AGE FROM YEAR TEXT INPUT
  this.age = _timeStamp.toDate().getFullYear() - Number(this.yearText);
    // UPDATE USER DEC IN COL 'user-buyer'
    this.firestore.collection('user-buyer').doc(this.id).update({
      birthDate: {
        dayText: this.dayText,
        monthText: this.monthText,
        yearText: this.yearText,
        birthDateTimestamp: new Date(Number(this.yearText), _monthNumber, Number(this.dayText), 0, 0, 0, 0)
      },
      accountStatus: true,
      displayName: this.displayName,
      name: this.name,
      lastName: this.lastName,
      gender: this.gender,
      age: this.age,
      refCode: this.refCode,
      userStatus: 'approve',
      accountApproveAt: _timeStamp
    })
    .then(docRef => {
      this.router.navigate(['/'])
    })
    .catch(error => {
      console.error("Error Update user-buyer document: ", error)
    })
  }






}


