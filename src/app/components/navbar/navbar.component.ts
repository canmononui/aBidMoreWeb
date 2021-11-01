import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// FIREBASE
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { KeySearchService } from '../../services/key-search.service';
// declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  authState: any = null;
  public keySearchList: any = [];
  public userBuyer: any;
  public showContent = false;
  public profileImg = './assets/img/profile-icon-BG.svg';
  public signinSignoutText = 'เข้าสู่ระบบ';
  public id;
  public subscriptionUserBuyer
  public chatCount = '0';
  public notiCount = '0';
  public cartCount = '0';
  public disabledNav = false;
  public showCategory = true;
  public showSubCategory = false;
  public selectTagTH = '';
  public subCatArr = [];
  public selectTagEN = '';
  public keySearchCheck = false;
  public keySearchInput = '';
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    public keySearch: KeySearchService,
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((auth) => {
      // console.log(auth)
      if (auth != null && auth.email != null) {
        // IS SIGN IN
        this.signinSignoutText = 'ออกจากระบบ';
        // console.log('- NAVBER - currentUserId :', this.auth.currentUserId)
        this.profileImg = './assets/img/profile-icon-BG.svg';
        this.keySearchList = [];
        // this.showContent = true;
        // console.log(this.userBuyer)
        // GET DATA FROM UID
        // console.log('- NAVBER - currentUserId :', this.auth.currentUserId)
        this.subscriptionUserBuyer = this.firestore.collection('user-buyer').doc(this.auth.currentUserId).valueChanges()
          .subscribe(val => {
            this.userBuyer = val;
            // console.log('- NAVBER - userBuyer :', this.userBuyer)
            if (this.userBuyer != undefined) {
              // CHECK ACCOUNT STATUS
              if(this.userBuyer.accountStatus){
                if (this.userBuyer.profileImg.imgUrl == null) {
                  this.profileImg = './assets/img/profile-icon-BG.svg';
                }
                else {
                  if (auth != null) {
                    this.profileImg = this.userBuyer.profileImg.imgUrl;
                  }
                }
                // GET CHAT COUNT
                this.firestore.collection('chat', ref => ref
                  .where(`readed.${this.auth.currentUserId}`, '==', false )
                  .where(`members.${this.auth.currentUserId}.type`, '==', 'buyer' )
                ).snapshotChanges()
                  .map(actions => {
                    return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
                  }).subscribe(chat => {
                    // console.log(chat.length)
                    if(chat.length > 99){
                      this.chatCount = '99+';
                    }
                    else{
                      this.chatCount = String(chat.length);
                    }
                  })
  
                // GET NOTI COUNT
                this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications', ref => ref
                .where('readed', '==', false )
                ).snapshotChanges()
                  .map(actions => {
                    return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
                  }).subscribe(noti => {
                    // console.log(noti.length)
                    if(noti.length > 99){
                      this.notiCount = '99+';
                    }
                    else{
                      this.notiCount = String(noti.length);
                    }
                  })
  
                // GET CART COUNT
                this.firestore.collection('order', ref => ref
                .where('status', '==', 'cart' )
                .where('buyerUID', '==', this.auth.currentUserId )
                ).snapshotChanges()
                  .map(actions => {
                    return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
                  }).subscribe(cart => {
                    // console.log(noti.length)
                    if(cart.length > 99){
                      this.cartCount = '99+';
                    }
                    else{
                      this.cartCount = String(cart.length);
                    }
                  })
  
                // GET KEY SEARCH
                this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('keySearch', ref => ref
                  .orderBy('createAt', 'desc')
                  .limit(5)
                ).snapshotChanges()
                  .map(actions => {
                    return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
                  }).subscribe(keySearch => {
                    this.keySearchList = keySearch;
                    // console.log(this.keySearchList)
                  })
                this.disabledNav = false;
                this.showContent = true;
              }
              else {
                this.profileImg = './assets/img/profile-icon-BG.svg';
                this.keySearchList = [];
                this.disabledNav = true;
                this.showContent = true;
              }
            }
            else {
              this.profileImg = './assets/img/profile-icon-BG.svg';
              this.keySearchList = [];
              this.disabledNav = false;
              this.showContent = true;
            }
          });
      }
      else {
        // console.log(auth)
        // NO SIGN IN
        // console.log(this.router.url)
        // var linkUlr = window.location.href.split(".com", 2);
        // var linkUlr = window.location.href.split(":4200", 2);
        // console.log(linkUlr)
        // console.log('--> EDIT HERE <--')
        // if(linkUlr[1] == '/' || linkUlr[1] == ''){
        if(this.router.url == '/' || this.router.url == ''){
          // NO SIGN & ON FIRST PAGE = SIGN IN ANONYMOUS
          this.auth.anonymousLogin().then((currentUserAnonymous) => {
            // console.log('- NAVBER - ANONYMOUS UID : ', currentUserAnonymous.uid)
          })
        }
        // else if (linkUlr[1] == '/check-email-verify') {
        else if (this.router.url == '/check-email-verify') {
          // DO NOT
        }
        else {
          // NO SIGN IN & NOT ON FIRST PAGE => SIGN IN
          // this.router.navigate(['/signin']);
        }
        // OLD VERSION
        // if (linkUlr[1] != '/signin') {
        //   // console.log('-- CALL AUTH SIGNIN ANONYMOUS')
        //   this.auth.anonymousLogin().then((currentUserAnonymous) => {
        //     // console.log('- NAVBER - ANONYMOUS UID : ', currentUserAnonymous.uid)
        //   })
        // }
        this.signinSignoutText = 'เข้าสู่ระบบ'
        this.profileImg = './assets/img/profile-icon-BG.svg';
        this.keySearchList = [];
        this.showContent = true;
      }
    });
  }


  searchProductInput(searchProductInput, $event) {
    // CHECK SEARCH INPUT = '' ?
    if (searchProductInput != '') {
      // CLEAR SEARCH KEY INPUT = ''
      this.keySearchInput = '';
      // GET ELEMENT BY ID [DROPDOWNMENU]
      // var dropdownMenu = <HTMLInputElement> document.getElementById('dropdownMenu');
      // SET STYPE [DROPDOWNMENU] DISPLAY NONE
      // dropdownMenu.style.display = 'none';
      if(this.auth.currentUserAnonymous){
        // THIS AUTH STATUS ANONYMOUS => DONT ADD KEY SEARCH IN COL
        // GO TO SEARCH PAGE
        this.keySearch.setKeySearch(searchProductInput);
        this.router.navigate([`/search/${searchProductInput}`]);
      }
      else {
        // SET KEY SEARCH CHECK = FALSE
        this.keySearchCheck = false;
        // LOOP CHECK SEARCH PRODUCT INPUT == KEY SEARCH LIST
        for(var i=0; i<this.keySearchList.length; i++){
          if(this.keySearchList[i].value.keySearch == searchProductInput){
            this.keySearchCheck = true;
          }
        }
        if(this.keySearchCheck){
          // HAVE SEARCH PRODUCT INPUT IN KEY SEARCH LIST => DONT PUSH DATA IN COL KEY SEARCH
          // GO TO SEARCH PAGE
          this.keySearch.setKeySearch(searchProductInput);
          this.router.navigate([`/search/${searchProductInput}`]);
        }
        else {
          // DONT HAVE SEARCH PRODUCT INPUT IN KEY SEARCH LIST => PUSH DATA IN COL KEY SEARCH
          this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('keySearch').add({
            createAt: firebase.firestore.Timestamp.now(),
            keySearch: searchProductInput,
          })
          .then((doc) => {
            // ADD DOC SUCCESS => GO TO SEARCH PAGE
            this.keySearch.setKeySearch(searchProductInput);
            this.router.navigate([`/search/${searchProductInput}`]);
          })
        }
      }
    }
  }

  goBackToCategory($event){
    // CLEAR SEARCH KEY INPUT = ''
    this.keySearchInput = '';
    // SHOP JQUERY
    $event.stopPropagation();
    // SHOW CATEGORY
    this.showCategory = true;
    this.showSubCategory = false;
    this.selectTagTH = '';
  }

  searchProductSelect(selectTagEN, selectTagTH, $event) {
    // STOP JQUERY
    $event.stopPropagation();
    // SET TAG TH FOR SHOW
    this.selectTagTH = selectTagTH;
    this.selectTagEN = selectTagEN;
    // SET SUB CATEGORY
    if (selectTagEN == 'maleClothes') {
      // maleClothes
      this.subCatArr = ['เสื้อเชิ้ต', 'เสื้อยืด', 'กางเกงขาสั้น', 'กางเกงขายาว', 'เสื้อโปโล', 'กางเกงยีนส์', 'เสื้อคลุมตัวนอก', 'ชุดชั้นในชาย', 'Uniforms', 'Virtual Goods', 'อื่นๆ'];
    }
    else if (selectTagEN == 'maleShoes') {
      // maleShoes
      this.subCatArr = ['รองเท้าแตะ', 'รองเท้ารัดส้น', 'รองเท้าผ้าใบแบบผูกเชือก', 'รองเท้าผ้าใบแบบสวม', 'รองเท้าหนังแบบผูกเชือก', 'รองเท้าหนังแบบสวม', 'รองเท้าบูท', 'รองเท้าเซฟตี้', 'รองเท้านักเรียน', 'รองเท้าทรงหัวโต', 'อุปกรณ์เสริมสำหรับรองเท้า', 'ถุงเท้า', 'Virtual Goods', 'อื่นๆ'];
    }
    else if (selectTagEN == 'femaleClothes') {
      // femaleClothes
      this.subCatArr = ['เสื้อ', 'เดรส', 'จั๊มสูท', 'กระโปรง', 'กางเกง', 'แจ็คเก็ตและเสื้อโค้ท', 'ชุดชั้นใน', 'ชุดว่ายน้ำ', 'ชุดนอน', 'เสื้อผ้าสาวอวบ', 'ชุดเข้าเซท', 'ผ้ายีนส์', 'เสื้อผ้ามุสลิมผู้หญิง', 'อื่นๆ'];
    }
    else if (selectTagEN == 'femaleShoes') {
      // femaleShoes
      this.subCatArr = ['รองเท้าส้นแบน', 'รองเท้าส้นสูง', 'รองเท้าแตะ', 'รองเท้าลำลอง', 'รองเท้าบูทและรองเท้าหุ้มข้อ', 'รองเท้าผ้าใบ', 'ถุงเท้าและถุงน่อง', 'อุปกรณ์เสริมสำหรับรองเท้า', 'อื่นๆ'];
    }
    else if (selectTagEN == 'beauty') {
      // beauty
      this.subCatArr = ['เครื่องสำอางสำหรับผิวหน้า', 'เครื่องสำอางสำหรับดวงตา', 'ลิป', 'ผลิตภัณฑ์ดูแลผิวหน้า', 'ผลิตภัณฑ์อาบน้ำและดูแลผิวกาย', 'ผลิตภัณฑ์ดูแลผม', 'ผลิตภัณฑ์สำหรับเล็บ', 'ผลิตภัณฑ์สำหรับผู้ชาย', 'อุปกรณ์เสริมความงาม', 'น้ำหอม', 'ของใช้ส่วนตัว', 'อื่นๆ'];
    }
    else if (selectTagEN == 'bag') {
      // bag
      this.subCatArr = ['กระเป๋าสตางค์', 'คลัทช์', 'กระเป๋าถือ', 'กระเป๋าสะพายข้าง', 'กระเป๋าเป้', 'กระเป๋าผ้า', 'กระเป๋าเดินทาง', 'กระเป๋าคาดอก', 'แบรนด์เนม', 'กระเป๋ากันน้ำ', 'อุปกรณ์เสริมกระเป๋า', 'อื่นๆ'];
    }
    else if (selectTagEN == 'accessories') {
      // accessories
      this.subCatArr = ['สร้อยคอ', 'ต่างหู', 'หมวก', 'แหวน', 'กำไล', 'เครื่องประดับผม', 'ผ้าพันคอและผ้าคลุมไหล่', 'เข็มขัด', 'คัฟลิงค์และเนคไท', 'ถุงมือ', 'พวงกุญแจ', 'ผ้าเช็ดหน้า', 'ร่ม', 'เครื่องประดับทอง', 'เพชร', 'ทองคำแท่ง', 'อื่นๆ'];
    }
    else if (selectTagEN == 'homeAppliances') {
      // homeAppliances
      this.subCatArr = ['ห้องครัวและห้องอาหาร', 'ห้องนอน', 'ห้องน้ำ', 'อุปกรณ์ตกแต่งบ้าน', 'อุปกรณ์สำหรับจัดเก็บ', 'เฟอร์นิเจอร์', 'โคมไฟและอุปกรณ์ให้แสงสว่าง', 'ผลิตภัณฑ์ซักรีด', 'อุปกรณ์ทำความสะอาด', 'เครื่องมือไฟฟ้า', 'เครื่องมือช่าง', 'อุปกรณ์ปรับปรุงบ้าน', 'สวน', 'อื่นๆ'];
    }
    else if (selectTagEN == 'mobilePhone') {
      // mobilePhone
      this.subCatArr = ['โทรศัพท์มือถือ', 'แท็บเล็ต', 'เคสและซองมือถือ', 'อุปกรณ์เสริมมือถือ', 'อุปกรณ์กันรอยหน้าจอ', 'แบตเตอรี่สำรอง', 'อุปกรณ์ไอทีสวมใส่', 'อุปกรณ์เน็ตเวิร์ค', 'อื่นๆ'];
    }
    else if (selectTagEN == 'game') {
      // game
      this.subCatArr = ['เครื่องเกม', 'แผ่นและตลับเกม', 'ของสะสมจากเกม', 'อุปกรณ์เสริมเกม', 'Gaming Virtual Goods', 'เกมอื่นๆ'];
    }
    else if (selectTagEN == 'camera') {
      // camera
      this.subCatArr = ['กล้องดิจิตอล', 'กล้องแอคชั่น', 'กล้องวงจรปิด', 'เลนส์', 'เมมโมรี่การ์ด', 'อุปกรณ์เสริมกล้อง', 'ฟิล์ม', 'อื่นๆ'];
    }
    else if (selectTagEN == 'sport') {
      // sport
      this.subCatArr = ['เสื้อผ้ากีฬาผู้หญิง', 'เสื้อผ้ากีฬาผู้ชาย', 'ฟุตบอลและกีฬาที่เล่นเป็นทีม', 'อุปกรณ์ฟิตเนสและออกกำลังกาย', 'กีฬาจักรยาน', 'กระเป๋ากีฬาและอุปกรณ์กีฬา', 'ตกปลา', 'การตั้งแค้มป์และเดินป่า', 'กีฬาแร็กเกต', 'ดำน้ำ', 'กีฬาทางน้ำ', 'กอล์ฟ', 'สเก็ตบอร์ดและสกูตเตอร์', 'มวยและศิลปะการต่อสู้', 'อื่นๆ'];
    }
    else if (selectTagEN == 'computer') {
      // computer
      this.subCatArr = ['แล็ปท็อปและคอมตั้งโต๊ะ', 'ชิ้นส่วนคอมพิวเตอร์', 'ปริ้นเตอร์และอุปกรณ์เสริม', 'อุปกรณ์จัดเก็บข้อมูล', 'อุปกรณ์เน็ตเวิร์ค', 'อุปกรณ์เสริมคอมพิวเตอร์', 'อุปกรณ์สำหรับเล่นเกม', 'ซอฟต์แวร์', 'อื่นๆ'];
    }
    else if (selectTagEN == 'food') {
      // food
      this.subCatArr = ['ขนม', 'อาหาร', 'เครื่องดื่ม', 'อื่นๆ'];
    }
    else if (selectTagEN == 'electricalApp') {
      // electricalApp
      this.subCatArr = ['เครื่องปรับอากาศ', 'พัดลมไอเย็น', 'พัดลม', 'เครื่องฟอกอากาศ', 'เครื่องใช้ไฟฟ้าในครัวขนาดเล็ก', 'ตู้เย็น', 'เครื่องซักผ้าและเครื่องอบผ้า', 'เตารีดและอุปกรณ์ดูแลผ้า', 'เครื่องดูดฝุ่นและอุปกรณ์ดูแลพื้น', 'เตาแก๊ส', 'ไมโครเวฟและเตาอบ', 'เครื่องทำน้ำอุ่น', 'อุปกรณ์และอะไหล่เครื่องใช้ไฟฟ้า', 'อื่นๆ'];
    }
    else if (selectTagEN == 'motorVehicle') {
      // motorVehicle
      this.subCatArr = ['อุปกรณ์ภายในรถยนต์', 'อุปกรณ์ภายนอกรถยนต์', 'ผลิตภัณฑ์ดูแลรถยนต์', 'ล้อและยาง', 'อะไหล่/ชุดแต่งมอเตอร์ไซค์', 'อะไหล่/ชุดแต่งรถยนต์', 'อุปกรณ์สวมใส่สำหรับขับขี่', 'น้ำมันและของเหลว', 'เครื่องเสียงรถยนต์', 'กล้องติดรถยนต์', 'แบตเตอรี่และอุปกรณ์เสริม', 'ฟิล์มรถยนต์', 'ยานพาหนะ', 'ทะเบียน', 'อื่นๆ'];
    }
    else if (selectTagEN == 'voucher') {
      // voucher
      this.subCatArr = ['Lifestyle', 'บันเทิงเเละกิจกรรม', 'อาหารและเครื่องดื่ม', 'สุขภาพและความงาม', 'ท่องเที่ยว', 'Real Estate', 'Insurance', 'Games & Streaming', 'Shopping and Home Living', 'Transportation & Delivery', 'Line stickers and themes', 'อื่นๆ'];
    }
    else if (selectTagEN == 'fetish') {
      // fetish
      this.subCatArr = ['ตะกรุด', 'สัตว์เสริมดวง', 'ผ้ายันต์', 'กุมาร', 'เบี้ยแก้', 'สีผึ้ง', 'น้ำเต้า', 'ลูกอม (ลูกแก้ว)', 'นางกวัก', 'พระเครื่อง', 'อื่นๆ'];
    }
    else if (selectTagEN == 'collectibles') {
      // collectibles
      this.subCatArr = ['ตุ๊กตา', 'ฟิกเกอร์โมเดล', 'ตัวต่อ', 'สติกเกอร์', 'RC', 'เพลงและภาพยนต์', 'ของโบราณ', 'อื่นๆ'];
    }
    else if (selectTagEN == 'other') {
      // other
      this.subCatArr = ['อื่นๆ'];
    }
    // SHOW CONTENT
    this.showCategory = false;
    this.showSubCategory = true;
    // THIS VERSION OK 
    // this.keySearch.setKeySearch(selectTagEN);
    // this.router.navigate([`/search/${selectTagEN}`]);
  }

  selectSubCat(subCat){
    // console.log(subCat)
    // CLEAR SEARCH KEY INPUT = ''
    this.keySearchInput = '';
    this.showCategory = true;
    this.showSubCategory = false;
    this.keySearch.setKeySearch(`${this.selectTagEN}&${subCat}`);
    this.router.navigate([`/search/${this.selectTagEN}&${subCat}`]);
    this.selectTagEN = '';
    this.selectTagTH = '';
  }

  searchProductSelectHis(selectTagEN) {
    // CLEAR SEARCH KEY INPUT = ''
    this.keySearchInput = '';
    this.keySearch.setKeySearch(selectTagEN);
    this.router.navigate([`/search/${selectTagEN}`]);
  }

  deleteKeySearch() {
    this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('keySearch').get().toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('keySearch').doc(doc.id).delete();
        });
      })
  }

  gotoAuctionList() {
    if (this.auth.currentUser == null) {
      this.router.navigate([`/signin`]);
    }
    else if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.router.navigate([`/auction-list`]);
    }
  }

  gotoChatList() {
    if (this.auth.currentUser == null) {
      this.router.navigate([`/signin`]);
    }
    else if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.router.navigate([`/chat-list`]);
    }
  }

  gotoNotificationList() {
    if (this.auth.currentUser == null) {
      this.router.navigate([`/signin`]);
    }
    else if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.router.navigate([`/notification-list`]);
    }
  }

  gotoPromotionList() {
    if (this.auth.currentUser == null) {
      this.router.navigate([`/signin`]);
    }
    else if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.router.navigate([`/promotion-list`]);
    }
  }

  gotoPaymentItems() {
    if (this.auth.currentUser == null) {
      this.router.navigate([`/signin`]);
    }
    else if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.router.navigate([`/payment-items`]);
    }
  }

  gotoWalletCredit() {
    if (this.auth.currentUser == null) {
      this.router.navigate([`/signin`]);
    }
    else if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.router.navigate([`/wallet-credit`]);
    }
  }

  gotoBuyMenuList(){
    if (this.auth.currentUser == null) {
      this.router.navigate([`/signin`]);
    }
    else if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.router.navigate([`/buyMenu-list`]);
    }
  }

  gotoFollowingList() {
    if (this.auth.currentUser == null) {
      this.router.navigate([`/signin`]);
    }
    else if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.router.navigate([`/following-list`]);
    }
  }

  gotoLinkList() {
    if (this.auth.currentUser == null) {
      this.router.navigate([`/signin`]);
    }
    else if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.router.navigate([`/like-list`]);
    }
  }

  gotoProfileSettings() {
    if (this.auth.currentUser == null) {
      this.router.navigate([`/signin`]);
    }
    else if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.router.navigate([`/profile-settings`]);
    }
  }

  gotoMerchant(){
    // this.router.navigate(['/merchant-coming-soon']);
    window.open('https://abidmore.com/merchant-coming-soon', '_blank');
  }

  gotoHome() {
    // console.log('- NAVBER - currentUser :', this.auth.currentUser)
    if (this.auth.currentUser == null) {
      this.auth.anonymousLogin().then((currentUserAnonymous) => {
        this.profileImg = './assets/img/profile-icon-BG.svg';
        this.keySearchList = [];
        this.showContent = true;
        this.router.navigate(['/'])
      })
    }
    else {
      if (this.auth.currentUser.isAnonymous) {
        this.auth.anonymousLogin();
      }
      else {
        this.router.navigate(['/'])
      }
    }
  }

  signInsignOut() {
    // console.log('- NAVBER - currentUser :', this.auth.currentUser)
    this.keySearchList = [];
    this.signinSignoutText = 'เข้าสู่ระบบ';
    this.profileImg = './assets/img/profile-icon-BG.svg';
    this.chatCount = '0';
    this.notiCount = '0';
    if (this.auth.currentUser.isAnonymous) {
      this.router.navigate([`/signin`]);
    }
    else {
      this.subscriptionUserBuyer.unsubscribe();
      this.auth.signOut();
    }
  }

}
